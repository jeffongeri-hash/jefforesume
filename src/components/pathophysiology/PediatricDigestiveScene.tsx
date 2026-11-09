import { DIGESTIVE_LESSONS, digestiveState, type DigestiveKind, type DigestiveStructure } from '@/data/pathophysiology/pediatricDigestiveEmergencies';
import FlowParticles from './FlowParticles';
import { Label, Meter, makeHit, pv } from './sceneKit';

type Props = {
  kind: DigestiveKind;
  time: number;
  variant?: string;
  normal?: boolean;
  compact?: boolean;
  showLabels: boolean;
  selected: DigestiveStructure | null;
  onSelect: (id: DigestiveStructure) => void;
};
type State = ReturnType<typeof digestiveState>;
type Hit = ReturnType<typeof makeHit<DigestiveStructure>>;
type PanelProps = { state: State; hit: Hit; showLabels: boolean };
const blue = '#76c7f3';
const red = '#ee918e';
const gold = '#f4d274';

function PyloricStenosis({ state: s, hit, showLabels }: PanelProps) {
  const muscleThickness = 9 + 18 * s.onset;
  const lumenWidth = 23 - 16 * s.narrowedOutlet;
  const flow = 1 - 0.91 * s.narrowedOutlet;
  return <>
    <Label show={showLabels} x={30} y={42} size={13}>Anterior teaching view · anatomy simplified</Label>
    <g {...hit('source')}>
      <path d="M150 69V125C106 125 76 149 81 194C85 248 127 293 194 294C247 296 269 272 289 239H324V215H274C244 215 230 202 224 172C215 128 188 113 172 120V69Z"
        fill={pv('serosa', .48)} stroke={pv('ink', .7)} strokeWidth="3"/>
      <path d="M100 214Q166 235 253 219Q243 270 196 279Q142 277 115 247Z" fill={pv('fluid', .25 + .3 * s.progression)}/>
      <FlowParticles from={[126, 205]} to={[288, 225]} time={s.time} strength={1 - .55 * s.narrowedOutlet} color={blue} count={8}/>
      <FlowParticles from={[149, 174]} to={[149, 68]} time={s.time} strength={s.gastricLoss} color={gold} count={6}/>
      <Label show={showLabels} x={117} y={162}>Stomach</Label>
      <Label show={showLabels} x={67} y={83} size={11}>{s.gastricLoss > .05 ? 'Gastric emesis' : 'Feed enters'}</Label>
    </g>
    <g {...hit('flow')}>
      <path d="M386 226H418Q452 226 452 264Q452 309 418 309H359" fill="none" stroke={pv('serosa', .7)} strokeWidth="42" strokeLinecap="round"/>
      <path d="M386 226H418Q452 226 452 264Q452 309 418 309H359" fill="none" stroke={pv('bg')} strokeWidth="24" strokeLinecap="round"/>
      <path d="M505 142Q489 174 458 181Q438 187 442 243" fill="none" stroke={gold} strokeWidth="7"/>
      <FlowParticles from={[385, 226]} to={[424, 226]} time={s.time} strength={flow} color={blue} count={6}/>
      <FlowParticles from={[447, 273]} to={[374, 309]} time={s.time} strength={flow} color={blue} count={6}/>
      <Label show={showLabels} x={426} y={339} size={12}>Duodenum</Label>
      <Label show={showLabels} x={480} y={160} size={11}>Bile duct enters distal to pylorus</Label>
    </g>
    <g {...hit('anatomy')}>
      <path d="M307 202H391M307 252H391" stroke={red} strokeWidth={muscleThickness} strokeLinecap="round"/>
      <path d="M308 227H390" stroke={pv('bg')} strokeWidth={lumenWidth} strokeLinecap="round"/>
      <FlowParticles from={[310, 227]} to={[389, 227]} time={s.time} strength={flow} color={blue} count={6}/>
      {s.response > .01 && <path d="M352 182V216" stroke={pv('bg')} strokeWidth={10 * s.response} opacity={s.response}/>}
      <Label show={showLabels} x={299} y={174} size={12}>{s.response > .1 ? 'Pyloromyotomy releases muscle' : 'Pyloric muscle and channel'}</Label>
    </g>
    <g {...hit('effect')}>
      <rect x="524" y="221" width="263" height="166" rx="15" fill={pv('panel')} stroke={pv('ink', .3)}/>
      <Label show={showLabels} x={540} y={247} size={13}>Physiology · qualitative</Label>
      <Meter x={541} y={278} w={224} label="Outlet passage" value={flow} color={blue}/>
      <Meter x={541} y={316} w={224} label="Vomiting / gastric losses" value={s.gastricLoss} color={gold}/>
      <Label show={showLabels} x={541} y={363} size={11}>Cl⁻ may fall · HCO₃⁻ may rise</Label>
    </g>
    <Label show={showLabels} x={28} y={441} size={11}>The surgical response shows restored passage after stabilization; changes are qualitative.</Label>
  </>;
}

function MidgutVolvulus({ state: s, hit, showLabels }: PanelProps) {
  const rotation = 145 * s.twist;
  return <>
    <Label show={showLabels} x={28} y={42} size={13}>Anterior abdomen · patient right on the viewer’s left</Label>
    <path d="M108 66Q290 32 475 66Q506 199 475 354Q295 390 108 354Q80 199 108 66Z"
      fill={pv('panel')} stroke={pv('ink', .45)} strokeWidth="3"/>
    <g {...hit('source')}>
      <path d="M205 89Q150 93 147 129Q146 168 196 175Q233 180 251 156H284" fill={pv('serosa', .55)} stroke={red} strokeWidth="4"/>
      <path d="M284 156H310Q338 156 338 180" fill="none" stroke={red} strokeWidth="18" strokeLinecap="round"/>
      <FlowParticles from={[175, 143]} to={[304, 156]} time={s.time} strength={1 - .85 * s.twist} color={blue} count={7}/>
      <Label show={showLabels} x={126} y={109} size={12}>Stomach</Label>
      <Label show={showLabels} x={223} y={144} size={11}>Duodenum</Label>
      {s.progression > .1 && <Label show={showLabels} x={98} y={74} size={11}>Possible bilious emesis</Label>}
    </g>
    <g {...hit('anatomy')}>
      <g transform={`rotate(${rotation} 315 238)`}>
        <path d="M315 183C260 170 221 188 224 211C226 230 287 231 304 220C322 209 303 190 279 201C258 212 266 242 300 247C339 253 359 228 344 215C331 202 313 218 325 239C337 262 384 257 389 234C395 207 359 189 344 193"
          fill="none" stroke={pv('serosa')} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M235 275C275 267 290 300 327 295C363 290 381 277 390 261" fill="none" stroke={pv('serosa')} strokeWidth="22" strokeLinecap="round"/>
        <path d="M222 208C249 186 277 186 298 196" fill="none" stroke={blue} strokeWidth="4" opacity={s.mesentericPerfusion}/>
      </g>
      <path d="M345 201A48 48 0 0 1 360 251" fill="none" stroke={gold} strokeWidth="4" opacity={s.twist}/>
      <path d="M361 244l-1 10-8-6" fill="none" stroke={gold} strokeWidth="4" opacity={s.twist}/>
      <Label show={showLabels} x={214} y={333} size={12}>Midgut loops / mesentery</Label>
    </g>
    <g {...hit('flow')}>
      <path d="M315 116V238" stroke={red} strokeWidth="7"/>
      <path d="M315 201L278 220M315 209L348 229M315 219L300 257" stroke={red} strokeWidth={5 - 3 * s.twist} fill="none"/>
      <FlowParticles from={[315, 119]} to={[315, 232]} time={s.time} strength={s.mesentericPerfusion} color={gold} count={7}/>
      <circle cx="315" cy="238" r={5 + 8 * s.twist} fill={gold} opacity={s.twist}/>
      <Label show={showLabels} x={340} y={117} size={11}>Superior mesenteric artery</Label>
    </g>
    <g {...hit('effect')}>
      <ellipse cx="293" cy="263" rx="44" ry="22" fill="#543448" opacity={.58 * s.bowelInjury}/>
      <rect x="521" y="121" width="254" height="175" rx="15" fill={pv('panel')} stroke={pv('ink', .3)}/>
      <Label show={showLabels} x={538} y={147} size={13}>Mesenteric physiology</Label>
      <Meter x={539} y={183} w={218} label="Twisting" value={s.twist} color={gold}/>
      <Meter x={539} y={225} w={218} label="Mesenteric perfusion" value={s.mesentericPerfusion} color={red}/>
      <Meter x={539} y={267} w={218} label="Possible bowel injury" value={s.bowelInjury} color={pv('serosa')}/>
    </g>
    <Label show={showLabels} x={28} y={441} size={11}>A narrow mesenteric base permits twisting; malrotation does not always cause volvulus.</Label>
  </>;
}

function Dehydration({ state: s, hit, showLabels }: PanelProps) {
  const oral = s.variant === 'oral';
  return <>
    <Label show={showLabels} x={27} y={42} size={13}>Separate intestinal, epithelial and circulatory insets</Label>
    <g {...hit('source')}>
      <path d="M44 106H272V194H44Z" fill={pv('fluid', .18)} stroke={pv('ink', .35)} strokeWidth="2"/>
      <Label show={showLabels} x={58} y={132} size={13}>Intestinal lumen</Label>
      <FlowParticles from={[75, 171]} to={[247, 171]} time={s.time} strength={s.fluidLoss} color={gold} count={7}/>
      <Label show={showLabels} x={65} y={223} size={11}>Vomiting / diarrhea losses</Label>
    </g>
    <g {...hit('anatomy')}>
      <rect x="306" y="91" width="213" height="207" rx="14" fill={pv('panel')} stroke={pv('ink', .3)}/>
      <Label show={showLabels} x={324} y={116} size={12}>Enterocyte inset</Label>
      <rect x="365" y="146" width="90" height="88" rx="12" fill={pv('serosa', .55)} stroke={pv('ink', .55)} strokeWidth="2"/>
      <rect x="357" y="171" width="16" height="28" rx="5" fill={pv('panel')} stroke={pv('ink', .6)} strokeWidth="2"/>
      <path d="M459 185H486" stroke={pv('ink', .5)} strokeWidth="4"/>
      {oral && <>
        <FlowParticles from={[320, 168]} to={[365, 185]} time={s.time} strength={s.therapy} color={red} count={4}/>
        <FlowParticles from={[320, 202]} to={[365, 185]} time={s.time} strength={s.therapy} color={gold} count={4}/>
        <FlowParticles from={[366, 185]} to={[409, 185]} time={s.time} strength={s.therapy} color={gold} count={4}/>
        <FlowParticles from={[429, 185]} to={[502, 185]} time={s.time} strength={s.therapy} color={blue} count={4}/>
        <FlowParticles from={[324, 244]} to={[502, 244]} time={s.time} strength={s.therapy} color={blue} count={5}/>
        <Label show={showLabels} x={318} y={154} size={11}>Na⁺</Label>
        <Label show={showLabels} x={311} y={220} size={11}>Glucose</Label>
        <Label show={showLabels} x={324} y={239} size={11}>H₂O</Label>
      </>}
      <Label show={showLabels} x={377} y={205} size={12}>SGLT1</Label>
      <Label show={showLabels} x={325} y={271} size={11}>{oral ? 'Solute uptake draws water' : 'IV fluid bypasses the gut'}</Label>
    </g>
    <g {...hit('flow')}>
      <rect x="554" y="109" width="229" height="78" rx="25" fill={pv('serosa', .18)} stroke={red} strokeWidth="2"/>
      <FlowParticles from={[565, 148]} to={[773, 148]} time={s.time} strength={s.circulatingVolume} color={red} count={9}/>
      <Label show={showLabels} x={570} y={135} size={12}>Circulation</Label>
      {!oral && <g opacity={s.therapy}>
        <rect x="690" y="51" width="42" height="42" rx="6" fill={pv('fluid', .25)} stroke={blue}/>
        <path d="M711 93V108" stroke={blue} strokeWidth="4"/>
        <FlowParticles from={[711, 79]} to={[711, 146]} time={s.time} strength={s.therapy} color={blue} count={4}/>
        <Label show={showLabels} x={738} y={79} size={11}>IV fluid</Label>
      </g>}
      {oral && <FlowParticles from={[505, 185]} to={[557, 148]} time={s.time} strength={s.therapy} color={blue} count={4}/>}
    </g>
    <g {...hit('effect')}>
      <rect x="554" y="220" width="229" height="123" rx="14" fill={pv('panel')} stroke={pv('ink', .3)}/>
      <Label show={showLabels} x={570} y={247} size={12}>Volume and renal response</Label>
      <Meter x={571} y={281} w={192} label="Circulating volume" value={s.circulatingVolume} color={red}/>
      <Meter x={571} y={320} w={192} label="Renal perfusion · illustrative" value={s.circulatingVolume} color={blue}/>
    </g>
    <Label show={showLabels} x={28} y={441} size={11}>Route and pace depend on clinical assessment; the diagram does not give a fluid prescription.</Label>
  </>;
}

export default function PediatricDigestiveScene({ kind, time, variant, normal, compact, showLabels, selected, onSelect }: Props) {
  const state = digestiveState(kind, time, normal, variant);
  const hit = makeHit(DIGESTIVE_LESSONS[kind].structures, selected, onSelect, compact);
  const panel = { state, hit, showLabels };
  return <svg viewBox="0 0 820 460" role="group" aria-label={DIGESTIVE_LESSONS[kind].title}
    className="block h-auto w-full rounded-lg patho-scene" style={{ background: pv('bg') }} data-scenario={state.variant}>
    {kind === 'pyloric' && <PyloricStenosis {...panel}/>}
    {kind === 'volvulus' && <MidgutVolvulus {...panel}/>}
    {kind === 'dehydration' && <Dehydration {...panel}/>}
  </svg>;
}
