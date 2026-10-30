import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { levelFor } from '@/data/pathophysiology/upperAirway';
import type { CompanionProps } from './PathoLessonPage';

export default function AirwayObjectPanel({ variant, phaseIndex }: CompanionProps) {
  const [params, setParams] = useSearchParams();
  const level = levelFor(params.get('level'));
  const degree = params.get('degree') === 'near-complete' ? 'near-complete' : 'partial';
  const choose = (key: string, value: string) => { const n = new URLSearchParams(params); n.set(key, value); setParams(n, { replace: true }); };
  if (variant !== 'foreign-body') return <p className="mt-2 text-sm text-muted-foreground">{variant === 'epiglottitis' ? 'Supraglottic inflammation crowds the inlet above the vocal folds.' : 'Croup predominantly narrows the subglottic mucosa below the vocal folds.'} No measured airway dimensions or patient values are shown.</p>;
  return <div className="mt-3 space-y-4">
    <fieldset><legend className="text-xs font-semibold">Foreign-body level</legend><div className="mt-2 flex flex-wrap gap-2">{(['larynx', 'trachea', 'bronchus'] as const).map(v => <Button key={v} size="sm" variant={v === level ? 'secondary' : 'outline'} aria-pressed={v === level} onClick={() => choose('level', v)} className="min-h-11 capitalize">{v}</Button>)}</div></fieldset>
    <fieldset><legend className="text-xs font-semibold">Illustrative degree of obstruction</legend><div className="mt-2 flex flex-wrap gap-2">{(['partial', 'near-complete'] as const).map(v => <Button key={v} size="sm" variant={v === degree ? 'secondary' : 'outline'} aria-pressed={v === degree} onClick={() => choose('degree', v)} className="min-h-11 capitalize">{v}</Button>)}</div></fieldset>
    <p aria-live="polite" className="text-sm">Phase {phaseIndex + 1} · {level === 'bronchus' ? 'Distal bronchial obstruction: focal wheeze or reduced air entry may occur; partial ball-valve air trapping and obstructive atelectasis are alternative patterns. This is not upper-airway stridor.' : level === 'trachea' ? 'Central tracheal obstruction can affect both lungs and produce biphasic noise; mobility and seal vary.' : 'Laryngeal obstruction can cause stridor, cough or voice change; abrupt severe obstruction may occur without preceding phases.'} {degree === 'near-complete' ? 'Near-complete means very limited flow at the selected site, not proof of total obstruction or failure of both lungs.' : 'Partial obstruction leaves residual flow; preserved oxygenation does not exclude a retained object or future deterioration.'}</p>
  </div>;
}