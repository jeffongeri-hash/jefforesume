import { useCallback, useEffect, useRef, useState } from 'react';
import { Headphones, Pause, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ListenButtonProps {
  /** Same-origin URL of the embedded atlas HTML, if the post is an embed */
  embedUrl?: string;
  /** Raw post HTML, used when there is no embed */
  html?: string;
  title: string;
}

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
  const chunksRef = useRef<string[]>([]);
  const indexRef = useRef(0);

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
    setStatus('idle');
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [embedUrl, html]);

  const speakFrom = useCallback((start: number) => {
    const synth = window.speechSynthesis;
    const chunks = chunksRef.current;
    if (start >= chunks.length) {
      setStatus('idle');
      indexRef.current = 0;
      return;
    }
    indexRef.current = start;
    const utterance = new SpeechSynthesisUtterance(chunks[start]);
    utterance.rate = 1;
    utterance.onend = () => speakFrom(start + 1);
    utterance.onerror = () => setStatus('idle');
    synth.speak(utterance);
    setStatus('playing');
  }, []);

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
      chunksRef.current = chunkText(text);
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
    setStatus('idle');
  }, []);

  if (!supported) return null;

  return (
    <span className="inline-flex items-center gap-2 print:hidden">
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
      {status !== 'idle' && status !== 'loading' && (
        <Button variant="ghost" size="sm" onClick={handleStop} aria-label="Stop listening">
          <Square className="h-4 w-4" />
        </Button>
      )}
    </span>
  );
};

export default ListenButton;
