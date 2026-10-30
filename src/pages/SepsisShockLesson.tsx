import { SEPSIS_DEEP } from '@/data/pathophysiology/deepMechanisms';
import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import SepsisScene from '@/components/pathophysiology/SepsisScene';
import * as data from '@/data/pathophysiology/sepsisShock';

export default function SepsisShockLesson() {
  return <PathoLessonPage config={{ deep: (_v: string, id: string) => SEPSIS_DEEP[id],
    path: data.SEPSIS_PATH, lessonNo: 3, crumb: 'Sepsis & distributive shock',
    title: 'Sepsis → Distributive Shock: Host Response, Vasodilation, Leak and Uneven Perfusion',
    metaTitle: 'Sepsis & Distributive Shock Pathophysiology | Emergency Pathophysiology Atlas',
    metaDescription: 'Interactive conceptual microcirculation lesson: innate recognition, dysregulated host response, NO-related vasodilation, glycocalyx and endothelial dysfunction, capillary leak and heterogeneous perfusion, with clinical signals, lactate limits and sources.',
    ogDescription: 'Phase-by-phase conceptual sepsis lesson with microcirculation scene, clinical signals and sources.',
    intro: 'Conceptual visual education for clinicians. A code-drawn microcirculation schematic of one possible progression — not a model of any patient. Sepsis is heterogeneous and not universally a “cytokine storm”; many patients recover.',
    variationsIntro: 'Sepsis-3 defines sepsis as life-threatening organ dysfunction caused by a dysregulated host response to infection. Haemodynamic and immune phenotypes vary between patients and over time.',
    normalTitle: 'Normal reference: regulated microcirculation',
    data, Scene: SepsisScene,
  }} />;
}
