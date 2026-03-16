import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Home, Car, Trees, Sparkles, Trophy, MapPin, Hospital } from 'lucide-react';

interface Area {
  name: string;
  type: string;
  rent3br: number;
  commute: number; // miles to TMC
  hospitalScore: number; // 1-10
  yardScore: number; // 1-10
  lifestyleScore: number; // 1-10
  monthlyTotal: number;
  ring: string;
  zillow: string;
}

const AREAS: Area[] = [
  { name: "Pearland", type: "Suburb", rent3br: 2300, commute: 15, hospitalScore: 7, yardScore: 8, lifestyleScore: 5, monthlyTotal: 3840, ring: "Suburban", zillow: "https://www.zillow.com/pearland-tx/rentals/3-_beds/" },
  { name: "Sugar Land", type: "Suburb", rent3br: 2150, commute: 17, hospitalScore: 7, yardScore: 8, lifestyleScore: 7, monthlyTotal: 3690, ring: "Suburban", zillow: "https://www.zillow.com/sugar-land-tx/rentals/3-_beds/" },
  { name: "Katy", type: "Suburb", rent3br: 2240, commute: 30, hospitalScore: 6, yardScore: 9, lifestyleScore: 6, monthlyTotal: 3825, ring: "Suburban", zillow: "https://www.zillow.com/katy-tx/rentals/3-_beds/" },
  { name: "Cypress", type: "Suburb", rent3br: 2277, commute: 27, hospitalScore: 5, yardScore: 9, lifestyleScore: 5, monthlyTotal: 3862, ring: "Suburban", zillow: "https://www.zillow.com/cypress-tx/rentals/3-_beds/" },
  { name: "Spring", type: "Suburb", rent3br: 1965, commute: 29, hospitalScore: 5, yardScore: 7, lifestyleScore: 5, monthlyTotal: 3545, ring: "Suburban", zillow: "https://www.zillow.com/spring-tx/rentals/3-_beds/" },
  { name: "The Woodlands", type: "Suburb", rent3br: 2400, commute: 31, hospitalScore: 6, yardScore: 8, lifestyleScore: 9, monthlyTotal: 3980, ring: "Suburban", zillow: "https://www.zillow.com/the-woodlands-tx/rentals/3-_beds/" },
  { name: "League City / Clear Lake", type: "Suburb", rent3br: 2145, commute: 27, hospitalScore: 5, yardScore: 7, lifestyleScore: 6, monthlyTotal: 3720, ring: "Suburban", zillow: "https://www.zillow.com/league-city-tx/rentals/3-_beds/" },
  { name: "Bellaire", type: "Close-in", rent3br: 2300, commute: 12, hospitalScore: 8, yardScore: 6, lifestyleScore: 6, monthlyTotal: 3810, ring: "TMC-Adjacent", zillow: "https://www.zillow.com/bellaire-tx/rentals/3-_beds/" },
  { name: "Medical Center", type: "Close-in", rent3br: 2181, commute: 0, hospitalScore: 10, yardScore: 2, lifestyleScore: 5, monthlyTotal: 3646, ring: "TMC-Adjacent", zillow: "https://www.zillow.com/houston-tx-77030/rentals/" },
  { name: "Museum District", type: "Close-in", rent3br: 2356, commute: 2, hospitalScore: 9, yardScore: 3, lifestyleScore: 9, monthlyTotal: 3821, ring: "TMC-Adjacent", zillow: "https://www.zillow.com/houston-tx-77004/rentals/" },
  { name: "West U / University Place", type: "Close-in", rent3br: 3575, commute: 3, hospitalScore: 9, yardScore: 5, lifestyleScore: 7, monthlyTotal: 5050, ring: "TMC-Adjacent", zillow: "https://www.zillow.com/west-university-place-tx/rentals/3-_beds/" },
  { name: "Midtown", type: "Close-in", rent3br: 1694, commute: 5, hospitalScore: 7, yardScore: 2, lifestyleScore: 8, monthlyTotal: 3129, ring: "TMC-Adjacent", zillow: "https://www.zillow.com/houston-tx-77006/rentals/" },
  { name: "Montrose / Neartown", type: "Close-in", rent3br: 2281, commute: 4, hospitalScore: 7, yardScore: 3, lifestyleScore: 10, monthlyTotal: 3746, ring: "TMC-Adjacent", zillow: "https://www.zillow.com/houston-tx-77006/rentals/" },
  { name: "Upper Kirby / Greenway", type: "Close-in", rent3br: 1938, commute: 4, hospitalScore: 7, yardScore: 3, lifestyleScore: 7, monthlyTotal: 3403, ring: "TMC-Adjacent", zillow: "https://www.zillow.com/houston-tx-77098/rentals/" },
  { name: "Washington Ave / Memorial Park", type: "Close-in", rent3br: 1866, commute: 8, hospitalScore: 6, yardScore: 4, lifestyleScore: 8, monthlyTotal: 3331, ring: "TMC-Adjacent", zillow: "https://www.zillow.com/houston-tx-77007/rentals/" },
];

const normalize = (value: number, min: number, max: number, invert = false) => {
  if (max === min) return 5;
  const normalized = ((value - min) / (max - min)) * 10;
  return invert ? 10 - normalized : normalized;
};

const HoustonSuburbCalculator = () => {
  const [weights, setWeights] = useState({
    affordability: 5,
    commute: 5,
    hospital: 5,
    yard: 5,
    lifestyle: 5,
  });

  const rankedAreas = useMemo(() => {
    const rents = AREAS.map(a => a.rent3br);
    const commutes = AREAS.map(a => a.commute);
    const minRent = Math.min(...rents), maxRent = Math.max(...rents);
    const minCommute = Math.min(...commutes), maxCommute = Math.max(...commutes);

    return AREAS.map(area => {
      const affordScore = normalize(area.rent3br, minRent, maxRent, true);
      const commuteScore = normalize(area.commute, minCommute, maxCommute, true);
      const hospitalScore = area.hospitalScore;
      const yardScore = area.yardScore;
      const lifestyleScore = area.lifestyleScore;

      const totalWeight = weights.affordability + weights.commute + weights.hospital + weights.yard + weights.lifestyle;
      const score = totalWeight === 0 ? 0 : (
        (affordScore * weights.affordability +
         commuteScore * weights.commute +
         hospitalScore * weights.hospital +
         yardScore * weights.yard +
         lifestyleScore * weights.lifestyle) / totalWeight
      );

      return { ...area, score, affordScore, commuteScore };
    }).sort((a, b) => b.score - a.score);
  }, [weights]);

  const topScore = rankedAreas[0]?.score || 1;

  return (
    <div className="my-12 p-6 md:p-8 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 mb-2">
        <MapPin className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Houston Area Ranker</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-8">Drag the sliders to weight what matters most to you. Includes both suburban rings and TMC-adjacent neighborhoods.</p>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          { key: 'affordability' as const, label: 'Affordability', icon: Home, desc: 'Lower rent = higher score' },
          { key: 'commute' as const, label: 'TMC Commute', icon: Car, desc: 'Closer to Texas Medical Center = higher' },
          { key: 'hospital' as const, label: 'Hospital Access', icon: Hospital, desc: 'ED employer density & proximity' },
          { key: 'yard' as const, label: 'Yard & Space', icon: Trees, desc: 'House-friendly, bigger lots' },
          { key: 'lifestyle' as const, label: 'Lifestyle & Attractions', icon: Sparkles, desc: 'Dining, nightlife, culture, recreation' },
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
        {rankedAreas.map((area, index) => {
          const barWidth = topScore > 0 ? (area.score / topScore) * 100 : 0;
          const isTop3 = index < 3;

          return (
            <div
              key={area.name}
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
                        href={area.zillow}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-foreground hover:text-primary transition-colors text-sm"
                      >
                        {area.name}
                      </a>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">{area.ring}</Badge>
                      {index === 0 && <Trophy className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {area.type} · {area.commute === 0 ? 'At TMC' : `${area.commute} mi to TMC`} · ${area.rent3br.toLocaleString()}/mo · ~${area.monthlyTotal.toLocaleString()} total
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground flex-shrink-0">
                  {area.score.toFixed(1)}
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
        Scores are relative — they show how areas compare to each other based on your priorities. 
        Rent data from Zillow and RentCafe. Texas has no state income tax. Commute distances are road miles to Texas Medical Center.
      </p>
    </div>
  );
};

export default HoustonSuburbCalculator;
