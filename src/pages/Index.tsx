import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Stethoscope, TrendingUp, BookOpen, Linkedin, Mail } from 'lucide-react';
import profileHeadshot from '@/assets/profile-headshot.png';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.15),transparent_50%)]" />
          <div className="container-blog relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full text-secondary text-sm font-medium">
                  <Stethoscope className="h-4 w-4" />
                  Physician Assistant | Clinical Researcher
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Jefney Ongeri<span className="text-secondary">, PA-C</span>
                </h1>
                <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-lg">
                  Healthcare professional passionate about patient care, clinical research, and building innovative solutions for modern medicine.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button size="lg" variant="secondary" asChild>
                    <Link to="/professional">
                      View Portfolio
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                    <Link to="/investments">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Investments
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-full blur-2xl" />
                  <img 
                    src={profileHeadshot} 
                    alt="Jefney Ongeri - Physician Assistant" 
                    className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover ring-4 ring-secondary/50 shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="py-20 bg-background">
          <div className="container-blog">
            <div className="grid md:grid-cols-3 gap-8">
              <Link to="/professional" className="group">
                <div className="p-8 bg-card border border-border rounded-lg hover:border-secondary hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                    <Stethoscope className="h-6 w-6 text-primary group-hover:text-secondary transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Professional Portfolio</h3>
                  <p className="text-muted-foreground">Clinical experience, education, certifications, and publications.</p>
                </div>
              </Link>
              
              <Link to="/investments" className="group">
                <div className="p-8 bg-card border border-border rounded-lg hover:border-secondary hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                    <TrendingUp className="h-6 w-6 text-primary group-hover:text-secondary transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Investment Portfolio</h3>
                  <p className="text-muted-foreground">Current holdings, trade history, and investment insights.</p>
                </div>
              </Link>
              
              <Link to="/posts" className="group">
                <div className="p-8 bg-card border border-border rounded-lg hover:border-secondary hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                    <BookOpen className="h-6 w-6 text-primary group-hover:text-secondary transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Blog & Insights</h3>
                  <p className="text-muted-foreground">Thoughts on medicine, healthcare, and professional development.</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* About Preview Section */}
        <section className="py-20 bg-muted/30">
          <div className="container-blog">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">About Me</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                I'm a certified Physician Assistant with a passion for patient-centered care and clinical research. 
                With a background in neuroscience and experience at leading healthcare institutions, I bring a 
                unique perspective to medicine. I'm also the co-founder of Medi-Sync Applications, working to 
                innovate healthcare technology solutions.
              </p>
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
                    Get in Touch
                  </a>
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

export default Index;
