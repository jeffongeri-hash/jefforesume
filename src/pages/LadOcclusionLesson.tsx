import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import LadScene from '@/components/pathophysiology/LadScene';
import CardiacPreloadPanel from '@/components/pathophysiology/CardiacPreloadPanel';
import * as data from '@/data/pathophysiology/ladOcclusion';

export default function LadOcclusionLesson() {
  return <PathoLessonPage config={{
    path: data.LAD_PATH, lessonNo: 4, crumb: 'Coronary occlusion: LAD vs RCA',
    title: 'Coronary Occlusion → Myocardial Ischemia → Possible Infarction: LAD vs RCA',
    metaTitle: 'LAD vs RCA Occlusion, Inferior MI & RV Involvement | Emergency Pathophysiology Atlas',
    metaDescription: 'Interactive illustrative cardiac lesson: selectable LAD or RCA occlusion, coronary dominance, territory map, ECG lead-group concepts, troponin, possible RV involvement and the RV→LV preload chain, with limits and sources.',
    ogDescription: 'Phase-by-phase LAD vs RCA occlusion lesson with anatomically informed heart drawing, territory map, preload chain and sources.',
    intro: 'Illustrative, anatomically informed drawings for clinicians — not an angiogram, echocardiogram, ECG or 3D model. Choose LAD or RCA occlusion. Territories, dominance and timing vary; infarction is not inevitable and there is no universal fixed clock.',
    variationsIntro: 'Reversible ischemia and irreversible infarction are distinct. How much myocardium is lost depends on anatomy, dominance, collaterals, demand and how long and how completely flow is reduced.',
    normalTitle: 'Normal reference: patent coronary arteries',
    variants: { param: 'artery', legend: 'Occluded artery', options: data.VARIANTS },
    Companion: CardiacPreloadPanel, companionTitle: 'Preload chain: RV output → LV filling → cardiac output',
    data, Scene: LadScene,
  }} />;
}
