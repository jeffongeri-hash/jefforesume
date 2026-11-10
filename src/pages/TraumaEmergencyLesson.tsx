import type { ComponentProps } from 'react';
import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import TraumaEmergencyScene from '@/components/pathophysiology/TraumaEmergencyScene';
import * as data from '@/data/pathophysiology/traumaEmergencies';

type SceneProps = Omit<ComponentProps<typeof TraumaEmergencyScene>, 'kind'>;
const scenes: Record<data.TraumaKind, (props: SceneProps) => JSX.Element> = {
  compartment: props => <TraumaEmergencyScene {...props} kind="compartment"/>,
  vascular: props => <TraumaEmergencyScene {...props} kind="vascular"/>,
  pneumothorax: props => <TraumaEmergencyScene {...props} kind="pneumothorax"/>,
};

export default function TraumaEmergencyLesson({ kind }: {kind: data.TraumaKind}) {
  const lesson = data.TRAUMA_LESSONS[kind];
  return <PathoLessonPage config={{
    path: lesson.path, lessonNo: {compartment:66,vascular:67,pneumothorax:68}[kind],
    crumb: lesson.title, title: lesson.title, metaTitle: `${lesson.title} | Emergency Pathophysiology Atlas`,
    metaDescription: lesson.intro, ogDescription: lesson.intro, intro: lesson.intro,
    normalTitle: 'Reference anatomy and perfusion', variationsIntro: 'Each illustration follows one possible sequence.',
    data: {...data, PHASES: lesson.phases, STRUCTURES: lesson.structures, VARIATIONS: lesson.variations,
      SOURCES: lesson.sources, ESCALATION_NOTE: lesson.escalation,
      CANNOT_DETERMINE: ['Individual diagnosis, tissue viability, intervention, or patient-specific pressure and flow.']},
    deep: (_variant, id) => {
      const phase = lesson.phases.find(item => item.id === id);
      return phase ? { sections: [{h:'Mechanism and clinical context',t:`${phase.explanation} ${phase.bedside[0]}`}], refs:lesson.sources } : undefined;
    },
    Scene: scenes[kind],
  }}/>;
}
