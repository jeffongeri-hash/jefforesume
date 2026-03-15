import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Home, Car, Trees, Sparkles, Trophy, MapPin, Hospital } from 'lucide-react';

interface Suburb {
  name: string;
  neighborhood: string;
  rent3br: number;
  commute: number;
  hospitalScore: number;
  yardScore: number;
  lifestyleScore: number;
  rentPctGross: number;
  ring: string;
  zillow: string;
}

const SUBURBS: Suburb[] = [
  { name: "Eastmark / East Mesa", neighborhood: "85212", rent3br: 2300, commute: 27, hospitalScore: 8, yardScore: 8, lifestyleScore: 6, rentPctGross: 22.1, ring: "East Valley", zillow: "https://www.zillow.com/mesa-ca/rentals/3-_beds/" },
  { name: "Arrowhead", neighborhood: "Glendale 85308", rent3br: 2245, commute: 24, hospitalScore: 8, yardScore: 9, lifestyleScore: 5, rentPctGross: 21.6, ring: "West Valley", zillow: "https://www.zillow.com/glendale-az/rentals/3-_beds/" },
  { name: "South Chandler", neighborhood: "85249", rent3br: 2270, commute: 30, hospitalScore: 7, yardScore: 8, lifestyleScore: 6, rentPctGross: 20.2, ring: "Southeast", zillow: "https://www.zillow.com/chandler-az/rentals/3-_beds/" },
  { name: "Ahwatukee", neighborhood: "Phoenix 85044", rent3br: 2575, commute: 0, hospitalScore: 9, yardScore: 7, lifestyleScore: 6, rentPctGross: 22.1, ring: "Phoenix", zillow: "https://www.zillow.com/phoenix-az/rentals/3-_beds/" },
  { name: "Downtown Chandler", neighborhood: "85296", rent3br: 2224, commute: 30, hospitalScore: 7, yardScore: 5, lifestyleScore: 8, rentPctGross: 19.8, ring: "Southeast", zillow: "https://www.zillow.com/chandler-az/rentals/3-_beds/" },
  { name: "Mesa 85207 / Usery", neighborhood: "85207", rent3br: 2398, commute: 27, hospitalScore: 7, yardScore: 7, lifestyleScore: 5, rentPctGross: 23.0, ring: "East Valley", zillow: "https://www.zillow.com/mesa-az/rentals/3-_beds/" },
  { name: "Westgate", neighborhood: "Glendale 85305", rent3br: 2295, commute: 24, hospitalScore: 7, yardScore: 5, lifestyleScore: 7, rentPctGross: 22.0, ring: "West Valley", zillow: "https://www.zillow.com/glendale-az/rentals/3-_beds/" },
  { name: "Downtown Mesa", neighborhood: "85201", rent3br: 1900, commute: 27, hospitalScore: 8, yardScore: 4, lifestyleScore: 6, rentPctGross: 18.2, ring: "East Valley", zillow: "https://www.zillow.com/mesa-az/rentals/3-_beds/" },
  { name: "Old Town Scottsdale", neighborhood: "85251", rent3br: 3500, commute: 24, hospitalScore: 8, yardScore: 3, lifestyleScore: 10, rentPctGross: 30.5, ring: "Scottsdale", zillow: "https://www.zillow.com/scottsdale-az/rentals/3-_beds/" },
  { name: "Arcadia", neighborhood: "Phoenix 85018", rent3br: 3295, commute: 0, hospitalScore: 9, yardScore: 5, lifestyleScore: 9, rentPctGross: 28.2, ring: "Phoenix", zillow: "https://www.zillow.com/phoenix-az/rentals/3-_beds/" },
  { name: "Ocotillo", neighborhood: "Chandler 85248", rent3br: 2750, commute: 30, hospitalScore: 7, yardScore: 6, lifestyleScore: 7, rentPctGross: 24.4, ring: "Southeast", zillow: "https://www.zillow.com/chandler-az/rentals/3-_beds/" },
  { name: "North Scottsdale", neighborhood: "85255", rent3br: 4500, commute: 24, hospitalScore: 7, yardScore: 7, lifestyleScore: 8, rentPctGross: 39.3, ring: "Scottsdale", zillow: "https://www.zillow.com/scottsdale-az/rentals/3-_beds/" },
];

const normalize = (value: number, min: number, max: number, invert = false) => {
  if (max === min) return 5;
  const normalized = ((value - min) / (max - min)) * 10;
  return invert ? 10 - normalized : normalized;
};

const PhoenixSuburbCalculator = () => {
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
        <h2 className="text-2xl font-bold text-foreground">Phoenix Metro Suburb Ranker</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-8">Drag the sliders to weight what matters most to you. The ranking updates instantly.</p>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          { key: 'affordability' as const, label: 'Affordability', icon: Home, desc: 'Lower rent = higher score' },
          { key: 'commute' as const, label: 'Short Commute', icon: Car, desc: 'Closer to Phoenix core = higher' },
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
                      {suburb.neighborhood} · {suburb.commute === 0 ? 'In-city' : `${suburb.commute} min`} · ${suburb.rent3br.toLocaleString()}/mo · {suburb.rentPctGross}% of gross
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
        Scores are relative — they show how neighborhoods compare to each other based on your priorities. 
        Rent data from Zillow 3BR signals. Arizona flat 2.5% state income tax applies equally across all areas.
      </p>
    </div>
  );
};

export default PhoenixSuburbCalculator;
