const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large floating circle */}
      <div 
        className="absolute top-20 -right-20 w-72 h-72 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 blur-3xl animate-float"
      />
      
      {/* Medium floating circle */}
      <div 
        className="absolute top-40 left-10 w-48 h-48 rounded-full bg-gradient-to-tr from-accent/15 to-secondary/20 blur-2xl animate-float-delayed"
      />
      
      {/* Small floating circle */}
      <div 
        className="absolute bottom-20 right-1/4 w-32 h-32 rounded-full bg-gradient-to-bl from-primary/10 to-accent/15 blur-xl animate-pulse-glow"
      />
      
      {/* Decorative ring */}
      <div 
        className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full border-2 border-primary/10 animate-float opacity-50"
      />
      
      {/* Small accent dots */}
      <div className="absolute top-32 left-1/4 w-3 h-3 rounded-full bg-accent/40 animate-pulse-glow" />
      <div className="absolute bottom-1/3 left-20 w-2 h-2 rounded-full bg-primary/30 animate-float-delayed" />
      <div className="absolute top-1/2 right-20 w-4 h-4 rounded-full bg-secondary/50 animate-float" />
    </div>
  );
};

export default FloatingShapes;
