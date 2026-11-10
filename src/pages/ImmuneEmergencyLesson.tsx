import type { ComponentProps } from 'react';
import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import ImmuneEmergencyScene from '@/components/pathophysiology/ImmuneEmergencyScene';
import * as data from '@/data/pathophysiology/immuneEmergencies';

const lessonNumbers: Record<data.EmergencyKind, number> = {
  meningitis: 55, softTissue: 56, febrileNeutropenia: 57, endocarditis: 58,
};

export default function ImmuneEmergencyLesson({kind}: {kind: data.EmergencyKind}) {
  const lesson = data.EMERGENCIES[kind];
  const Scene = (props: Omit<ComponentProps<typeof ImmuneEmergencyScene>, 'kind'>) =>
    <ImmuneEmergencyScene {...props} kind={kind}/>;
  return <PathoLessonPage config={{
    path: '/pathophysiology-atlas/'+lesson.slug,
    lessonNo: lessonNumbers[kind],
    title: lesson.title,
    crumb: lesson.title,
    metaTitle: lesson.title+' | Emergency Pathophysiology Atlas',
    metaDescription: lesson.intro,
    ogDescription: lesson.intro,
    intro: lesson.intro,
    normalTitle: lesson.normalTitle,
    variationsIntro: 'Compare the animation with the range of clinical presentations.',
    variants: kind === 'endocarditis' ? {
      param:'valve', legend:'Infected valve',
      options:[
        {id:'left', label:'Left-sided', hint:'Mitral example with systemic arterial embolization.'},
        {id:'right', label:'Right-sided', hint:'Tricuspid example with pulmonary embolization.'},
      ],
    } : undefined,
    data: {
      ...data,
      PHASES: lesson.phases,
      phasesFor: variant => data.phasesFor(kind, variant),
      STRUCTURES: lesson.structures,
      VARIATIONS: lesson.variations,
      CANNOT_DETERMINE: ['Whether someone has the condition, which organism is responsible, or which treatment they need.'],
      ESCALATION_NOTE: lesson.escalation,
      SOURCES: lesson.sources,
    },
    Scene,
  }}/>;
}
