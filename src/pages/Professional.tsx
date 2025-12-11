import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  TrendingUp, 
  Target, 
  BookOpen,
  Linkedin,
  Mail,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Professional = () => {
  const experiences = [
    {
      title: "Senior Financial Analyst",
      company: "Your Current Company",
      period: "2022 - Present",
      location: "Nairobi, Kenya",
      highlights: [
        "Led portfolio analysis resulting in 25% improved returns",
        "Managed $50M+ in investment assets",
        "Developed financial models for strategic decision-making"
      ]
    },
    {
      title: "Investment Associate",
      company: "Previous Company",
      period: "2019 - 2022",
      location: "Nairobi, Kenya",
      highlights: [
        "Conducted due diligence on 30+ investment opportunities",
        "Built financial projections and valuation models",
        "Supported portfolio company growth initiatives"
      ]
    },
    {
      title: "Financial Consultant",
      company: "Earlier Company",
      period: "2017 - 2019",
      location: "Nairobi, Kenya",
      highlights: [
        "Advised clients on investment strategies",
        "Performed market research and competitive analysis",
        "Developed client financial planning roadmaps"
      ]
    }
  ];

  const education = [
    {
      degree: "Master of Business Administration (MBA)",
      institution: "Your University",
      year: "2019",
      focus: "Finance & Investment Management"
    },
    {
      degree: "Bachelor of Commerce",
      institution: "Your University",
      year: "2016",
      focus: "Accounting & Finance"
    }
  ];

  const certifications = [
    "Chartered Financial Analyst (CFA) Level III Candidate",
    "Certified Public Accountant (CPA-K)",
    "Financial Modeling & Valuation Analyst (FMVA)"
  ];

  const skills = [
    "Financial Modeling", "Portfolio Management", "Investment Analysis",
    "Risk Assessment", "Strategic Planning", "Capital Markets",
    "Private Equity", "Mergers & Acquisitions", "Due Diligence",
    "Bloomberg Terminal", "Excel/VBA", "Python for Finance"
  ];

  const performanceMetrics = [
    { label: "Portfolio Returns", value: "+32%", subtitle: "5-Year Average" },
    { label: "Assets Managed", value: "$75M+", subtitle: "Peak AUM" },
    { label: "Deals Closed", value: "15+", subtitle: "Successful Transactions" },
    { label: "Client Retention", value: "95%", subtitle: "Satisfaction Rate" }
  ];

  const caseStudies = [
    {
      title: "Tech Startup Investment",
      type: "Private Equity",
      outcome: "3.2x return in 4 years",
      description: "Led the investment analysis and due diligence for a Series A funding round in a fintech startup, resulting in significant value creation."
    },
    {
      title: "Portfolio Restructuring",
      type: "Asset Management",
      outcome: "Reduced risk by 40%",
      description: "Redesigned client portfolio allocation strategy, balancing growth objectives with risk management during market volatility."
    },
    {
      title: "M&A Advisory",
      type: "Corporate Finance",
      outcome: "$25M transaction value",
      description: "Provided financial advisory services for a mid-market acquisition, including valuation, negotiation support, and deal structuring."
    }
  ];

  const insights = [
    {
      title: "Navigating Emerging Markets in 2024",
      date: "March 2024",
      excerpt: "An analysis of investment opportunities and risks in African emerging markets, with a focus on Kenya's growing tech ecosystem."
    },
    {
      title: "ESG Investing: Beyond the Buzzword",
      date: "January 2024",
      excerpt: "How environmental, social, and governance factors are reshaping portfolio management strategies in Sub-Saharan Africa."
    },
    {
      title: "The Rise of Alternative Investments",
      date: "November 2023",
      excerpt: "Exploring private credit, real estate, and infrastructure investments as portfolio diversification strategies."
    }
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
                <span className="text-4xl font-bold text-primary">JO</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Jefney Ongeri
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Financial Professional | Investment Strategist | Portfolio Manager
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Nairobi, Kenya
                </span>
              </div>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <a href="https://www.linkedin.com/in/jefney-ongeri/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-2" />
                    Connect on LinkedIn
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    Get in Touch
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="py-16 bg-card border-y border-border">
          <div className="container-blog">
            <h2 className="section-title text-center">Performance Highlights</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="text-center p-6">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {metric.value}
                  </div>
                  <div className="font-medium text-foreground">{metric.label}</div>
                  <div className="text-sm text-muted-foreground">{metric.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-16" aria-labelledby="experience-heading">
          <div className="container-blog">
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="h-6 w-6 text-primary" />
              <h2 id="experience-heading" className="section-title mb-0">Professional Experience</h2>
            </div>
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <CardTitle className="text-xl">{exp.title}</CardTitle>
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

        {/* Case Studies */}
        <section className="py-16 bg-muted/30" aria-labelledby="case-studies-heading">
          <div className="container-blog">
            <div className="flex items-center gap-3 mb-8">
              <Target className="h-6 w-6 text-primary" />
              <h2 id="case-studies-heading" className="section-title mb-0">Notable Case Studies</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {caseStudies.map((study, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">{study.type}</Badge>
                    <CardTitle className="text-lg">{study.title}</CardTitle>
                    <p className="text-primary font-semibold">{study.outcome}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{study.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="py-16" aria-labelledby="education-heading">
          <div className="container-blog">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Education */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <h2 id="education-heading" className="section-title mb-0">Education</h2>
                </div>
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <h3 className="font-bold text-foreground">{edu.degree}</h3>
                        <p className="text-muted-foreground">{edu.institution}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline">{edu.focus}</Badge>
                          <span className="text-sm text-muted-foreground">{edu.year}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <Award className="h-6 w-6 text-primary" />
                  <h2 className="section-title mb-0">Certifications</h2>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <ul className="space-y-4">
                      {certifications.map((cert, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Award className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Skills */}
        <section className="py-16 bg-muted/30" aria-labelledby="skills-heading">
          <div className="container-blog">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 id="skills-heading" className="section-title mb-0">Core Competencies</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-2 px-4">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Insights / Thought Leadership */}
        <section className="py-16" aria-labelledby="insights-heading">
          <div className="container-blog">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 id="insights-heading" className="section-title mb-0">Investment Insights</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {insights.map((insight, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-2">{insight.date}</p>
                    <h3 className="font-bold text-foreground mb-3">{insight.title}</h3>
                    <p className="text-muted-foreground text-sm">{insight.excerpt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container-blog text-center">
            <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Interested in discussing investment opportunities, financial strategies, or potential collaborations? 
              I'd love to hear from you.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button variant="secondary" size="lg" asChild>
                <a href="/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Me
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
