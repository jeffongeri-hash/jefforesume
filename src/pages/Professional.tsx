import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WaveDivider from '@/components/WaveDivider';
import { AnimatedSection } from '@/hooks/useScrollAnimation';
import { ParallaxHero } from '@/hooks/useParallax';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  BookOpen,
  Linkedin,
  Mail,
  MapPin,
  Stethoscope,
  FlaskConical,
  Heart,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import headshot from '@/assets/headshot.jpeg';

const Professional = () => {
  const experiences = [
    {
      title: "Physician Assistant Certified",
      company: "UnityPoint Health",
      period: "Oct 2025 - Present",
      location: "Des Moines, Iowa",
      type: "clinical",
      highlights: [
        "Providing comprehensive patient care as a certified Physician Assistant",
        "Collaborating with interdisciplinary healthcare teams",
        "Utilizing advanced clinical skills in patient assessment and treatment"
      ]
    },
    {
      title: "Co-Founder and President",
      company: "Medi-Sync Applications",
      period: "Aug 2025 - Present",
      location: "United States",
      type: "leadership",
      highlights: [
        "Leading healthcare technology innovation initiatives",
        "Developing applications to improve medical practice efficiency",
        "Building cross-functional teams to deliver healthcare solutions"
      ]
    },
    {
      title: "Clinical Research Specialist",
      company: "Indiana University School of Medicine",
      period: "May 2022 - May 2023",
      location: "Indianapolis, Indiana",
      type: "research",
      highlights: [
        "Led clinical research projects with focus on pharmacogenetics",
        "Managed research protocols following Good Clinical Practice (GCP)",
        "Contributed to peer-reviewed publications in medical journals"
      ]
    },
    {
      title: "Clinical Research Technician",
      company: "Indiana University School of Medicine",
      period: "Jun 2021 - May 2022",
      location: "Indianapolis, Indiana",
      type: "research",
      highlights: [
        "Supported clinical trials and human subjects research",
        "Collected and analyzed clinical research data",
        "Ensured regulatory compliance in research protocols"
      ]
    },
    {
      title: "Virtual Summer Research Program (APSA VSRP)",
      company: "American Physician Scientists Association",
      period: "Jul 2020 - Oct 2020",
      location: "Virtual",
      type: "research",
      highlights: [
        "Selected for competitive physician scientist training program",
        "Engaged in structured research mentorship",
        "Developed foundational skills in clinical investigation"
      ]
    },
    {
      title: "SHPEP Scholar",
      company: "University of Iowa",
      period: "Jun 2019 - Jul 2019",
      location: "Iowa City, Iowa",
      type: "academic",
      highlights: [
        "Completed Summer Health Professions Education Program",
        "Received intensive pre-health professional training",
        "Strengthened foundation for career in medicine"
      ]
    }
  ];

  const education = [
    {
      degree: "Master of Physician Assistant Studies",
      institution: "Des Moines University",
      year: "Jun 2023 - Aug 2025",
      focus: "Physician Assistant Program Class of '25"
    },
    {
      degree: "Bachelor of Science in Neuroscience",
      institution: "Indiana University Bloomington",
      year: "2017 - 2021",
      focus: "Neuroscience"
    }
  ];

  const certifications = [
    { name: "Advanced Trauma Life Support (ATLS)", issuer: "American College of Surgeons" },
    { name: "Advanced Cardiovascular Life Support (ACLS)", issuer: "American Heart Association" },
    { name: "Pediatric Advanced Life Support (PALS)", issuer: "American Heart Association" },
    { name: "Certified Clinical Research Associate", issuer: "ACRP - Association of Clinical Research Professionals" },
    { name: "MRI Level 1", issuer: "Indiana University Bloomington" },
    { name: "Fundamental Neuroscience for Neuroimaging", issuer: "Johns Hopkins University - Coursera" },
    { name: "Introduction to Breast Cancer", issuer: "Yale - Coursera" },
    { name: "Sleep: Neurobiology, Medicine, and Society", issuer: "University of Michigan - Coursera" },
    { name: "COVID-19 Contact Tracing", issuer: "Johns Hopkins University - Coursera" }
  ];

  const clinicalSkills = [
    "Advanced Trauma Life Support (ATLS)",
    "Advanced Cardiac Life Support (ACLS)", 
    "Pediatric Advanced Life Support (PALS)",
    "Suturing",
    "Subcutaneous Injections",
    "Surgical Assisting",
    "Surgery"
  ];

  const specialties = [
    "Neurosurgery",
    "Dermatology",
    "Radiology",
    "Medicine",
    "Neuroscience"
  ];

  const researchSkills = [
    "Clinical Research",
    "Human Subjects Research",
    "Good Clinical Practice (GCP)",
    "Medical Coding",
    "MRI",
    "Psychology"
  ];

  const otherSkills = [
    "Team Leadership"
  ];

  const publications = [
    {
      title: "Opportunity for pharmacogenetics testing in patients with sickle cell anemia",
      journal: "Future Medicine Pharmacogenomics",
      date: "November 2022",
      description: "Investigation into the potential applications of pharmacogenetic testing to improve treatment outcomes for patients with sickle cell anemia."
    }
  ];

  const volunteerWork: { role: string; organization: string; period: string; category: string }[] = [];

  const organizations: string[] = [];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Jefney Ongeri — Professional Background | PA-C, Healthcare & Technology</title>
        <meta name="description" content="Jefney Ongeri's professional background as a Physician Assistant (PA-C) with experience in emergency medicine, clinical research, and healthcare technology." />
        <meta name="keywords" content="Jefney Ongeri, Physician Assistant, PA-C, emergency medicine, healthcare professional" />
        <link rel="canonical" href="https://jefneyongeri.com/professional" />
      </Helmet>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <ParallaxHero className="py-20 bg-gradient-to-br from-primary/20 via-primary/5 to-accent/10">
          <div className="container-blog">
            <AnimatedSection className="max-w-4xl mx-auto text-center">
              <div className="w-36 h-36 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-lg">
                <img 
                  src={headshot} 
                  alt="Jefney Ongeri - Physician Assistant" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Jefney Ongeri, PA-C
              </h1>
              <p className="text-xl text-muted-foreground mb-2">
                Physician Assistant | Clinical Researcher | Healthcare Innovator
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Des Moines University PA Program Class of '25
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Fishers, Indiana
                </span>
                <span>•</span>
                <span>500+ connections</span>
              </div>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button asChild>
                  <a href="https://www.linkedin.com/in/jefney-ongeri/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-2" />
                    Connect on LinkedIn
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="mailto:jeffongeri@gmail.com">
                    <Mail className="h-4 w-4 mr-2" />
                    jeffongeri@gmail.com
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </ParallaxHero>
        
        <WaveDivider color="fill-primary/10" className="-mb-1" flip />

        {/* Open to Opportunities Banner */}
        <section className="py-6 bg-primary/10 border-y border-primary/20">
          <div className="container-blog text-center">
            <p className="text-lg font-medium text-foreground">
              <span className="inline-flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Open to opportunities: Physician Assistant, Advanced Practice Provider, Nurse Practitioner roles
              </span>
            </p>
          </div>
        </section>

        {/* Clinical Experience Section */}
        <section className="py-16" aria-labelledby="experience-heading">
          <div className="container-blog">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-8">
                <Briefcase className="h-6 w-6 text-primary" />
                <h2 id="experience-heading" className="section-title mb-0">Clinical & Professional Experience</h2>
              </div>
            </AnimatedSection>
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <AnimatedSection key={index} delay={index * 50}>
                  <Card className={`border-l-4 ${
                    exp.type === 'clinical' ? 'border-l-green-500' :
                    exp.type === 'research' ? 'border-l-blue-500' :
                    exp.type === 'leadership' ? 'border-l-purple-500' :
                    'border-l-primary'
                  }`}>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-xl">{exp.title}</CardTitle>
                            <Badge variant="secondary" className="text-xs">
                              {exp.type === 'clinical' ? 'Clinical' :
                               exp.type === 'research' ? 'Research' :
                               exp.type === 'leadership' ? 'Leadership' : 'Academic'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground font-medium">{exp.company}</p>
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                          <div>{exp.period}</div>
                          <div>{exp.location}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {exp.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground">
                            <span className="text-primary mt-1.5">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <WaveDivider color="fill-muted/30" className="-mb-1" flip />

        {/* Education Section */}
        <section className="py-16 bg-muted/30" aria-labelledby="education-heading">
          <div className="container-blog">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="h-6 w-6 text-primary" />
                <h2 id="education-heading" className="section-title mb-0">Education</h2>
              </div>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-6">
              {education.map((edu, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <h3 className="font-bold text-foreground text-lg">{edu.degree}</h3>
                      <p className="text-muted-foreground font-medium">{edu.institution}</p>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant="outline">{edu.focus}</Badge>
                        <span className="text-sm text-muted-foreground">{edu.year}</span>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Publications Section */}
        <section className="py-16" aria-labelledby="publications-heading">
          <div className="container-blog">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-8">
                <FileText className="h-6 w-6 text-primary" />
                <h2 id="publications-heading" className="section-title mb-0">Publications</h2>
              </div>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 gap-6">
              {publications.map((pub, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <Badge variant="secondary" className="mb-3">{pub.date}</Badge>
                      <h3 className="font-bold text-foreground mb-2">{pub.title}</h3>
                      <p className="text-primary font-medium text-sm mb-3">{pub.journal}</p>
                      <p className="text-muted-foreground text-sm">{pub.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <WaveDivider color="fill-accent/10" className="-mb-1" flip />

        {/* Clinical Training Experience */}
        <section className="py-16 bg-accent/10" aria-labelledby="training-heading">
          <div className="container-blog">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-2">
                <Stethoscope className="h-6 w-6 text-primary" />
                <h2 id="training-heading" className="section-title mb-0">Clinical Training Experience</h2>
              </div>
              <p className="text-muted-foreground mb-8">Hands-on procedures and cases from clinical rotations</p>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Procedures Performed */}
              <AnimatedSection>
                <Card className="h-full border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Heart className="h-4 w-4 text-green-600" />
                      </span>
                      Procedures Performed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Sutures</span>
                        <Badge variant="secondary">20+</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Incision & Drainage</span>
                        <Badge variant="secondary">6</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Epistaxis Management</span>
                        <Badge variant="secondary">4</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Cast Placements (Fiberglass)</span>
                        <Badge variant="secondary">3</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Open Fracture Management</span>
                        <Badge variant="secondary">2</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Nursemaid's Elbow Reduction</span>
                        <Badge variant="secondary">1</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Left Anterior Shoulder Reduction</span>
                        <Badge variant="secondary">1</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Digital Disimpaction + Enema</span>
                        <Badge variant="secondary">1</Badge>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Cases Managed */}
              <AnimatedSection delay={100}>
                <Card className="h-full border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </span>
                      Cases Managed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <ul className="space-y-3">
                       <li className="flex items-center justify-between">
                         <span className="text-muted-foreground">Psychiatric / Behavioral Health</span>
                          <Badge variant="secondary">35</Badge>
                       </li>
                       <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Cardiovascular (Chest Pain, ACS, PE, STEMI/NSTEMI)</span>
                          <Badge variant="secondary">60</Badge>
                       </li>
                       <li className="flex items-center justify-between">
                         <span className="text-muted-foreground">Musculoskeletal / Trauma / Fractures / Falls</span>
                         <Badge variant="secondary">50</Badge>
                       </li>
                       <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Abdominal / GI Complaints</span>
                          <Badge variant="secondary">50</Badge>
                       </li>
                       <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Infectious Disease (UTI, Pneumonia, RSV, Influenza)</span>
                          <Badge variant="secondary">55</Badge>
                       </li>
                       <li className="flex items-center justify-between">
                         <span className="text-muted-foreground">Neurologic (Syncope, Seizure, Stroke, TBI, Headache, AMS)</span>
                         <Badge variant="secondary">30</Badge>
                       </li>
                       <li className="flex items-center justify-between">
                         <span className="text-muted-foreground">Pulmonary (COPD, Pneumothorax, Sarcoidosis)</span>
                         <Badge variant="secondary">15</Badge>
                       </li>
                       <li className="flex items-center justify-between">
                         <span className="text-muted-foreground">Genitourinary / Reproductive (Nephrolithiasis, Pelvic, Pregnancy)</span>
                         <Badge variant="secondary">20</Badge>
                       </li>
                       <li className="flex items-center justify-between">
                         <span className="text-muted-foreground">Endocrine / Metabolic (Thyroid, Electrolytes, Dehydration)</span>
                         <Badge variant="secondary">10</Badge>
                       </li>
                       <li className="flex items-center justify-between">
                         <span className="text-muted-foreground">Ophthalmologic / ENT / Dental</span>
                         <Badge variant="secondary">10</Badge>
                       </li>
                       <li className="flex items-center justify-between">
                         <span className="text-muted-foreground">Pediatric (RSV, Croup, Varicella, Fever)</span>
                         <Badge variant="secondary">12</Badge>
                       </li>
                       <li className="flex items-center justify-between">
                         <span className="text-muted-foreground">Oncology-Related (Post-Radiation, Cancer Symptoms)</span>
                         <Badge variant="secondary">8</Badge>
                       </li>
                     </ul>
                     <p className="text-xs text-muted-foreground mt-4 italic">
                       350+ total cases across 12 clinical categories. Top: Cardiopulmonary (~17%), Infectious (~16%), MSK/Trauma (~14%), GI (~14%).
                     </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>

            {/* Detailed Case Breakdown */}
            <AnimatedSection delay={200} className="mt-8">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">Case Distribution by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Cardiovascular', value: 60 },
                            { name: 'Infectious Disease', value: 55 },
                            { name: 'MSK / Trauma', value: 50 },
                            { name: 'Abdominal / GI', value: 50 },
                            { name: 'Psychiatric', value: 35 },
                            { name: 'Neurologic', value: 30 },
                            { name: 'Genitourinary', value: 20 },
                            { name: 'Pulmonary', value: 15 },
                            { name: 'Pediatric', value: 12 },
                            { name: 'Endocrine', value: 10 },
                            { name: 'ENT / Dental / Eye', value: 10 },
                            { name: 'Oncology-Related', value: 8 },
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          innerRadius={60}
                          paddingAngle={2}
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            'hsl(210, 80%, 55%)',
                            'hsl(180, 65%, 45%)',
                            'hsl(25, 85%, 55%)',
                            'hsl(340, 75%, 55%)',
                            'hsl(270, 65%, 60%)',
                            'hsl(45, 90%, 55%)',
                            'hsl(150, 60%, 45%)',
                            'hsl(200, 70%, 65%)',
                            'hsl(320, 60%, 65%)',
                            'hsl(15, 70%, 60%)',
                            'hsl(100, 55%, 50%)',
                            'hsl(240, 50%, 60%)',
                          ].map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem',
                            color: 'hsl(var(--foreground))',
                          }}
                        />
                        <Legend
                          layout="vertical"
                          align="right"
                          verticalAlign="middle"
                          wrapperStyle={{ fontSize: '0.75rem' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detailed Case Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Diagnosis</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        ["Psychiatric (SI, Agitation, Substance-Induced)", "15"],
                        ["Syncope", "10+"],
                        ["Seizures (incl. Breakthrough)", "6"],
                        ["CHF Exacerbation", "5+"],
                        ["COPD Exacerbation", "5+"],
                        ["Soft Tissue Injury / Contusion", "5"],
                        ["UTI (incl. Sepsis Physiology)", "4"],
                        ["Epistaxis Management", "4"],
                        ["Chest Pain (ACS Rule-Out / AMA)", "3"],
                        ["Gastroenteritis / Viral Illness", "3"],
                        ["Alcohol-Related Conditions", "3"],
                        ["Nephrolithiasis / Ureterolithiasis", "3"],
                        ["Urinary Retention", "3"],
                        ["Obstipation", "3"],
                        ["NSTEMI", "3"],
                        ["STEMI", "3"],
                        ["Influenza (incl. with Migraine)", "3"],
                        ["Diabetic Foot Osteomyelitis", "2"],
                        ["Intractable Vomiting", "2"],
                        ["Corneal Abrasion", "2"],
                        ["1st Trimester Bleeding", "2"],
                        ["Assault Victims", "2"],
                        ["Pneumothorax", "2"],
                        ["Aortic Aneurysm (incl. AAA)", "2"],
                        ["AMS / Delirium", "2"],
                        ["Possible Upper GI Bleed / Gastritis", "2"],
                        ["Dental Infection", "2"],
                        ["Mechanical Fall", "1"],
                        ["Ischemic Stroke", "1"],
                        ["Concussion / Mild TBI", "1"],
                        ["Cervical Spine Fracture (Odontoid)", "1"],
                        ["Orbital Fracture", "1"],
                        ["Distal Clavicle Fracture (Fall)", "1"],
                        ["Severe Anemia (Hgb 4) – GI Bleed", "1"],
                        ["Exertional Tachycardia (Mild CK Elevation)", "1"],
                        ["Exertional Ischemia (Non-ACS)", "1"],
                        ["Lumbar Radiculopathy / Sciatica", "1"],
                        ["Constipation / IBS-C Exacerbation", "1"],
                        ["Rotator Cuff Pathology", "1"],
                        ["MSK Back Pain (Post-DKA)", "1"],
                        ["Ileus / Dehydration / Sepsis Concern", "1"],
                        ["AKI with Supratherapeutic INR", "1"],
                        ["Abscess (incl. OR Case)", "1"],
                        ["RSV Bronchiolitis", "1"],
                        ["Varicella (Chickenpox)", "1"],
                        ["Uveitis vs Conjunctivitis", "1"],
                        ["Pressure Ulcer", "1"],
                        ["Pleural Effusion with Catheter (Stable)", "1"],
                        ["Droxidopa Adverse Effect (Resolved)", "1"],
                        ["Cancer-Related Pain (Metastatic)", "1"],
                        ["Chronic Wound (No Infection)", "1"],
                        ["Pneumonia + Subacute Infarcts", "1"],
                        ["Acute Bronchitis / Mild Hemoptysis", "1"],
                        ["Failure to Thrive (15+ lb Loss)", "1"],
                        ["Metabolic Acidosis", "1"],
                        ["Deep Wound Laceration (Assisted)", "1"],
                        ["Pulmonary Sarcoidosis", "1"],
                        ["Strep Anal Infection", "1"],
                        ["Osteogenesis Imperfecta", "1"],
                        ["Infected Cervical Neck Cyst (I&D)", "1"],
                        ["Bilateral Pulmonary Embolism", "1"],
                        ["Elopement (Incomplete Evaluation)", "1"],
                        ["General Abdominal Pain", "8"],
                        ["RLQ / LLQ Pain", "5"],
                        ["Epigastric Pain", "4"],
                        ["Nausea / Vomiting", "6"],
                        ["Bowel Obstruction / Volvulus Concern", "2"],
                        ["Esophagitis / Dysphagia", "2"],
                        ["GI Bleed Concern", "3"],
                        ["Shortness of Breath", "8"],
                        ["Hypertension (Symptomatic & Asymptomatic)", "6"],
                        ["Pacemaker / Cardiac Device Concerns", "2"],
                        ["Aspiration Complaints", "2"],
                        ["Pleuritic Chest / Back Pain", "3"],
                        ["Possible PE Evaluations", "4"],
                        ["Back Pain", "8"],
                        ["Neck Pain", "4"],
                        ["Extremity Pain / Swelling", "6"],
                        ["Joint Swelling (Elbow, Wrist, Hand)", "4"],
                        ["Falls", "8"],
                        ["Low-Mechanism Trauma", "5"],
                        ["MVCs", "4"],
                        ["Suspected Fractures", "6"],
                        ["Gout Flares", "2"],
                        ["Stroke / TIA", "3"],
                        ["Focal Weakness", "3"],
                        ["Headache", "6"],
                        ["Neuropathic Pain", "2"],
                        ["Dizziness / Vertigo", "4"],
                        ["Altered Mental Status", "4"],
                        ["Cellulitis", "5"],
                        ["Abscess / Paronychia", "3"],
                        ["Skin & Soft Tissue Infection", "4"],
                        ["Fever of Unclear Source", "3"],
                        ["Viral Syndromes", "4"],
                        ["Otitis Media", "2"],
                        ["URI", "5"],
                        ["Vaginal Bleeding", "3"],
                        ["Pregnancy-Related Complaints", "3"],
                        ["Pelvic Pain", "3"],
                        ["Scrotal Swelling / Pain", "2"],
                        ["Testicular Complaints", "2"],
                        ["Urinary Symptoms", "4"],
                        ["Infant URI", "3"],
                        ["Pediatric Cough / Congestion", "3"],
                        ["Concern for Croup", "2"],
                        ["Fever in Children", "4"],
                        ["Anxiety-Driven Presentations", "5"],
                        ["Recurrent ED Visits", "4"],
                        ["Social Placement Concerns", "3"],
                        ["Capacity Evaluations", "2"],
                        ["AMA Departures", "3"],
                        ["Refusal of Recommended Care", "2"],
                        ["Thyroid-Related Symptoms", "2"],
                        ["Electrolyte Abnormalities", "3"],
                        ["Dehydration", "3"],
                        ["Medication Non-Adherence Effects", "2"],
                        ["Post-Radiation Pain", "2"],
                        ["Cancer-Related Symptoms", "3"],
                        ["Incidental Oncologic Findings (Follow-Up)", "2"],
                      ].map(([diagnosis, count], i) => (
                        <TableRow key={i}>
                          <TableCell className="text-muted-foreground">{diagnosis}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary">{count}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        <WaveDivider color="fill-muted/30" className="-mb-1" flip />

        {/* Clinical Skills & Specialties */}
        <section className="py-16 bg-muted/30" aria-labelledby="skills-heading">
          <div className="container-blog">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-8">
                <Stethoscope className="h-6 w-6 text-primary" />
                <h2 id="skills-heading" className="section-title mb-0">Clinical Skills & Expertise</h2>
              </div>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatedSection>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Life Support & Emergency
                </h3>
                <div className="flex flex-wrap gap-2">
                  {clinicalSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection delay={100}>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-blue-500" />
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection delay={200}>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-green-500" />
                  Research
                </h3>
                <div className="flex flex-wrap gap-2">
                  {researchSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection delay={300}>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-purple-500" />
                  Leadership
                </h3>
                <div className="flex flex-wrap gap-2">
                  {otherSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16" aria-labelledby="certifications-heading">
          <div className="container-blog">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-8">
                <Award className="h-6 w-6 text-primary" />
                <h2 id="certifications-heading" className="section-title mb-0">Certifications</h2>
              </div>
            </AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert, index) => (
                <AnimatedSection key={index} delay={(index % 3) * 50}>
                  <Card className="hover:shadow-sm transition-shadow">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start gap-3">
                        <Award className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-foreground text-sm">{cert.name}</p>
                          <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>


        {/* Volunteer & Organizations - Only show if there's content */}
        {(volunteerWork.length > 0 || organizations.length > 0) && (
          <>
            <Separator />
            <section className="py-16 bg-muted/30" aria-labelledby="volunteer-heading">
              <div className="container-blog">
                <div className="grid md:grid-cols-2 gap-12">
                  {volunteerWork.length > 0 && (
                    <AnimatedSection>
                      <div className="flex items-center gap-3 mb-8">
                        <Heart className="h-6 w-6 text-primary" />
                        <h2 id="volunteer-heading" className="section-title mb-0">Volunteer Experience</h2>
                      </div>
                      <div className="space-y-4">
                        {volunteerWork.map((vol, index) => (
                          <Card key={index}>
                            <CardContent className="pt-4 pb-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-foreground">{vol.role}</p>
                                  <p className="text-muted-foreground">{vol.organization}</p>
                                  <Badge variant="outline" className="mt-2 text-xs">{vol.category}</Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">{vol.period}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AnimatedSection>
                  )}

                  {organizations.length > 0 && (
                    <AnimatedSection delay={150}>
                      <div className="flex items-center gap-3 mb-8">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <h2 className="section-title mb-0">Organizations</h2>
                      </div>
                      <Card>
                        <CardContent className="pt-6">
                          <ul className="space-y-4">
                            {organizations.map((org, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-foreground">{org}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container-blog text-center">
            <AnimatedSection>
              <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
              <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Interested in discussing clinical opportunities, research collaborations, or healthcare innovation? 
                I'd love to hear from you.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button variant="secondary" size="lg" asChild>
                  <a href="mailto:jeffongeri@gmail.com">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Me
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <a href="https://www.linkedin.com/in/jefney-ongeri/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn Profile
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Professional;
