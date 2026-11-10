import type { ComponentProps } from 'react';
import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import TraumaDetailScene from '@/components/pathophysiology/TraumaDetailScene';
import * as data from '@/data/pathophysiology/traumaDetails';

type SceneProps = Omit<ComponentProps<typeof TraumaDetailScene>, 'kind'>;
const scenes: Record<data.TraumaDetailKind, (props: SceneProps) => JSX.Element> = {
  head: props => <TraumaDetailScene {...props} kind="head"/>,
  pelvis: props => <TraumaDetailScene {...props} kind="pelvis"/>,
  openFracture: props => <TraumaDetailScene {...props} kind="openFracture"/>,
};

export default function TraumaDetailLesson({ kind }: { kind: data.TraumaDetailKind }) {
  const lesson = data.TRAUMA_DETAIL_LESSONS[kind];
  const variants = kind === 'head' ? {
    param: 'space', legend: 'Hematoma location', options: [
      { id: 'epidural', label: 'Epidural', hint: 'Blood collects between the skull and dura.' },
      { id: 'subdural', label: 'Subdural', hint: 'Blood collects between the dura and arachnoid.' },
    ],
  } : kind === 'pelvis' ? {
    param: 'source', legend: 'Bleeding source emphasis', options: [
      { id: 'venous', label: 'Venous / bone', hint: 'Pelvic venous plexus and fracture surfaces.' },
      { id: 'arterial', label: 'Arterial', hint: 'An injured pelvic artery is emphasized.' },
    ],
  } : undefined;

  return <PathoLessonPage config={{
    path: lesson.path,
    lessonNo: { head: 79, pelvis: 80, openFracture: 81 }[kind],
    crumb: lesson.title,
    title: lesson.title,
    metaTitle: `${lesson.title} | Emergency Pathophysiology Atlas`,
    metaDescription: lesson.intro,
    ogDescription: lesson.intro,
    intro: lesson.intro,
    normalTitle: lesson.normalTitle,
    variationsIntro: 'Use the timeline and normal comparison to review the injury and its possible physiologic effects.',
    variants,
    sides: kind === 'head' ? { param: 'side', legend: 'Hematoma side', labels: { left: 'Patient left', right: 'Patient right' } } : undefined,
    data: {
      ...data,
      PHASES: lesson.phases,
      phasesFor: variant => data.traumaDetailPhases(kind, variant),
      STRUCTURES: lesson.structures,
      VARIATIONS: lesson.variations,
      CANNOT_DETERMINE: ['Individual diagnosis, hematoma size, bleeding source, tissue viability or treatment.'],
      ESCALATION_NOTE: lesson.escalation,
      SOURCES: lesson.sources,
    },
    deep: (variant, phase) => data.traumaDetailDeep(kind, variant, phase),
    Scene: scenes[kind],
  }}/>;
}
