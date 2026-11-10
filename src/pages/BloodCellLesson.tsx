import PathoLessonPage from '@/components/pathophysiology/PathoLessonPage';
import BloodCellScene from '@/components/pathophysiology/BloodCellScene';
import * as data from '@/data/pathophysiology/bloodCells';

export default function BloodCellLesson() {
  return <PathoLessonPage config={{
    path: data.BLOOD_CELLS_PATH,
    lessonNo: 51,
    crumb: 'Blood cell disorders',
    title: 'Blood Cell Disorders: From Marrow to the CBC',
    metaTitle: 'Blood Cell Disorders | Emergency Pathophysiology Atlas',
    metaDescription: 'Compare leukemia, lymphoma, reactive leukocytosis, megaloblastic anemia, and mechanisms of thrombocytopenia.',
    ogDescription: 'Explore blood and marrow mechanisms with animated cells and phase-linked clinical signals.',
    intro: 'Follow abnormal and normal cells through marrow, peripheral blood, and lymphoid tissue. Select a mechanism and compare it with the reference.',
    variationsIntro: 'Marrow, blood and lymphoid tissue provide complementary clues.',
    normalTitle: 'Reference: normal blood cell production and circulation',
    variants: {param: 'condition', legend: 'Blood cell mechanism', options: data.VARIANTS},
    data,
    Scene: BloodCellScene,
  }}/>;
}
