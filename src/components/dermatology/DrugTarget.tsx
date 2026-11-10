import type { Lesson } from '@/data/dermatologyAtlas';
import { Label, pv } from '@/components/pathophysiology/sceneKit';
import FlowParticles from '@/components/pathophysiology/FlowParticles';
type Props={lesson:Lesson;time:number;engagement:number;benefit:number;exposure:number;labels:boolean};
const blue='#79c8e8',gold='#e9cc77',red='#e58f9b',purple='#b9a1df';
/** Inset coordinates only; compartments are deliberately framed apart from skin. */
export default function DrugTarget({lesson:c,time,engagement:a,benefit:b,exposure,labels}:Props){
 const text=(x:number,y:number,t:string,size=11)=><Label show={labels} x={x} y={y} size={size}>{t}</Label>;
 const flow=(from:[number,number],to:[number,number],strength=1,color=purple)=><FlowParticles from={from} to={to} time={time} strength={strength} color={color} count={6}/>;
 const cross=(x:number,y:number)=><path d={`M${x-9} ${y-10}l18 20m0-20-18 20`} stroke={blue} strokeWidth="5" opacity={a}/>;
 const membrane=<><path d="M548 172H898M548 181H898" stroke={pv('ink',.45)} strokeWidth="3"/>{text(552,119,'Extracellular')}{text(552,212,'Intracellular')}</>;
 const receptor=<path d="M706 158v31m28-31v31m-28-30q14 22 28 0" fill="none" stroke={gold} strokeWidth="5"/>;
 const drug=<circle cx={858-117*exposure} cy="154" r="8" fill={blue} opacity={exposure}/>;
 const nucleus=<><ellipse cx="747" cy="277" rx="86" ry="43" fill={purple} fillOpacity=".12" stroke={purple}/>{text(713,308,'Nucleus')}</>;
 if(c.id==='antibiotic')return <>
  <ellipse cx="718" cy="207" rx="123" ry="82" fill={gold} fillOpacity=".08" stroke={gold}/>{text(602,111,'Bacterial ribosome · two distinct targets')}
  <ellipse cx="718" cy="185" rx="61" ry="27" fill={purple} fillOpacity=".5" stroke={purple}/><ellipse cx="718" cy="237" rx="48" ry="19" fill={red} fillOpacity=".5" stroke={red}/>{text(696,189,'50S')}{text(696,241,'30S')}
  {flow([600,213],[836,213],1-.85*a,gold)}{cross(763,184)}{cross(753,238)}{text(552,305,'Clindamycin → 50S; doxycycline → 30S')}{text(552,329,'Translation decreases · resistance still matters')}
 </>;
 if(c.id==='antifungal')return <>
  <ellipse cx="719" cy="211" rx="138" ry="82" fill={purple} fillOpacity=".09" stroke={purple} strokeWidth="5"/><ellipse cx="719" cy="211" rx="129" ry="73" fill="none" stroke={gold} strokeWidth="2"/>{text(579,111,'Fungal membrane / sterol pathway')}
  <rect x="637" y="184" width="168" height="42" rx="12" fill={pv('panel')} stroke={gold}/>{text(648,208,'Squalene epoxidase',11)}{flow([594,205],[635,205])}{flow([805,205],[849,205],1-.85*a)}{cross(777,204)}{text(553,311,'Squalene ↑ · ergosterol synthesis ↓')}{text(553,332,'Terbinafine targets an enzyme, not a ribosome')}
 </>;
 if(c.id==='pde4')return <>
  {text(550,111,'Intracellular second-messenger metabolism')}
  <circle cx="592" cy="178" r="24" fill={purple} fillOpacity=".35"/>{text(575,182,'cAMP')}
  <rect x="677" y="157" width="83" height="42" rx="10" fill={pv('bg')} stroke={gold}/>{text(701,182,'PDE4')}
  <circle cx="849" cy="178" r="24" fill={purple} fillOpacity=".15"/>{text(834,182,'AMP')}
  {flow([620,178],[675,178],1-.8*a)}{flow([764,178],[824,178],1-.8*a)}{cross(744,177)}
  {Array.from({length:6},(_,i)=><circle key={i} cx={605+i*44} cy={246+10*Math.sin(time+i)} r="8" fill={purple} opacity={.15+.65*b}/>)}{text(551,304,'Less cAMP breakdown → altered inflammatory signaling')}
 </>;
 if(c.id==='clascoterone')return <>
  {text(550,111,'Androgen-receptor antagonism inside skin cells')}
  <ellipse cx="721" cy="223" rx="161" ry="108" fill="none" stroke={pv('ink',.45)}/>{nucleus}
  <circle cx="667" cy="199" r="19" fill={gold} fillOpacity=".4"/>{text(658,204,'AR')}
  {flow([581,166],[645,194],1-.9*a,gold)}{cross(677,199)}{flow([688,212],[746,267],1-.9*a)}
  <circle cx={842-154*exposure} cy="185" r="8" fill={blue} opacity={exposure}/>{text(550,350,'Local androgen signaling changes; full effect is complex')}
 </>;
 if(['dupilumab','il17','il23','jak'].includes(c.id))return <>
  {membrane}{receptor}{drug}
  {flow([720,110],[720,151],['il17','il23'].includes(c.id)?1-.9*a:1,gold)}
  {c.id==='jak'?<><rect x="682" y="216" width="79" height="32" rx="8" stroke={gold} fill={pv('bg')}/>{text(695,236,'JAK1 / 2')}{cross(757,231)}{flow([722,190],[722,215])}{flow([722,251],[722,282],1-.9*a)}{text(551,330,'Receptor signal → JAK → STAT → transcription')}</>:c.id==='clascoterone'?<>
   {nucleus}<circle cx="719" cy="231" r="15" fill={gold} fillOpacity=".5"/>{cross(725,232)}{flow([720,191],[720,212])}{flow([720,250],[750,273],1-.9*a)}{text(550,330,'Androgen receptor is intracellular; signal simplified')}
  </>:<>
   {['il17','il23'].includes(c.id)?<>{cross(718,135)}{text(765,141,'Cytokine',10)}<path d="M685 121l10 12 11-12m-11 12v17" stroke={blue} strokeWidth="4" opacity={a}/></>:cross(735,171)}
   {flow([720,192],[720,266],1-.9*a)}{text(665,291,'Downstream activation')}{text(550,330,c.id==='dupilumab'?'Blocks shared IL-4Rα receptor subunit':c.id==='il17'?'Neutralizes IL-17A before receptor binding':'Neutralizes IL-23 p19 before receptor binding')}
  </>}
 </>;
 if(['steroid','vitamin-d','retinoid','calcineurin'].includes(c.id))return <>
  {text(551,111,'Intracellular action · enlarged cell')}
  <ellipse cx="721" cy="223" rx="161" ry="112" fill="none" stroke={pv('ink',.45)}/>{nucleus}
  {flow([577,171],[675,217],exposure,blue)}
  {c.id==='calcineurin'?<><rect x="655" y="179" width="131" height="36" rx="8" fill={pv('bg')} stroke={gold}/>{text(673,201,'Calcineurin')}{cross(769,196)}{flow([720,219],[720,257],1-.9*a)}{text(550,354,'NFAT activation ↓; T-cell cytokine transcription ↓')}</>:<>
   <circle cx="704" cy="240" r="16" fill={gold} fillOpacity=".5"/><circle cx={651+49*exposure} cy={204+29*exposure} r="7" fill={blue} opacity={exposure}/>{flow([724,246],[763,270],a,gold)}{text(720,279,c.id==='steroid'?'GR':c.id==='vitamin-d'?'VDR':'RAR')}{text(550,354,'Receptor-directed changes in gene regulation')}
  </>}
 </>;
 if(c.id==='bpo')return <>
  {text(550,111,'Follicular bacterial environment')}
  <ellipse cx="721" cy="219" rx="106" ry="48" fill={red} fillOpacity={.6*(1-.8*b)} stroke={red}/>{Array.from({length:7},(_,i)=><circle key={i} cx={593+i*41} cy={159+22*Math.sin(time+i)} r="6" fill={blue} opacity={a}/>)}{flow([720,139],[720,190],a,blue)}{text(650,222,'C. acnes')}{text(550,311,'Oxidative intermediates damage bacterial components')}{text(550,333,'Not a ribosomal antibiotic')}
 </>;
 return <>
  {text(550,111,'Sebaceous gland activity · separate scale')}
  <path d="M641 175Q664 140 698 169Q723 135 753 164Q791 142 803 181Q822 208 794 235H647Q615 208 641 175Z" transform={`translate(${720*.2*b} ${200*.2*b}) scale(${1-.2*b})`} fill={gold} fillOpacity=".5" stroke={gold}/>
  {flow([720,239],[720,303],1-.8*b,gold)}{text(550,332,'Reduced sebaceous activity changes follicular milieu')}
 </>;
}
