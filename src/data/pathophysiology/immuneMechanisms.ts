export * from './timeline';
import type { GenericPhase } from './timeline';

export const IMMUNE_PATH = '/pathophysiology-atlas/immune-response';
export const ANTIMICROBIAL_PATH = '/pathophysiology-atlas/antimicrobial-mechanisms';
export const STRUCTURES = {
  signal: {label:'Upstream signal', explanation:'The stimulus or drug is shown at the beginning of its pathway.'},
  target: {label:'Biological target', explanation:'The highlighted structure is the site where the signal or drug acts.'},
  output: {label:'Downstream effect', explanation:'The moving symbols represent qualitative changes in output.'},
};
type Structure = keyof typeof STRUCTURES;
type Case = {id:string; label:string; steps:[string,string,string,string]; source:string};
const searchLabel = (drug:string) => 'https://dailymed.nlm.nih.gov/dailymed/search.cfm?query='+drug;
export const immuneCases: Case[] = [
  {id:'neutropenia',label:'Viral-associated neutropenia',steps:['A viral illness can temporarily suppress marrow granulopoiesis.','Fewer precursors mature and enter circulation in this example. Immune clearance and redistribution can also contribute in other cases.','The absolute neutrophil count falls. The total WBC alone does not quantify neutropenia.','Review the timing, prior counts, medications and other cell lines. Fever with significant neutropenia warrants urgent assessment.'],source:'https://pmc.ncbi.nlm.nih.gov/articles/PMC3748385/'},
  {id:'leukocytosis',label:'Reactive leukocytosis',steps:['Inflammation and physiologic stress can increase circulating neutrophils.','Stress can demarginate neutrophils already near vessel walls. Inflammation can increase marrow release and, over time, production.','The circulating count rises. Release of immature granulocytes can produce a left shift.','Use the differential, smear and clinical trajectory. A high WBC alone does not establish bacterial infection or leukemia.'],source:'https://training.seer.cancer.gov/abstracting/procedures/clinical/hematologic/'},
  {id:'acute-phase',label:'Acute-phase response',steps:['Activated innate immune cells release cytokines, including IL-6.','IL-6 signals hepatocytes to increase production of proteins such as CRP, serum amyloid A and fibrinogen.','CRP and fibrinogen may rise. Fibrinogen promotes red-cell aggregation, which can increase ESR indirectly. Albumin can fall.','CRP and ESR reflect inflammation with different kinetics. They do not identify the cause or location by themselves.'],source:'https://www.ncbi.nlm.nih.gov/books/NBK519570/'},
];
export const drugCases: Case[] = [
  {id:'wall',label:'Beta-lactam · amoxicillin',steps:['Growing bacteria build and remodel their peptidoglycan wall.','Beta-lactams bind penicillin-binding proteins and inhibit cross-linking of peptidoglycan.','New wall material has fewer cross-links. Susceptible growing bacteria can lyse.','Beta-lactamases, altered targets or reduced drug access can reduce activity.'],source:searchLabel('amoxicillin')},
  {id:'ribosome',label:'Macrolide · azithromycin',steps:['Bacterial ribosomes translate mRNA into proteins.','Azithromycin binds the 50S ribosomal subunit and inhibits protein synthesis.','The growing peptide stalls in this schematic. The effect differs from damage to the cell wall.','Susceptibility depends on the organism. Ribosomal target modification and efflux are examples of resistance mechanisms.'],source:searchLabel('azithromycin')},
  {id:'dna',label:'Antiviral · acyclovir',steps:['Herpesviruses replicate viral DNA within infected cells.','Viral thymidine kinase starts acyclovir activation. Cellular enzymes produce the active triphosphate.','Acyclovir triphosphate inhibits viral DNA polymerase and terminates elongation when incorporated.','This target is specific to susceptible herpesviruses. Other antivirals act at different stages.'],source:searchLabel('acyclovir')},
  {id:'release',label:'Antiviral · oseltamivir',steps:['New influenza virions bud from the infected cell surface.','The active metabolite of oseltamivir inhibits influenza neuraminidase.','Virions are released less efficiently and can remain associated with the cell surface.','This mechanism applies to susceptible influenza A and B viruses.'],source:searchLabel('oseltamivir')},
  {id:'tubulin',label:'Antiparasitic · albendazole',steps:['Helminth microtubules support cell function and nutrient uptake.','Albendazole and its active metabolite disrupt parasite microtubule formation through beta-tubulin binding.','The microtubule network is impaired, reducing glucose uptake and depleting energy stores.','Antiparasitics have different targets. This example represents an anthelmintic.'],source:searchLabel('albendazole')},
  {id:'mitochondria',label:'Antiparasitic · atovaquone',steps:['Susceptible malaria parasites depend on mitochondrial electron transport.','Atovaquone inhibits the parasite cytochrome bc1 complex.','Electron transport and downstream pyrimidine synthesis are disrupted.','The target differs from albendazole. Atovaquone is used with proguanil for malaria.'],source:searchLabel('atovaquone proguanil')},
];
export function lessonData(cases:Case[]) {
  const select = (id:string) => cases.find(c=>c.id===id) ?? cases[0];
  const phasesFor = (id:string): GenericPhase<Structure>[] => {
    const c = select(id);
    const descriptions = ['Compare the intact pathway with the selected example.', ...c.steps];
    return descriptions.map((explanation,i)=>({
      id:String(i), name:['Reference','Upstream process','Target engagement','Downstream change','Interpretation'][i],
      short:['Reference','Process','Target','Effect','Context'][i],
      explanation, focus:[i===0 || i===1 ? 'signal' : i===2 ? 'target' : 'output'],
      bedside:[i===4 ? c.steps[3] : c.label],
      labs:[],
    }));
  };
  return {
    PHASES:phasesFor(cases[0].id), phasesFor, STRUCTURES,
    VARIATIONS:[{title:'Compare examples',text:'Change the selected mechanism to follow a different target or host response.'}],
    CANNOT_DETERMINE:['Individual diagnosis, organism susceptibility or medication selection.'],
    ESCALATION_NOTE:'Fever with known significant neutropenia needs prompt clinical assessment.',
    SOURCES:cases.map(c=>({name:c.label,url:c.source})),
  };
}
