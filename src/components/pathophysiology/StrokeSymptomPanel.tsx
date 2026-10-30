import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { asStroke, deficits, sceneState, SYMPTOM_NOTES } from '@/data/pathophysiology/mcaStroke';
import type { CompanionProps } from './PathoLessonPage';
import { pv } from './sceneKit';

/** Classic symptom associations for the selected territory and hemisphere, synchronized with the timeline. Not diagnostic. */
export default function StrokeSymptomPanel({ time, variant, side, phaseIndex }: CompanionProps) {
  const v = asStroke(variant);
  const [dominant, setDominant] = useState<'left' | 'right'>('left');
  const s = sceneState(time);
  const on = phaseIndex === 0 ? 0 : Math.min(1, s.clot * 1.2);
  const d = deficits(v, side, dominant);
  const contra: 'left' | 'right' = side === 'left' ? 'right' : 'left';
  // Figure faces the viewer: patient's right appears on the viewer's left.
  const isAffected = (bodySide: 'left' | 'right') => d.bilateral || bodySide === contra;
  const fill = (w: number, bodySide: 'left' | 'right') => pv('inflame', isAffected(bodySide) ? 0.12 + 0.75 * w * on * (d.bilateral && bodySide === side ? 0.7 : 1) : 0.05);
  const P = { right: 0, left: 1 } as const; // index across viewer's x
  const bx = (bs: 'left' | 'right', a: string, b: string) => (P[bs] === 0 ? a : b);
  const field = (eye: number) => {
    // visual fields as seen by the patient: left field on the left
    const cx = 60 + eye * 90;
    const lostSide: 'left' | 'right' | 'both' = d.bilateral ? 'both' : contra;
    const op = 0.85 * d.hemianopia * on;
    return <g key={eye}>
      <circle cx={cx} cy={52} r={34} fill={pv('panel')} stroke={pv('ink', 0.5)} />
      {(lostSide === 'left' || lostSide === 'both') && <path d={`M ${cx} 18 A 34 34 0 0 0 ${cx} 86 Z`} fill={pv('ink', op * (lostSide === 'both' ? 0.6 : 1))} />}
      {(lostSide === 'right' || lostSide === 'both') && <path d={`M ${cx} 18 A 34 34 0 0 1 ${cx} 86 Z`} fill={pv('ink', op * (lostSide === 'both' ? 0.6 : 1))} />}
      <text x={cx} y={100} textAnchor="middle" fontSize="10" fill={pv('ink', 0.75)}>{eye === 0 ? 'Left eye' : 'Right eye'}</text>
    </g>;
  };
  const chip = (label: string, w: number) => <span key={label} className={`rounded border px-2 py-1 text-xs ${w * on > 0.2 ? 'border-primary bg-secondary text-secondary-foreground' : 'border-border text-muted-foreground'}`}>{label}{w > 0 && w < 0.6 ? ' (possible)' : ''}</span>;

  return (
    <div>
      <p className="mt-1 text-sm text-muted-foreground">Classic associations for the selected territory and hemisphere. They appear once the occlusion phase begins. Symptoms overlap between territories and never establish which vessel is occluded — that needs vascular imaging.</p>
      {v !== 'basilar' && <div className="mt-3 flex flex-wrap items-center gap-2 text-sm"><span className="text-xs font-semibold uppercase text-muted-foreground">Language-dominant hemisphere (assumption)</span>{(['left', 'right'] as const).map(h => <Button key={h} size="sm" variant={dominant === h ? 'secondary' : 'outline'} aria-pressed={dominant === h} onClick={() => setDominant(h)} className="capitalize">{h}{h === 'left' ? ' (most people)' : ''}</Button>)}</div>}
      <div className="mt-3 grid items-start gap-4 md:grid-cols-[220px_1fr]">
        <svg viewBox="0 0 220 300" role="img" aria-label={`Body figure facing you: ${d.bilateral ? 'bilateral or crossed' : `${contra}-sided`} deficits highlighted — face ${Math.round(d.face * 100)}%, arm ${Math.round(d.arm * 100)}%, leg ${Math.round(d.leg * 100)}% emphasis`} className="block h-auto w-full rounded" style={{ background: pv('bg') }} data-affected={d.bilateral ? 'both' : contra} data-on={on.toFixed(2)}>
          <text x="10" y="16" fontSize="9" fill={pv('ink', 0.7)}>Patient’s R</text><text x="210" y="16" fontSize="9" textAnchor="end" fill={pv('ink', 0.7)}>Patient’s L</text>
          {(['right', 'left'] as const).map(bs => <g key={bs}>
            <path d={bx(bs, 'M 110 30 A 22 26 0 0 0 110 82 Z', 'M 110 30 A 22 26 0 0 1 110 82 Z')} fill={fill(d.face, bs)} stroke={pv('ink', 0.5)} />
            <path d={bx(bs, 'M 110 92 L 80 96 L 82 170 L 110 172 Z', 'M 110 92 L 140 96 L 138 170 L 110 172 Z')} fill={pv('panel')} stroke={pv('ink', 0.4)} />
            <path d={bx(bs, 'M 78 98 L 58 104 L 46 176 L 58 180 L 72 120 Z', 'M 142 98 L 162 104 L 174 176 L 162 180 L 148 120 Z')} fill={fill(d.arm, bs)} stroke={pv('ink', 0.5)} />
            <path d={bx(bs, 'M 84 174 L 108 174 L 104 286 L 86 286 Z', 'M 136 174 L 112 174 L 116 286 L 134 286 Z')} fill={fill(d.leg, bs)} stroke={pv('ink', 0.5)} />
          </g>)}
          <text x="110" y="298" fontSize="9" textAnchor="middle" fill={pv('ink', 0.7)}>shading = classic emphasis, not severity</text>
        </svg>
        <div>
          <div className="flex flex-wrap gap-2">
            {chip('Face weakness', d.face)}{chip('Arm weakness', d.arm)}{chip('Leg weakness', d.leg)}
            {chip('Aphasia', d.language)}{chip('Neglect', d.neglect)}{chip('Visual field loss', d.hemianopia)}{chip('Brainstem / cerebellar signs', d.brainstem)}
          </div>
          <svg viewBox="0 0 210 108" role="img" aria-label={`Visual fields as seen by the patient: ${d.hemianopia ? (d.bilateral ? 'possible bilateral loss' : `possible ${contra} homonymous hemianopia`) : 'no classic field loss for this territory'}`} className="mt-3 block h-auto w-full max-w-[260px] rounded" style={{ background: pv('bg') }}>{[0, 1].map(field)}</svg>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{SYMPTOM_NOTES[v].map(n => <li key={n}>{n}</li>)}</ul>
          <p className="mt-2 text-xs text-muted-foreground">{v === 'basilar' ? 'Posterior-circulation strokes are frequently bilateral or crossed and are easily missed; mimics include vestibular disorders, intoxication and seizure.' : `Lesion side: ${side}. Motor and sensory signs are contralateral (${contra} body). Language vs neglect depends on hemispheric dominance, which varies.`}</p>
        </div>
      </div>
    </div>
  );
}
