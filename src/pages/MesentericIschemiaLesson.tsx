import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import MesentericIschemiaScene from '@/components/pathophysiology/MesentericIschemiaScene';
import * as data from '@/data/pathophysiology/mesentericIschemia';

export default function MesentericIschemiaLesson() {
 return <PathoLessonPage config={{path:data.MESENTERIC_PATH,lessonNo:24,crumb:'Acute mesenteric ischemia',title:'Acute Mesenteric Ischemia: SMA Occlusion and Bowel Injury',metaTitle:'Acute Mesenteric Ischemia | Emergency Pathophysiology Atlas',metaDescription:'Interactive source-linked lesson on SMA embolism, mucosal injury, infarction and clinical interpretation.',ogDescription:'A phase-based conceptual illustration of mesenteric ischemia.',intro:'Follow one possible arterial embolic pathway from impaired mesenteric blood flow to bowel injury. The illustration is a teaching schematic, not diagnostic imaging.',variationsIntro:'Mesenteric ischemia has multiple mechanisms and variable presentations; progression is not inevitable.',normalTitle:'Reference mesenteric perfusion',data,deep:data.mesentericDeep,Scene:MesentericIschemiaScene}} />;
}
