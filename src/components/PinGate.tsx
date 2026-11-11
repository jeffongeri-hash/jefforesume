import { useState, type ReactNode, type FormEvent } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PIN = '0719';

export default function PinGate({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const key = `pin-unlocked:${id}`;
  const [ok, setOk] = useState(() => sessionStorage.getItem(key) === '1');
  const [val, setVal] = useState('');
  const [err, setErr] = useState(false);
  if (ok) return <>{children}</>;
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (val === PIN) { sessionStorage.setItem(key, '1'); setOk(true); }
    else { setErr(true); setVal(''); }
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <form onSubmit={submit} className="w-full max-w-xs rounded-lg border border-border bg-card p-6 text-center shadow-sm">
        <Lock className="mx-auto h-8 w-8 text-primary" aria-hidden />
        <h1 className="mt-3 font-journal text-2xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter the PIN to continue.</p>
        <Input autoFocus type="password" inputMode="numeric" maxLength={4} aria-label="PIN" value={val}
          onChange={e => { setVal(e.target.value.replace(/\D/g, '')); setErr(false); }} className="mt-4 text-center text-lg tracking-[0.5em]" />
        {err && <p role="alert" className="mt-2 text-sm text-destructive">Incorrect PIN.</p>}
        <Button type="submit" className="mt-4 w-full">Unlock</Button>
      </form>
    </main>
  );
}
