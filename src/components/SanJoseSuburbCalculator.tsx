import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Home, Car, Trees, Sparkles, Trophy, MapPin, Hospital } from 'lucide-react';

interface Suburb {
  name: string;
  county: string;
  rent3br: number;
  commute: number;
  hospitalScore: number;
  yardScore: number;
  lifestyleScore: number;
  ring: string;
  zillow: string;
}

const SUBURBS: Suburb[] = [
  { name: "Campbell", county: "Santa Clara", rent3br: 4100, commute: 11, hospitalScore: 9, yardScore: 5, lifestyleScore: 8, ring: "Core", zillow: "https://www.zillow.com/campbell-ca/rentals/3-_beds/" },
  { name: "Santa Clara", county: "Santa Clara", rent3br: 4900, commute: 11, hospitalScore: 9, yardScore: 4, lifestyleScore: 7, ring: "Core", zillow: "https://www.zillow.com/santa-clara-ca/rentals/3-_beds/" },
  { name: "Milpitas", county: "Santa Clara", rent3br: 4300, commute: 16, hospitalScore: 8, yardScore: 5, lifestyleScore: 6, ring: "Inner", zillow: "https://www.zillow.com/milpitas-ca/rentals/3-_beds/" },
  { name: "Los Gatos", county: "Santa Clara", rent3br: 5000, commute: 12, hospitalScore: 8, yardScore: 6, lifestyleScore: 9, ring: "Core", zillow: "https://www.zillow.com/los-gatos-ca/rentals/3-_beds/" },
  { name: "Sunnyvale", county: "Santa Clara", rent3br: 4800, commute: 18, hospitalScore: 7, yardScore: 4, lifestyleScore: 8, ring: "Inner", zillow: "https://www.zillow.com/sunnyvale-ca/rentals/3-_beds/" },
  { name: "Mountain View", county: "Santa Clara", rent3br: 5100, commute: 20, hospitalScore: 7, yardScore: 3, lifestyleScore: 9, ring: "Outer", zillow: "https://www.zillow.com/mountain-view-ca/rentals/3-_beds/" },
  { name: "Morgan Hill", county: "Santa Clara", rent3br: 3600, commute: 30, hospitalScore: 6, yardScore: 8, lifestyleScore: 5, ring: "Outer", zillow: "https://www.zillow.com/morgan-hill-ca/rentals/3-_beds/" },
  { name: "Cupertino", county: "Santa Clara", rent3br: 5200, commute: 15, hospitalScore: 7, yardScore: 4, lifestyleScore: 8, ring: "Inner", zillow: "https://www.zillow.com/cupertino-ca/rentals/3-_beds/" },
];

const normalize = (value: number, min: number, max: number, invert = false) => {
  if (max === min) return 5;
  const normalized = ((value - min) / (max - min)) * 10;
  return invert ? 10 - normalized : normalized;
};

const SanJoseSuburbCalculator = () => {
  const [weights, setWeights] = useState({
    affordability: 5,
    commute: 5,
    hospital: 5,
    yard: 5,
    lifestyle: 5,
  });

  const rankedSuburbs = useMemo(() => {
    const rents = SUBURBS.map(s => s.rent3br);
    const commutes = SUBURBS.map(s => s.commute);
    const minRent = Math.min(...rents), maxRent = Math.max(...rents);
    const minCommute = Math.min(...commutes), maxCommute = Math.max(...commutes);

    return SUBURBS.map(suburb => {
      const affordScore = normalize(suburb.rent3br, minRent, maxRent, true);
      const commuteScore = normalize(suburb.commute, minCommute, maxCommute, true);
      const hospitalScore = suburb.hospitalScore;
      const yardScore = suburb.yardScore;
      const lifestyleScore = suburb.lifestyleScore;

      const totalWeight = weights.affordability + weights.commute + weights.hospital + weights.yard + weights.lifestyle;
      const score = totalWeight === 0 ? 0 : (
        (affordScore * weights.affordability +
         commuteScore * weights.commute +
         hospitalScore * weights.hospital +
         yardScore * weights.yard +
         lifestyleScore * weights.lifestyle) / totalWeight
      );

      return { ...suburb, score, affordScore, commuteScore };
    }).sort((a, b) => b.score - a.score);
  }, [weights]);

  const topScore = rankedSuburbs[0]?.score || 1;

  return (
    <div className="my-12 p-6 md:p-8 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 mb-2">
        <MapPin className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">San Jose Suburb Ranker</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-8">Drag the sliders to weight what matters most to you. The ranking updates instantly.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          { key: 'affordability' as const, label: 'Affordability', icon: Home, desc: 'Lower rent = higher score' },
          { key: 'commute' as const, label: 'Short Commute', icon: Car, desc: 'Closer to San Jose core = higher' },
          { key: 'hospital' as const, label: 'Hospital Access', icon: Hospital, desc: 'ED employer density & proximity' },
          { key: 'yard' as const, label: 'Yard & Space', icon: Trees, desc: 'Bigger lots, house-friendly areas' },
          { key: 'lifestyle' as const, label: 'Lifestyle & Attractions', icon: Sparkles, desc: 'Dining, nightlife, recreation' },
        ].map(({ key, label, icon: Icon, desc }) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">{label}</span>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{weights[key]}</span>
            </div>
            <Slider
              value={[weights[key]]}
              onValueChange={([v]) => setWeights(prev => ({ ...prev, [key]: v }))}
              min={0}
              max={10}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {rankedSuburbs.map((suburb, index) => {
          const barWidth = topScore > 0 ? (suburb.score / topScore) * 100 : 0;
          const isTop3 = index < 3;

          return (
            <div
              key={suburb.name}
              className={`relative rounded-lg border p-4 transition-all ${
                isTop3
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border bg-background'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-primary text-primary-foreground' :
                    isTop3 ? 'bg-primary/20 text-primary' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={suburb.zillow}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-foreground hover:text-primary transition-colors text-sm"
                      >
                        {suburb.name}
                      </a>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{suburb.ring}</Badge>
                      {index === 0 && <Trophy className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {suburb.county} County · {suburb.commute} min · ${suburb.rent3br.toLocaleString()}/mo
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground flex-shrink-0">
                  {suburb.score.toFixed(1)}
                </span>
              </div>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-6 italic">
        Scores are relative — they show how suburbs compare to each other based on your priorities. 
        Rent data from Zillow 3BR signals. All areas share California's state income tax.
      </p>
    </div>
  );
};

export default SanJoseSuburbCalculator;
