import type { FieldLoss } from '@/data/visualPathways';
function EyeField({x,loss,name}:{x:number;loss:FieldLoss;name:string}){
 const id=`field-${name.replace(/\s/g,'-')}`;let rect=null;
 if(loss==='all')rect={x:x-70,y:48,width:140,height:140};
 if(loss==='left-half')rect={x:x-70,y:48,width:70,height:140};
 if(loss==='right-half')rect={x:x,y:48,width:70,height:140};
 if(loss==='upper-right')rect={x:x,y:48,width:70,height:70};
 if(loss==='lower-right')rect={x:x,y:118,width:70,height:70};
 return <g><defs><clipPath id={id}><circle cx={x} cy="118" r="70"/></clipPath></defs><circle cx={x} cy="118" r="70" fill="#2a4553" stroke="#bcd2d7" strokeWidth="2"/><path d={`M${x} 48V188M${x-70} 118H${x+70}`} stroke="#aec3c7" strokeWidth="1"/>{rect&&<rect {...rect} fill="#d98287" opacity=".8" clipPath={`url(#${id})`}/>}<circle cx={x} cy="118" r="3" fill="#fff"/><text x={x} y="26" textAnchor="middle" fill="#e2eced" fontSize="13">{name}</text><text x={x-72} y="209" fill="#c3d2d5" fontSize="11">Left field</text><text x={x+14} y="209" fill="#c3d2d5" fontSize="11">Right field</text></g>;
}
export default function VisualFieldDiagram({rightEye,leftEye}:{rightEye:FieldLoss;leftEye:FieldLoss}){return <svg viewBox="0 0 390 230" className="h-auto w-full rounded-lg bg-[#14232c]" role="img" aria-label={`Conceptual field loss: right eye ${rightEye}, left eye ${leftEye}. Red areas indicate lost field.`}><EyeField x={100} loss={rightEye} name="Patient right eye"/><EyeField x={290} loss={leftEye} name="Patient left eye"/></svg>;}
