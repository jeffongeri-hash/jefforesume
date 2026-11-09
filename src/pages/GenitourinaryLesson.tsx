import type { ComponentProps } from 'react';
import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import GenitourinaryScene from '@/components/pathophysiology/GenitourinaryScene';
import { GU_LESSONS, GU_PATHS, guDeep, guScenario, type GuKind } from '@/data/pathophysiology/genitourinary';
import { LESSON_DURATION, clampTime, phaseAt, phaseStart, tick } from '@/data/pathophysiology/timeline';

type SceneProps = Omit<ComponentProps<typeof GenitourinaryScene>, 'kind'>;
const bindScene = (kind: GuKind) => (props: SceneProps) => <GenitourinaryScene {...props} kind={kind}/>;
const scenes = {
  stones: bindScene('stones'),
  retention: bindScene('retention'),
  infection: bindScene('infection'),
  scrotum: bindScene('scrotum'),
};

export default function GenitourinaryLesson({ kind }: { kind: GuKind }) {
  const lesson = GU_LESSONS[kind];
  return <PathoLessonPage config={{
    path: GU_PATHS[kind],
    lessonNo: lesson.number,
    title: lesson.title,
    crumb: lesson.title,
    metaTitle: `${lesson.title} | Emergency Pathophysiology Atlas`,
    metaDescription: lesson.intro,
    ogDescription: lesson.intro,
    intro: lesson.intro,
    normalTitle: lesson.normal,
    variationsIntro: 'Use the scenario selector and normal comparison to isolate where each mechanism acts.',
    variants: {
      param: 'scenario',
      legend: 'Compare mechanisms',
      options: lesson.cases.map(({ id, label, hint }) => ({ id, label, hint })),
    },
    deep: (variant, phase) => guDeep(kind, variant, phase),
    data: {
      LESSON_DURATION, clampTime, phaseAt, phaseStart, tick,
      PHASES: lesson.cases[0].phases,
      phasesFor: variant => guScenario(kind, variant).phases,
      STRUCTURES: lesson.structures,
      VARIATIONS: lesson.variations,
      CANNOT_DETERMINE: ['The cause of pain or swelling, an organism’s susceptibility, organ viability, or an individual treatment plan.'],
      ESCALATION_NOTE: lesson.escalation,
      SOURCES: [...new Map(lesson.cases.flatMap(scenario => scenario.sources).map(source => [source.url, source])).values()],
    },
    Scene: scenes[kind],
  }}/>;
}
