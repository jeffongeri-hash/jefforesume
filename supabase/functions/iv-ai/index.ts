import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// IV Strike Selector AI proxy.
// Anthropic (Claude) primary, OpenAI (GPT) fallback.
// Body: { mode: "json" | "stream", prompt: string, maxTokens?: number, webSearch?: boolean }

const ANTHROPIC_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY');

const ANTHROPIC_MODEL = 'claude-sonnet-4-5-20250929';
const OPENAI_MODEL = 'gpt-4o';

async function callAnthropic(prompt: string, maxTokens: number, webSearch: boolean, stream: boolean) {
  if (!ANTHROPIC_KEY) throw new Error('ANTHROPIC_API_KEY missing');
  const body: Record<string, unknown> = {
    model: ANTHROPIC_MODEL,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  };
  if (webSearch) body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
  if (stream) body.stream = true;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Anthropic ${res.status}: ${t.slice(0, 300)}`);
  }
  return res;
}

async function callOpenAI(prompt: string, maxTokens: number, stream: boolean) {
  if (!OPENAI_KEY) throw new Error('OPENAI_API_KEY missing');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      max_tokens: maxTokens,
      stream,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OpenAI ${res.status}: ${t.slice(0, 300)}`);
  }
  return res;
}

function extractAnthropicText(data: any): string {
  let text = '';
  for (const b of data?.content || []) {
    if (b.type === 'text') text += b.text;
  }
  return text;
}

// Re-emit upstream stream as Anthropic-style SSE (`content_block_delta` with `delta.text`)
// so the existing client parser keeps working regardless of provider.
function anthropicPassthroughStream(upstream: Response): Response {
  return new Response(upstream.body, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}

function openAIToAnthropicStream(upstream: Response): Response {
  const reader = upstream.body!.getReader();
  const dec = new TextDecoder();
  const enc = new TextEncoder();
  let buf = '';

  const stream = new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.enqueue(enc.encode(`data: ${JSON.stringify({ type: 'message_stop' })}\n\n`));
        controller.close();
        return;
      }
      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6).trim();
        if (!payload || payload === '[DONE]') continue;
        try {
          const d = JSON.parse(payload);
          const text = d?.choices?.[0]?.delta?.content;
          if (text) {
            const evt = { type: 'content_block_delta', delta: { type: 'text_delta', text } };
            controller.enqueue(enc.encode(`data: ${JSON.stringify(evt)}\n\n`));
          }
        } catch { /* ignore */ }
      }
    },
    cancel() { reader.cancel(); },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { mode = 'json', prompt, maxTokens = 1024, webSearch = false } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'prompt required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stream = mode === 'stream';

    // ── Anthropic primary ──
    try {
      const res = await callAnthropic(prompt, maxTokens, webSearch, stream);
      if (stream) return anthropicPassthroughStream(res);
      const data = await res.json();
      return new Response(JSON.stringify({
        provider: 'anthropic',
        text: extractAnthropicText(data),
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    } catch (anthropicErr) {
      console.warn('Anthropic failed, falling back to OpenAI:', anthropicErr);

      // ── OpenAI fallback ──
      const res = await callOpenAI(prompt, maxTokens, stream);
      if (stream) return openAIToAnthropicStream(res);
      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content ?? '';
      return new Response(JSON.stringify({
        provider: 'openai',
        text,
        fallback_reason: String(anthropicErr?.message || anthropicErr),
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err?.message || err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});