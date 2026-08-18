import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'read-posts';
const EVENT = 'read-posts-changed';

const load = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const save = (slugs: string[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  window.dispatchEvent(new CustomEvent(EVENT));
};

export const useReadPosts = () => {
  const [readSlugs, setReadSlugs] = useState<string[]>(() => load());

  useEffect(() => {
    const sync = () => setReadSlugs(load());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isRead = useCallback((slug: string) => readSlugs.includes(slug), [readSlugs]);

  const markRead = useCallback((slug: string) => {
    const next = load();
    if (!next.includes(slug)) save([...next, slug]);
    else save(next);
  }, []);

  const markUnread = useCallback((slug: string) => {
    save(load().filter((s) => s !== slug));
  }, []);

  const toggleRead = useCallback((slug: string) => {
    const current = load();
    save(current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug]);
  }, []);

  return { readSlugs, isRead, markRead, markUnread, toggleRead };
};
