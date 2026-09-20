import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Facebook, Twitter, Instagram, Menu, X, User, FileText, Award, TrendingUp, Calculator, MapPin, Plane, BookOpen, DollarSign, Stethoscope, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsMenuOpen(false), [location.pathname]);

  const primaryNavItems = [
    { name: 'Professional', href: '/professional', matches: ['/professional', '/resume', '/accolades'] },
    { name: 'Investments', href: '/investments', matches: ['/investments', '/finance-guides', '/iv-strike-selector', '/covered-call-master'] },
    { name: 'Care Abroad', href: '/care-abroad', matches: ['/care-abroad'] },
    { name: 'Writing', href: '/posts', matches: ['/posts', '/blog'] },
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
        { name: 'Finance Guides', href: '/finance-guides', icon: TrendingUp, desc: 'Animated money explainers' },
        { name: 'IV Strike', href: '/iv-strike-selector', icon: Calculator, desc: 'Options strike selector' },
        { name: 'Covered Call', href: '/covered-call-master', icon: DollarSign, desc: 'Covered call planner' },
      ],
    },
    {
      label: 'Career Tools',
      items: [
        { name: 'CA Move Planner', href: '/ca-move-planner', icon: MapPin, desc: 'Relocation modeling' },
        { name: 'Care Abroad', href: '/care-abroad', icon: Stethoscope, desc: 'International care planning' },
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
      className={cn("sticky top-0 z-50 border-b font-clinical transition-all duration-300", isScrolled ? "border-border bg-background/95 shadow-sm backdrop-blur-lg" : "border-border bg-background")}
    >
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
        <div 
          className={cn(
            "grid grid-cols-[1fr_auto] items-center gap-4 transition-all duration-300 xl:grid-cols-[minmax(18rem,1fr)_auto_minmax(18rem,1fr)]",
            isScrolled ? "h-16" : "h-20"
          )}
        >
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="group block py-2" aria-label="Jefney Ongeri, PA-C home">
              <p className={cn("font-journal font-bold leading-none text-foreground transition-all duration-300", isScrolled ? "text-base sm:text-lg" : "text-lg sm:text-xl")}>
                Jefney Ongeri<span className="font-normal text-primary">, PA-C</span>
              </p>
              <p className="mt-1 hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:block">Emergency medicine · Investing</p>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex h-full items-center gap-8" role="navigation" aria-label="Main navigation">
            {primaryNavItems.map((item) => {
              const isActive = item.matches.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));
              return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "relative flex h-full items-center text-[13px] font-semibold text-muted-foreground transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:bg-primary after:transition-transform hover:text-foreground",
                  isActive ? "text-foreground after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.name}
              </Link>
            )})}
          </nav>

          <div className="hidden items-center justify-end gap-2 xl:flex">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-10 w-10 p-0 text-muted-foreground hover:bg-secondary hover:text-foreground"
              aria-label="Search articles"
              onClick={() => navigate('/search')}
            >
              <Search className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <Button variant="outline" className="ml-2 h-10 gap-2 rounded-md border-foreground/20 px-4 text-xs font-semibold uppercase tracking-[0.1em]" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen} aria-controls="site-directory">
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />} Browse
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-md border-foreground/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isMenuOpen}
              aria-controls="site-directory"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div
          id="site-directory"
          className={cn(
            "overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
            isMenuOpen ? "max-h-[calc(100vh-4rem)] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="-mx-5 max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-secondary/50 px-5 pb-8 pt-6 sm:-mx-8 sm:px-8 xl:mx-0 xl:grid xl:grid-cols-[15rem_1fr] xl:gap-12 xl:px-0 xl:py-8">
            <div>
              <p className="font-journal text-2xl text-foreground">Explore</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">Clinical resources, professional work, investment tools, and planning guides.</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/search');
                }}
                className="mt-5 w-full justify-start gap-3 rounded-md bg-background px-4 text-sm text-muted-foreground xl:w-52"
                aria-label="Search articles"
              >
                <Search className="h-4 w-4" />
                <span>Search the site</span>
              </Button>
            </div>

            <nav className="mt-8 grid gap-8 sm:grid-cols-2 xl:mt-0 xl:grid-cols-4" role="navigation" aria-label="Site directory">
              {mobileNavGroups.map((group) => (
                <div key={group.label}>
                  <div className="mb-3 border-b border-border pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    {group.label}
                  </div>
                  <div className="space-y-1">
                    {group.items.map(({ name, href, icon: Icon, desc }) => (
                      <Link
                        key={name}
                        to={href}
                        onClick={() => setIsMenuOpen(false)}
                        className="group flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-background"
                      >
                        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-background text-primary ring-1 ring-border transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1 leading-tight">
                          <span className="text-sm font-semibold text-foreground">{name}</span>
                          <span className="mt-1 block text-xs text-muted-foreground">{desc}</span>
                        </span>
                        <ChevronRight className="h-4 w-4 flex-none text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-5 xl:col-span-2">
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