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
    }
  ];

  return (
    <div className="min-h-screen bg-background">
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
                <div className="text-6xl font-bold text-foreground mb-2">
                  3 of 4
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  Patients Rated 9/10 or Higher
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>50% of reviews received a perfect 10/10 rating</span>
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
