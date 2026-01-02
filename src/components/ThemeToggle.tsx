import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(systemTheme === 'dark' ? 'light' : 'dark');
    } else {
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative h-9 w-9 p-0 overflow-hidden group"
      aria-label="Toggle theme"
    >
      {/* Background glow effect */}
      <span className="absolute inset-0 rounded-md bg-gradient-to-br from-amber-200/0 to-orange-300/0 dark:from-indigo-500/0 dark:to-purple-600/0 group-hover:from-amber-200/20 group-hover:to-orange-300/20 dark:group-hover:from-indigo-500/20 dark:group-hover:to-purple-600/20 transition-all duration-500" />
      
      {/* Sun icon */}
      <Sun 
        className={`absolute h-5 w-5 text-amber-500 transition-all duration-500 ease-out ${
          isDark 
            ? 'rotate-90 scale-0 opacity-0' 
            : 'rotate-0 scale-100 opacity-100'
        }`}
      />
      
      {/* Moon icon */}
      <Moon 
        className={`absolute h-5 w-5 text-indigo-400 transition-all duration-500 ease-out ${
          isDark 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0'
        }`}
      />
      
      {/* Animated rays for sun */}
      <span 
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isDark ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
        }`}
      >
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute w-0.5 h-1 bg-amber-400/60 rounded-full transition-all duration-300"
            style={{
              transform: `rotate(${i * 45}deg) translateY(-12px)`,
            }}
          />
        ))}
      </span>
      
      {/* Animated stars for moon */}
      <span 
        className={`absolute inset-0 transition-all duration-500 ${
          isDark ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="absolute top-1 right-1 w-1 h-1 bg-indigo-300 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
        <span className="absolute top-2 left-2 w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
        <span className="absolute bottom-2 right-2 w-0.5 h-0.5 bg-indigo-200 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
      </span>
    </Button>
  );
};

export default ThemeToggle;