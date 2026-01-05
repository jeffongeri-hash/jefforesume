import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WaveDivider from '@/components/WaveDivider';
import FloatingShapes from '@/components/FloatingShapes';
import GlassCard from '@/components/GlassCard';
import ParallaxShapes from '@/components/ParallaxShapes';
import { AnimatedSection } from '@/hooks/useScrollAnimation';
import { ParallaxHero } from '@/hooks/useParallax';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Stethoscope, TrendingUp, BookOpen, Linkedin, Mail, ArrowRight } from 'lucide-react';
import headshot from '@/assets/headshot.jpeg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <ParallaxHero className="py-20 md:py-32 bg-gradient-to-br from-primary/90 via-primary/70 to-accent/50 relative overflow-hidden">
          <FloatingShapes />
          <div className="container-blog relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <AnimatedSection className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm bg-background/20 dark:bg-secondary/20 rounded-full text-foreground dark:text-secondary text-sm font-medium border border-background/30">
                  <Stethoscope className="h-4 w-4" />
                  Physician Assistant | Clinical Researcher
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-serif">
                  <span className="bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-[length:200%_auto] animate-gradient-shift bg-clip-text text-transparent drop-shadow-lg dark:from-white dark:via-amber-100 dark:to-orange-200">
                    Jefney Ongeri
                  </span>
                  <span className="text-white/90 drop-shadow-md dark:text-white/90">, PA-C</span>
                </h1>
                <p className="text-xl text-muted-foreground dark:text-primary-foreground/80 leading-relaxed max-w-lg">
                  Healthcare professional passionate about patient care, clinical research, and building innovative solutions for modern medicine.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button size="lg" variant="secondary" className="btn-shimmer group" asChild>
                    <Link to="/professional">
                      View Portfolio
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-foreground/30 text-foreground hover:bg-foreground/10 dark:border-primary-foreground/30 dark:text-primary-foreground dark:hover:bg-primary-foreground/10 transition-all duration-300" asChild>
                    <Link to="/investments">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Investments
                    </Link>
                  </Button>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={200} className="flex justify-center lg:justify-end">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-full blur-2xl transition-all duration-500 group-hover:from-secondary/40 group-hover:to-accent/20" />
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary/50 to-accent/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img 
                    src={headshot} 
                    alt="Jefney Ongeri - Physician Assistant" 
                    className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover ring-4 ring-secondary/50 shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </ParallaxHero>
        
        <WaveDivider color="fill-background" className="-mt-1" />

        {/* Quick Links Section */}
        <section className="py-20 bg-background relative">
          <div className="container-blog">
            <div className="grid md:grid-cols-3 gap-8">
              <AnimatedSection>
                <Link to="/professional" className="group block h-full">
                  <GlassCard className="p-8 h-full">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <Stethoscope className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 font-serif group-hover:text-primary transition-colors duration-300">Professional Portfolio</h3>
                    <p className="text-muted-foreground">Clinical experience, education, certifications, and publications.</p>
                    <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium">Learn more</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </GlassCard>
                </Link>
              </AnimatedSection>
              
              <AnimatedSection delay={100}>
                <Link to="/investments" className="group block h-full">
                  <GlassCard className="p-8 h-full">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 font-serif group-hover:text-primary transition-colors duration-300">Investment Portfolio</h3>
                    <p className="text-muted-foreground">Current holdings, trade history, and investment insights.</p>
                    <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium">View portfolio</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </GlassCard>
                </Link>
              </AnimatedSection>
              
              <AnimatedSection delay={200}>
                <Link to="/posts" className="group block h-full">
                  <GlassCard className="p-8 h-full">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 font-serif group-hover:text-primary transition-colors duration-300">Blog & Insights</h3>
                    <p className="text-muted-foreground">Thoughts on medicine, healthcare, and professional development.</p>
                    <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium">Read articles</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </GlassCard>
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </section>

        <WaveDivider color="fill-muted/30" className="-mb-1" flip />
        
        {/* About Preview Section */}
        <section className="py-20 bg-muted/30 relative overflow-hidden">
          <ParallaxShapes />
          <div className="container-blog relative z-10">
            <AnimatedSection className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-serif">About Me</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                I'm a certified Physician Assistant with a passion for patient-centered care and clinical research. 
                With a background in neuroscience and experience at leading healthcare institutions, I bring a 
                unique perspective to medicine. I'm also the co-founder of Medi-Sync Applications, working to 
                innovate healthcare technology solutions.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button className="btn-shimmer group" asChild>
                  <a href="https://www.linkedin.com/in/jefney-ongeri/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-2" />
                    Connect on LinkedIn
                    <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </a>
                </Button>
                <Button variant="outline" className="transition-all duration-300 hover:-translate-y-0.5" asChild>
                  <a href="mailto:jeffongeri@gmail.com">
                    <Mail className="h-4 w-4 mr-2" />
                    Get in Touch
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

export default Index;
