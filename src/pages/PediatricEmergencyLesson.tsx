import type { ComponentProps } from 'react';
import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import PediatricEmergencyScene from '@/components/pathophysiology/PediatricEmergencyScene';
import * as data from '@/data/pathophysiology/pediatricEmergencies';

type SceneProps = Omit<ComponentProps<typeof PediatricEmergencyScene>, 'kind'>;
const scenes: Record<data.PediatricKind, (props: SceneProps) => JSX.Element> = {
  tetralogy: props => <PediatricEmergencyScene {...props} kind="tetralogy"/>,
  measles: props => <PediatricEmergencyScene {...props} kind="measles"/>,
  intussusception: props => <PediatricEmergencyScene {...props} kind="intussusception"/>,
};

export default function PediatricEmergencyLesson({ kind }: { kind: data.PediatricKind }) {
  const lesson = data.PEDIATRIC_LESSONS[kind];
  return <PathoLessonPage config={{
    path: lesson.path, lessonNo: { tetralogy: 63, measles: 64, intussusception: 65 }[kind],
    crumb: lesson.title, title: lesson.title, metaTitle: `${lesson.title} | Emergency Pathophysiology Atlas`,
    metaDescription: lesson.intro, ogDescription: lesson.intro, intro: lesson.intro,
    normalTitle: 'Reference anatomy and physiology', variationsIntro: 'Presentations and timing vary.',
    data: { ...data, PHASES: lesson.phases, STRUCTURES: lesson.structures, VARIATIONS: lesson.variations,
      SOURCES: lesson.sources, ESCALATION_NOTE: lesson.escalation,
      CANNOT_DETERMINE: ['Individual diagnosis, disease severity or treatment selection.'] },
    deep: (_variant, id) => {
      const phase = lesson.phases.find(item => item.id === id);
      return phase ? { sections: [{ h: 'Mechanism and clinical correlation', t: `${phase.explanation} ${phase.bedside[0]}` }], refs: lesson.sources } : undefined;
    },
    Scene: scenes[kind],
  }}/>;
}
