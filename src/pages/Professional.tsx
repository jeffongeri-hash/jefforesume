import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
      title: "Research Assistant",
      company: "Indiana University Bloomington",
      period: "Aug 2019 - Jul 2020",
      location: "Bloomington, Indiana",
      type: "research",
      highlights: [
        "Conducted research under Dr. Sharlene Newman",
        "Studied relationship between toy block play and spatial/cognitive development",
        "Co-authored publication in Mathematical Thinking and Learning Journal"
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
    { name: "Bloomberg Terminal License", issuer: "Bloomberg LP" },
    { name: "MRI Level 1", issuer: "Indiana University Bloomington" },
    { name: "Fundamental Neuroscience for Neuroimaging", issuer: "Johns Hopkins University - Coursera" },
    { name: "Introduction to Breast Cancer", issuer: "Yale - Coursera" },
    { name: "Sleep: Neurobiology, Medicine, and Society", issuer: "University of Michigan - Coursera" },
    { name: "COVID-19 Contact Tracing", issuer: "Johns Hopkins University - Coursera" },
    { name: "Introduction to Programming Using HTML and CSS", issuer: "Sololearn" },
    { name: "Python for Finance", issuer: "Sololearn" }
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
    "Team Leadership",
    "Customer Service",
    "Retail"
  ];

  const publications = [
    {
      title: "Spatial training using game play in preschoolers improves computational skills",
      journal: "Mathematical Thinking and Learning Journal",
      date: "August 2021",
      description: "Research examining the relationship between spatial training through game play and the development of computational skills in preschool-aged children."
    },
    {
      title: "Opportunity for pharmacogenetics testing in patients with sickle cell anemia",
      journal: "Future Medicine Pharmacogenomics",
      date: "November 2022",
      description: "Investigation into the potential applications of pharmacogenetic testing to improve treatment outcomes for patients with sickle cell anemia."
    }
  ];

  const volunteerWork = [
    {
      role: "Member",
      organization: "Honors Bloomington Outreach",
      period: "Jan 2020 - Present",
      category: "Social Services"
    },
    {
      role: "Member",
      organization: "Hutton Bloomington Outreach",
      period: "Jan 2020 - Present",
      category: "Social Services"
    },
    {
      role: "OEM Ambassador",
      organization: "Office of Enrollment Management",
      period: "Aug 2018 - Present",
      category: "Education"
    }
  ];

  const organizations = [
    "Intercollegiate Neuroscience Research Journal Club",
    "Hoosier Scholar Ambassadors"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-accent/20">
          <div className="container-blog">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                <Stethoscope className="h-16 w-16 text-primary" />
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
            </div>
          </div>
        </section>

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
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="h-6 w-6 text-primary" />
              <h2 id="experience-heading" className="section-title mb-0">Clinical & Professional Experience</h2>
            </div>
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <Card key={index} className={`border-l-4 ${
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
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Education Section */}
        <section className="py-16 bg-muted/30" aria-labelledby="education-heading">
          <div className="container-blog">
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h2 id="education-heading" className="section-title mb-0">Education</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {education.map((edu, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-foreground text-lg">{edu.degree}</h3>
                    <p className="text-muted-foreground font-medium">{edu.institution}</p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline">{edu.focus}</Badge>
                      <span className="text-sm text-muted-foreground">{edu.year}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Publications Section */}
        <section className="py-16" aria-labelledby="publications-heading">
          <div className="container-blog">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="h-6 w-6 text-primary" />
              <h2 id="publications-heading" className="section-title mb-0">Publications</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {publications.map((pub, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <Badge variant="secondary" className="mb-3">{pub.date}</Badge>
                    <h3 className="font-bold text-foreground mb-2">{pub.title}</h3>
                    <p className="text-primary font-medium text-sm mb-3">{pub.journal}</p>
                    <p className="text-muted-foreground text-sm">{pub.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Clinical Skills & Specialties */}
        <section className="py-16 bg-muted/30" aria-labelledby="skills-heading">
          <div className="container-blog">
            <div className="flex items-center gap-3 mb-8">
              <Stethoscope className="h-6 w-6 text-primary" />
              <h2 id="skills-heading" className="section-title mb-0">Clinical Skills & Expertise</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
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
              </div>

              <div>
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
              </div>

              <div>
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
              </div>

              <div>
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
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16" aria-labelledby="certifications-heading">
          <div className="container-blog">
            <div className="flex items-center gap-3 mb-8">
              <Award className="h-6 w-6 text-primary" />
              <h2 id="certifications-heading" className="section-title mb-0">Certifications</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert, index) => (
                <Card key={index} className="hover:shadow-sm transition-shadow">
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
              ))}
            </div>
          </div>
        </section>

        <Separator />

        {/* Volunteer & Organizations */}
        <section className="py-16 bg-muted/30" aria-labelledby="volunteer-heading">
          <div className="container-blog">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
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
              </div>

              <div>
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
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container-blog text-center">
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Professional;
