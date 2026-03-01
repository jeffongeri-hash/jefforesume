import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border" role="contentinfo">
      <div className="container-blog py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">Jefney Ongeri<span className="text-secondary">, PA-C</span></h2>
            <p className="text-sm text-muted-foreground">
              Physician Assistant, Clinical Researcher, and Healthcare Innovator sharing insights on medicine, research, and professional development.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Navigate</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/professional" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Portfolio</Link></li>
              <li><Link to="/investments" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Investments</Link></li>
              <li><Link to="/posts" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Blog</Link></li>
            </ul>
          </div>
          
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">About</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Contact</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Privacy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">Terms</Link></li>
              </ul>
            </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Connect</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <a href="https://www.linkedin.com/in/jefney-ongeri/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                LinkedIn
              </a>
              <a href="mailto:jeffongeri@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                Email
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © <Link to="/freedom-countdown" className="text-muted-foreground hover:text-muted-foreground no-underline cursor-text">{new Date().getFullYear()}</Link> Jefney Ongeri, PA-C. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;