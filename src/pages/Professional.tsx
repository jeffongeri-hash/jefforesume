import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WaveDivider from '@/components/WaveDivider';
import { AnimatedSection } from '@/hooks/useScrollAnimation';
import { ParallaxHero } from '@/hooks/useParallax';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
              <p className="text-muted-foreground mb-8">Hands-on procedures and cases from 2 months of clinical rotations</p>
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
                        <Badge variant="secondary">10+</Badge>
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
                        <span className="text-muted-foreground">Syncope</span>
                        <Badge variant="secondary">10+</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">CHF Exacerbation</span>
                        <Badge variant="secondary">5+</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">COPD Exacerbation</span>
                        <Badge variant="secondary">5+</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Seizures</span>
                        <Badge variant="secondary">5</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">STEMI</span>
                        <Badge variant="secondary">3</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Pneumothorax</span>
                        <Badge variant="secondary">2</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Aortic Aneurysm (incl. AAA)</span>
                        <Badge variant="secondary">2</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Bilateral Pulmonary Embolism</span>
                        <Badge variant="secondary">1</Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">NSTEMI</span>
                        <Badge variant="secondary">1</Badge>
                      </li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-4 italic">
                      Plus multiple cases of benign chest pain, dizziness, and abdominal pain
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
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
