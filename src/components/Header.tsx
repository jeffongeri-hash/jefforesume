import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Facebook, Twitter, Instagram, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'PORTFOLIO', href: '/professional' },
    { name: 'RESUME', href: '/resume' },
    { name: 'ACCOLADES', href: '/accolades' },
    { name: 'INVESTMENTS', href: '/investments' },
    { name: 'IV STRIKE', href: '/iv-strike-selector' },
    { name: 'CA MOVE', href: '/ca-move-planner' },
    { name: 'PAYCHECK', href: '/paycheck-analyzer' },
    { name: 'SAC HEALTH', href: '/sacramento-healthcare' },
    { name: 'VACATION', href: '/vacation' },
    { name: 'BLOG', href: '/posts' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },  
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-500 ease-out",
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm" 
          : "bg-background border-b border-border"
      )}
    >
      <div className="container-blog">
        <div 
          className={cn(
            "flex items-center justify-between transition-all duration-500",
            isScrolled ? "h-16" : "h-20"
          )}
        >
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="block group">
              <h1 
                className={cn(
                  "font-bold text-foreground transition-all duration-500 font-serif",
                  isScrolled ? "text-lg" : "text-xl"
                )}
              >
                Jefney Ongeri
                <span className="text-muted-foreground transition-colors duration-300 group-hover:text-primary">, PA-C</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "nav-link transition-all duration-300",
                  isScrolled ? "text-xs" : "text-sm"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Social Links & Search */}
          <div className="hidden lg:flex items-center space-x-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <Button 
                key={label} 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "transition-all duration-300 hover:bg-primary/10 hover:text-primary",
                  isScrolled ? "h-8 w-8 p-0" : "h-9 w-9 p-0"
                )}
                asChild
              >
                <a href={href} aria-label={label}>
                  <Icon className={cn("transition-all duration-300", isScrolled ? "h-3.5 w-3.5" : "h-4 w-4")} />
                </a>
              </Button>
            ))}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "transition-all duration-300 hover:bg-primary/10 hover:text-primary",
                isScrolled ? "h-8 w-8 p-0" : "h-9 w-9 p-0"
              )}
              aria-label="Search articles"
              onClick={() => navigate('/search')}
            >
              <Search className={cn("transition-all duration-300", isScrolled ? "h-3.5 w-3.5" : "h-4 w-4")} />
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-out",
            isMenuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
          )}
        >
          <nav className="flex flex-col space-y-4 border-t border-border pt-4" role="navigation" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="mt-6 space-y-4">
            <div className="flex space-x-2 items-center">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Button key={label} variant="outline" size="sm" asChild>
                  <a href={href} aria-label={label}>
                    <Icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              aria-label="Search articles"
              onClick={() => navigate('/search')}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;