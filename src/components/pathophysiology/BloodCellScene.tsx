import { bloodCase, phaseAt, ramp, STRUCTURES, type Structure } from '@/data/pathophysiology/bloodCells';
import { makeHit, pv } from './sceneKit';

type Cell = 'red' | 'platelet' | 'white' | 'blast' | 'clone' | 'macro' | 'hypersegmented';
type Props = {time: number; normal?: boolean; compact?: boolean; showLabels: boolean; selected: Structure | null; onSelect: (id: Structure) => void; variant?: string; title?: string};

function BloodCell({x, y, kind, opacity = 1}: {x: number; y: number; kind: Cell; opacity?: number}) {
  const red = kind === 'red' || kind === 'macro';
  const large = kind === 'macro';
  return <g transform={`translate(${x} ${y})`} opacity={opacity}>
    {red ? <>
      <ellipse rx={large ? 17 : 12} ry={large ? 10 : 8} fill={pv('inflame', .85)} stroke={pv('ink', .55)} />
      <ellipse rx={large ? 8 : 6} ry="4" fill={pv('bg', .4)} />
    </> : kind === 'platelet' ?
      <path d="M-6 1l4-5 6 1 2 4-5 3z" fill={pv('alert')} stroke={pv('ink', .4)} /> :
      <>
        <circle r={kind === 'blast' ? 13 : 11} fill={pv(kind === 'clone' ? 'fluid' : 'serosa', .8)} stroke={pv('ink', .6)} />
        {kind === 'blast' || kind === 'clone' ?
          <circle r={kind === 'blast' ? 9 : 7} fill={pv('bg', .8)} /> :
          <path d={kind === 'hypersegmented' ? 'M-7 0h14' : 'M-5 2q5-12 10 0'} stroke={pv('bg', .8)} strokeWidth="5" strokeDasharray={kind === 'hypersegmented' ? '1 2' : undefined} strokeLinecap="round" />}
      </>}
  </g>;
}

export default function BloodCellScene({time, normal, compact, showLabels, selected, onSelect, variant = '', title}: Props) {
  const t = normal ? 0 : time;
  const kind = bloodCase(variant);
  const phase = phaseAt(t);
  const origin = ramp(t, 5, 10);
  const process = ramp(t, 10, 15);
  const effect = ramp(t, 15, 20);
  const hit = makeHit(STRUCTURES, selected, onSelect, compact);
  const thrombocytopenia = kind === 'thrombocytopenia' && phase > 0;
  const lowOutput = thrombocytopenia && phase === 1;
  const loss = thrombocytopenia && phase === 2;
  const splenicPool = thrombocytopenia && phase === 3;
  const lowPlatelets = thrombocytopenia ? 0.77 : kind === 'leukemia' ? process * .55 : 0;
  const lowRed = kind === 'leukemia' || kind === 'megaloblastic' ? process * .62 : 0;
  const marrowClone = kind === 'leukemia' ? origin * .35 + process * .65 : 0;
  const nodeClone = kind === 'lymphoma' ? origin * .35 + process * .65 : 0;
  const labels = {leukemia: 'Blasts may enter blood', lymphoma: 'Clonal lymphocytes expand in tissue', leukocytosis: 'Mature neutrophils mobilize', megaloblastic: 'Fewer red cells complete maturation', thrombocytopenia: 'Separate causes of a lower circulating count'};

  return <svg viewBox="0 0 760 460" role="group" aria-label={title ?? 'Bone marrow, blood and lymphoid cell mechanisms'} className="block h-auto w-full rounded-lg patho-scene" style={{background: pv('bg')}}>
    <text x="24" y="30" fill={pv('ink')} fontSize="15">{phase ? labels[kind] : 'Reference: marrow production and circulating cells'}</text>
    <g {...hit('marrow')}>
      <rect x="24" y="57" width="295" height="176" rx="25" fill={pv('serosa', .23)} stroke={pv('serosa', .8)} strokeWidth="2"/>
      <text x="44" y="84" fill={pv('ink')} fontSize="15">Bone marrow</text>
      <path d="M61 144 H275" stroke={pv('ink', .4)} strokeWidth="2" strokeDasharray="5 4"/>
      <BloodCell x={65} y={144} kind="white"/>
      {Array.from({length: 7}, (_, i) => <BloodCell key={i} x={106 + 26*i} y={131 + (i%2)*27} kind={i%2 ? 'red' : 'white'} opacity={1 - marrowClone*.72}/>)}
      {Array.from({length: 9}, (_, i) => <BloodCell key={i} x={123 + (i%5)*31} y={105 + Math.floor(i/5)*67} kind="blast" opacity={Math.max(0, Math.min(1, marrowClone*10-i))}/>)}
      {kind === 'megaloblastic' && origin > 0 && <BloodCell x={197} y={191} kind="macro" opacity={origin}/>}
      {!lowOutput && <BloodCell x={264} y={191} kind="platelet"/>}
      {showLabels && <text x="44" y="215" fill={pv('ink', .77)} fontSize="12">{lowOutput ? 'Megakaryocyte output decreases' : 'Progenitors mature into blood cells'}</text>}
    </g>
    <path d="M165 234 V266 l-6 -9 m6 9 6 -9" fill="none" stroke={pv('ink', .6)} strokeWidth="2" />
    <BloodCell x={165} y={238 + (t * 20 % 24)} kind={kind === 'leukocytosis' ? 'white' : 'platelet'} opacity={lowOutput ? .2 : 1}/>
    <g {...hit('lymph')}>
      <path d="M407 83 C450 41 526 60 536 117 C547 170 494 207 448 195 C403 185 382 133 407 83Z" fill={pv('fluid', .17 + nodeClone*.18)} stroke={pv('fluid', .85)} strokeWidth="3"/>
      <text x="465" y="109" fill={pv('ink')} textAnchor="middle" fontSize="14">Lymph node</text>
      {[0,1,2,3,4,5,6].map(i => <BloodCell key={i} x={421 + (i%4)*29} y={133 + Math.floor(i/4)*32} kind="clone" opacity={Math.max(0, Math.min(1, nodeClone*8-i))}/>)}
    </g>
    <g {...hit('spleen')}>
      <path d="M618 84 C683 61 713 102 690 156 C673 186 621 199 595 164 C579 141 586 101 618 84Z" fill={pv('serosa', .45)} stroke={pv('ink', .6)} strokeWidth="2"/>
      <text x="645" y="117" textAnchor="middle" fill={pv('ink')} fontSize="14">Spleen</text>
      {splenicPool && [0,1,2,3,4,5].map(i => <BloodCell key={i} x={615 + (i%3)*24} y={145 + Math.floor(i/3)*19} kind="platelet" opacity={effect}/>)}
    </g>
    {splenicPool && <g aria-hidden="true">
      <path d="M647 272 V191" stroke={pv('alert', .7)} strokeWidth="2"/>
      <BloodCell x={647} y={268 - t*31%70} kind="platelet" opacity={effect}/>
    </g>}
    <g {...hit('blood')}>
      <rect x="24" y="272" width="710" height="103" rx="30" fill={pv('inflame', .16)} stroke={pv('serosa', .85)} strokeWidth="3"/>
      <text x="41" y="297" fill={pv('ink')} fontSize="14">Peripheral blood →</text>
      {Array.from({length: 12}, (_, i) => {
        const x = 49 + ((t*39 + i*56) % 653);
        const cell: Cell = i%3 === 0 ? 'platelet' : i%3 === 1 ? 'red' : 'white';
        const kindInBlood = cell === 'red' && kind === 'megaloblastic' && effect > .3 ? 'macro' : cell;
        const opacity = cell === 'red' ? 1-lowRed : cell === 'platelet' ? 1-lowPlatelets : 1;
        return <BloodCell key={i} x={x} y={322 + (i%2)*23} kind={kindInBlood} opacity={opacity}/>;
      })}
      {(kind === 'leukemia' || kind === 'leukocytosis') && [0,1,2,3,4].map(i =>
        <BloodCell key={i} x={53+((t*37+i*134)%650)} y={322} kind={kind === 'leukemia' ? 'blast' : 'white'} opacity={kind === 'leukemia' ? effect : process}/>)}
    </g>
    {loss && <g {...hit('clearance')}>
      <path d="M509 371 Q517 408 541 413" stroke={pv('alert', .75)} fill="none" strokeWidth="2" />
      <BloodCell x={515 + (t*20%25)} y={373 + (t*19%40)} kind="platelet" opacity={process}/>
      <text x="550" y="418" fill={pv('ink')} fontSize="12">Peripheral platelet loss</text>
    </g>}
    {kind === 'megaloblastic' && effect > .01 && <g {...hit('smear')}>
      <BloodCell x={42} y={410} kind="macro" opacity={effect}/>
      <BloodCell x={82} y={410} kind="hypersegmented" opacity={effect}/>
      <text x="108" y="414" fill={pv('ink')} fontSize="12">Macro-ovalocyte and hypersegmented neutrophil</text>
    </g>}
    {showLabels && <text x="24" y="444" fill={pv('ink', .74)} fontSize="11">Illustrative cell shapes and movement. The number and size of symbols are qualitative.</text>}
  </svg>;
}
