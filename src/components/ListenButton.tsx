import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Headphones, Pause, Play, RotateCcw, Square } from 'lucide-react';
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

const PROGRESS_PREFIX = 'tts-progress:';
const VOICE_KEY = 'tts-voice';
const RATE_KEY = 'tts-rate';

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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState<string>('');
  const [chunks, setChunks] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [savedIndex, setSavedIndex] = useState(0);
  const chunksRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const rateRef = useRef(1);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const activeLineRef = useRef<HTMLParagraphElement | null>(null);

  const progressKey = useMemo(
    () => `${PROGRESS_PREFIX}${embedUrl || title}`,
    [embedUrl, title],
  );

  useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  // load available voices (async in most browsers)
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const load = () => {
      const list = synth.getVoices();
      if (!list.length) return;
      setVoices(list);
      setVoiceURI((current) => {
        if (current && list.some((v) => v.voiceURI === current)) return current;
        const stored = localStorage.getItem(VOICE_KEY);
        if (stored && list.some((v) => v.voiceURI === stored)) return stored;
        const preferred =
          list.find((v) => v.default) ||
          list.find((v) => v.lang?.toLowerCase().startsWith('en')) ||
          list[0];
        return preferred?.voiceURI || '';
      });
    };
    load();
    synth.addEventListener('voiceschanged', load);
    return () => synth.removeEventListener('voiceschanged', load);
  }, []);

  useEffect(() => {
    voiceRef.current = voices.find((v) => v.voiceURI === voiceURI) || null;
  }, [voiceURI, voices]);

  // restore saved rate
  useEffect(() => {
    const stored = localStorage.getItem(RATE_KEY);
    if (stored && SPEEDS.includes(stored)) {
      setRate(stored);
      rateRef.current = Number(stored);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // reset when navigating between posts + restore saved position
  useEffect(() => {
    chunksRef.current = [];
    indexRef.current = 0;
    setChunks([]);
    setActiveIndex(0);
    setStatus('idle');
    const stored = Number(localStorage.getItem(progressKey) || 0);
    setSavedIndex(Number.isFinite(stored) && stored > 0 ? stored : 0);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [progressKey]);

  // keep the highlighted sentence in view
  useEffect(() => {
    activeLineRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [activeIndex]);

  const saveProgress = useCallback(
    (index: number) => {
      setSavedIndex(index);
      if (index > 0) localStorage.setItem(progressKey, String(index));
      else localStorage.removeItem(progressKey);
    },
    [progressKey],
  );

  const speakFrom = useCallback(
    (start: number) => {
      const synth = window.speechSynthesis;
      const list = chunksRef.current;
      if (start >= list.length) {
        setStatus('idle');
        indexRef.current = 0;
        setActiveIndex(0);
        saveProgress(0);
        return;
      }
      indexRef.current = start;
      setActiveIndex(start);
      saveProgress(start);
      const utterance = new SpeechSynthesisUtterance(list[start]);
      utterance.rate = rateRef.current;
      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
        utterance.lang = voiceRef.current.lang;
      }
      utterance.onend = () => speakFrom(start + 1);
      utterance.onerror = () => setStatus('idle');
      synth.speak(utterance);
      setStatus('playing');
    },
    [saveProgress],
  );

  const handleRateChange = useCallback(
    (value: string) => {
      setRate(value);
      rateRef.current = Number(value);
      localStorage.setItem(RATE_KEY, value);
      // restart the current sentence at the new speed
      if (status === 'playing' || status === 'paused') {
        window.speechSynthesis.cancel();
        speakFrom(indexRef.current);
      }
    },
    [speakFrom, status],
  );

  const handleVoiceChange = useCallback(
    (value: string) => {
      setVoiceURI(value);
      voiceRef.current = voices.find((v) => v.voiceURI === value) || null;
      localStorage.setItem(VOICE_KEY, value);
      if (status === 'playing' || status === 'paused') {
        window.speechSynthesis.cancel();
        speakFrom(indexRef.current);
      }
    },
    [speakFrom, status, voices],
  );

  const prepare = useCallback(async () => {
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
    return next;
  }, [embedUrl, html, title]);

  const start = useCallback(
    async (fromSaved: boolean) => {
      const synth = window.speechSynthesis;
      setStatus('loading');
      try {
        const next = chunksRef.current.length ? chunksRef.current : await prepare();
        const from = fromSaved ? Math.min(savedIndex, Math.max(next.length - 1, 0)) : 0;
        indexRef.current = from;
        synth.cancel();
        speakFrom(from);
      } catch {
        setStatus('idle');
      }
    },
    [prepare, savedIndex, speakFrom],
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
    await start(savedIndex > 0);
  }, [savedIndex, start, status]);

  const handleRestart = useCallback(async () => {
    window.speechSynthesis.cancel();
    saveProgress(0);
    await start(false);
  }, [saveProgress, start]);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setStatus('idle');
  }, []);

  if (!supported) return null;

  const active = status === 'playing' || status === 'paused';
  const voiceLabel = (v: SpeechSynthesisVoice) => `${v.name} (${v.lang})`;

  return (
    <span className="inline-flex flex-col gap-2 print:hidden">
      <span className="inline-flex flex-wrap items-center gap-2">
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
          {status === 'loading'
            ? 'Preparing…'
            : status === 'playing'
              ? 'Pause'
              : status === 'paused'
                ? 'Resume'
                : savedIndex > 0
                  ? 'Continue listening'
                  : 'Listen'}
        </Button>

        {voices.length > 0 && (
          <Select value={voiceURI} onValueChange={handleVoiceChange}>
            <SelectTrigger className="h-9 w-[190px]" aria-label="Voice and language">
              <SelectValue placeholder="Voice" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50 max-h-72">
              {voices.map((v) => (
                <SelectItem key={v.voiceURI} value={v.voiceURI}>
                  {voiceLabel(v)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

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

        {(active || savedIndex > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestart}
            aria-label="Restart from the beginning"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}

        {active && (
          <Button variant="ghost" size="sm" onClick={handleStop} aria-label="Stop listening">
            <Square className="h-4 w-4" />
          </Button>
        )}
      </span>

      {!active && savedIndex > 0 && (
        <span className="text-xs text-muted-foreground">
          Saved position: sentence {savedIndex + 1}
        </span>
      )}

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
