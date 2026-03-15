import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Home, Car, Trees, Sparkles, Trophy, MapPin } from 'lucide-react';

interface Suburb {
  name: string;
  county: string;
  rent3br: number; // midpoint planning number
  commute: number; // minutes
  yardScore: number; // 1-10
  lifestyleScore: number; // 1-10
  leftover: number; // midpoint monthly leftover
  ring: string;
  zillow: string;
}

const SUBURBS: Suburb[] = [
  { name: "Citrus Heights", county: "Sacramento", rent3br: 2550, commute: 20, yardScore: 5, lifestyleScore: 4, leftover: 2825, ring: "Ring 2", zillow: "https://www.zillow.com/citrus-heights-ca/rentals/3-_beds/" },
  { name: "Rancho Cordova", county: "Sacramento", rent3br: 2775, commute: 19, yardScore: 5, lifestyleScore: 5, leftover: 2600, ring: "Ring 2", zillow: "https://www.zillow.com/rancho-cordova-ca/rentals/3-_beds/" },
  { name: "Roseville", county: "Placer", rent3br: 2950, commute: 24, yardScore: 6, lifestyleScore: 7, leftover: 2550, ring: "Ring 1", zillow: "https://www.zillow.com/roseville-ca/rentals/3-_beds/" },
  { name: "Elk Grove", county: "Sacramento", rent3br: 2875, commute: 24, yardScore: 6, lifestyleScore: 5, leftover: 2500, ring: "Ring 2", zillow: "https://www.zillow.com/elk-grove-ca/rentals/3-_beds/" },
  { name: "Cameron Park", county: "El Dorado", rent3br: 2850, commute: 35, yardScore: 9, lifestyleScore: 4, leftover: 2450, ring: "Ring 3", zillow: "https://www.zillow.com/cameron-park-ca/rentals/" },
  { name: "Folsom", county: "Sacramento", rent3br: 3100, commute: 31, yardScore: 6, lifestyleScore: 8, leftover: 2350, ring: "Ring 1", zillow: "https://www.zillow.com/folsom-ca/rentals/3-_beds/" },
  { name: "Rocklin", county: "Placer", rent3br: 2900, commute: 24, yardScore: 6, lifestyleScore: 6, leftover: 2450, ring: "Ring 2", zillow: "https://www.zillow.com/rocklin-ca/rentals/3-_beds/" },
  { name: "Auburn", county: "Placer", rent3br: 3025, commute: 33, yardScore: 8, lifestyleScore: 7, leftover: 2300, ring: "Ring 3", zillow: "https://www.zillow.com/auburn-ca/rentals/3-_beds/" },
  { name: "Lincoln", county: "Placer", rent3br: 2950, commute: 33, yardScore: 7, lifestyleScore: 4, leftover: 2350, ring: "Ring 2", zillow: "https://www.zillow.com/lincoln-ca/rentals/3-_beds/" },
  { name: "Folsom Ranch", county: "Sacramento", rent3br: 3150, commute: 32, yardScore: 7, lifestyleScore: 7, leftover: 2150, ring: "Ring 3", zillow: "https://www.zillow.com/folsom-ca/rentals/3-_beds/" },
  { name: "El Dorado Hills", county: "El Dorado", rent3br: 3625, commute: 33, yardScore: 8, lifestyleScore: 7, leftover: 1725, ring: "Ring 1", zillow: "https://www.zillow.com/el-dorado-hills-ca/rentals/3-_beds/" },
  { name: "Granite Bay", county: "Placer", rent3br: 4050, commute: 32, yardScore: 8, lifestyleScore: 6, leftover: 1125, ring: "Ring 2", zillow: "https://www.zillow.com/granite-bay-ca/rentals/" },
];

// Normalize a value to 0-10 scale (higher is better)
const normalize = (value: number, min: number, max: number, invert = false) => {
  const normalized = ((value - min) / (max - min)) * 10;
  return invert ? 10 - normalized : normalized;
};

const SuburbCalculator = () => {
  const [weights, setWeights] = useState({
    affordability: 5,
    commute: 5,
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
      const yardScore = suburb.yardScore;
      const lifestyleScore = suburb.lifestyleScore;

      const totalWeight = weights.affordability + weights.commute + weights.yard + weights.lifestyle;
      const score = totalWeight === 0 ? 0 : (
        (affordScore * weights.affordability +
         commuteScore * weights.commute +
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
        <h2 className="text-2xl font-bold text-foreground">Sacramento Suburb Ranker</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-8">Drag the sliders to weight what matters most to you. The ranking updates instantly.</p>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {[
          { key: 'affordability' as const, label: 'Affordability', icon: Home, desc: 'Lower rent = higher score' },
          { key: 'commute' as const, label: 'Short Commute', icon: Car, desc: 'Closer to Sacramento = higher' },
          { key: 'yard' as const, label: 'Yard & Space', icon: Trees, desc: 'Bigger lots, fenced houses' },
          { key: 'lifestyle' as const, label: 'Lifestyle & Attractions', icon: Sparkles, desc: 'Dining, parks, recreation' },
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

      {/* Results */}
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
                      {suburb.county} County · {suburb.commute} min · ${suburb.rent3br.toLocaleString()}/mo · ${suburb.leftover.toLocaleString()} left
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground flex-shrink-0">
                  {suburb.score.toFixed(1)}
                </span>
              </div>
              {/* Score bar */}
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
        Scores are relative — they show how suburbs compare to each other based on your priorities, not absolute quality. 
        Rent data from Zillow market trends. Commute is no-traffic baseline.
      </p>
    </div>
  );
};

export default SuburbCalculator;
