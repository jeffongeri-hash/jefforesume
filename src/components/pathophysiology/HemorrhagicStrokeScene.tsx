import { STRUCTURES, hemState, asHem, type StructureId } from '@/data/pathophysiology/hemorrhagicStroke';
import { Label, Meter, makeHit, pv } from './sceneKit';

type Props = { time: number; normal?: boolean; showLabels: boolean; selected: StructureId | null; onSelect: (id: StructureId) => void; compact?: boolean; title?: string; variant?: string };

const CX = 260, CY = 235;
const DURA = `M ${CX - 198} ${CY} a 198 188 0 1 0 396 0 a 198 188 0 1 0 -396 0 Z`;
const BRAIN = 'M 260 62 Q 330 50 390 92 Q 446 140 446 220 Q 448 286 410 322 Q 380 352 330 352 L 290 362 Q 260 372 230 362 L 190 352 Q 140 352 110 322 Q 72 286 74 220 Q 74 140 130 92 Q 190 50 260 62 Z';
const SULCI = ['M 120 120 l 22 14', 'M 96 180 l 26 6', 'M 92 260 l 26 -6', 'M 400 120 l -22 14', 'M 424 180 l -26 6', 'M 428 260 l -26 -6', 'M 200 72 l 6 22', 'M 320 72 l -6 22'];

export default function HemorrhagicStrokeScene({ time, normal = false, showLabels, selected, onSelect, compact, title, variant = 'ich' }: Props) {
  const v = asHem(variant);
  const s = hemState(v, time, normal);
  const hit = makeHit(STRUCTURES, selected, onSelect, compact);
  const sel = (id: StructureId) => selected === id;
  const dx = -18 * s.shift; // lesion on the patient's left (viewer's right) pushes midline toward viewer's left
  const vScale = 1 + 0.7 * s.hydro;
  const hR = 8 + 40 * s.hematoma, eR = hR + 20 * s.edema;
  const H = { x: 332, y: 214 };
  const pulse = 1 + 0.03 * Math.sin(time * 5) * s.bleed;
  const blood = (a: number) => pv('rbc', a);
  const compliance = Math.max(0, 1 - (s.hematoma + s.edema * 0.6 + s.hydro * 0.6 + s.sahSpread * 0.3)); // CSF reserve concept

  return (
    <svg viewBox="0 0 820 560" role="img" aria-label={title ?? `Illustrative coronal brain section: ${v === 'ich' ? 'intracerebral haemorrhage with haematoma, oedema and mass effect' : 'subarachnoid haemorrhage from a ruptured aneurysm spreading through cisterns'} — not a scan`} className="block h-auto w-full rounded-lg patho-scene" style={{ background: pv('bg') }}
      data-variant={v} data-hematoma={s.hematoma.toFixed(2)} data-sah={s.sahSpread.toFixed(2)} data-icp={s.icp.toFixed(2)} data-shift={s.shift.toFixed(2)}>
      <text x="14" y="20" fontSize="11" fill={pv('ink', 0.75)}>Illustrative coronal section, viewed from the front (patient’s right = your left) · not a CT or MRI</text>
      <text x="40" y="46" fontSize="10" fill={pv('ink', 0.65)}>Patient’s R</text><text x="480" y="46" fontSize="10" textAnchor="end" fill={pv('ink', 0.65)}>Patient’s L</text>

      <g {...hit('skull')}><ellipse cx={CX} cy={CY} rx={212} ry={202} fill="none" stroke={pv('ink', sel('skull') ? 0.9 : 0.55)} strokeWidth={sel('skull') ? 14 : 11} /></g>
      <g {...hit('subarachnoid')}>
        <path d={`${DURA} ${BRAIN}`} fillRule="evenodd" fill={pv('fluid', 0.18)} />
        {v === 'sah' && s.sahSpread > 0.01 && <path d={`${DURA} ${BRAIN}`} fillRule="evenodd" fill={blood(0.75 * s.sahSpread)} />}
      </g>
      <g {...hit('dura')}><path d={DURA} fill="none" stroke={pv('serosa', 0.8)} strokeWidth={sel('dura') ? 4 : 2} /><path d={`M ${CX} ${CY - 188} L ${CX} 150`} stroke={pv('serosa', 0.9)} strokeWidth={sel('dura') ? 5 : 3} /></g>
      <g {...hit('cortex')}>
        <path d={BRAIN} fill={pv('brain', 0.38)} stroke={pv('ink', sel('cortex') ? 1 : 0.35)} strokeWidth={sel('cortex') ? 2.5 : 1} />
        {SULCI.map(d => <path key={d} d={d} stroke={v === 'sah' && s.sahSpread > 0.3 ? blood(0.9 * s.sahSpread) : pv('ink', 0.4)} strokeWidth={v === 'sah' ? 1 + 2.5 * s.sahSpread : 1.2} />)}
        {/* Sylvian fissures */}
        {[['M 76 236 Q 120 232 150 250', 0], ['M 444 236 Q 400 232 370 250', 1]].map(([d, i]) => <path key={i as number} d={d as string} fill="none" stroke={v === 'sah' && s.sahSpread > 0.05 ? blood(0.3 + 0.7 * s.sahSpread) : pv('fluid', 0.5)} strokeWidth={v === 'sah' ? 2 + 4 * s.sahSpread : 2} />)}
        <path d="M 260 62 L 260 150" stroke={pv('fluid', 0.4)} strokeWidth="3" />
      </g>

      {/* Deep structures shift with mass effect */}
      <g transform={`translate(${dx} 0)`}>
        <g {...hit('ventricles')}>
          <g transform={`translate(225 182) scale(${vScale}) translate(-225 -182)`}><path d="M 256 168 Q 214 158 200 186 Q 220 198 256 200 Z" fill={pv('fluid', 0.55)} stroke={pv('ink', sel('ventricles') ? 1 : 0.4)} /></g>
          <g transform={`translate(295 182) scale(${vScale} ${vScale * (1 - 0.45 * s.shift)}) translate(-295 -182)`}><path d="M 264 168 Q 306 158 320 186 Q 300 198 264 200 Z" fill={pv('fluid', 0.55)} stroke={pv('ink', sel('ventricles') ? 1 : 0.4)} />{s.ivh > 0.02 && <path d="M 264 172 Q 300 166 314 186 Q 296 196 264 198 Z" fill={blood(0.85 * s.ivh)} />}</g>
          <rect x={257} y={210} width={6 * (1 + 0.8 * s.hydro)} height={36} rx={3} fill={pv('fluid', 0.55)} />
          <Label show={showLabels} x={180} y={160} anchor="end">Lateral ventricles</Label>
        </g>
        <g {...hit('thalamus')}><ellipse cx={240} cy={232} rx={16} ry={20} fill={pv('brain', 0.6)} stroke={pv('ink', 0.35)} /><ellipse cx={282} cy={232} rx={16} ry={20} fill={pv('brain', 0.6)} stroke={pv('ink', 0.35)} /></g>
        <g {...hit('basalGanglia')}><ellipse cx={188} cy={214} rx={16} ry={30} fill={pv('brain', 0.62)} stroke={pv('ink', sel('basalGanglia') ? 1 : 0.35)} /><ellipse cx={H.x} cy={H.y} rx={16} ry={30} fill={pv('brain', 0.62)} stroke={pv('ink', sel('basalGanglia') ? 1 : 0.35)} /><Label show={showLabels} x={150} y={250} anchor="end">Putamen</Label></g>
      </g>
      <g {...hit('midline')}><path d={`M ${CX} 150 L ${CX + dx} 210 L ${CX + dx} 300`} fill="none" stroke={pv('alert', s.shift > 0.05 ? 0.9 : 0.25)} strokeWidth={sel('midline') ? 3 : 1.5} strokeDasharray="5 4" />{s.shift > 0.1 && <Label show={showLabels} x={CX + dx - 8} y={312} anchor="end">Midline shift</Label>}</g>

      {/* Base: brainstem, cisterns, circle of Willis */}
      <g {...hit('cisterns')}><path d="M 215 352 Q 260 340 305 352 Q 300 378 260 382 Q 220 378 215 352 Z" fill={v === 'sah' && s.sahSpread > 0.01 ? blood(0.3 + 0.65 * s.sahSpread) : pv('fluid', 0.35)} stroke={pv('ink', sel('cisterns') ? 1 : 0.3)} /><Label show={showLabels} x={320} y={396}>Basal cisterns</Label></g>
      <g {...hit('brainstem')}><path d={`M ${242 + dx * 0.3} 372 L ${240 + dx * 0.3} 450 L ${280 + dx * 0.3} 450 L ${278 + dx * 0.3} 372 Z`} fill={pv('brain', 0.55)} stroke={pv('ink', sel('brainstem') ? 1 : 0.35)} /><Label show={showLabels} x={290} y={440}>Brainstem</Label></g>
      <path d="M 200 360 Q 230 352 260 356 Q 290 352 320 360 M 320 360 Q 350 330 368 250 M 200 360 Q 170 330 152 250" fill="none" stroke={pv('vessel', 0.85)} strokeWidth="3" aria-hidden />
      <g {...hit('perforator')}><path d="M 338 330 Q 340 280 336 244" fill="none" stroke={pv('vessel', v === 'ich' && s.bleed > 0.2 ? 0.95 : 0.6)} strokeWidth={sel('perforator') ? 4 : 2} /><Label show={showLabels} x={352} y={300}>Penetrating artery</Label></g>
      <g {...hit('aneurysm')}><circle cx={300} cy={352} r={v === 'sah' ? 7 : 5} fill={pv('vessel', 0.9)} stroke={pv('alert', v === 'sah' && s.bleed > 0.1 ? 1 : 0.4)} strokeWidth={sel('aneurysm') ? 3 : 1.5} />{v === 'sah' && s.bleed > 0.1 && <path d="M 300 345 l 8 -10 M 306 350 l 12 -4" stroke={blood(1)} strokeWidth="2.5" />}<Label show={showLabels} x={300} y={420} anchor="middle">Circle of Willis · aneurysm</Label></g>

      {/* ICH haematoma and oedema */}
      {v === 'ich' && !normal && <g transform={`translate(${dx * 0.4} 0)`}>
        <g {...hit('edema')}>{s.edema > 0.01 && <circle cx={H.x} cy={H.y} r={eR} fill={pv('membrane', 0.35 * s.edema)} stroke={pv('membrane', 0.7 * s.edema)} strokeDasharray="4 3" />}{s.edema > 0.3 && <Label show={showLabels} x={H.x + eR + 6} y={H.y - eR + 6}>Oedema</Label>}</g>
        <g {...hit('hematoma')}>{s.hematoma > 0.01 && <circle cx={H.x} cy={H.y} r={hR * pulse} fill={blood(0.92)} stroke={pv('ink', sel('hematoma') ? 1 : 0.3)} strokeWidth={sel('hematoma') ? 3 : 1} />}{s.expansion > 0.02 && <circle cx={H.x} cy={H.y} r={hR + 6} fill="none" stroke={pv('alert', 0.9)} strokeDasharray="3 3" />}{s.hematoma > 0.1 && <Label show={showLabels} x={H.x + hR + 10} y={H.y + 4}>{s.expansion > 0.05 ? 'Haematoma (expanding?)' : 'Haematoma'}</Label>}</g>
      </g>}
      {v === 'ich' && s.icp > 0.75 && <g aria-hidden><path d={`M ${CX + 30} 140 Q ${CX} 150 ${CX - 30} 150`} fill="none" stroke={pv('alert')} strokeWidth="2" markerEnd="" /><Label show={showLabels} x={CX - 36} y={140} anchor="end" size={10}>possible herniation risk</Label></g>}

      {/* ICP + Monro–Kellie */}
      <g {...hit('icp')}>
        <rect x="520" y="60" width="285" height="170" rx="8" fill={pv('panel')} stroke={pv('ink', sel('icp') ? 1 : 0.2)} strokeWidth={sel('icp') ? 2.5 : 1} />
        <text x="534" y="80" fontSize="11" fill={pv('ink', 0.9)}>Monro–Kellie concept (qualitative)</text>
        {(() => { const added = Math.min(0.35, 0.2 * s.hematoma + 0.12 * s.edema + 0.08 * s.sahSpread + 0.12 * s.hydro); const csf = 0.12 * compliance; const venous = 0.1 * (0.5 + 0.5 * compliance); const brain = 1 - added - csf - venous; let x = 534; return [['Brain', brain, 'brain'], ['Venous blood', venous, 'vein'], ['CSF reserve', csf, 'fluid'], [v === 'ich' ? 'Haematoma + oedema' : 'Blood + CSF block', added, 'rbc']].map(([n, w, c]) => { const width = 255 * (w as number); const el = <g key={n as string}><rect x={x} y={92} width={Math.max(0, width)} height={22} fill={pv(c as string, 0.75)} />{width > 40 && <text x={x + 4} y={107} fontSize="9" fill={pv('bg')}>{n as string}</text>}</g>; x += width; return el; }); })()}
        <text x="534" y="132" fontSize="9" fill={pv('ink', 0.75)}>Added volume first displaces CSF and venous blood; once reserve is used, ICP rises steeply.</text>
        <Meter x={534} y={160} w={255} label="Intracranial pressure (concept)" value={s.icp} color={pv('alert')} />
        <Meter x={534} y={198} w={255} label="Compensatory reserve (concept)" value={compliance} color={pv('fluid')} />
      </g>

      {/* NCCT concept */}
      <g {...hit('ncct')}>
        <rect x="520" y="250" width="285" height="200" rx="8" fill={pv('panel')} stroke={pv('ink', sel('ncct') ? 1 : 0.2)} strokeWidth={sel('ncct') ? 2.5 : 1} />
        <text x="534" y="270" fontSize="11" fill={pv('ink', 0.9)}>Non-contrast CT concept — icons, not scans</text>
        {(['ich', 'sah'] as const).map((k, i) => <g key={k} transform={`translate(${534 + i * 136} 282)`} opacity={k === v ? 1 : 0.45}>
          <rect width="122" height="120" rx="6" fill={pv('bg')} stroke={pv(k === v ? 'alert' : 'ink', k === v ? 0.9 : 0.3)} />
          <ellipse cx="61" cy="58" rx="46" ry="44" fill={pv('ink', 0.28)} stroke={pv('ink', 0.85)} strokeWidth="4" />
          <path d="M 49 46 Q 61 40 73 46 L 73 60 Q 61 56 49 60 Z" fill={pv('bg', 0.9)} />
          {k === 'ich' ? <circle cx="80" cy="56" r={k === v ? 6 + 10 * s.hematoma : 12} fill={pv('ink', 0.95)} /> : <path d="M 40 86 Q 61 76 82 86 M 20 60 Q 30 58 38 64 M 102 60 Q 92 58 84 64 M 30 34 l 8 6 M 92 34 l -8 6" fill="none" stroke={pv('ink', 0.95)} strokeWidth={k === v ? 1.5 + 3 * s.sahSpread : 3} />}
          <text x="61" y="114" fontSize="9" textAnchor="middle" fill={pv('ink', 0.8)}>{k === 'ich' ? 'ICH: bright blood in tissue' : 'SAH: bright cisterns/sulci'}</text>
        </g>)}
        <text x="534" y="424" fontSize="9" fill={pv('ink', 0.75)}>Acute blood is hyperdense. SAH sensitivity is highest early</text>
        <text x="534" y="438" fontSize="9" fill={pv('ink', 0.75)}>and declines with time; a later normal CT does not exclude it.</text>
      </g>

      <text x="20" y="490" fontSize="10" fill={pv('ink', 0.7)}>{v === 'ich' ? 'Deep (putaminal) ICH on the patient’s left shown; lobar, cerebellar and brainstem ICH behave differently.' : 'Aneurysmal SAH shown; non-aneurysmal and traumatic SAH have different patterns and courses.'}</text>
      <text x="20" y="506" fontSize="10" fill={pv('ink', 0.7)}>Expansion, hydrocephalus and herniation are possible outcomes — not a fixed sequence or timeline.</text>
    </svg>
  );
}
