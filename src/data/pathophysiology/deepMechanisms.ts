// Clinician-level, phase-specific mechanism detail for Emergency Pathophysiology Atlas lessons.
// Pure data. Keyed by phase id (and variant where the lesson has selectable scenarios). No patient values or dosing.
export type DeepSection = { h: string; t: string };
export type DeepRef = { name: string; url: string };
export type Deep = { sections: DeepSection[]; refs: DeepRef[] };

const R = {
  sepsis3: { name: 'Singer M, et al. Sepsis-3 definitions. JAMA 2016', url: 'https://doi.org/10.1001/jama.2016.0287' },
  hotchkiss: { name: 'Hotchkiss RS, et al. Sepsis and septic shock. Nat Rev Dis Primers 2016', url: 'https://doi.org/10.1038/nrdp.2016.45' },
  landry: { name: 'Landry DW, Oliver JA. The pathogenesis of vasodilatory shock. N Engl J Med 2001', url: 'https://doi.org/10.1056/NEJMra002709' },
  vincent: { name: 'Vincent JL, De Backer D. Circulatory shock. N Engl J Med 2013', url: 'https://doi.org/10.1056/NEJMra1208943' },
  ince: { name: 'Ince C. Hemodynamic coherence and the microcirculation. Crit Care 2015', url: 'https://doi.org/10.1186/cc14726' },
  lactate: { name: 'Garcia-Alvarez M, Marik P, Bellomo R. Sepsis-associated hyperlactatemia. Crit Care 2014', url: 'https://doi.org/10.1186/s13054-014-0503-3' },
  ssc: { name: 'Evans L, et al. Surviving Sepsis Campaign 2021. Crit Care Med', url: 'https://doi.org/10.1097/CCM.0000000000005337' },
  jennings: { name: 'Jennings RB. Historical perspective on the pathology of myocardial ischemia/reperfusion injury. Circ Res 2013', url: 'https://doi.org/10.1161/CIRCRESAHA.113.300987' },
  wavefront: { name: 'Reimer KA, Jennings RB, et al. The wavefront phenomenon of ischemic cell death. Circulation 1977', url: 'https://doi.org/10.1161/01.CIR.56.5.786' },
  udmi: { name: 'Thygesen K, et al. Fourth Universal Definition of Myocardial Infarction. Circulation 2018', url: 'https://doi.org/10.1161/CIR.0000000000000617' },
  acs25: { name: 'Rao SV, et al. 2025 ACC/AHA/ACEP/NAEMSP/SCAI ACS Guideline. Circulation', url: 'https://doi.org/10.1161/CIR.0000000000001309' },
  rvReview: { name: 'Right ventricular myocardial infarction: from pathophysiology to prognosis (PMC3716484)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3716484/' },
  rvStat: { name: 'StatPearls: Right Ventricular Myocardial Infarction', url: 'https://www.ncbi.nlm.nih.gov/books/NBK431048/' },
  ferguson: { name: 'Ferguson JJ, et al. Nitroglycerin-induced hypotension with inferior wall AMI. Am J Cardiol 1989', url: 'https://doi.org/10.1016/0002-9149(89)90525-0' },
  dirnagl: { name: 'Dirnagl U, Iadecola C, Moskowitz MA. Pathobiology of ischaemic stroke: an integrated view. Trends Neurosci 1999', url: 'https://doi.org/10.1016/S0166-2236(99)01401-0' },
  astrup: { name: 'Astrup J, Siesjö BK, Symon L. Thresholds in cerebral ischemia — the ischemic penumbra. Stroke 1981', url: 'https://doi.org/10.1161/01.STR.12.6.723' },
  tatu: { name: 'Tatu L, et al. Arterial territories of the human brain. Neurology 1998', url: 'https://doi.org/10.1212/WNL.50.6.1699' },
  campbell: { name: 'Campbell BCV, et al. Ischaemic stroke. Nat Rev Dis Primers 2019', url: 'https://doi.org/10.1038/s41572-019-0118-8' },
  mattle: { name: 'Mattle HP, et al. Basilar artery occlusion. Lancet Neurol 2011', url: 'https://doi.org/10.1016/S1474-4422(11)70229-0' },
  defuse3: { name: 'Albers GW, et al. DEFUSE 3. N Engl J Med 2018', url: 'https://doi.org/10.1056/NEJMoa1713973' },
  keep: { name: 'Keep RF, Hua Y, Xi G. Intracerebral haemorrhage: mechanisms of injury and therapeutic targets. Lancet Neurol 2012', url: 'https://doi.org/10.1016/S1474-4422(12)70104-7' },
  ich22: { name: 'Greenberg SM, et al. 2022 AHA/ASA Spontaneous ICH Guideline. Stroke', url: 'https://doi.org/10.1161/STR.0000000000000407' },
  brott: { name: 'Brott T, et al. Early hemorrhage growth in ICH. Stroke 1997', url: 'https://doi.org/10.1161/01.STR.28.1.1' },
  sah23: { name: 'Hoh BL, et al. 2023 AHA/ASA Aneurysmal SAH Guideline. Stroke', url: 'https://doi.org/10.1161/STR.0000000000000436' },
  perry: { name: 'Perry JJ, et al. CT within six hours of headache for SAH. BMJ 2011', url: 'https://doi.org/10.1136/bmj.d4277' },
};

// ---------------- Sepsis ----------------
export const SEPSIS_DEEP: Record<string, Deep> = {
  normal: { refs: [R.hotchkiss, R.sepsis3], sections: [
    { h: 'Initiating event', t: 'Pathogen-associated molecular patterns (e.g., lipopolysaccharide, lipoteichoic acid, flagellin, viral nucleic acids) and damage-associated patterns from injured host cells bind pattern-recognition receptors — Toll-like, NOD-like and C-type lectin receptors — on macrophages, neutrophils, dendritic and endothelial cells.' },
    { h: 'Cellular signalling', t: 'Receptor engagement activates NF-κB and MAPK pathways and inflammasomes, producing TNF, IL-1β, IL-6, chemokines, complement activation and tissue factor expression. In a regulated response this is local, recruits neutrophils, and is balanced by anti-inflammatory signals (IL-10, glucocorticoids).' },
    { h: 'Vascular baseline', t: 'Normal arterioles maintain tone through sympathetic input, angiotensin II and vasopressin opposed by endothelial NO; the glycocalyx limits leak and leukocyte adhesion; capillary recruitment matches flow to local demand.' },
    { h: 'Why this matters', t: 'Sepsis is defined not by infection or inflammation alone but by life-threatening organ dysfunction caused by a dysregulated host response (Sepsis-3). The same pathogen can cause trivial or lethal illness depending on host factors.' },
  ] },
  'host-response': { refs: [R.hotchkiss, R.sepsis3, R.ssc], sections: [
    { h: 'Dysregulation', t: 'When pathogen load, virulence or host susceptibility overwhelm local containment, mediators spill systemically. Pro- and anti-inflammatory programmes run simultaneously; some patients show marked early hyperinflammation, others early immunosuppression (lymphocyte apoptosis, monocyte HLA-DR loss). “Cytokine storm” describes only a subset.' },
    { h: 'Coagulation & complement', t: 'Tissue factor on monocytes/endothelium drives thrombin generation while protein C, antithrombin and TFPI pathways are consumed; neutrophil extracellular traps add a procoagulant scaffold. The result ranges from microthrombosis to overt DIC.' },
    { h: 'Bedside findings — why', t: 'IL-1/IL-6/TNF reset the hypothalamic set point via prostaglandin E2 (fever; hypothermia in some, associated with worse outcomes). Catecholamines and reduced vascular tone drive tachycardia; cytokines and acidosis stimulate tachypnoea. Altered mentation reflects neuroinflammation, perfusion and neurotransmitter changes.' },
    { h: 'Labs — why they move', t: 'Neutrophilia follows marrow release (G-CSF, glucocorticoids, demargination); leukopenia can occur with consumption or marrow suppression. CRP (IL-6-driven hepatic synthesis) lags hours; procalcitonin rises more with bacterial infection but is neither sensitive nor specific enough alone.' },
    { h: 'Limits', t: 'No single biomarker identifies sepsis. Older adults, immunosuppressed patients and those on beta-blockers may lack fever or tachycardia.' },
  ] },
  vasodilation: { refs: [R.landry, R.vincent, R.hotchkiss], sections: [
    { h: 'Nitric oxide', t: 'Cytokines induce inducible NO synthase (iNOS) in vascular smooth muscle and endothelium. NO activates soluble guanylate cyclase → cGMP → myosin light-chain dephosphorylation → smooth muscle relaxation. Peroxynitrite (NO + superoxide) adds oxidative injury.' },
    { h: 'Other vasodilatory mechanisms', t: 'ATP depletion and acidosis open KATP channels, hyperpolarising smooth muscle and blunting calcium entry, so catecholamines work less well. Relative vasopressin deficiency develops after early depletion, and adrenergic receptor down-regulation and relative corticosteroid insufficiency contribute.' },
    { h: 'Hemodynamic consequence', t: 'Arteriolar dilation lowers systemic vascular resistance and mean arterial pressure; venodilation increases unstressed venous volume, reducing venous return. Cardiac output is often normal or high after volume restoration but can be low — septic cardiomyopathy (cytokine-, NO- and mitochondrial-mediated depression) occurs in a substantial minority.' },
    { h: 'Bedside findings — why', t: 'Warm peripheries and bounding pulses can reflect low SVR with preserved output; cold, mottled skin and delayed capillary refill suggest low output or intense vasoconstriction. Low diastolic pressure is a marker of reduced arterial tone.' },
    { h: 'Limits', t: '“Warm” vs “cold” shock are phenotypes, not stages; patients move between them and mixed states (e.g., coexisting hypovolaemia or cardiac dysfunction) are common.' },
  ] },
  leak: { refs: [R.ince, R.hotchkiss, R.vincent], sections: [
    { h: 'Endothelial barrier', t: 'TNF, IL-1, thrombin, bradykinin and angiopoietin-2 (released from Weibel–Palade bodies) destabilise VE-cadherin junctions; heparanase and metalloproteinases shed the glycocalyx (syndecan-1, heparan sulphate). Albumin and water move into the interstitium.' },
    { h: 'Microcirculation', t: 'Heterogeneous flow appears: some capillaries stop (microthrombi, leukocyte adhesion, red-cell rigidity, swollen endothelium) while others shunt rapidly. Diffusion distance rises with oedema. Oxygen extraction falls even if global delivery is adequate — loss of “hemodynamic coherence” between macro- and microcirculation.' },
    { h: 'Hemodynamic consequence', t: 'Leak plus venodilation reduce effective circulating volume and venous return; interstitial oedema impairs organ function (lung — hypoxaemia; gut — ileus/barrier failure; kidney — raised interstitial pressure).' },
    { h: 'Bedside findings — why', t: 'Oedema, falling urine output and worsening oxygenation follow leak and renal microvascular dysfunction; mottling reflects heterogeneous skin perfusion.' },
    { h: 'Limits', t: 'Normal blood pressure does not guarantee normal microcirculatory flow, and restoring pressure does not always restore it. Bedside microcirculation imaging remains largely a research tool.' },
  ] },
  shock: { refs: [R.lactate, R.sepsis3, R.vincent, R.ince], sections: [
    { h: 'Definition context', t: 'Septic shock (Sepsis-3) is sepsis with persistent vasopressor requirement to maintain perfusion pressure and elevated lactate despite adequate volume resuscitation — a clinical construct identifying higher mortality, not a single mechanism.' },
    { h: 'Cellular energetics', t: 'Mitochondrial dysfunction (NO/peroxynitrite inhibition of the electron-transport chain, reduced biogenesis) can impair oxygen use even when oxygen is available — “cytopathic hypoxia”. Some organ dysfunction may be partly adaptive hibernation, which may explain recovery with little necrosis.' },
    { h: 'Lactate — why it rises', t: 'Contributors: anaerobic glycolysis in poorly perfused regions; adrenergic (β2) stimulation of Na⁺/K⁺-ATPase and glycolysis in muscle producing lactate aerobically; pyruvate dehydrogenase inhibition; and reduced hepatic/renal clearance. Lactate is a marker of severity and stress, not proof of tissue hypoxia.' },
    { h: 'Organ dysfunction', t: 'Kidney (microvascular and tubular injury), lung (ARDS), liver (cholestasis, impaired clearance), brain (encephalopathy), coagulation (thrombocytopenia, DIC) and heart (septic cardiomyopathy) — the SOFA domains.' },
    { h: 'Limits', t: 'Normal lactate does not exclude hypoperfusion; elevated lactate also follows seizures, liver failure, metformin, β-agonists and others. Lactate clearance reflects production and clearance together.' },
  ] },
};

// ---------------- Coronary: LAD / RCA ----------------
const CORONARY_COMMON = {
  ischemiaCell: { h: 'Cellular energetics', t: 'Within seconds of severe ischaemia oxygen tension falls, oxidative phosphorylation stops and creatine phosphate is consumed first. ATP falls; anaerobic glycolysis produces lactate and H⁺, which itself inhibits glycolysis. Na⁺/K⁺-ATPase failure lets intracellular Na⁺ rise and K⁺ leak out; the Na⁺/Ca²⁺ exchanger then loads the cell with Ca²⁺.' },
  contractility: { h: 'Why contraction fails', t: 'Contraction ceases within about a minute — before cell death — because falling ATP, accumulating inorganic phosphate and H⁺ reduce myofilament Ca²⁺ sensitivity and cross-bridge cycling. The segment becomes hypokinetic or akinetic and may bulge in systole (dyskinesis), reducing stroke volume.' },
  ecgWhy: { h: 'ECG — why it changes', t: 'Extracellular K⁺ accumulation partially depolarises ischaemic myocytes and shortens their action potentials. The resulting voltage gradient between injured and healthy tissue during diastole and systole (“injury current”) displaces the ST segment toward (transmural) or away from (subendocardial) leads facing the territory.' },
  irreversible: { h: 'Irreversible injury', t: 'With prolonged severe ischaemia, Ca²⁺ overload activates proteases and phospholipases, mitochondria swell and open permeability pores, and the sarcolemma ruptures. Injury begins in the subendocardium — highest wall stress and last on the perfusion path — and spreads outward (wavefront). Rate depends on collateral flow, demand and preconditioning.' },
  troponin: { h: 'Troponin — why and when', t: 'Troponin I/T exist as a small cytosolic pool and a large structural pool bound to myofilaments. Membrane disruption releases them; a rising and/or falling pattern indicates acute injury. Very early samples can be normal; high-sensitivity assays shorten but do not abolish this window.' },
};

export const CORONARY_DEEP: Record<'lad' | 'rca', Record<string, Deep>> = {
  lad: {
    normal: { refs: [R.jennings, R.acs25], sections: [
      { h: 'Supply and demand', t: 'Myocardium extracts most delivered oxygen at rest, so rising demand must be met by increased flow through metabolic, endothelial and autoregulatory dilation. LV subendocardial flow occurs mainly in diastole, so tachycardia (shorter diastole) and high LV diastolic pressure reduce supply.' },
      { h: 'LAD anatomy', t: 'The LAD runs in the anterior interventricular groove, giving septal perforators (anterior two-thirds of the septum, including bundle branches) and diagonals (anterolateral wall). It often supplies the apex and may wrap to the inferior apex.' },
      { h: 'Variability', t: 'Length, wraparound and diagonal size change the territory; collateral networks differ widely between people.' },
    ] },
    occlusion: { refs: [R.udmi, R.acs25], sections: [
      { h: 'Initiating event', t: 'Plaque rupture (thin fibrous cap, lipid core, inflammation) or erosion exposes thrombogenic material; platelets adhere (vWF–GPIb), activate (thromboxane A2, ADP) and aggregate (GPIIb/IIIa), and tissue factor drives fibrin formation. Thrombus may be partial, intermittent or total.' },
      { h: 'Territory at risk', t: 'Proximal LAD occlusion (before the first septal/diagonal) threatens the anterior wall, septum and apex; mid or distal occlusion threatens less. Distal embolisation of thrombus and vasoconstrictors can extend microvascular injury.' },
      { h: 'Bedside findings — why', t: 'Ischaemic metabolites (adenosine, bradykinin, H⁺, K⁺) stimulate cardiac sympathetic afferents, referred through T1–T4 dermatomes to chest, arm, neck or jaw. Sympathetic activation causes sweating and tachycardia; vagal reflexes can cause nausea.' },
      CORONARY_COMMON.troponin,
    ] },
    ischemia: { refs: [R.jennings, R.acs25], sections: [CORONARY_COMMON.ischemiaCell, CORONARY_COMMON.contractility,
      { h: 'Hemodynamic consequence', t: 'A large akinetic anterior segment lowers stroke volume and raises LV end-diastolic pressure (also from stiffening — diastolic dysfunction occurs early). Raised LV filling pressure transmits to pulmonary veins → congestion and dyspnoea; low output may cause hypotension.' },
      CORONARY_COMMON.ecgWhy,
      { h: 'Arrhythmia substrate', t: 'Heterogeneous depolarisation, conduction slowing and catecholamines create re-entry and triggered activity — ventricular fibrillation can occur early, even before infarction. Septal ischaemia can impair bundle-branch conduction.' },
    ] },
    wavefront: { refs: [R.wavefront, R.jennings, R.udmi], sections: [CORONARY_COMMON.irreversible, CORONARY_COMMON.troponin,
      { h: 'Limits', t: 'Symptom resolution is not a reliable sign of reperfusion. MI is defined by troponin dynamics plus clinical evidence of ischaemia; troponin rises in many non-ischaemic conditions.' },
    ] },
    infarct: { refs: [R.jennings, R.udmi, R.acs25], sections: [
      { h: 'Reperfusion biology', t: 'Restoring flow salvages myocardium that is still viable but cannot revive necrotic tissue. Reperfusion itself brings a Ca²⁺ and reactive-oxygen burst, mitochondrial permeability-transition pore opening and inflammation (reperfusion injury); microvascular obstruction (no-reflow) can persist despite an open artery. Viable but dysfunctional (“stunned”) myocardium may take days to recover.' },
      { h: 'Possible complications — why', t: 'Large anterior infarcts reduce LV systolic function (heart failure, cardiogenic shock), create arrhythmia substrate, and in later days necrotic thinning can cause mechanical complications (free-wall or septal rupture, aneurysm, LV thrombus).' },
      { h: 'Labs', t: 'Troponin rises then falls; natriuretic peptides rise with wall stress; lactate may rise if output falls. None alone determines infarct size or prognosis.' },
    ] },
  },
  rca: {
    normal: { refs: [R.rvReview, R.rvStat], sections: [
      { h: 'RCA anatomy', t: 'The RCA travels in the right AV groove, giving the conus and sinoatrial nodal branches (SA node in roughly 60%), acute marginal branches to the RV free wall, and — in a right-dominant heart — the PDA and posterolateral branches (inferior LV wall, inferior septum) and AV nodal artery.' },
      { h: 'RV physiology', t: 'The thin-walled RV pumps into a low-resistance pulmonary circulation and, unlike the LV, is perfused in both systole and diastole. Its lower oxygen demand and collateral supply (including from the LAD via the moderator-band artery) partly explain why it often tolerates and recovers from ischaemia better than the LV.' },
      { h: 'Series circulation', t: 'Because the ventricles are in series, LV preload is the RV’s output. Ventricular interdependence through the shared septum and pericardium means RV dilation can also impair LV filling directly.' },
    ] },
    occlusion: { refs: [R.rvReview, R.acs25], sections: [
      { h: 'Initiating event', t: 'Thrombotic occlusion of the proximal RCA (before acute marginals) puts the RV free wall at risk in addition to the inferior LV; distal occlusion usually spares the RV. In left-dominant hearts inferior MI arises from the circumflex instead.' },
      { h: 'Conduction effects — why', t: 'Ischaemia of the SA or AV nodal arteries, adenosine release and vagal reflexes from inferior-wall receptors (Bezold–Jarisch) can cause sinus bradycardia or AV block, usually at the nodal level and often transient.' },
      { h: 'Bedside findings', t: 'Chest or epigastric discomfort, nausea/vomiting (vagal) and diaphoresis are common; bradycardia and hypotension may appear early.' },
      CORONARY_COMMON.troponin,
    ] },
    ischemia: { refs: [R.jennings, R.acs25], sections: [CORONARY_COMMON.ischemiaCell, CORONARY_COMMON.contractility, CORONARY_COMMON.ecgWhy,
      { h: 'Lead localisation', t: 'Inferior leads II, III and aVF face the inferior wall; reciprocal depression in I/aVL is common. ST elevation greater in III than II, and reciprocal change in I, favour RCA over circumflex; posterior extension may show only V1–V3 ST depression on the standard ECG.' },
      { h: 'Limits', t: 'Lead patterns are probabilistic; circumflex occlusion can be electrically silent; occlusion MI without diagnostic ST elevation exists.' },
    ] },
    rv: { refs: [R.rvReview, R.rvStat, R.ferguson, R.acs25], sections: [
      { h: 'RV ischaemia → RV output', t: 'Ischaemic RV free wall loses contractility; the RV dilates and its systolic pressure generation falls. Septal contraction (from the LV) partly sustains RV ejection — so concurrent septal or LV dysfunction worsens it.' },
      { h: 'RV output → LV preload → cardiac output', t: 'Less blood crosses the lungs, so LV end-diastolic volume falls (underfilling, not primary LV failure). The dilated RV within a non-compliant pericardium raises intrapericardial pressure and shifts the septum leftward, further restricting LV filling. Stroke volume and cardiac output fall; systemic venous pressure rises.' },
      { h: 'Why preload dependence matters', t: 'Output now depends heavily on venous return and atrial contraction. Venodilation (nitrates such as nitroglycerin, also opioids), volume depletion, or loss of atrioventricular synchrony (AV block, atrial fibrillation) can produce a disproportionate fall in cardiac output and blood pressure. In a small study of inferior MI, most — not all — patients with marked nitrate-associated hypotension had ECG evidence of RV involvement.' },
      { h: 'Bedside findings — why', t: 'Hypotension with raised jugular venous pressure and clear lungs reflects reduced LV filling with systemic venous congestion; Kussmaul’s sign may appear. The triad is specific-ish but insensitive.' },
      { h: 'Labs & tests', t: 'Right-sided leads (V4R) may show ST elevation, often transiently; echocardiography shows RV dilation/hypokinesis. Troponin rises but does not localise. Lactate may rise if output falls.' },
      { h: 'Qualifications', t: 'Many inferior MIs lack meaningful RV involvement, and RV involvement does not always cause hypotension. Nitrate cautions (hypotension, suspected RV infarction, recent PDE-5 inhibitor use) are applied through individual clinical assessment; this lesson gives no algorithm or dosing.' },
    ] },
    infarct: { refs: [R.rvReview, R.jennings, R.udmi], sections: [CORONARY_COMMON.irreversible,
      { h: 'Recovery pattern', t: 'RV function frequently improves over days to weeks, even without complete reperfusion, reflecting stunning rather than necrosis in part of the RV — but persistent RV failure carries significant risk.' },
      { h: 'Possible complications — why', t: 'AV block (nodal ischaemia/vagal), persistent low output, and papillary-muscle rupture — the posteromedial papillary muscle often depends on the PDA alone — causing acute mitral regurgitation; ventricular septal rupture is rarer.' },
      CORONARY_COMMON.troponin,
    ] },
  },
};

// ---------------- Ischemic stroke ----------------
const STROKE_BASE: Record<string, Deep> = {
  normal: { refs: [R.tatu, R.dirnagl], sections: [
    { h: 'Energy dependence', t: 'The brain uses roughly a fifth of resting oxygen consumption with almost no glycogen or oxygen reserve. Neurons spend most ATP restoring Na⁺/K⁺ gradients after synaptic activity, so flow interruption quickly silences function.' },
    { h: 'Autoregulation & collaterals', t: 'Arteriolar tone keeps cerebral blood flow stable across a range of perfusion pressures. The circle of Willis (anterior and posterior communicating arteries) and pial leptomeningeal anastomoses between ACA, MCA and PCA branches provide potential alternative routes; their calibre varies greatly.' },
    { h: 'Territories & function', t: 'MCA: lateral convexity — face/arm motor and sensory cortex, language (dominant) and spatial attention (non-dominant), optic radiations, and deep structures via lenticulostriates. ACA: medial frontal/parietal — leg motor/sensory, initiative, micturition control. PCA: occipital visual cortex, inferomedial temporal (memory), thalamus. Basilar: brainstem, cerebellum, thalami.' },
  ] },
  'core-penumbra': { refs: [R.astrup, R.dirnagl, R.campbell], sections: [
    { h: 'Flow thresholds', t: 'As flow falls, electrical (synaptic) failure occurs first while membranes remain intact — the penumbra. Below a lower threshold, ion pumps fail, cells depolarise irreversibly (anoxic depolarisation) and infarction follows — the core. Thresholds depend on duration: tissue tolerates moderate hypoperfusion longer than severe.' },
    { h: 'Ischaemic cascade', t: 'Depolarisation releases glutamate; NMDA/AMPA receptor activation causes Ca²⁺ influx, activating proteases, lipases and NO synthase, and generating free radicals (excitotoxicity). Cytotoxic oedema (cell swelling from Na⁺/water influx) is what diffusion MRI detects. Peri-infarct spreading depolarisations expand injury into the penumbra; inflammation and apoptosis continue for days.' },
    { h: 'Clinical deficit', t: 'Deficits reflect core plus penumbra, so the bedside picture can exceed final injury — and can improve if penumbra survives.' },
    { h: 'Imaging estimates', t: 'CT perfusion estimates core by severely reduced CBF and hypoperfusion by prolonged Tmax; diffusion MRI estimates core. Both are approximations dependent on timing, thresholds and software; CTA shows occlusion and collaterals but not tissue fate.' },
  ] },
  evolution: { refs: [R.campbell, R.defuse3, R.dirnagl], sections: [
    { h: 'Core growth', t: 'Without reperfusion the core expands into penumbra at a rate set mainly by collateral perfusion and occlusion site — “fast progressors” may complete infarction early, “slow progressors” may retain penumbra for many hours. Clock time is a proxy for tissue state, not a measure of it.' },
    { h: 'Reperfusion', t: 'Recanalisation can salvage penumbra but not core; reperfusion may cause haemorrhagic transformation (blood–brain barrier disruption via matrix metalloproteinases) and incomplete microvascular reperfusion (no-reflow) can limit benefit.' },
    { h: 'Later complications — why', t: 'Vasogenic oedema (barrier breakdown) peaks over days and can cause mass effect, particularly with large MCA or cerebellar infarcts. Neurologic worsening can also reflect seizure, haemorrhage or systemic factors (glucose, fever, hypotension).' },
    { h: 'Labs', t: 'No blood test measures core or penumbra. Glucose, coagulation and cardiac evaluation inform mimics, bleeding risk and embolic sources.' },
  ] },
};
const STROKE_OCC: Record<string, Deep> = {
  mca: { refs: [R.tatu, R.campbell], sections: [
    { h: 'Initiating event', t: 'Cardioembolism (e.g., atrial fibrillation), artery-to-artery embolism from carotid plaque, or intracranial atherothrombosis occludes M1 or a division. M1 occlusion also blocks lenticulostriate perforators to the basal ganglia and internal capsule, which have no collaterals.' },
    { h: 'Function lost — why the signs', t: 'Lateral precentral/postcentral gyri hold face and arm representation → contralateral face/arm weakness and sensory loss greater than leg. Frontal eye fields drive gaze contralaterally, so their loss causes deviation toward the lesion. Dominant hemisphere: Broca (inferior frontal) and Wernicke (posterior superior temporal) → aphasia. Non-dominant parietal: neglect and anosognosia. Optic radiations → contralateral homonymous field defect.' },
    { h: 'Variability', t: 'Superior-division occlusion gives motor/expressive deficits, inferior-division receptive aphasia or neglect with less weakness. Symptoms overlap with other territories and mimics; occlusion is shown by vascular imaging.' },
  ] },
  aca: { refs: [R.tatu, R.campbell], sections: [
    { h: 'Initiating event', t: 'ACA occlusion is less common, usually embolic. If occlusion is distal to the anterior communicating artery, the contralateral ACA cannot compensate through it; an azygos ACA or a single dominant A1 can cause bilateral medial frontal infarction.' },
    { h: 'Function lost — why the signs', t: 'The leg and foot area of the motor/sensory strip lies on the medial surface → contralateral leg weakness and sensory loss greater than arm, face spared. Medial frontal and cingulate injury cause abulia and disinhibition; paracentral lobule involvement impairs voluntary micturition control. Dominant supplementary motor area injury can cause transcortical motor aphasia.' },
    { h: 'Variability', t: 'Territory and ACoA anatomy vary; partial syndromes are common.' },
  ] },
  pca: { refs: [R.tatu, R.campbell], sections: [
    { h: 'Initiating event', t: 'Embolism from the heart or vertebrobasilar system, or in-situ thrombosis. A fetal-type PCA arises from the ICA, so a carotid embolus can cause a PCA stroke.' },
    { h: 'Function lost — why the signs', t: 'Calcarine (primary visual) cortex → contralateral homonymous hemianopia, often macular-sparing (dual MCA/PCA supply at the occipital pole). Dominant occipital plus splenium injury disconnects visual input from language areas → alexia without agraphia. Inferomedial temporal (hippocampal) injury → memory impairment. Thalamic perforators → contralateral sensory loss or arousal change.' },
    { h: 'Variability', t: 'Hemianopia may be unnoticed by patients; posterior strokes are under-detected by anterior-weighted scales.' },
  ] },
  basilar: { refs: [R.mattle, R.campbell], sections: [
    { h: 'Initiating event', t: 'Atherothrombosis (often mid-basilar) or embolism (often to the top of the basilar). Onset can be abrupt or stuttering with prodromal transient symptoms, reflecting progressive thrombosis.' },
    { h: 'Function lost — why the signs', t: 'Pontine perforator ischaemia damages corticospinal tracts bilaterally (quadriparesis), cranial nerve nuclei and the medial longitudinal fasciculus (diplopia, gaze palsies, internuclear ophthalmoplegia), corticobulbar fibres (dysarthria, dysphagia) and the reticular activating system (reduced consciousness). Crossed signs — cranial nerve deficit on one side, limb weakness on the other — localise to the brainstem. Cerebellar involvement causes ataxia and vertigo; top-of-basilar occlusion affects thalami and both PCAs.' },
    { h: 'Collaterals', t: 'Posterior communicating arteries can perfuse the distal basilar from the carotids; their size strongly influences outcome.' },
    { h: 'Variability', t: 'Presentations range from isolated vertigo to coma or locked-in syndrome and are frequently misattributed; vascular imaging establishes occlusion.' },
  ] },
};
const STROKE_COLL: Record<string, Deep> = {
  mca: { refs: [R.campbell, R.dirnagl], sections: [
    { h: 'Leptomeningeal collaterals', t: 'Pial anastomoses from ACA and PCA branches perfuse the MCA cortex retrogradely; deep perforator territories have none and infarct early. Collateral flow depends on systemic blood pressure, age, chronic hypertension and genetic factors.' },
    { h: 'Why it matters', t: 'Good collaterals keep much of the territory in the penumbral range; poor collaterals let the core expand rapidly. CTA can grade collaterals, but grading does not equal tissue viability.' },
  ] },
  aca: { refs: [R.campbell], sections: [{ h: 'Collateral routes', t: 'Cross-filling through the ACoA (if the occlusion is proximal to it) and pial collaterals from MCA and PCA branches can support the medial frontal territory; contribution varies widely.' }] },
  pca: { refs: [R.campbell], sections: [{ h: 'Collateral routes', t: 'MCA and ACA pial branches supply parts of the PCA territory; the posterior communicating artery links carotid and posterior circulations. Fetal-type configuration alters both supply and collateral potential.' }] },
  basilar: { refs: [R.mattle], sections: [{ h: 'Collateral routes', t: 'Posterior communicating arteries (carotid → distal basilar/PCAs) and cerebellar anastomoses (SCA, AICA, PICA) can sustain parts of the territory; absent or tiny Pcomms leave the brainstem dependent on the occluded vessel.' }] },
};

export function strokeDeep(variant: string, phaseId: string): Deep | undefined {
  if (phaseId === 'occlusion') return STROKE_OCC[variant] ?? STROKE_OCC.mca;
  if (phaseId === 'collaterals') return STROKE_COLL[variant] ?? STROKE_COLL.mca;
  return STROKE_BASE[phaseId];
}

// ---------------- Hemorrhagic stroke ----------------
export const HEM_DEEP: Record<'ich' | 'sah', Record<string, Deep>> = {
  ich: {
    normal: { refs: [R.keep, R.ich22], sections: [
      { h: 'Vessel vulnerability', t: 'Chronic hypertension causes lipohyalinosis and arteriolosclerosis of small penetrating arteries (lenticulostriate, thalamoperforating, pontine). Cerebral amyloid angiopathy deposits β-amyloid in cortical and leptomeningeal vessel walls, favouring lobar haemorrhage in older adults.' },
      { h: 'Intracranial compartments', t: 'Brain, blood and CSF share a rigid skull. Compensation for added volume comes mainly from displacing CSF into the spinal sac and compressing venous blood.' },
    ] },
    rupture: { refs: [R.keep, R.ich22], sections: [
      { h: 'Initiating event', t: 'A weakened penetrating artery ruptures; blood dissects along white-matter planes into deep grey matter. Anticoagulation, thrombocytopenia, vascular malformations, tumours, venous thrombosis and sympathomimetic drugs are other mechanisms.' },
      { h: 'Primary injury', t: 'The expanding mass mechanically disrupts neurons and tracts (here putamen/internal capsule) and raises local tissue pressure, reducing perfusion around the clot.' },
      { h: 'Bedside findings — why', t: 'Internal capsule involvement causes contralateral weakness; headache and vomiting reflect meningeal/dural stretch and raised pressure; reduced consciousness suggests large volume, ventricular extension or brainstem effect. Blood pressure is often very high (pre-existing hypertension, pain, sympathetic surge).' },
      { h: 'Labs', t: 'Coagulation studies, platelets and anticoagulant history identify bleeding contributors; glucose excludes a mimic. None distinguishes ICH from ischaemic stroke — imaging does.' },
    ] },
    expansion: { refs: [R.brott, R.ich22], sections: [
      { h: 'Why haematomas grow', t: 'Continued bleeding from the ruptured vessel and secondary shearing of surrounding vessels by the expanding mass enlarge the clot, mostly in the first hours. Anticoagulation and larger initial volume increase the likelihood.' },
      { h: 'Clinical significance', t: 'Expansion is associated with neurologic worsening and poorer outcome, which is why early repeat assessment and imaging are part of care pathways.' },
      { h: 'Limits', t: 'CTA spot sign and NCCT density/shape markers are associated with expansion but have modest predictive accuracy for an individual.' },
    ] },
    edema: { refs: [R.keep, R.ich22], sections: [
      { h: 'Perihaematomal oedema — why', t: 'Early: clot retraction extrudes serum. Hours–days: thrombin activates PAR receptors, complement and microglia, disrupting the blood–brain barrier. Later: haemolysis releases haemoglobin, haem and iron, generating free radicals and further oedema and neuronal death.' },
      { h: 'Mass effect & ventricles', t: 'Haematoma plus oedema compress the ipsilateral ventricle and shift midline structures. Rupture into the ventricles (IVH) can obstruct CSF pathways (foramen of Monro, aqueduct) causing hydrocephalus.' },
      { h: 'Variability', t: 'Oedema volume varies widely; cerebellar haemorrhage can compress the fourth ventricle and brainstem early.' },
    ] },
    icp: { refs: [R.keep, R.ich22], sections: [
      { h: 'ICP physiology', t: 'Once CSF and venous reserve are exhausted, small volume increases cause large ICP rises (steep pressure–volume curve). Cerebral perfusion pressure ≈ mean arterial pressure − ICP, so rising ICP reduces global perfusion.' },
      { h: 'Herniation — why the signs', t: 'Subfalcine herniation can compress the ACA; uncal herniation compresses CN III (pupil dilation) and the cerebral peduncle; downward displacement stretches brainstem perforators. Brainstem compression can trigger the Cushing response (hypertension, bradycardia, irregular respiration).' },
      { h: 'Limits', t: 'These are late and inconsistent signs; many patients with ICH never develop raised ICP. No laboratory value measures ICP.' },
    ] },
  },
  sah: {
    normal: { refs: [R.sah23], sections: [
      { h: 'Aneurysm biology', t: 'Saccular aneurysms form at circle-of-Willis branch points where haemodynamic stress and wall inflammation degrade the internal elastic lamina and media. Risk factors include smoking, hypertension, family history and connective-tissue disorders.' },
      { h: 'Compartment', t: 'Arteries run in the CSF-filled subarachnoid space, so rupture fills CSF spaces rather than tissue.' },
    ] },
    rupture: { refs: [R.sah23, R.perry], sections: [
      { h: 'Initiating event', t: 'Rupture jets arterial blood into the basal cisterns. ICP may briefly approach arterial pressure, transiently arresting cerebral perfusion — the mechanism of collapse or brief loss of consciousness — and causing global ischaemic injury (“early brain injury”).' },
      { h: 'Bedside findings — why', t: 'Sudden distension and chemical irritation of pain-sensitive meninges and vessels cause a thunderclap headache maximal at onset; vomiting and seizures may occur. Focal signs are often absent unless there is parenchymal extension or CN III compression (e.g., posterior communicating aneurysm).' },
      { h: 'Systemic effects', t: 'A catecholamine surge can produce ECG changes, troponin release, stress cardiomyopathy and neurogenic pulmonary oedema.' },
    ] },
    spread: { refs: [R.sah23, R.perry], sections: [
      { h: 'Blood distribution', t: 'Blood spreads through cisterns, Sylvian fissures and sulci; the pattern hints at aneurysm site but is not definitive.' },
      { h: 'Meningism — why delayed', t: 'Neck stiffness and photophobia reflect inflammatory meningeal irritation by blood breakdown products and can take hours to appear.' },
      { h: 'Rebleeding', t: 'The unsecured aneurysm can rebleed, most often early, carrying high mortality — why urgent aneurysm evaluation is a guideline priority.' },
      { h: 'Imaging & CSF', t: 'NCCT sensitivity is highest soon after onset and declines as blood is diluted and cleared; CSF xanthochromia requires time for haemoglobin to be converted to bilirubin.' },
    ] },
    hydro: { refs: [R.sah23], sections: [
      { h: 'Why hydrocephalus', t: 'Blood can obstruct CSF flow within ventricles or impair absorption at arachnoid granulations; ventricles enlarge and ICP rises.' },
      { h: 'Sodium', t: 'Hyponatraemia may develop over days through cerebral salt wasting (natriuresis) or SIADH; distinguishing them depends on volume status.' },
    ] },
    delayed: { refs: [R.sah23], sections: [
      { h: 'Delayed cerebral ischaemia — why', t: 'Over days, oxyhaemoglobin and breakdown products reduce NO availability and increase endothelin, causing large-artery vasospasm; microthrombosis, microvascular dysfunction and cortical spreading depolarisations also reduce perfusion. DCI can occur without angiographic vasospasm and vice versa.' },
      { h: 'Variability', t: 'Not all patients develop DCI; risk relates to bleed volume and other factors. Timing varies.' },
    ] },
  },
};
