import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import PageFilter, { Post } from '@/components/PageFilter';
import { useState } from 'react';
import techPost from '@/assets/tech-post.jpg';
import businessPost from '@/assets/business-post.jpg';
import pslfPost from '@/assets/pslf-hospitals.jpg';
import relocationPost from '@/assets/relocation-budget.jpg';
import sacramentoSuburbs from '@/assets/sacramento-suburbs.jpg';
import pslfFinder from '@/assets/pslf-finder.jpg';
import sanJoseSuburbs from '@/assets/san-jose-suburbs.jpg';
import phoenixSuburbs from '@/assets/phoenix-suburbs.jpg';
import houstonSuburbs from '@/assets/houston-suburbs.jpg';
import imgCardiologyAsset from '@/assets/blog/cardiology.png.asset.json';
import imgPulmonaryAsset from '@/assets/blog/pulmonary.png.asset.json';
import imgRenalAsset from '@/assets/blog/renal.png.asset.json';
import imgHematologyAsset from '@/assets/blog/hematology.png.asset.json';
import imgNeurologyAsset from '@/assets/blog/neurology.png.asset.json';
import imgInfectious from '@/assets/blog/infectious-disease.jpg';
import imgOncology from '@/assets/blog/oncology.jpg';
import imgDermatologyAsset from '@/assets/blog/dermatology.png.asset.json';
import imgPediatrics from '@/assets/blog/pediatrics.jpg';
import imgPsychiatry from '@/assets/blog/psychiatry.jpg';
import imgMskAsset from '@/assets/blog/msk.png.asset.json';
import imgGiAsset from '@/assets/blog/gi.png.asset.json';
import imgEndoAsset from '@/assets/blog/endocrinology.png.asset.json';
import imgEntAsset from '@/assets/blog/ent.png.asset.json';
import imgObgynAsset from '@/assets/blog/obgyn-new.png.asset.json';
const imgCardiology = imgCardiologyAsset.url;
const imgPulmonary = imgPulmonaryAsset.url;
const imgRenal = imgRenalAsset.url;
const imgHematology = imgHematologyAsset.url;
const imgNeurology = imgNeurologyAsset.url;
const imgDermatology = imgDermatologyAsset.url;
const imgMsk = imgMskAsset.url;
const imgGi = imgGiAsset.url;
const imgEndo = imgEndoAsset.url;
const imgEnt = imgEntAsset.url;
const imgObgynNew = imgObgynAsset.url;
import imgToxicology from '@/assets/blog/toxicology.jpg';
import imgProcedures from '@/assets/blog/procedures.jpg';
import imgOffTheClock from '@/assets/blog/off-the-clock.jpg';

const AllPosts = () => {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const blogPosts: Post[] = [
    {
      title: "Chest Imaging Atlas — CXR & CT Interpretation",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 14, 2026",
      excerpt: "Systematic chest radiograph and CT interpretation — lines, opacities, pneumothorax, effusions, and can"t-miss findings.",
      image: businessPost,
      slug: "chest-imaging-atlas",
      tags: ["Radiology", "Pulmonary"]
    },
    {
      title: "Neuro Imaging Atlas — Brain & Spine",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 14, 2026",
      excerpt: "CT and MRI interpretation for stroke, hemorrhage, mass effect, and spinal pathology — with decision rules.",
      image: businessPost,
      slug: "neuro-imaging-atlas",
      tags: ["Radiology", "Neurology"]
    },
    {
      title: "MSK & Extremities Imaging Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 14, 2026",
      excerpt: "Fracture and joint imaging by region — views, subtle findings, and pitfalls across the extremities.",
      image: businessPost,
      slug: "msk-extremities-imaging-atlas",
      tags: ["Radiology", "Musculoskeletal"]
    },
    {
      title: "Abdomen & Pelvis Imaging Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 14, 2026",
      excerpt: "CT, ultrasound, and plain film interpretation for abdominal and pelvic pathology — with contrast selection guidance.",
      image: businessPost,
      slug: "abdomen-pelvis-imaging-atlas",
      tags: ["Radiology", "Gastroenterology"]
    },
    {
      title: "Neck, Soft Tissue & Vascular Imaging Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 14, 2026",
      excerpt: "Imaging of neck spaces, soft tissue infections, and vascular pathology — CTA, ultrasound, and red flags.",
      image: businessPost,
      slug: "neck-softtissue-vascular-imaging-atlas",
      tags: ["Radiology", "ENT"]
    },
    {
      title: "Reading The Defense — Coverage Film Room",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 14, 2026",
      excerpt: "An interactive film-room breakdown of defensive coverages, how to identify them pre-snap, and the concepts that beat them.",
      image: businessPost,
      slug: "reading-the-defense",
      tags: ["Football", "Off the Clock"]
    },
    {
      title: "Hematopoiesis & Cellular Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 6, 2026",
      excerpt: "Stem cell lineages, erythropoiesis, granulopoiesis, lymphopoiesis, and megakaryopoiesis — with morphology pearls and clinical correlates.",
      image: businessPost,
      slug: "hematology-hematopoiesis-atlas",
      tags: ["Hematology", "Clinical Education"]
    },
    {
      title: "The Bulletproof Note — HPI, Exam & Disposition for the Deposition",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 10, 2026",
      excerpt: "Charting an ED note that holds up in deposition — HPI structure, exam specificity, MDM, and disposition language that defends the chart.",
      image: businessPost,
      slug: "bulletproof-note-atlas",
      tags: ["Documentation", "Medicolegal", "Clinical Education"]
    },
    {
      title: "The Pediatric Bulletproof Note — Deposition-Proof Peds Charting",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 10, 2026",
      excerpt: "Peds-specific charting: weight-based dosing, caregiver history, red flags, and disposition language that survives deposition.",
      image: businessPost,
      slug: "pediatric-bulletproof-note-atlas",
      tags: ["Pediatrics", "Documentation", "Medicolegal"]
    },
    {
      title: "The Charting Atlas — ED Documentation & Medicolegal Defense",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 10, 2026",
      excerpt: "A medicolegal atlas of ED documentation — language that helped, language that hurt, and the patterns plaintiff attorneys look for.",
      image: businessPost,
      slug: "ed-charting-medicolegal-atlas",
      tags: ["Documentation", "Medicolegal", "Clinical Education"]
    },
    {
      title: "Surviving the Deposition — Testifying Consistent With Your Chart",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 10, 2026",
      excerpt: "How to prepare for and testify in a deposition — chart consistency, phrasing traps, and the mindset that keeps you defensible.",
      image: businessPost,
      slug: "surviving-the-deposition-atlas",
      tags: ["Medicolegal", "Deposition", "Clinical Education"]
    },
    {
      title: "Laboratory Values Atlas — ED & Hospitalist",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 10, 2026",
      excerpt: "Reference ranges, panic values, and interpretation patterns for the labs ED and hospitalist clinicians order every shift.",
      image: businessPost,
      slug: "laboratory-values-atlas",
      tags: ["Labs", "Hematology", "Clinical Education"]
    },
    {
      title: "Analgesics Atlas — ED Pharmacology Master Reference",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 10, 2026",
      excerpt: "Opioids, non-opioids, adjuncts, and regional analgesia — dosing, onset, duration, and selection pearls for ED pain control.",
      image: businessPost,
      slug: "analgesics-atlas",
      tags: ["Pain", "Pharmacology", "Clinical Education"]
    },
    {
      title: "Alternative Analgesics Atlas — Research-Backed Non-Drug Pain Methods",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 10, 2026",
      excerpt: "Non-pharmacologic pain strategies — nerve blocks, TENS, heat/cold, mind-body, and procedural adjuncts with evidence pearls.",
      image: businessPost,
      slug: "alternative-analgesics-atlas",
      tags: ["Pain", "Procedures", "Clinical Education"]
    },
    {
      title: "Insulin Dosing Atlas — TDD, Weight-Based, Renal & Field Estimation",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 10, 2026",
      excerpt: "Total daily dose, weight-based starts, renal adjustments, correction factors, and bedside field estimation for insulin dosing.",
      image: businessPost,
      slug: "insulin-dosing-atlas",
      tags: ["Endocrine", "Pharmacology", "Clinical Education"]
    },
    {
      title: "CBC & Coagulation Labs Interpretation Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 6, 2026",
      excerpt: "Step-by-step interpretation of the CBC, differential, and coagulation panels — with panic values, patterns, and workup pearls.",
      image: businessPost,
      slug: "hematology-cbc-coag-labs-atlas",
      tags: ["Hematology", "Labs", "Clinical Education"]
    },
    {
      title: "Coagulation, Clotting Disorders & Anticoagulation Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 6, 2026",
      excerpt: "The coagulation cascade, bleeding and clotting disorders, anticoagulant and antiplatelet pharmacology, and reversal strategies.",
      image: businessPost,
      slug: "hematology-coagulation-atlas",
      tags: ["Hematology", "Anticoagulation", "Clinical Education"]
    },
    {
      title: "Cancer Classification & Staging Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 3, 2026",
      excerpt: "Tumor origin, histologic grade, TNM staging, and prognostic groups — with bedside pearls for interpreting pathology and imaging.",
      image: businessPost,
      slug: "cancer-classification-staging-atlas",
      tags: ["Oncology", "Staging", "Clinical Education"]
    },
    {
      title: "Lung & Breast Cancer Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 3, 2026",
      excerpt: "Histologic subtypes, molecular markers, staging pearls, and treatment pathways for lung and breast cancer.",
      image: businessPost,
      slug: "lung-breast-cancer-atlas",
      tags: ["Oncology", "Lung Cancer", "Breast Cancer"]
    },
    {
      title: "Cancer Deep Dives Vol. II",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 3, 2026",
      excerpt: "Volume II — expanded organ-system oncology coverage with molecular drivers, staging, treatment pathways, and prognostic pearls.",
      image: businessPost,
      slug: "cancer-deep-dives-vol2",
      tags: ["Oncology", "Clinical Education"]
    },
    {
      title: "Oncology Emergencies Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 3, 2026",
      excerpt: "Tumor lysis, hypercalcemia of malignancy, cord compression, neutropenic fever, SVC syndrome, and hyperviscosity — recognition and management.",
      image: businessPost,
      slug: "oncology-emergencies-atlas",
      tags: ["Oncology", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Oncology Interventions Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 3, 2026",
      excerpt: "Surgery, radiation, chemotherapy, targeted therapy, immunotherapy, and supportive care — with modality selection pearls.",
      image: businessPost,
      slug: "oncology-interventions-atlas",
      tags: ["Oncology", "Treatment", "Clinical Education"]
    },
    {
      title: "Oncology Side Effects Atlas — Chemo & Radiation",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 3, 2026",
      excerpt: "Chemo and radiation toxicities by organ system — with grading, monitoring, and management pearls.",
      image: businessPost,
      slug: "oncology-side-effects-atlas",
      tags: ["Oncology", "Toxicity", "Clinical Education"]
    },
    {
      title: "Cosmetic Dermatology Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 3, 2026",
      excerpt: "Neuromodulators, fillers, chemical peels, lasers, and resurfacing — with anatomy pearls and complication management.",
      image: businessPost,
      slug: "cosmetic-dermatology-atlas",
      tags: ["Dermatology", "Cosmetic", "Clinical Education"]
    },
    {
      title: "Outpatient Dermatology Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 3, 2026",
      excerpt: "Acne, rosacea, eczema, psoriasis, pigmentary disorders, skin cancer screening, and common in-office procedures.",
      image: businessPost,
      slug: "outpatient-dermatology-atlas",
      tags: ["Dermatology", "Outpatient", "Clinical Education"]
    },
    {
      title: "Electrolyte & Blood Product Correction Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 26, 2026",
      excerpt: "Repletion strategies, correction formulas, transfusion thresholds, and blood product selection — with dosing pearls and monitoring pitfalls for the bedside.",
      image: businessPost,
      slug: "electrolyte-correction-atlas",
      tags: ["Electrolytes", "Transfusion", "Clinical Education"]
    },
    {
      title: "MSK Physical Exam Atlas — ROM, Strength, Special Tests, Palpation",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 17, 2026",
      excerpt: "A regional MSK physical exam atlas — range of motion, strength grading, special tests, and palpation landmarks from shoulder to foot.",
      image: businessPost,
      slug: "msk-physical-exam-atlas",
      tags: ["MSK", "Physical Exam", "Clinical Education"]
    },
    {
      title: "Extremity Pain Differential Diagnosis Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 17, 2026",
      excerpt: "A region-by-region differential diagnosis atlas for extremity pain — mechanism, exam findings, imaging, and can't-miss diagnoses.",
      image: businessPost,
      slug: "extremity-ddx-atlas",
      tags: ["MSK", "Differential Diagnosis", "Clinical Education"]
    },
    {
      title: "Tib-Fib / Lower Extremity Fracture Disposition Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 17, 2026",
      excerpt: "Disposition, splinting, ortho consultation, and weight-bearing status for tib-fib and lower extremity fractures — with reduction and admission criteria.",
      image: businessPost,
      slug: "fracture-disposition-atlas",
      tags: ["MSK", "Fractures", "Clinical Education"]
    },
    {
      title: "Cardiac Enzymes, Labs & Diagnostics Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 17, 2026",
      excerpt: "Troponin kinetics, BNP, D-dimer, cardiac markers, and diagnostic workups — with interpretation pearls and rule-in/rule-out thresholds.",
      image: businessPost,
      slug: "cardiac-labs-atlas",
      tags: ["Cardiology", "Labs", "Clinical Education"]
    },
    {
      title: "Cardiology Atlas Vol. 1a — Vascular & Ischemic Disease",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Hypertension, lipids, coronary artery disease, and peripheral arterial disease — risk stratification, pharmacology, and management pathways.",
      image: businessPost,
      slug: "cardiology-atlas-vol1a",
      tags: ["Cardiology", "Vascular", "Ischemia", "Clinical Education"]
    },
    {
      title: "Cardiology Atlas Vol. 1b — Heart Failure & Structural/Inflammatory Disease",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "HFrEF/HFpEF, cardiomyopathies, valvular disease, pericarditis, endocarditis, and pulmonary hypertension — diagnosis and treatment.",
      image: businessPost,
      slug: "cardiology-atlas-vol1b",
      tags: ["Cardiology", "Heart Failure", "Valvular Disease", "Clinical Education"]
    },
    {
      title: "Cardiology Atlas Vol. 4 — ACS Deep Dive",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "STEMI/NSTEMI recognition, risk scores, reperfusion strategy, antiplatelet and anticoagulation regimens, RV infarction, and special ACS populations.",
      image: businessPost,
      slug: "cardiology-atlas-vol4",
      tags: ["Cardiology", "ACS", "STEMI", "Clinical Education"]
    },
    {
      title: "Cardiology Atlas Vol. 3 — Arrhythmias & Conduction Disease",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Bradyarrhythmias, AV block, SVT, atrial fibrillation, wide-complex tachycardia, VT, and inherited channelopathies.",
      image: businessPost,
      slug: "cardiology-atlas-vol3",
      tags: ["Cardiology", "Arrhythmia", "EKG", "Clinical Education"]
    },
    {
      title: "Cardiothoracic Surgery Atlas Vol. 1 — Cardiac Surgery & Devices",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "CABG, PCI, valve surgery, aortic operations, LVADs, transplant, and post-operative cardiac surgical care.",
      image: businessPost,
      slug: "cardiothoracic-surgery-atlas-vol1",
      tags: ["Cardiology", "Cardiac Surgery", "Devices", "Clinical Education"]
    },
    {
      title: "Cardiology Atlas Vol. 5 — Acute MI Complications & Cardiogenic Shock",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Cardiogenic shock, mechanical circulatory support, papillary muscle rupture, VSR, free-wall rupture, aneurysm, and post-MI care.",
      image: businessPost,
      slug: "cardiology-atlas-vol5",
      tags: ["Cardiology", "Cardiogenic Shock", "Critical Care", "Clinical Education"]
    },
    {
      title: "Cardiology Atlas Vol. 6 — Peripartum & Pregnancy Cardiac Emergencies",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Pregnancy cardiac physiology, peripartum cardiomyopathy, preeclampsia, P-SCAD, amniotic fluid embolism, mWHO risk classes, and drug safety.",
      image: businessPost,
      slug: "cardiology-atlas-vol6",
      tags: ["Cardiology", "Obstetrics", "Emergencies", "Clinical Education"]
    },
    {
      title: "Cardiology Pharmacology Atlas Vol. 1 — Blood Pressure & Lipid Medications",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Diuretics, RAAS blockade, calcium channel blockers, beta blockers, alpha agents, and lipid-lowering therapy — dosing, monitoring, and pitfalls.",
      image: businessPost,
      slug: "cardiology-pharm-atlas-vol1",
      tags: ["Cardiology", "Pharmacology", "Hypertension", "Clinical Education"]
    },
    {
      title: "Cardiology Pharmacology Atlas Vol. 2 — Heart Failure & Rate/Rhythm Control",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "GDMT pillars, adjunct heart failure agents, rate control, and antiarrhythmics by Vaughan-Williams class with dosing and safety pearls.",
      image: businessPost,
      slug: "cardiology-pharm-atlas-vol2",
      tags: ["Cardiology", "Pharmacology", "Heart Failure", "Clinical Education"]
    },
    {
      title: "Cardiology Pharmacology Atlas Vol. 3 — Antithrombotics & Remaining Agents",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Antiplatelets, heparins, warfarin, DOACs, reversal agents, and dosing in CKD and heart failure — with emerging therapies.",
      image: businessPost,
      slug: "cardiology-pharm-atlas-vol3",
      tags: ["Cardiology", "Pharmacology", "Anticoagulation", "Clinical Education"]
    },
    {
      title: "Cardiology Physical Exam, Documentation & Risk Stratification Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Cardiac auscultation, JVP, vascular and skin findings, risk stratification tools, and bulletproof cardiac documentation.",
      image: businessPost,
      slug: "cardiology-physical-exam-atlas",
      tags: ["Cardiology", "Physical Exam", "Documentation", "Clinical Education"]
    },
    {
      title: "Cardiothoracic Surgery Atlas Vol. 2 — Thoracic Surgery",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Pneumothorax, esophageal emergencies, mediastinal disease, chest trauma, lung resection, and pleural procedures.",
      image: businessPost,
      slug: "cardiothoracic-surgery-atlas-vol2",
      tags: ["Cardiology", "Thoracic Surgery", "Clinical Education"]
    },
    {
      title: "Vascular Atlas Vol. 1 — Arterial Disease",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Acute limb ischemia, aortic syndromes, vasculitis, renal and mesenteric arterial disease, and carotid disease.",
      image: businessPost,
      slug: "vascular-atlas-vol1",
      tags: ["Cardiology", "Vascular", "Clinical Education"]
    },
    {
      title: "Vascular Atlas Vol. 2 — Venous & Access Disease",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Chronic venous insufficiency, VTE, vascular access, AV malformations, lymphedema, and vascular trauma.",
      image: businessPost,
      slug: "vascular-atlas-vol2",
      tags: ["Cardiology", "Vascular", "VTE", "Clinical Education"]
    },
    {
      title: "Adult Trauma & Resuscitation Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Primary and secondary survey, massive transfusion, shock states, and damage-control resuscitation — with dosing and disposition pearls.",
      image: businessPost,
      slug: "adult-trauma-resuscitation-atlas",
      tags: ["Trauma", "Critical Care", "Resuscitation", "Clinical Education"]
    },
    {
      title: "GI Atlas Vol. 1 — Hormones & Neurotransmitters",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Gastrin, CCK, secretin, GIP, motilin, and enteric neurotransmitters — source cells, stimuli, actions, and clinical correlates.",
      image: businessPost,
      slug: "gi-atlas-vol1",
      tags: ["Gastroenterology", "Physiology", "Clinical Education"]
    },
    {
      title: "GI Atlas Vol. 2 — Secretory & Absorptive Physiology",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Salivary and gastric secretion, pancreatic exocrine function, bile, and carbohydrate, protein, fat, vitamin and water absorption.",
      image: businessPost,
      slug: "gi-atlas-vol2",
      tags: ["Gastroenterology", "Physiology", "Clinical Education"]
    },
    {
      title: "GI Atlas Vol. 3 — Motility Disorders",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Esophageal motility, gastroparesis, small bowel dysmotility, colonic and anorectal disorders, and postoperative ileus.",
      image: businessPost,
      slug: "gi-atlas-vol3",
      tags: ["Gastroenterology", "Motility", "Clinical Education"]
    },
    {
      title: "GI Atlas Vol. 4 — Pharmacology",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Acid suppression, antiemetics, prokinetics, laxatives, antidiarrheals, and IBD agents — mechanisms, dosing, and adverse effects.",
      image: businessPost,
      slug: "gi-atlas-vol4",
      tags: ["Gastroenterology", "Pharmacology", "Clinical Education"]
    },
    {
      title: "GI Atlas Vol. 5 — GI Surgery",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Core GI operations — indications, anatomy altered, postoperative course, and complications to anticipate.",
      image: businessPost,
      slug: "gi-atlas-vol5",
      tags: ["Gastroenterology", "Surgery", "Clinical Education"]
    },
    {
      title: "GI Atlas Vol. 5b — More Surgeries & Device Care",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Additional GI procedures plus ostomy, feeding tube, and drain management — troubleshooting and bedside care.",
      image: businessPost,
      slug: "gi-atlas-vol5b",
      tags: ["Gastroenterology", "Surgery", "Clinical Education"]
    },
    {
      title: "GI Emergencies & Hepatology Atlas Vol. 1",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Upper and lower GI bleeding, cirrhosis and portal hypertension, HE/SBP, hepatorenal syndrome, pancreatitis, esophageal emergencies, and ischemic colitis.",
      image: businessPost,
      slug: "gi-emergencies-hepatology-atlas-vol1",
      tags: ["Gastroenterology", "Hepatology", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "GI Symptoms, Stool & Quick-Facts Atlas Vol. 1",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Bristol stool chart, stool color differential, blood in stool, diarrhea classification, constipation pharmacology, and rapid-recall GI facts.",
      image: businessPost,
      slug: "gi-symptoms-stool-quickfacts-atlas-vol1",
      tags: ["Gastroenterology", "Symptoms", "Clinical Education"]
    },
    {
      title: "Endocrine Atlas Vol. 1 — Classic Axes",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "HPA, HPT, HPG and pancreatic axes — hormone cascades, feedback loops, and clinical correlates.",
      image: businessPost,
      slug: "endocrine-atlas-vol1",
      tags: ["Endocrinology", "Physiology", "Clinical Education"]
    },
    {
      title: "Endocrine Atlas Vol. 2 — Adipokine, GI & Neuroendocrine Hormones",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Leptin, ghrelin, incretins, RAAS, catecholamines, EPO, posterior pituitary, GH/IGF-1, and melatonin.",
      image: businessPost,
      slug: "endocrine-atlas-vol2",
      tags: ["Endocrinology", "Physiology", "Clinical Education"]
    },
    {
      title: "Endocrine Atlas Vol. 3a — Corticosteroid Pharmacology",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Steroid potency and equivalency, routes and PK, adrenal suppression, and taper protocols.",
      image: businessPost,
      slug: "endocrine-atlas-vol3a",
      tags: ["Endocrinology", "Pharmacology", "Clinical Education"]
    },
    {
      title: "Endocrine Atlas Vol. 3b — Testosterone & Estrogen HRT",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Testosterone and estrogen replacement — formulations, dosing, monitoring, and risk counseling.",
      image: businessPost,
      slug: "endocrine-atlas-vol3b",
      tags: ["Endocrinology", "Pharmacology", "Clinical Education"]
    },
    {
      title: "Endocrine Atlas Vol. 3c — Labs & Monitoring Reference",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Endocrine lab panels, dynamic testing, reference ranges, and monitoring intervals.",
      image: businessPost,
      slug: "endocrine-atlas-vol3c",
      tags: ["Endocrinology", "Labs", "Clinical Education"]
    },
    {
      title: "Endocrine Atlas Vol. 4 — Endocrine Emergencies",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "DKA, HHS, myxedema coma, thyroid storm, adrenal crisis, and severe electrolyte derangements.",
      image: businessPost,
      slug: "endocrine-atlas-vol4",
      tags: ["Endocrinology", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Endocrine Atlas Vol. 5 — Special Topics & Diagnostic Pitfalls",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Assay interference, sick euthyroid, incidentalomas, and the classic endocrine diagnostic traps.",
      image: businessPost,
      slug: "endocrine-atlas-vol5",
      tags: ["Endocrinology", "Diagnostics", "Clinical Education"]
    },
    {
      title: "Endocrine Atlas Vol. 6 — Interaction Matrix & Clinical Scenarios",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Cross-axis hormone interactions, drug-endocrine interference, and integrated clinical scenarios.",
      image: businessPost,
      slug: "endocrine-atlas-vol6",
      tags: ["Endocrinology", "Clinical Education"]
    },
    {
      title: "GI Atlas Vol. 6 — IBD Management, Malignancy & Viral Hepatitis",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "IBD clinical management, colorectal cancer screening, tumor markers and staging, viral hepatitis, and pediatric GI emergencies.",
      image: businessPost,
      slug: "gi-atlas-vol6",
      tags: ["Gastroenterology", "IBD", "Oncology", "Hepatitis", "Clinical Education"]
    },
    {
      title: "Ocular Atlas Vol. 2b — Massive Differential Diagnosis Reference",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Eye complaints by chief complaint — red eye, vision loss, diplopia, anisocoria, ptosis, proptosis, and pediatric presentations.",
      image: businessPost,
      slug: "ocular-differential-atlas-vol2b",
      tags: ["ENT", "Ocular", "Differential Diagnosis", "Clinical Education"]
    },
    {
      title: "Ocular Atlas Vol. 1 — Vision & Globe-Threatening Emergencies",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Central retinal artery occlusion, acute angle closure, endophthalmitis, and other sight-threatening emergencies — recognition and time-critical management.",
      image: businessPost,
      slug: "ocular-atlas-vol1",
      tags: ["Ophthalmology", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Ocular Atlas Vol. 2 — Ocular Trauma",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Open globe, hyphema, orbital fractures, chemical burns, and foreign bodies — exam sequence, imaging, and disposition.",
      image: businessPost,
      slug: "ocular-atlas-vol2",
      tags: ["Ophthalmology", "Trauma", "Clinical Education"]
    },
    {
      title: "Ocular Atlas Vol. 3a — Infectious & Inflammatory Disease",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Keratitis, uveitis, scleritis, conjunctivitis, and inflammatory eye disease — pathogens, treatment, and referral thresholds.",
      image: businessPost,
      slug: "ocular-atlas-vol3a",
      tags: ["Ophthalmology", "Infectious Disease", "Clinical Education"]
    },
    {
      title: "Ocular Atlas Vol. 3b — Orbital/Adnexal Infections & Outpatient Red Eye",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Preseptal vs orbital cellulitis, dacryocystitis, hordeolum/chalazion, and the outpatient red eye workup.",
      image: businessPost,
      slug: "ocular-atlas-vol3b",
      tags: ["Ophthalmology", "Infectious Disease", "Clinical Education"]
    },
    {
      title: "Ocular Atlas Vol. 4 — Neuro-Ophthalmology",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Cranial nerve palsies, optic neuropathies, papilledema, visual field defects, and pupillary abnormalities.",
      image: businessPost,
      slug: "ocular-atlas-vol4",
      tags: ["Ophthalmology", "Neurology", "Clinical Education"]
    },
    {
      title: "Ocular Atlas Vol. 5 — Exam Technique, Procedures & Pharmacology",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Slit lamp and fluorescein technique, tonometry, lateral canthotomy, foreign body removal, and ophthalmic drug reference.",
      image: businessPost,
      slug: "ocular-atlas-vol5",
      tags: ["Ophthalmology", "Procedures", "Pharmacology", "Clinical Education"]
    },
    {
      title: "Ocular Atlas Vol. 6 — Pediatric & Special Populations",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 29, 2026",
      excerpt: "Neonatal conjunctivitis, leukocoria, amblyopia/strabismus, pediatric trauma, and eye findings in pregnancy and immunocompromise.",
      image: businessPost,
      slug: "ocular-atlas-vol6",
      tags: ["Ophthalmology", "Pediatrics", "Clinical Education"]
    },
    {
      title: "GI Atlas — Differential, Pharmacology & IBD Reference",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 21, 2026",
      excerpt: "Abdominal pain differential by region, pharmacology pearls, and IBD reference — plus red flags, workup, and disposition guidance.",
      image: businessPost,
      slug: "gi-atlas",
      tags: ["Gastroenterology", "Differential Diagnosis", "Pharmacology", "IBD", "Clinical Education"]
    },
    {
      title: "GI Physical Exam Atlas — Abdominal & Rectal Exam Reference",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 23, 2026",
      excerpt: "Expert-level abdominal and rectal exam reference — inspection, palpation, special signs, hernia exam, and documentation pearls.",
      image: businessPost,
      slug: "gi-physical-exam-atlas",
      tags: ["Gastroenterology", "Physical Exam", "Clinical Education"]
    },
    {
      title: "Dermatology ER Atlas — Rash Differential Algorithm",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 21, 2026",
      excerpt: "A rash differential algorithm by distribution and morphology — face, trunk, extremities, palms/soles, mucosal, generalized — with can't-miss ED dermatologic emergencies.",
      image: businessPost,
      slug: "derm-er-rash-atlas",
      tags: ["Dermatology", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "ENT Atlas — Ear, Nose, Throat & Ocular Reference",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 21, 2026",
      excerpt: "A structured ENT and ocular reference — otologic, nasal, oropharyngeal, and eye complaints with exam findings, workup, and disposition pearls.",
      image: businessPost,
      slug: "ent-atlas",
      tags: ["ENT", "Ocular", "Clinical Education"]
    },
    {
      title: "MSK Neuromuscular Atlas — Innervation, Action & Movement Pathways",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 26, 2026",
      excerpt: "Muscles mapped to their innervation, actions, and movement pathways — with nerve routes, injury patterns, and bedside exam pearls.",
      image: businessPost,
      slug: "msk-neuromuscular-atlas",
      tags: ["MSK", "Neurology", "Clinical Education"]
    },
    {
      title: "Renal Pharmacology & UTI Atlas — CKD Dosing, Contrast, Bacteremia",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 25, 2026",
      excerpt: "CKD-based drug dosing, contrast nephropathy, and UTI/bacteremia management — with dose adjustments, avoid-in-CKD lists, and antibiotic selection pearls.",
      image: businessPost,
      slug: "renal-pharm-uti-atlas",
      tags: ["Nephrology", "Pharmacology", "Clinical Education"]
    },
    {
      title: "Procedural Sedation Master Atlas — Anesthesiology Reference",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 25, 2026",
      excerpt: "Sedation depth, agent selection, dosing, monitoring, and rescue — an anesthesiology-grade reference for propofol, ketamine, etomidate, benzos, opioids, and dexmedetomidine.",
      image: businessPost,
      slug: "sedation-master-atlas",
      tags: ["Sedation", "Anesthesiology", "Clinical Education"]
    },
    {
      title: "Renal Emergency Atlas — AKI, Electrolytes, Stones, Diuretics & UA",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 24, 2026",
      excerpt: "A renal emergency atlas covering acute kidney injury, electrolyte derangements, nephrolithiasis, diuretic pharmacology, and urinalysis interpretation — with GFR-based staging, stone management algorithms, and bedside pearls.",
      image: businessPost,
      slug: "renal-emergency-atlas",
      tags: ["Nephrology", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Neurologic Emergencies Atlas — Stroke, Spine, Seizures & CNS Infections",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 23, 2026",
      excerpt: "A two-part neurologic emergencies atlas: stroke syndromes and spinal cord emergencies, plus seizures, ASMs, and CNS infections with bedside pearls and management algorithms.",
      image: businessPost,
      slug: "neurologic-emergencies-atlas",
      tags: ["Neurology", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Neuralgia, Migraine & Spinal Pain Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "July 6, 2026",
      excerpt: "A clinical atlas covering neuralgia subtypes, migraine pathophysiology and acute management, spinal pain generators, radiculopathy patterns, and bedside pearls for distinguishing neuropathic, vascular, and mechanical spine pain.",
      image: businessPost,
      slug: "neuralgia-migraine-spine-atlas",
      tags: ["Neurology", "Pain", "Clinical Education"]
    },
    {
      title: "Procedural Companions — Splinting, Nerve Blocks & Sedation",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 22, 2026",
      excerpt: "A bedside procedural atlas covering splinting, regional/digital nerve blocks, and procedural sedation with dosing, anatomy, and pitfall pearls.",
      image: businessPost,
      slug: "procedural-companions-atlas",
      tags: ["Procedures", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Emergency Dermatology Atlas — Master Reference",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 22, 2026",
      excerpt: "Life-threatening rashes, urgent dermatoses, pediatric exanthems, and primary lesion morphology in a structured ED reference.",
      image: businessPost,
      slug: "dermatology-emergency-atlas",
      tags: ["Dermatology", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Wound, Burn & Abscess Atlas — Procedural Reference",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 22, 2026",
      excerpt: "A procedural atlas for wound closure, burn classification and resuscitation, and abscess I&D with technique pearls and aftercare.",
      image: businessPost,
      slug: "wound-burn-abscess-atlas",
      tags: ["Procedures", "Wound Care", "Clinical Education"]
    },
    {
      title: "Sepsis Atlas Vol. 1 — Recognition & Screening",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 20, 2026",
      excerpt: "Sepsis recognition and screening: SIRS vs qSOFA vs SOFA, screening tools, lactate thresholds, and time-zero definitions.",
      image: businessPost,
      slug: "sepsis-vol1-recognition-screening",
      tags: ["Infectious Disease", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Sepsis Atlas Vol. 2 — Cultures & Diagnostics",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 20, 2026",
      excerpt: "Blood cultures, source-specific sampling, biomarkers, and rapid molecular diagnostics in suspected sepsis.",
      image: businessPost,
      slug: "sepsis-vol2-cultures-diagnostics",
      tags: ["Infectious Disease", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Sepsis Atlas Vol. 3 — Hemodynamics & Fluid Resuscitation",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 20, 2026",
      excerpt: "Fluid strategy, responsiveness assessment, vasopressor selection and titration, and MAP targets in septic shock.",
      image: businessPost,
      slug: "sepsis-vol3-hemodynamics-fluid-resuscitation",
      tags: ["Infectious Disease", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Sepsis Atlas Vol. 4 — Empiric Antibiotics & Source Control",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 20, 2026",
      excerpt: "Empiric antibiotic selection by source, timing, dosing in sepsis, de-escalation, and source-control priorities.",
      image: businessPost,
      slug: "sepsis-vol4-empiric-antibiotics-source-control",
      tags: ["Infectious Disease", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Sepsis Atlas Vol. 5 — Special Populations",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 20, 2026",
      excerpt: "Sepsis in pregnancy, neutropenia, cirrhosis, ESRD, immunosuppression, elderly, and pediatric patients.",
      image: businessPost,
      slug: "sepsis-vol5-special-populations",
      tags: ["Infectious Disease", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Sepsis Atlas Vol. 6 — Prevention & QI",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 20, 2026",
      excerpt: "Sepsis bundles, SEP-1 compliance, quality improvement metrics, and prevention strategies.",
      image: businessPost,
      slug: "sepsis-vol6-prevention-qi",
      tags: ["Infectious Disease", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Antibiotic & Steroid Indications Atlas — When They're Actually Warranted",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 20, 2026",
      excerpt: "When antibiotics and steroids are truly indicated by condition — evidence thresholds, stewardship, and avoiding reflex prescribing.",
      image: businessPost,
      slug: "antibiotic-indications-atlas",
      tags: ["Infectious Disease", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Antimicrobial Atlas — Antibacterials, Antivirals & Antifungals",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 20, 2026",
      excerpt: "An antimicrobial atlas covering bacterial classification, antibiotic mechanism of action, antivirals, antifungals, and stewardship — with spectrum tables, resistance patterns, and clinical pearls.",
      image: businessPost,
      slug: "antimicrobial-atlas",
      tags: ["Antibiotics", "Infectious Disease", "Clinical Education"]
    },
    {
      title: "OB/GYN Emergency Atlas — First, Second, Third Trimester & GYN Emergencies",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 20, 2026",
      excerpt: "An OB/GYN emergency atlas covering first, second, and third trimester emergencies plus gynecologic crises — with clinical pearls, ultrasound findings, and management pearls for the emergency department.",
      image: businessPost,
      slug: "obgyn-emergency-atlas",
      tags: ["OB/GYN", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "OB/GYN Atlas Vol. 1 — Antepartum Foundations",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Trimester-by-trimester care, prenatal labs and biomarkers, growth surveillance, imaging, birth preparation, and antepartum emergencies.",
      image: businessPost,
      slug: "obgyn-atlas-vol1",
      tags: ["OB/GYN", "Prenatal Care", "Clinical Education"]
    },
    {
      title: "OB/GYN Atlas Vol. 2 — Labor & Delivery",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Stages of labor, induction, fetal heart rate monitoring, analgesia, delivery mechanics, operative delivery, and intrapartum emergencies.",
      image: businessPost,
      slug: "obgyn-atlas-vol2",
      tags: ["OB/GYN", "Labor & Delivery", "Clinical Education"]
    },
    {
      title: "OB/GYN Atlas Vol. 3 — Complications",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Gestational diabetes, obesity, UTI and renal disease, hypertensive disorders, cardiac disease, and perinatal mental health.",
      image: businessPost,
      slug: "obgyn-atlas-vol3",
      tags: ["OB/GYN", "Pregnancy Complications", "Clinical Education"]
    },
    {
      title: "OB/GYN Atlas Vol. 4 — Fertility, Preconception & Epigenetics",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Infertility workup, assisted reproductive technology, preconception optimization, epigenetics, and cost considerations.",
      image: businessPost,
      slug: "obgyn-atlas-vol4",
      tags: ["OB/GYN", "Fertility", "Clinical Education"]
    },
    {
      title: "OB/GYN Atlas Vol. 5 — Complementary & Traditional Approaches",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Water immersion, acupuncture and TCM, chiropractic care, herbals and supplements, mind-body therapy, and cultural postpartum practices.",
      image: businessPost,
      slug: "obgyn-atlas-vol5",
      tags: ["OB/GYN", "Integrative Medicine", "Clinical Education"]
    },
    {
      title: "OB/GYN Atlas Vol. 6 — Gynecologic Emergencies",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Ovarian torsion, ruptured cysts, PID and tubo-ovarian abscess, Bartholin abscess, acute AUB, toxic shock, and vulvovaginal emergencies.",
      image: businessPost,
      slug: "obgyn-atlas-vol6",
      tags: ["OB/GYN", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "OB/GYN Atlas Vol. 7 — Contraception & Cancer Screening",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Contraceptive method comparison, US MEC, emergency contraception, IUD complications, and cervical, breast, ovarian and endometrial screening.",
      image: businessPost,
      slug: "obgyn-atlas-vol7",
      tags: ["OB/GYN", "Contraception", "Screening", "Clinical Education"]
    },
    {
      title: "OB/GYN Atlas Vol. 8 — Breast Health, Lactation & Outpatient Gynecology",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Lactation-related breast conditions, benign breast disease, medication safety, chronic AUB, PCOS, endometriosis, fibroids, and vulvar dermatoses.",
      image: businessPost,
      slug: "obgyn-atlas-vol8",
      tags: ["OB/GYN", "Breast Health", "Lactation", "Clinical Education"]
    },
    {
      title: "OB/GYN Atlas Vol. 9 — Menopause & Perimenopause",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "The menopausal transition, vasomotor symptoms, hormone therapy, GSM, bone health, cardiometabolic risk, and premature ovarian insufficiency.",
      image: businessPost,
      slug: "obgyn-atlas-vol9",
      tags: ["OB/GYN", "Menopause", "Clinical Education"]
    },
    {
      title: "Female Development, Physiology & Research Equity Atlas",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "August 2, 2026",
      excerpt: "Puberty and development, menstrual physiology and pain, hormonal contraceptives, pregnancy and aging physiology, and research equity gaps.",
      image: businessPost,
      slug: "female-development-physiology-atlas",
      tags: ["OB/GYN", "Physiology", "Research Equity", "Clinical Education"]
    },
    {
      title: "Psychiatric Emergency Atlas — Master Reference",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 21, 2026",
      excerpt: "A psychiatric emergency atlas covering agitation, psychosis, mood and safety crises, organic mimics, and substance-related presentations — with de-escalation, dosing, and disposition pearls.",
      image: businessPost,
      slug: "psychiatric-emergency-atlas",
      tags: ["Psychiatry", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Pediatric EM Atlas — Board Review",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 19, 2026",
      excerpt: "A pediatric EM board-review atlas covering resuscitation, neonatal emergencies, respiratory distress, GI/surgical mimics, NAT, and pediatric infectious disease with age-specific dosing and red flags.",
      image: businessPost,
      slug: "pediatric-em-atlas",
      tags: ["Pediatrics", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Fluid Dynamics Atlas — IV Fluids, Physiology & Special Considerations",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 19, 2026",
      excerpt: "A fluid dynamics atlas covering crystalloids, colloids, blood products, and compartment physiology with special considerations for sepsis, DKA, burns, heart failure, and pediatrics.",
      image: businessPost,
      slug: "fluid-dynamics-atlas",
      tags: ["IV Fluids", "Critical Care", "Clinical Education"]
    },
    {
      title: "Resuscitation Atlas — Shock, Pressors, Fluids & Electrolytes",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 17, 2026",
      excerpt: "A resuscitation atlas covering the four shock types, matching pressors, fluid strategy, and electrolyte derangements with a structured bedside approach to recognition, dosing, and reassessment.",
      image: businessPost,
      slug: "resuscitation-atlas",
      tags: ["Resuscitation", "Critical Care", "Clinical Education"]
    },
    {
      title: "ABG Interpreter — Acid-Base, Step by Step",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 17, 2026",
      excerpt: "A step-by-step interactive ABG interpreter covering pH, PaCO₂, HCO₃⁻, anion gap, and expected compensation to identify primary and mixed acid-base disturbances.",
      image: businessPost,
      slug: "abg-interpreter",
      tags: ["Acid-Base", "Critical Care", "Clinical Education"]
    },
    {
      title: "Reduction Field Manual — Joint Dislocations",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 17, 2026",
      excerpt: "A bedside field manual for joint reductions with traction vectors, sedation considerations, and post-reduction checks across shoulder, elbow, hip, patella, and finger.",
      image: businessPost,
      slug: "reduction-field-manual",
      tags: ["Orthopedics", "Procedures", "Clinical Education"]
    },
    {
      title: "POCUS Atlas — Probe, Window, Screen & Pitfall",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 17, 2026",
      excerpt: "A point-of-care ultrasound atlas mapping each common exam to its probe choice, acoustic window, expected anatomy, and the pitfalls that fool clinicians.",
      image: businessPost,
      slug: "pocus-atlas",
      tags: ["POCUS", "Ultrasound", "Clinical Education"]
    },
    {
      title: "Toxidrome Atlas — Recognition, Overdoses & Antidotes",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 17, 2026",
      excerpt: "A visual atlas of the major toxidromes — sympathomimetic, anticholinergic, cholinergic, opioid, and sedative-hypnotic — with vitals patterns, agents, and antidotes.",
      image: businessPost,
      slug: "toxidrome-atlas",
      tags: ["Toxicology", "Emergency Medicine", "Clinical Education"]
    },
    {
      title: "Ventilator Atlas — Modes, Numbers & Troubleshooting",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 17, 2026",
      excerpt: "A ventilator atlas covering AC, SIMV, PRVC, PS, and APRV modes, the numbers that matter, and a structured approach to alarms and waveform troubleshooting.",
      image: businessPost,
      slug: "ventilator-atlas",
      tags: ["Critical Care", "Mechanical Ventilation", "Clinical Education"]
    },
    {
      title: "EKG Strip Atlas — Pattern, Location & Mechanism",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 17, 2026",
      excerpt: "An interactive visual atlas mapping each EKG strip to its pattern, cardiac location, and electrophysiologic mechanism — with waveform annotations and mechanism callouts clinicians use at the bedside.",
      image: businessPost,
      slug: "ekg-strip-atlas",
      tags: ["Cardiology", "ECG", "Clinical Education"]
    },
    {
      title: "Arrhythmia Origin Atlas — Where Each One Lives",
      category: "HEALTHCARE",
      subcategory: "Clinical Education",
      date: "June 9, 2026",
      excerpt: "An interactive visual atlas mapping each major arrhythmia to its anatomic origin in the conduction system, with the ECG signatures clinicians use to recognize them.",
      image: businessPost,
      slug: "arrhythmia-origin-atlas",
      tags: ["Cardiology", "ECG", "Clinical Education"]
    },
    {
      title: "Houston Suburb & TMC Neighborhood Guide: 3BR Housing, Commute & Monthly Budget",
      category: "HEALTHCARE",
      subcategory: "Career Planning",
      date: "March 16, 2026",
      excerpt: "A full breakdown of 15 Houston suburbs and TMC-adjacent neighborhoods ranked by 3BR rent, hospital commute, yard value, and monthly budget on a single PA income.",
      image: houstonSuburbs,
      slug: "houston-suburb-guide-3br-housing-tmc-commute",
      tags: ["Relocation", "Houston", "Healthcare Careers"]
    },
    {
      title: "Phoenix Metro Suburb Guide: 3BR Housing, Hospital Commute & Neighborhood Breakdown",
      category: "HEALTHCARE",
      subcategory: "Career Planning",
      date: "March 15, 2026",
      excerpt: "A city-by-city and neighborhood-level breakdown of Phoenix, Mesa, Chandler, Scottsdale, and Glendale — ranked by 3BR rent, hospital access, ER PA salary signals, and move-ready cash on a single income.",
      image: phoenixSuburbs,
      slug: "phoenix-metro-suburb-guide-3br-housing-hospital-commute",
      tags: ["Relocation", "Phoenix", "Healthcare Careers"]
    },
    {
      title: "San Jose Suburb Guide: 3BR Housing, Hospital Commute & Move-Ready Cash",
      category: "HEALTHCARE",
      subcategory: "Career Planning",
      date: "March 15, 2026",
      excerpt: "A suburb-by-suburb comparison of 8 San Jose-area communities ranked by 3BR rent, hospital commute fit, move-ready cash, and monthly surplus on a single PA income.",
      image: sanJoseSuburbs,
      slug: "san-jose-suburb-guide-3br-housing-commute-hospital",
      tags: ["Relocation", "San Jose", "Healthcare Careers"]
    },
    {
      title: "Find PSLF-Qualifying Hospitals by City or Zip Code",
      category: "HEALTHCARE",
      subcategory: "Student Loans",
      date: "March 15, 2026",
      excerpt: "Search PSLF-qualifying hospitals and clinics across 6 markets by city, zip code, or health system. Includes government and nonprofit employer verification guidance.",
      image: pslfFinder,
      slug: "pslf-hospital-finder-by-city-zip",
      tags: ["PSLF", "Student Loans", "Healthcare Careers"]
    },
    {
      title: "Sacramento Suburb Guide: 3BR Housing, Commute & Monthly Budget for Every Orbit",
      category: "HEALTHCARE",
      subcategory: "Career Planning",
      date: "March 15, 2026",
      excerpt: "A suburb-by-suburb comparison of 12 Sacramento-area communities ranked by 3BR rent, commute time, and monthly surplus on a single PA income.",
      image: sacramentoSuburbs,
      slug: "sacramento-suburb-guide-3br-housing-commute-budget",
      tags: ["Relocation", "Sacramento", "Healthcare Careers"]
    },
    {
      title: "2-Adult Relocation Budget: 3BR House, Groceries & Move-Ready Cash by Market",
      category: "HEALTHCARE",
      subcategory: "Career Planning",
      date: "March 12, 2026",
      excerpt: "A full relocation budget comparing 3BR housing, Walmart grocery costs, monthly living expenses, and move-ready cash targets across five markets.",
      image: relocationPost,
      slug: "relocation-budget-3br-move-ready-cash",
      tags: ["Relocation", "Budgeting", "Healthcare Careers"]
    },
    {
      title: "PSLF-Qualifying Hospitals in California & Arizona: A Comprehensive Guide",
      category: "HEALTHCARE",
      subcategory: "Student Loans",
      date: "March 12, 2026",
      excerpt: "A consolidated guide to PSLF-qualifying hospitals in California and Arizona, with verification tips for government and nonprofit employers.",
      image: pslfPost,
      slug: "pslf-qualifying-hospitals-california-arizona",
      tags: ["PSLF", "Student Loans", "Healthcare Careers"]
    },
    {
      title: "The AI Bubble: Should We Be Concerned?",
      category: "TECHNOLOGY",
      subcategory: "Artificial Intelligence", 
      date: "December 15, 2025",
      excerpt: "Examining the rapid rise of AI investments and whether we're heading toward another tech bubble.",
      image: techPost,
      slug: "ai-bubble-concerns",
      tags: ["AI", "Investment", "Technology Trends"]
    },
    {
      title: "The Benefits of Seamless EHR Transfers: Improving Patient Care",
      category: "HEALTHCARE", 
      subcategory: "Health IT",
      date: "December 10, 2025",
      excerpt: "How seamless electronic health record transfers can transform patient outcomes and healthcare efficiency.",
      image: businessPost,
      slug: "seamless-ehr-transfers-benefits",
      tags: ["EHR", "Healthcare IT", "Patient Care"]
    }
  ];

  const postsToShow = filteredPosts.length > 0 ? filteredPosts : blogPosts;

  // Map each post slug to a clinical system for grouping.
  const systemBySlug: Record<string, string> = {
    // Cardiology
    "ekg-strip-atlas": "Cardiology",
    "arrhythmia-origin-atlas": "Cardiology",
    // Pulmonary & Critical Care
    "ventilator-atlas": "Pulmonary & Critical Care",
    "abg-interpreter": "Pulmonary & Critical Care",
    "resuscitation-atlas": "Pulmonary & Critical Care",
    "fluid-dynamics-atlas": "Pulmonary & Critical Care",
    // Renal
    "renal-emergency-atlas": "Renal",
    "renal-pharm-uti-atlas": "Renal",
    "electrolyte-correction-atlas": "Renal",
    // Neurology
    "neurologic-emergencies-atlas": "Neurology",
    "neuralgia-migraine-spine-atlas": "Neurology",
    // Toxicology
    "toxidrome-atlas": "Toxicology",
    // Procedures
    "reduction-field-manual": "Procedures",
    "pocus-atlas": "Procedures",
    "procedural-companions-atlas": "Procedures",
    "sedation-master-atlas": "Procedures",
    "wound-burn-abscess-atlas": "Procedures",
    // Dermatology
    "cosmetic-dermatology-atlas": "Dermatology",
    "outpatient-dermatology-atlas": "Dermatology",
    "dermatology-emergency-atlas": "Dermatology",
    // Oncology
    "cancer-classification-staging-atlas": "Oncology",
    "lung-breast-cancer-atlas": "Oncology",
    "cancer-deep-dives-vol2": "Oncology",
    "oncology-emergencies-atlas": "Oncology",
    "oncology-interventions-atlas": "Oncology",
    "oncology-side-effects-atlas": "Oncology",
    // OB/GYN
    "obgyn-emergency-atlas": "OB/GYN",
    "obgyn-atlas-vol1": "OB/GYN",
    "obgyn-atlas-vol2": "OB/GYN",
    "obgyn-atlas-vol3": "OB/GYN",
    "obgyn-atlas-vol4": "OB/GYN",
    "obgyn-atlas-vol5": "OB/GYN",
    "obgyn-atlas-vol6": "OB/GYN",
    "obgyn-atlas-vol7": "OB/GYN",
    "obgyn-atlas-vol8": "OB/GYN",
    "obgyn-atlas-vol9": "OB/GYN",
    "female-development-physiology-atlas": "OB/GYN",
    // Psychiatry
    "psychiatric-emergency-atlas": "Psychiatry",
    // Pediatrics
    "pediatric-em-atlas": "Pediatrics",
    // Infectious Disease
    "antimicrobial-atlas": "Infectious Disease",
    "sepsis-vol1-recognition-screening": "Infectious Disease",
    "sepsis-vol2-cultures-diagnostics": "Infectious Disease",
    "sepsis-vol3-hemodynamics-fluid-resuscitation": "Infectious Disease",
    "sepsis-vol4-empiric-antibiotics-source-control": "Infectious Disease",
    "sepsis-vol5-special-populations": "Infectious Disease",
    "sepsis-vol6-prevention-qi": "Infectious Disease",
    "antibiotic-indications-atlas": "Infectious Disease",
    // MSK
    "msk-neuromuscular-atlas": "Musculoskeletal",
    "msk-physical-exam-atlas": "Musculoskeletal",
    "extremity-ddx-atlas": "Musculoskeletal",
    "fracture-disposition-atlas": "Musculoskeletal",
    // Cardiology (add)
    "cardiac-labs-atlas": "Cardiology",
    "cardiology-atlas-vol1a": "Cardiology",
    "cardiology-atlas-vol1b": "Cardiology",
    "cardiology-atlas-vol4": "Cardiology",
    "cardiology-atlas-vol5": "Cardiology",
    "cardiology-atlas-vol6": "Cardiology",
    "cardiology-pharm-atlas-vol1": "Cardiology",
    "cardiology-pharm-atlas-vol2": "Cardiology",
    "cardiology-pharm-atlas-vol3": "Cardiology",
    "cardiology-physical-exam-atlas": "Cardiology",
    "cardiothoracic-surgery-atlas-vol2": "Cardiology",
    "cardiology-atlas-vol3": "Cardiology",
    "cardiothoracic-surgery-atlas-vol1": "Cardiology",
    "vascular-atlas-vol1": "Cardiology",
    "vascular-atlas-vol2": "Cardiology",
    "adult-trauma-resuscitation-atlas": "Pulmonary & Critical Care",
    // Hematology
    "hematology-hematopoiesis-atlas": "Hematology",
    "hematology-cbc-coag-labs-atlas": "Hematology",
    "hematology-coagulation-atlas": "Hematology",
    "laboratory-values-atlas": "Hematology",
    // Documentation & Medicolegal → Procedures group
    "bulletproof-note-atlas": "Procedures",
    "ed-charting-medicolegal-atlas": "Procedures",
    "surviving-the-deposition-atlas": "Procedures",
    "pediatric-bulletproof-note-atlas": "Pediatrics",
    // Analgesia
    "analgesics-atlas": "Procedures",
    "alternative-analgesics-atlas": "Procedures",
    // Endocrine → grouped with Renal (dosing / metabolic)
    "insulin-dosing-atlas": "Renal",
    // Endocrinology
    "endocrine-atlas-vol1": "Endocrinology",
    "endocrine-atlas-vol2": "Endocrinology",
    "endocrine-atlas-vol3a": "Endocrinology",
    "endocrine-atlas-vol3b": "Endocrinology",
    "endocrine-atlas-vol3c": "Endocrinology",
    "endocrine-atlas-vol4": "Endocrinology",
    "endocrine-atlas-vol5": "Endocrinology",
    "endocrine-atlas-vol6": "Endocrinology",
    // Gastroenterology
    "gi-atlas": "Gastroenterology",
    "gi-physical-exam-atlas": "Gastroenterology",
    "gi-atlas-vol6": "Gastroenterology",
    "gi-atlas-vol1": "Gastroenterology",
    "gi-atlas-vol2": "Gastroenterology",
    "gi-atlas-vol3": "Gastroenterology",
    "gi-atlas-vol4": "Gastroenterology",
    "gi-atlas-vol5": "Gastroenterology",
    "gi-atlas-vol5b": "Gastroenterology",
    "gi-emergencies-hepatology-atlas-vol1": "Gastroenterology",
    "gi-symptoms-stool-quickfacts-atlas-vol1": "Gastroenterology",
    // ENT
    "ent-atlas": "ENT",
    // Ophthalmology
    "ocular-differential-atlas-vol2b": "Ophthalmology",
    "ocular-atlas-vol1": "Ophthalmology",
    "ocular-atlas-vol2": "Ophthalmology",
    "ocular-atlas-vol3a": "Ophthalmology",
    "ocular-atlas-vol3b": "Ophthalmology",
    "ocular-atlas-vol4": "Ophthalmology",
    "ocular-atlas-vol5": "Ophthalmology",
    "ocular-atlas-vol6": "Ophthalmology",
    // Dermatology (add)
    "derm-er-rash-atlas": "Dermatology",
    // Imaging
    "chest-imaging-atlas": "Pulmonary & Critical Care",
    "neuro-imaging-atlas": "Neurology",
    "msk-extremities-imaging-atlas": "Musculoskeletal",
    "abdomen-pelvis-imaging-atlas": "Gastroenterology",
    "neck-softtissue-vascular-imaging-atlas": "ENT",
    // Off the Clock
    "reading-the-defense": "Off the Clock",
  };

  const systemOrder = [
    "Cardiology",
    "Pulmonary & Critical Care",
    "Renal",
    "Gastroenterology",
    "Endocrinology",
    "Hematology",
    "Neurology",
    "Infectious Disease",
    "Oncology",
    "Dermatology",
    "ENT",
    "Ophthalmology",
    "OB/GYN",
    "Pediatrics",
    "Psychiatry",
    "Musculoskeletal",
    "Toxicology",
    "Procedures",
    "Off the Clock",
  ];

  const systemImage: Record<string, string> = {
    "Cardiology": imgCardiology,
    "Pulmonary & Critical Care": imgPulmonary,
    "Renal": imgRenal,
    "Hematology": imgHematology,
    "Neurology": imgNeurology,
    "Infectious Disease": imgInfectious,
    "Oncology": imgOncology,
    "Dermatology": imgDermatology,
    "ENT": imgEnt,
    "Ophthalmology": imgEnt,
    "Gastroenterology": imgGi,
    "Endocrinology": imgEndo,
    "OB/GYN": imgObgynNew,
    "Pediatrics": imgPediatrics,
    "Psychiatry": imgPsychiatry,
    "Musculoskeletal": imgMsk,
    "Toxicology": imgToxicology,
    "Procedures": imgProcedures,
    "Off the Clock": imgOffTheClock,
  };

  const getSystem = (post: Post) => systemBySlug[post.slug] || post.subcategory || "Other";

  const withSystemImage = (post: Post): Post => {
    if (post.subcategory !== "Clinical Education") return post;
    const sys = getSystem(post);
    return systemImage[sys] ? { ...post, image: systemImage[sys] } : post;
  };

  const clinicalPosts = postsToShow.filter((p) => p.subcategory === "Clinical Education").map(withSystemImage);
  const otherPosts = postsToShow.filter((p) => p.subcategory !== "Clinical Education");

  const grouped: Record<string, Post[]> = {};
  clinicalPosts.forEach((p) => {
    const sys = getSystem(p);
    (grouped[sys] ||= []).push(p);
  });
  const orderedSystems = [
    ...systemOrder.filter((s) => grouped[s]?.length),
    ...Object.keys(grouped).filter((s) => !systemOrder.includes(s)).sort(),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>All Posts by Jefney Ongeri | Healthcare, Technology & Finance Blog</title>
        <meta name="description" content="Browse all blog posts by Jefney Ongeri covering healthcare careers, PSLF, relocation guides, technology trends, and professional development." />
        <meta name="keywords" content="Jefney Ongeri, blog, healthcare, technology, PSLF, relocation, physician assistant" />
        <link rel="canonical" href="https://jefneyongeri.com/posts" />
      </Helmet>
      <Header />
      <main id="main-content" className="container-blog py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            All Posts
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights on healthcare, technology, and professional development.
          </p>
        </div>

        <PageFilter
          posts={blogPosts}
          onFilteredPostsChange={setFilteredPosts}
          availableCategories={["TECHNOLOGY", "HEALTHCARE"]}
          showCategoryFilter={true}
        />

        <div className="max-w-4xl mx-auto space-y-12">
          {orderedSystems.map((system) => (
            <section key={system}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap">
                  {system}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {grouped[system].length} {grouped[system].length === 1 ? "post" : "posts"}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {grouped[system].map((post) => (
                  <BlogCard
                    key={post.slug}
                    title={post.title}
                    category={post.category}
                    date={post.date}
                    excerpt={post.excerpt}
                    image={post.image}
                    href={`/blog/${post.slug}`}
                    isSmall={false}
                  />
                ))}
              </div>
            </section>
          ))}

          {otherPosts.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap">
                  More Posts
                </h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {otherPosts.map((post) => (
                  <BlogCard
                    key={post.slug}
                    title={post.title}
                    category={post.category}
                    date={post.date}
                    excerpt={post.excerpt}
                    image={post.image}
                    href={`/blog/${post.slug}`}
                    isSmall={false}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllPosts;