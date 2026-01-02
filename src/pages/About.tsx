import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Mail, MapPin, GraduationCap, Stethoscope, FlaskConical, Heart } from 'lucide-react';
import profileHeadshot from '@/assets/profile-headshot.png';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main id="main-content" className="container-blog py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About Me
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Physician Assistant | Emergency Medicine | Researcher
            </p>
          </div>

          {/* Hero Section with Photo */}
          <div className="mb-16">
            <div className="aspect-video rounded-lg bg-muted mb-8 flex items-center justify-center overflow-hidden">
              <img 
                src={profileHeadshot} 
                alt="Jefney Ongeri" 
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* About Content */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">My Journey</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  I'm Jefney Ongeri, a Physician Assistant who graduated in July 2025 with a 
                  passion for emergency medicine. My journey into healthcare was driven by a 
                  deep desire to make a meaningful impact in patients' lives during their most 
                  critical moments.
                </p>
                <p>
                  Throughout my training, I discovered that emergency medicine offers the unique 
                  opportunity to provide immediate, life-changing care across a diverse range of 
                  conditions. The fast-paced environment and the ability to help patients from 
                  all walks of life continues to inspire my dedication to this specialty.
                </p>
                <p>
                  Beyond clinical practice, I'm committed to advancing emergency medicine through 
                  research. I believe that evidence-based practice is essential for improving 
                  patient outcomes and pushing the boundaries of what's possible in acute care.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Areas of Focus</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Stethoscope className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Emergency Medicine</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FlaskConical className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Clinical Research</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Patient-Centered Care</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Evidence-Based Practice</span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-foreground mb-4">At a Glance</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">PA Graduate, Class of 2025</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Emergency Medicine Focus</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FlaskConical className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Research-Driven Approach</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-muted p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Let's Connect
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Whether you're interested in discussing emergency medicine, research collaborations, 
              or simply want to connect, I'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/contact">Get in Touch</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/professional">View Experience</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;