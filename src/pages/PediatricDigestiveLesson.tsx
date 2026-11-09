import type { ComponentProps } from 'react';
import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import PediatricDigestiveScene from '@/components/pathophysiology/PediatricDigestiveScene';
import * as data from '@/data/pathophysiology/pediatricDigestiveEmergencies';

type SceneProps = Omit<ComponentProps<typeof PediatricDigestiveScene>, 'kind'>;
const scenes: Record<data.DigestiveKind, (props: SceneProps) => JSX.Element> = {
  pyloric: props => <PediatricDigestiveScene {...props} kind="pyloric"/>,
  volvulus: props => <PediatricDigestiveScene {...props} kind="volvulus"/>,
  dehydration: props => <PediatricDigestiveScene {...props} kind="dehydration"/>,
};

export default function PediatricDigestiveLesson({ kind }: { kind: data.DigestiveKind }) {
  const lesson = data.DIGESTIVE_LESSONS[kind];
  return <PathoLessonPage config={{
    path: lesson.path,
    lessonNo: { pyloric: 76, volvulus: 77, dehydration: 78 }[kind],
    crumb: lesson.title,
    title: lesson.title,
    metaTitle: `${lesson.title} | Emergency Pathophysiology Atlas`,
    metaDescription: lesson.intro,
    ogDescription: lesson.intro,
    intro: lesson.intro,
    normalTitle: lesson.normalTitle,
    variationsIntro: 'Use the timeline and normal comparison to examine the anatomy and physiologic changes.',
    variants: kind === 'dehydration' ? {
      param: 'route',
      legend: 'Rehydration pathway',
      options: [
        { id: 'oral', label: 'Oral / enteral', hint: 'Sodium and glucose enter through the intestinal epithelium.' },
        { id: 'intravenous', label: 'Intravenous', hint: 'Fluid enters the circulation directly.' },
      ],
    } : undefined,
    data: {
      ...data,
      PHASES: lesson.phases,
      phasesFor: variant => data.digestivePhases(kind, variant),
      STRUCTURES: lesson.structures,
      VARIATIONS: lesson.variations,
      CANNOT_DETERMINE: ['The diagnosis, severity, bowel viability, fluid deficit or treatment for an individual patient.'],
      ESCALATION_NOTE: lesson.escalation,
      SOURCES: lesson.sources,
    },
    deep: (variant, phase) => data.digestiveDeep(kind, variant, phase),
    Scene: scenes[kind],
  }}/>;
}
