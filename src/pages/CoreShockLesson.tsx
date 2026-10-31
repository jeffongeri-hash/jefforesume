import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import ShockCoreScene from '@/components/pathophysiology/ShockCoreScene';
import * as cardiac from '@/data/pathophysiology/cardiogenicShock';
import * as obstructive from '@/data/pathophysiology/obstructiveShock';
import * as allergy from '@/data/pathophysiology/anaphylacticShock';
import type { ComponentProps } from 'react';
const Scene = (props: Omit<ComponentProps<typeof ShockCoreScene>, 'mechanism'> & { variant?: string }) => <ShockCoreScene {...props} mechanism={obstructive.resolveVariant(props.variant ?? '')} />;
const CardiacScene = (props: Omit<ComponentProps<typeof ShockCoreScene>, 'mechanism'>) => <ShockCoreScene {...props} mechanism="cardiogenic" />;
const AllergyScene = (props: Omit<ComponentProps<typeof ShockCoreScene>, 'mechanism'>) => <ShockCoreScene {...props} mechanism="anaphylaxis" />;
export default function CoreShockLesson({ condition }: { condition: 'cardiogenic' | 'obstructive' | 'anaphylactic' }) {
 const c = condition === 'cardiogenic', o = condition === 'obstructive';
 const title = c ? 'Cardiogenic Shock: Pump Failure & Congestion' : o ? 'Obstructive Shock: PE, Tamponade & Tension Pneumothorax' : 'Anaphylactic Shock: Mediators, Leak & Airway Risk';
 return <PathoLessonPage config={{
 path: c ? cardiac.CARDIOGENIC_PATH : o ? obstructive.OBSTRUCTIVE_PATH : allergy.ANAPHYLACTIC_PATH,
 lessonNo: c ? 14 : o ? 15 : 16, title, crumb: `${condition.charAt(0).toUpperCase()+condition.slice(1)} shock`,
 metaTitle: `${condition.charAt(0).toUpperCase()+condition.slice(1)} Shock Pathophysiology | Jefney Ongeri, PA-C`,
 metaDescription: c ? 'Interactive cardiogenic shock: reduced contractility, stroke volume, pulmonary congestion and organ perfusion, with detailed mechanisms and clinical test limitations.' : o ? 'Compare pulmonary embolism, cardiac tamponade and tension pneumothorax: RV afterload, diastolic constraint and thoracic pressure with synchronized clinical signals.' : 'Interactive anaphylactic shock: mediator-driven vasodilation, capillary leak, reduced filling and possible bronchospasm or airway edema, with tryptase limitations.',
 ogDescription: 'Source-cited conceptual circulation animation with detailed phase mechanisms, clinical signals and normal comparison. Clinician education, not treatment guidance.',
 intro: 'Shock & Circulation · Clinician-facing conceptual education. Anterior cardiac and chest anatomy with separately framed capillary and airway insets. Pressure, forward flow and oxygen delivery remain distinct. No patient values, diagnostic imaging or treatment algorithm; deterioration is possible, not inevitable.',
 normalTitle: 'Normal circulatory filling, patent pulmonary transit and tissue delivery',
 variationsIntro: 'The scene selects mechanisms rather than predicts a clinical course. Findings, reserve and overlapping shock physiology vary; animation time is not elapsed clinical time.',
 data: c ? cardiac : o ? obstructive : allergy, deep: c ? cardiac.cardiogenicDeep : o ? obstructive.obstructiveDeep : allergy.anaphylacticDeep,
 Scene: c ? CardiacScene : o ? Scene : AllergyScene,
 variants: o ? { param: 'mechanism', legend: 'Obstructive mechanism', options: obstructive.VARIANTS } : undefined,
 }} />;
}
