import { Download, GraduationCap, Briefcase, Award, BookOpen, Stethoscope, FlaskConical } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Resume = () => {
  const education = [
    {
      degree: "Master of Science in Physician Assistant Studies",
      institution: "Your PA Program",
      year: "2025",
      details: "Graduated with honors"
    },
    {
      degree: "Bachelor of Science",
      institution: "Your Undergraduate Institution",
      year: "2022",
      details: "Pre-Medicine / Health Sciences"
    }
  ];

  const experience = [
    {
      title: "Physician Assistant",
      organization: "Emergency Department",
      period: "2025 - Present",
      description: "Providing acute care in a high-volume emergency setting, managing a wide range of patient presentations."
    },
    {
      title: "Clinical Rotations",
      organization: "Various Healthcare Settings",
      period: "2024 - 2025",
      description: "Completed rotations in Emergency Medicine, Internal Medicine, Surgery, Pediatrics, Women's Health, and Psychiatry."
    }
  ];

  const certifications = [
    "NCCPA Certified Physician Assistant (PA-C)",
    "BLS/ACLS Certified",
    "PALS Certified",
    "DEA Licensed"
  ];

  const skills = [
    "Emergency Medicine",
    "Patient Assessment",
    "Clinical Research",
    "Evidence-Based Practice",
    "Electronic Health Records",
    "Procedural Skills",
    "Patient Education",
    "Team Collaboration"
  ];

  const handleDownload = () => {
    // This will link to the uploaded CV in public folder
    const link = document.createElement('a');
    link.href = '/cv/resume.pdf';
    link.download = 'Jefney_Ongeri_PA-C_Resume.pdf';
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container-blog">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                <Stethoscope className="w-3 h-3 mr-1" />
                Curriculum Vitae
              </Badge>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                Jefney Ongeri, PA-C
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Physician Assistant | Emergency Medicine | Clinical Research
              </p>
              <Button onClick={handleDownload} size="lg" className="gap-2">
                <Download className="w-4 h-4" />
                Download CV (PDF)
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container-blog">
            <div className="max-w-4xl mx-auto space-y-12">
              
              {/* Education */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">Education</h2>
                </div>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                          <Badge variant="outline">{edu.year}</Badge>
                        </div>
                        <p className="text-primary font-medium">{edu.institution}</p>
                        <p className="text-muted-foreground text-sm mt-1">{edu.details}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Professional Experience */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">Professional Experience</h2>
                </div>
                <div className="space-y-4">
                  {experience.map((exp, index) => (
                    <Card key={index} className="border-l-4 border-l-accent">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{exp.title}</h3>
                          <Badge variant="secondary">{exp.period}</Badge>
                        </div>
                        <p className="text-primary font-medium">{exp.organization}</p>
                        <p className="text-muted-foreground text-sm mt-2">{exp.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Certifications & Licenses */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">Certifications & Licenses</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="py-2 px-4 text-sm">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Skills */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FlaskConical className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">Skills & Expertise</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="py-2 px-4">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Research placeholder */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-foreground">Research & Publications</h2>
                </div>
                <Card className="bg-muted/50">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      Research publications and details coming soon. Share your CV to populate this section.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Download CTA */}
              <div className="text-center pt-8">
                <Button onClick={handleDownload} variant="outline" size="lg" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download Full CV
                </Button>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Resume;
