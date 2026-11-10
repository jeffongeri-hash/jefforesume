import { inheritedCase, ramp, STRUCTURES, type Structure } from '@/data/pathophysiology/inheritedHemostasis';
import { makeHit, pv } from './sceneKit';

type Props = {time: number; normal?: boolean; compact?: boolean; showLabels: boolean; selected: Structure | null; onSelect: (id: Structure) => void; variant?: string; title?: string};

export default function InheritedHemostasisScene({time, normal, compact, showLabels, selected, onSelect, variant = '', title}: Props) {
  const t = time;
  const c = inheritedCase(variant);
  const active = normal ? 0 : ramp(t, 5, 10);
  const response = ramp(t, 10, 16);
  const venous = c.mode === 'venous';
  const plug = venous ? 0 : response * (!normal && c.mode === 'adhesion' ? .25 : 1);
  const mesh = venous ? (normal ? 0 : response) : response * (!normal && c.mode === 'fibrin' ? .22 : 1);
  const hit = makeHit(STRUCTURES, selected, onSelect, compact);
  return <svg viewBox="0 0 760 390" role="group" aria-label={title ?? 'Inherited bleeding and clotting mechanisms'} className="block h-auto w-full rounded-lg patho-scene" style={{background: pv('bg')}}>
    <text x="25" y="30" fill={pv('ink')} fontSize="15">{active > 0 ? c.label : 'Balanced hemostasis reference'}</text>
    <g {...hit('vessel')}>
      <rect x="24" y="61" width="712" height="166" rx="50" fill={pv('inflame', .18)} stroke={pv('serosa', .9)} strokeWidth="5"/>
      <text x="47" y="89" fill={pv('ink')} fontSize="13">{venous ? 'Venous circulation →' : 'Blood flow →'}</text>
      {Array.from({length: 8}, (_, i) => <ellipse key={i} cx={48 + ((t*37 + i*84)%653)} cy={117+(i%3)*30} rx="10" ry="6" fill={pv('inflame', .86)} stroke={pv('ink', .35)}/>)}
      {!venous && <path d="M332 227 l21 -14 16 10 18 -13 25 17" fill="none" stroke={pv('alert', .95)} strokeWidth="5"/>}
    </g>
    <g {...hit('adhesion')}>
      {[0,1,2,3,4].map(i => {
        const flowX = 58 + ((t*38+i*123)%640);
        const reach = i < 4 ? plug : 0;
        const x = flowX*(1-reach) + (348 + i*15)*reach;
        return <ellipse key={i} cx={x} cy={160 + reach*49} rx="7" ry="4.5" fill={pv('alert')} stroke={pv('ink', .5)}/>;
      })}
    </g>
    <g {...hit('aggregation')} opacity={!normal && c.mode === 'aggregation' ? response*.14 : plug}>
      <path d="M346 209 Q354 189 364 205 T382 204 T403 209" stroke={pv('ink')} fill="none" strokeWidth="3"/>
    </g>
    {mesh > .01 && <g {...hit('fibrin')}>
      <path d="M-48 0 Q-15 -35 47 -5 M-44 -9 L42 -26 M-32 -27 L38 -2 M-22 -2 L19 -32 M-6 -6 L34 -26" transform={`translate(${venous ? 520 : 372} 215) scale(${.3+.85*mesh})`} stroke={pv('ink', .85)} fill="none" strokeWidth="3" opacity={mesh}/>
      {venous && <ellipse cx="520" cy={219-22*response} rx={55*response} ry={27*response} fill={pv('alert', .34)} stroke={pv('alert', .85)}/>}
    </g>}
    {!normal && !venous && response > .01 && <g aria-hidden="true">
      {[0,1,2].map(i => <circle key={i} cx={359+i*12} cy={231+(t*27+i*11)%32} r="4" fill={pv('inflame', .8*response)}/>)}
    </g>}
    {(['adhesion','aggregation','fibrin','brakes'] as const).map((step, i) => {
      const x = 24+i*181;
      return <g key={step} {...hit(step)}>
        <rect x={x} y="283" width="168" height="55" rx="10" fill={pv('panel')} stroke={pv(c.target === step && active > .01 ? 'alert' : 'ink', .35+.6*active)} strokeWidth={c.target === step && active > .01 ? 3 : 1}/>
        <text x={x+84} y="316" textAnchor="middle" fill={pv('ink')} fontSize="12">{step === 'brakes' ? 'Natural anticoagulants' : STRUCTURES[step].label}</text>
      </g>;
    })}
    {showLabels && <text x="24" y="370" fill={pv('ink', .76)} fontSize="11">Illustrative response. Clot size and timing are qualitative.</text>}
  </svg>;
}
