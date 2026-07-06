import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Facebook, Twitter, Instagram, Menu, X, User, FileText, Award, TrendingUp, Calculator, MapPin, Plane, BookOpen, DollarSign, Stethoscope } from 'lucide-react';
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
    { name: 'COVERED CALL', href: '/covered-call-master' },
    { name: 'CA MOVE', href: '/ca-move-planner' },
    { name: 'PAYCHECK', href: '/paycheck-analyzer' },
    { name: 'SAC HEALTH', href: '/sacramento-healthcare' },
    { name: 'VACATION', href: '/vacation' },
    { name: 'BLOG', href: '/posts' },
  ];

  const mobileNavGroups = [
    {
      label: 'About',
      items: [
        { name: 'Portfolio', href: '/professional', icon: User, desc: 'Professional overview' },
        { name: 'Resume', href: '/resume', icon: FileText, desc: 'CV and experience' },
        { name: 'Accolades', href: '/accolades', icon: Award, desc: 'Awards and metrics' },
      ],
    },
    {
      label: 'Investments',
      items: [
        { name: 'Portfolio', href: '/investments', icon: TrendingUp, desc: 'Holdings and thesis' },
        { name: 'IV Strike', href: '/iv-strike-selector', icon: Calculator, desc: 'Options strike selector' },
        { name: 'Covered Call', href: '/covered-call-master', icon: DollarSign, desc: 'Covered call planner' },
      ],
    },
    {
      label: 'Career Tools',
      items: [
        { name: 'CA Move Planner', href: '/ca-move-planner', icon: MapPin, desc: 'Relocation modeling' },
        { name: 'Paycheck Analyzer', href: '/paycheck-analyzer', icon: Calculator, desc: 'Take-home breakdown' },
        { name: 'Sacramento Health', href: '/sacramento-healthcare', icon: Stethoscope, desc: 'Hospital hub' },
        { name: 'Vacation', href: '/vacation', icon: Plane, desc: 'Trip planning' },
      ],
    },
    {
      label: 'Writing',
      items: [
        { name: 'All Blog Posts', href: '/posts', icon: BookOpen, desc: 'Clinical & career atlases' },
      ],
    },
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
            "lg:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-out",
            isMenuOpen ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="border-t border-border/60 max-h-[80vh] overflow-y-auto pb-6 pt-5 -mx-4 px-4">
            <div className="mb-5">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/search');
                }}
                className="w-full flex items-center gap-3 rounded-xl border border-border bg-muted/40 hover:bg-muted transition-colors px-4 py-3 text-sm text-muted-foreground"
                aria-label="Search articles"
              >
                <Search className="h-4 w-4" />
                <span>Search posts, tools, atlases…</span>
              </button>
            </div>

            <nav className="space-y-6" role="navigation" aria-label="Mobile navigation">
              {mobileNavGroups.map((group) => (
                <div key={group.label}>
                  <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                    {group.label}
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-card/40 divide-y divide-border/50 overflow-hidden">
                    {group.items.map(({ name, href, icon: Icon, desc }) => (
                      <Link
                        key={name}
                        to={href}
                        onClick={() => setIsMenuOpen(false)}
                        className="group flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="flex flex-col leading-tight">
                          <span className="text-sm font-semibold text-foreground">{name}</span>
                          <span className="text-xs text-muted-foreground">{desc}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-6 pt-5 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">Follow</span>
              <div className="flex items-center gap-2">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <Button key={label} variant="outline" size="sm" className="h-9 w-9 p-0" asChild>
                    <a href={href} aria-label={label}>
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;