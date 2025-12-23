import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main id="main-content" className="container-blog py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
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
        </section>

        {/* Patient Satisfaction Score */}
        <section className="mb-16">
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
        </section>

        {/* Testimonials Grid */}
        <section className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {testimonials.map((item, index) => (
            <Card key={index} className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                <Badge variant="outline" className="mb-4">
                  {item.type}
                </Badge>
                <blockquote className="text-lg md:text-xl text-foreground italic leading-relaxed">
                  "{item.quote}"
                </blockquote>
              </CardContent>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-secondary/50" />
            </Card>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Accolades;
