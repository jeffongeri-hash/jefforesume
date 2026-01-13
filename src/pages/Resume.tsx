import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Award, 
  FileText,
  Download,
  Stethoscope,
  FlaskConical,
  BookOpen,
  Users
} from 'lucide-react';

const Resume = () => {
  const education = [
    {
      degree: 'Master of Science in Physician Assistant Studies (MSPAS)',
      institution: 'Des Moines University Medicine and Health Sciences',
      location: 'West Des Moines, IA',
      date: 'Anticipated Graduation: August 2025',
    },
    {
      degree: 'Bachelor of Science in Neuroscience',
      institution: 'Indiana University',
      location: 'Bloomington, IN',
      date: 'May 2021',
      minor: 'Psychology',
    },
  ];

  const clinicalRotations = [
    'Primary Care - Palos Heights, IL',
    'Internal Medicine - Palos Heights, IL',
    'Pediatric Physical Medicine and Rehabilitation - Johnston, IA',
    'Pediatrics - Indianola, IA',
    "Women's Health - Nevada, IA",
    'Dermatology - West Des Moines, IA',
    'Surgery - Minneapolis, MN',
    'Behavioral and Mental Health - Des Moines, IA',
    'Family Medicine - Adel, IA | Ankeny, IA',
    'Emergency Medicine - Des Moines, IA',
    'Internal Medicine - Des Moines, IA',
    'Hematology/Oncology (MD Anderson) - Houston, TX',
  ];

  const researchExperience = [
    {
      title: 'Clinical Pharmacology Research',
      location: 'Indianapolis, IN',
      date: 'December 2021 – April 2022',
      role: 'Research Assistant Intern',
      supervisor: 'Emma Tillman, Ph.D.',
      description: 'Inquired the opportunity to incorporate pharmacogenomics testing for individuals with sickle cell anemia.',
    },
    {
      title: 'Lab of Social Neuroscience',
      location: 'Bloomington, IN',
      date: 'August 2020 – May 2021',
      role: 'Research Assistant Intern',
      supervisor: 'Aina Puce, Ph.D.',
      description: 'Analyzed the Functional Connectivity Detection in Resting-State MEG/EEG Data. Determined if there was a clear distinction in systolic and diastolic influence in resting-state neurophysiological activity. Discovered that systolic cardiac phase has an overall bigger influence on resting state brain activity.',
    },
    {
      title: 'American Physician Scientists Association',
      location: 'Philadelphia, PA',
      date: 'July 2020 – August 2020',
      role: 'Research Assistant Intern',
      supervisor: 'Mathew Kayser, M.D, Ph.D.',
      description: 'Analyzed GAL4/UAS lines present in Drosophila larvae to determine which neuronal populations have an influence on sleep wake circuit.',
    },
    {
      title: 'Spatial Intelligence Research',
      location: 'Bloomington, IN',
      date: 'August 2019 – May 2020',
      role: 'Research Assistant Intern',
      supervisor: 'Sharlene Newman, Ph.D.',
      description: 'Analyzed the effects of playing with blocks on the development in spatial intelligence and arithmetic cognition in children.',
    },
  ];

  const certifications = [
    { name: 'Basic Life Support (BLS) Training', date: '2023 to present' },
    { name: 'Advanced Cardiac Life Support (ACLS) Training', date: '2023 to present' },
    { name: 'Certified Clinical Research Associate Certification', date: '2023 to present' },
  ];

  const publications = [
    {
      citation: 'Gallaway K., Sakon C., Ongeri J, Patel K., Oliver J., Patacca H, O\'Brien A., Skaar T., and Tillman E., (2022) Opportunity for pharmacogenetics testing in patients with sickle cell anemia. Pharmacogenomics.',
      link: 'https://doi.org/10.2217/pgs-2022-0115',
    },
    {
      citation: 'Newman S., Loughery E., Ecklund A., Smothers M., Ongeri J. (2020). Spatial training using game play in preschoolers improves computational skills. Mathematical Thinking and Learning.',
      link: 'https://doi.org/10.1080/10986065.2021.1969866',
    },
  ];

  const presentations = [
    'Jefney Ongeri, Milan Szuperak, Matthew Kayser, "Identification of sleep-wake circuits in Drosophila larvae", Presented at "APSA South Regional Symposium." October, 2020.',
  ];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Jefney_Ongeri_Resume.docx';
    link.download = 'Jefney_Ongeri_Resume.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container-blog py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Jefney Ongeri
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            Accountable and seeking team collaboration in healthcare. Empathetic and a fast learner. 
            Dedicated to a lifelong journey of education within medicine and the Physician Assistant profession.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            jeffongeri@gmail.com | 317-435-3165 | Fishers, IN
          </p>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download Resume
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="border-l-2 border-primary/30 pl-4">
                  <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                  <p className="text-muted-foreground">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground">{edu.location}</p>
                  <p className="text-sm text-muted-foreground">{edu.date}</p>
                  {edu.minor && (
                    <Badge variant="outline" className="mt-2">Minor: {edu.minor}</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Clinical Rotations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Clinical Rotation Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {clinicalRotations.map((rotation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{rotation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Research Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-primary" />
                Research Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {researchExperience.map((research, index) => (
                <div key={index} className="border-l-2 border-secondary/30 pl-4">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{research.title}</h3>
                    <Badge variant="secondary">{research.date}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{research.role}, {research.supervisor}</p>
                  <p className="text-sm text-muted-foreground">{research.location}</p>
                  <p className="mt-2 text-muted-foreground">{research.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Certifications & Licensure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-foreground">{cert.name}</span>
                    <Badge variant="outline">{cert.date}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Publications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Publications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {publications.map((pub, index) => (
                <div key={index} className="border-l-2 border-primary/30 pl-4">
                  <p className="text-muted-foreground">{pub.citation}</p>
                  <a 
                    href={pub.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {pub.link}
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Presentations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Presentations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {presentations.map((presentation, index) => (
                <p key={index} className="text-muted-foreground">{presentation}</p>
              ))}
            </CardContent>
          </Card>

          {/* Volunteer Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Volunteer Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-foreground">Boys Reaching for Opportunities in Science</span>
                <Badge variant="outline">2024</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Resume;
