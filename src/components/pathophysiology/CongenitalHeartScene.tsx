import { ramp } from '@/data/pathophysiology/timeline';
import { STRUCTURES } from '@/data/pathophysiology/pediatricCongenitalHeart';
import { Label, makeHit, pv } from './sceneKit';
import FlowParticles from './FlowParticles';

type Structure = keyof typeof STRUCTURES;
type Props = { time: number; normal?: boolean; compact?: boolean; showLabels: boolean; selected: Structure | null; onSelect: (id: Structure) => void; variant?: string };
const blue = '#69baf2', red = '#ef8c8b';

export default function CongenitalHeartScene({ time, normal, compact, showLabels, selected, onSelect, variant }: Props) {
  const t = normal ? 0 : time;
  const ductClosure = ramp(t, 5, 15);
  const lowOutput = ramp(t, 10, 20);
  const tga = !normal && variant === 'tga';
  const hit = makeHit(STRUCTURES, selected, onSelect, compact);
  const bloodToAorta = tga ? blue : red;
  const bloodToLungs = tga ? red : blue;
  return <svg viewBox="0 0 600 390" role="group" aria-label="Conceptual newborn heart and great vessel anatomy" className="block h-auto w-full rounded-lg patho-scene" style={{ background: pv('bg') }}>
    <Label show={showLabels} x={24} y={25} size={13}>Anterior schematic · patient right is on the left</Label>
    <g {...hit('ra')}><ellipse cx="205" cy="145" rx="42" ry="43" fill={pv('fluid', .45)} stroke={blue} strokeWidth="3"/><Label show={showLabels} x={192} y={150}>RA</Label></g>
    <g {...hit('rv')}><path d="M161 201Q184 179 219 194Q250 210 255 300Q206 293 177 264Q158 244 161 201Z" fill={pv('fluid', .45)} stroke={blue} strokeWidth="3"/><Label show={showLabels} x={191} y={242}>RV</Label><FlowParticles from={[205,167]} to={[207,250]} time={t} color={blue}/></g>
    <g {...hit('la')}><ellipse cx="365" cy="145" rx="42" ry="43" fill={pv('serosa', .7)} stroke={red} strokeWidth="3"/><Label show={showLabels} x={351} y={150}>LA</Label></g>
    <g {...hit('lv')}><path d="M272 300Q278 211 307 194Q345 178 379 201Q382 243 353 269Q317 296 272 300Z" fill={pv('serosa', .7)} stroke={red} strokeWidth="4"/><Label show={showLabels} x={336} y={242}>LV</Label><FlowParticles from={[365,167]} to={[337,250]} time={t} color={red}/></g>
    <g {...hit('septum')}><path d={tga?'M264 102V131M264 158V300':'M264 102V300'} stroke={pv('ink', .75)} strokeWidth="6"/><Label show={showLabels} x={238} y={325} size={11}>{tga?'Atrial mixing shown':'Septum'}</Label></g>
    <g {...hit('aorta')}><path d={tga?'M207 201Q208 82 421 69L438 69':'M337 201Q338 82 421 69L438 69'} stroke={bloodToAorta} strokeWidth="17" fill="none"/><path d="M438 69Q465 92 445 145V196" stroke={bloodToAorta} strokeWidth="17" fill="none"/><FlowParticles from={[438,80]} to={[445,196]} time={t} strength={tga?1:1-.8*lowOutput} color={bloodToAorta}/><Label show={showLabels} x={440} y={53}>Aorta</Label>{!tga&&!normal&&<path d="M435 123L454 132" stroke={pv('alert')} strokeWidth={4+6*lowOutput}/>}</g>
    <g {...hit('pulmonaryArtery')}><path d={tga?'M338 201Q335 109 164 75':'M207 201Q205 109 164 75'} stroke={bloodToLungs} strokeWidth="17" fill="none"/><FlowParticles from={tga?[205,90]:[188,115]} to={[166,78]} time={t} color={bloodToLungs}/><Label show={showLabels} x={65} y={62} size={12}>Pulmonary artery</Label></g>
    <g {...hit('ductus')}><path d="M178 86Q293 40 426 86" stroke="#b887d5" strokeWidth={8-6*ductClosure} fill="none"/><FlowParticles from={[178,86]} to={[426,86]} time={t} strength={1-ductClosure} color="#b887d5"/><Label show={showLabels} x={242} y={56} size={11}>Ductus arteriosus</Label></g>
    <Label show={showLabels} x={32} y={360} size={11}>{normal?'Reference: normally connected great arteries':tga?'Great arteries arise from opposite ventricles · mixing site varies':'Aortic narrowing can reduce distal flow as the ductus closes'}</Label>
  </svg>;
}
