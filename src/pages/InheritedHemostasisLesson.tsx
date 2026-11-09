import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import InheritedHemostasisScene from '@/components/pathophysiology/InheritedHemostasisScene';
import * as data from '@/data/pathophysiology/inheritedHemostasis';

export default function InheritedHemostasisLesson() {
  return <PathoLessonPage config={{
    path: data.INHERITED_HEMOSTASIS_PATH,
    lessonNo: 52,
    crumb: 'Inherited bleeding and clotting',
    title: 'Inherited Bleeding and Clotting Disorders',
    metaTitle: 'Inherited Bleeding and Clotting | Emergency Pathophysiology Atlas',
    metaDescription: 'Compare von Willebrand disease, hemophilia A and B, Glanzmann thrombasthenia, and inherited thrombophilias.',
    ogDescription: 'Interactive comparison of platelet adhesion, fibrin stabilization and inherited thrombosis mechanisms.',
    intro: 'Select a disorder and follow the affected step from vessel injury or venous clotting tendency to the clinical pattern.',
    variationsIntro: 'The bleeding site, family history and clinical context help guide assessment.',
    normalTitle: 'Reference: balanced hemostasis',
    variants: {param:'condition', legend:'Inherited mechanism', options:data.VARIANTS},
    data,
    Scene: InheritedHemostasisScene,
  }}/>;
}
