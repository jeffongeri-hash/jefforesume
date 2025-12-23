import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Quote } from 'lucide-react';

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
