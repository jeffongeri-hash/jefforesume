import { useCallback, useEffect, useRef, useState } from 'react';
import { Headphones, Pause, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ListenButtonProps {
  /** Same-origin URL of the embedded atlas HTML, if the post is an embed */
  embedUrl?: string;
  /** Raw post HTML, used when there is no embed */
  html?: string;
  title: string;
}

const SPEEDS = ['0.75', '1', '1.25', '1.5', '1.75', '2'];

const htmlToText = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script, style, noscript, iframe, svg').forEach((el) => el.remove());
  return (doc.body?.innerText || doc.body?.textContent || '')
    .replace(/\s+/g, ' ')
    .trim();
};

// speechSynthesis truncates long utterances — split into sentence-sized chunks
const chunkText = (text: string, size = 220) => {
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  const chunks: string[] = [];
  let current = '';
  for (const s of sentences) {
    if ((current + s).length > size) {
      if (current.trim()) chunks.push(current.trim());
      current = s;
    } else {
      current += s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
};

const ListenButton = ({ embedUrl, html, title }: ListenButtonProps) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle');
  const [supported, setSupported] = useState(true);
  const [rate, setRate] = useState('1');
  const [chunks, setChunks] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const chunksRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const rateRef = useRef(1);
  const activeLineRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // reset when navigating between posts
  useEffect(() => {
    chunksRef.current = [];
    indexRef.current = 0;
    setChunks([]);
    setActiveIndex(0);
    setStatus('idle');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [embedUrl, html]);

  // keep the highlighted sentence in view
  useEffect(() => {
    activeLineRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeIndex]);

  const speakFrom = useCallback((start: number) => {
    const synth = window.speechSynthesis;
    const list = chunksRef.current;
    if (start >= list.length) {
      setStatus('idle');
      indexRef.current = 0;
      setActiveIndex(0);
      return;
    }
    indexRef.current = start;
    setActiveIndex(start);
    const utterance = new SpeechSynthesisUtterance(list[start]);
    utterance.rate = rateRef.current;
    utterance.onend = () => speakFrom(start + 1);
    utterance.onerror = () => setStatus('idle');
    synth.speak(utterance);
    setStatus('playing');
  }, []);

  const handleRateChange = useCallback(
    (value: string) => {
      setRate(value);
      rateRef.current = Number(value);
      // restart the current sentence at the new speed
      if (status === 'playing' || status === 'paused') {
        window.speechSynthesis.cancel();
        speakFrom(indexRef.current);
      }
    },
    [speakFrom, status],
  );

  const handlePlay = useCallback(async () => {
    const synth = window.speechSynthesis;

    if (status === 'playing') {
      synth.pause();
      setStatus('paused');
      return;
    }
    if (status === 'paused') {
      synth.resume();
      setStatus('playing');
      return;
    }

    setStatus('loading');
    try {
      let text = '';
      if (embedUrl) {
        const res = await fetch(embedUrl);
        text = htmlToText(await res.text());
      } else if (html) {
        text = htmlToText(html);
      }
      text = `${title}. ${text}`;
      const next = chunkText(text);
      chunksRef.current = next;
      setChunks(next);
      indexRef.current = 0;
      synth.cancel();
      speakFrom(0);
    } catch {
      setStatus('idle');
    }
  }, [embedUrl, html, speakFrom, status, title]);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    indexRef.current = 0;
    setActiveIndex(0);
    setStatus('idle');
  }, []);

  if (!supported) return null;

  const active = status === 'playing' || status === 'paused';

  return (
    <span className="inline-flex flex-col gap-2 print:hidden">
      <span className="inline-flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePlay}
          disabled={status === 'loading'}
          aria-label={status === 'playing' ? `Pause listening to ${title}` : `Listen to ${title}`}
        >
          {status === 'playing' ? (
            <Pause className="h-4 w-4 mr-2" />
          ) : status === 'paused' ? (
            <Play className="h-4 w-4 mr-2" />
          ) : (
            <Headphones className="h-4 w-4 mr-2" />
          )}
          {status === 'loading' ? 'Preparing…' : status === 'playing' ? 'Pause' : status === 'paused' ? 'Resume' : 'Listen'}
        </Button>

        <Select value={rate} onValueChange={handleRateChange}>
          <SelectTrigger className="h-9 w-[84px]" aria-label="Playback speed">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            {SPEEDS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}x
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {active && (
          <Button variant="ghost" size="sm" onClick={handleStop} aria-label="Stop listening">
            <Square className="h-4 w-4" />
          </Button>
        )}
      </span>

      {active && chunks.length > 0 && (
        <div
          className="max-h-40 w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-muted/40 p-3 text-sm leading-relaxed"
          aria-live="polite"
        >
          {chunks.map((chunk, i) => (
            <p
              key={i}
              ref={i === activeIndex ? activeLineRef : undefined}
              onClick={() => {
                window.speechSynthesis.cancel();
                speakFrom(i);
              }}
              className={`cursor-pointer rounded px-1 py-0.5 transition-colors ${
                i === activeIndex
                  ? 'bg-primary/15 font-medium text-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {chunk}
            </p>
          ))}
        </div>
      )}
    </span>
  );
};

export default ListenButton;
