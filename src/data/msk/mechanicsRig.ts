import type { Mechanic } from './movementMechanics';
export function boneInRig(name: string, rig: Mechanic['rig']): boolean {
 if(rig==='neck') return /^(Occipital bone|Frontal bone|Mandible|Maxilla\.[rl]|Temporal bone\.[rl]|Parietal bone\.[rl])$/.test(name);
 if(rig==='trunk') return /^(Vertebra (T|C)|Atlas|Axis|Rib|Sternum)/.test(name);
 if(!name.endsWith('.r')) return false;
 const hand=/metacarpal|finger of hand|Scaphoid|Lunate|Triquetrum|Pisiform|Trapezium|Trapezoid|Capitate|Hamate/.test(name);
 const foot=/metatarsal|finger of foot|Talus|Calcaneus|Navicular|Cuboid|cuneiform|Sesamoid bones of foot/.test(name);
 if(rig==='wrist') return hand;
 if(rig==='forearm') return name==='Radius.r';
 if(rig==='elbow') return /^(Radius|Ulna)\.r$/.test(name)||hand;
 if(rig==='shoulder') return /^(Humerus|Radius|Ulna)\.r$/.test(name)||hand;
 if(rig==='ankle') return foot;
 if(rig==='knee') return /^(Tibia|Fibula)\.r$/.test(name)||foot;
 return /^(Femur|Patella|Tibia|Fibula)\.r$/.test(name)||foot;
}
export const PIVOT_ANCHOR = {shoulder:'Humerus.r',elbow:'Ulna.r',forearm:'Radius.r',wrist:'Scaphoid bone.r',neck:'Atlas (C1)',trunk:'Vertebra L1',hip:'Femur.r',knee:'Tibia.r',ankle:'Talus.r',squat:'Femur.r'} as const;
export const FRAME_ANCHORS = {
 shoulder:['Scapula.r','Clavicle.r','Humerus.r','Radius.r','Ulna.r'], elbow:['Humerus.r','Radius.r','Ulna.r'],forearm:['Radius.r','Ulna.r'],wrist:['Radius.r','Ulna.r','Scaphoid bone.r','First metacarpal bone.r'],neck:['Atlas (C1)','Axis (C2)','Mandible','Occipital bone'],trunk:['Vertebra L5','Vertebra T1','Sacrum'],hip:['Hip bone.r','Femur.r','Tibia.r'],knee:['Femur.r','Patella.r','Tibia.r','Fibula.r'],ankle:['Tibia.r','Fibula.r','Talus.r','Calcaneus.r','First metatarsal bone.r'],squat:['Hip bone.r','Femur.r','Tibia.r','Calcaneus.r']
} as const;