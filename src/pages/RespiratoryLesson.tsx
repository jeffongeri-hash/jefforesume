import { Link } from 'react-router-dom';
import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import RespiratoryScene from '@/components/pathophysiology/RespiratoryScene';
import { RESPIRATORY_LESSONS, lessonFor, respiratoryDeep, dataFor, type RespiratoryCondition } from '@/data/pathophysiology/respiratory';
import * as timeline from '@/data/pathophysiology/timeline';
export default function RespiratoryLesson({ condition }: { condition: RespiratoryCondition }) {
  const lesson = lessonFor(condition);
  const Scene = (props: Omit<React.ComponentProps<typeof RespiratoryScene>, 'condition'>) => <RespiratoryScene condition={condition} {...props} />;
  const Companion = () => <nav aria-label="Respiratory lesson comparison" className="flex flex-wrap gap-3 text-sm">{RESPIRATORY_LESSONS.map(l => <Link key={l.id} to={l.path} aria-current={l.id === condition ? 'page' : undefined} className="text-primary underline underline-offset-4">{l.title}</Link>)}</nav>;
  return <PathoLessonPage key={condition} config={{
    path: lesson.path, lessonNo: 8 + RESPIRATORY_LESSONS.indexOf(lesson), title: lesson.title,
    metaTitle: `${lesson.title} | Emergency Atlas | Jefney Ongeri, PA-C`,
    metaDescription: `Interactive clinician education: ${lesson.blurb} Source-linked mechanisms, clinical signals and limitations.`, ogDescription: lesson.blurb, crumb: lesson.title,
    normalTitle: 'Healthy respiratory anatomy and pulmonary circulation reference',
    intro: `${lesson.blurb} Illustrative anatomy, not diagnostic imaging, patient-specific simulation or a treatment protocol. Five teaching phases are not a disease clock.`,
    variants: { param: 'scenario', legend: 'Clinical scenario', options: lesson.scenarios },
    deep: (v, id) => respiratoryDeep(condition, v, id),
    Companion, companionTitle: 'Respiratory comparisons',
    variationsIntro: 'Mechanisms, baseline physiology and reserve differ. Final deterioration is a possible branch, not an inevitable course.',
    data: { ...timeline, ...dataFor(condition) }, Scene,
  }} />;
}
