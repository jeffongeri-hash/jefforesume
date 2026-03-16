import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WaveDivider from '@/components/WaveDivider';
import { AnimatedSection } from '@/hooks/useScrollAnimation';
import { ParallaxHero } from '@/hooks/useParallax';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Quote, Star, TrendingUp } from 'lucide-react';

const Accolades = () => {
  const testimonials = [
    {
      quote: "The physician's assistant was absolutely amazing. His calm and knowledgeable demeanor was comforting.",
      type: "Patient Testimony"
    },
    {
      quote: "The young physician assistant's was extremely thorough.",
      type: "FOCUS Award"
    },
    {
      quote: "Despite a long wait, once I was seen, the young PA took his time and was incredibly detailed in his examination and explanations.",
      type: "Emergency Dept",
      score: "10/10 - Extremely likely"
    },
    {
      quote: "Very professional. Very concerned about my welfare.",
      type: "WLA Emergency Dept",
      score: "10/10 - Extremely likely"
    },
    {
      quote: "Excellent care. Explained symptoms and treatment.",
      type: "WLA Emergency Dept",
      score: "10/10 - Extremely likely"
    },
    {
      quote: "Very good experience considering my condition. I was very impressed with timely and thoughtful care given.",
      type: "WLA Emergency Dept",
      score: "9/10"
    },
    {
      quote: "Great experience.",
      type: "WLA Emergency Dept",
      score: "10/10 - Extremely likely"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Jefney Ongeri — Accolades | Patient Testimonials & Recognition</title>
        <meta name="description" content="Patient testimonials and professional recognition for Jefney Ongeri, PA-C — reflecting a commitment to compassionate, thorough emergency care." />
        <meta name="keywords" content="Jefney Ongeri, accolades, patient testimonials, PA-C recognition, healthcare awards" />
        <link rel="canonical" href="https://jefneyongeri.com/accolades" />
      </Helmet>
      <Header />
      
      <main id="main-content">
        {/* Hero Section */}
        <ParallaxHero className="text-center py-16 bg-gradient-to-br from-primary/15 via-primary/5 to-accent/10">
          <div className="container-blog">
            <AnimatedSection>
              <Badge variant="secondary" className="mb-4">
                <Award className="w-4 h-4 mr-2" />
                Recognition & Testimonials
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Accolades
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Patient feedback and professional recognition that reflect my commitment to compassionate, thorough care.
              </p>
            </AnimatedSection>
          </div>
        </ParallaxHero>
        
        <WaveDivider color="fill-background" className="-mt-1" />

        <div className="container-blog py-16">
          {/* Patient Satisfaction Score */}
          <AnimatedSection className="mb-16">
            <Card className="max-w-2xl mx-auto border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-8 h-8 ${i < 4 ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`} />
                  ))}
                </div>
                <div className="text-6xl font-bold text-primary mb-2">
                  78.6
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  NPS Score — Based on 14 Patient Returns
                </p>
                <p className="text-sm text-muted-foreground mb-4 italic">
                  March 2025 – February 2026
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">64.3%</div>
                    <div className="text-muted-foreground">Scored 10/10</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">85.7%</div>
                    <div className="text-muted-foreground">Scored 9+</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>92.8% of patients rated 8 or higher</span>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* Testimonials Grid */}
          <section className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {testimonials.map((item, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm h-full">
                  <CardContent className="p-8">
                    <Quote className="w-10 h-10 text-primary/20 mb-4" />
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">
                        {item.type}
                      </Badge>
                      {item.score && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          <Star className="w-3 h-3 mr-1 fill-primary" />
                          {item.score}
                        </Badge>
                      )}
                    </div>
                    <blockquote className="text-lg md:text-xl text-foreground italic leading-relaxed">
                      "{item.quote}"
                    </blockquote>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-accent/50" />
                </Card>
              </AnimatedSection>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Accolades;
