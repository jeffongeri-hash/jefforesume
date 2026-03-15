import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Building2, Shield, CheckCircle2, ExternalLink } from 'lucide-react';

interface Hospital {
  name: string;
  city: string;
  state: string;
  zip: string;
  type: 'government' | 'nonprofit';
  system: string;
  confidence: 'high' | 'medium';
  notes: string;
  region: string;
}

const PSLF_HOSPITALS: Hospital[] = [
  // Sacramento / El Dorado County
  { name: "UC Davis Medical Center", city: "Sacramento", state: "CA", zip: "95817", type: "nonprofit", system: "UC Davis Health", confidence: "high", notes: "Public nonprofit UC institution", region: "Sacramento" },
  { name: "Sutter Medical Center, Sacramento", city: "Sacramento", state: "CA", zip: "95816", type: "nonprofit", system: "Sutter Health", confidence: "high", notes: "Not-for-profit health system", region: "Sacramento" },
  { name: "Sutter Davis Hospital", city: "Davis", state: "CA", zip: "95616", type: "nonprofit", system: "Sutter Health", confidence: "high", notes: "Not-for-profit health system", region: "Sacramento" },
  { name: "Mercy General Hospital", city: "Sacramento", state: "CA", zip: "95819", type: "nonprofit", system: "Dignity Health / CommonSpirit", confidence: "high", notes: "Nonprofit health system", region: "Sacramento" },
  { name: "Methodist Hospital of Sacramento", city: "Sacramento", state: "CA", zip: "95823", type: "nonprofit", system: "Dignity Health / CommonSpirit", confidence: "high", notes: "Nonprofit health system", region: "Sacramento" },
  { name: "Mercy San Juan Medical Center", city: "Carmichael", state: "CA", zip: "95608", type: "nonprofit", system: "Dignity Health / CommonSpirit", confidence: "high", notes: "Nonprofit health system", region: "Sacramento" },
  { name: "Mercy Hospital of Folsom", city: "Folsom", state: "CA", zip: "95630", type: "nonprofit", system: "Dignity Health / CommonSpirit", confidence: "high", notes: "Nonprofit health system, 106 beds", region: "Sacramento" },
  { name: "Marshall Medical Center", city: "Placerville", state: "CA", zip: "95667", type: "nonprofit", system: "Marshall Medical", confidence: "high", notes: "Nonprofit corporation", region: "Sacramento" },
  { name: "Barton Memorial Hospital", city: "South Lake Tahoe", state: "CA", zip: "96150", type: "nonprofit", system: "Barton Health", confidence: "medium", notes: "El Dorado County base hospital, identified as not-for-profit", region: "Sacramento" },
  { name: "Kaiser Permanente Roseville Medical Center", city: "Roseville", state: "CA", zip: "95661", type: "nonprofit", system: "Kaiser Permanente", confidence: "high", notes: "Nonprofit HMO, 24/7 emergency services", region: "Sacramento" },
  { name: "Sutter Roseville Medical Center", city: "Roseville", state: "CA", zip: "95661", type: "nonprofit", system: "Sutter Health", confidence: "high", notes: "Level II trauma center", region: "Sacramento" },
  // San Francisco / Bay Area
  { name: "UCSF Medical Center", city: "San Francisco", state: "CA", zip: "94143", type: "nonprofit", system: "UCSF Health", confidence: "high", notes: "Public nonprofit, 501(c)(3)", region: "Bay Area" },
  { name: "Zuckerberg San Francisco General Hospital", city: "San Francisco", state: "CA", zip: "94110", type: "government", system: "SF Dept of Public Health", confidence: "high", notes: "Government employer — safest PSLF bet", region: "Bay Area" },
  { name: "Laguna Honda Hospital", city: "San Francisco", state: "CA", zip: "94116", type: "government", system: "SF Dept of Public Health", confidence: "high", notes: "Government employer — safest PSLF bet", region: "Bay Area" },
  { name: "San Francisco VA Medical Center", city: "San Francisco", state: "CA", zip: "94121", type: "government", system: "VA Health", confidence: "high", notes: "Federal government employer — safest PSLF bet", region: "Bay Area" },
  { name: "Alameda Health System - Highland Hospital", city: "Oakland", state: "CA", zip: "94602", type: "government", system: "Alameda Health System", confidence: "high", notes: "Public health system", region: "Bay Area" },
  { name: "Contra Costa Regional Medical Center", city: "Martinez", state: "CA", zip: "94553", type: "government", system: "Contra Costa Health", confidence: "high", notes: "County health system", region: "Bay Area" },
  { name: "Santa Clara Valley Medical Center", city: "San Jose", state: "CA", zip: "95128", type: "government", system: "Santa Clara County", confidence: "high", notes: "County health system", region: "Bay Area" },
  { name: "San Mateo Medical Center", city: "San Mateo", state: "CA", zip: "94403", type: "government", system: "San Mateo County", confidence: "high", notes: "County health system", region: "Bay Area" },
  { name: "Stanford Health Care", city: "Stanford", state: "CA", zip: "94305", type: "nonprofit", system: "Stanford Medicine", confidence: "high", notes: "California nonprofit public benefit corporation, 501(c)(3)", region: "Bay Area" },
  { name: "MarinHealth Medical Center", city: "Greenbrae", state: "CA", zip: "94904", type: "nonprofit", system: "MarinHealth", confidence: "medium", notes: "Nonprofit-backed, verify exact employing entity", region: "Bay Area" },
  // Phoenix / Arizona
  { name: "Valleywise Health Medical Center", city: "Phoenix", state: "AZ", zip: "85008", type: "government", system: "Maricopa County SHCD", confidence: "high", notes: "Public system — safest PSLF bet", region: "Phoenix" },
  { name: "Banner University Medical Center Phoenix", city: "Phoenix", state: "AZ", zip: "85006", type: "nonprofit", system: "Banner Health", confidence: "high", notes: "Nonprofit health system", region: "Phoenix" },
  { name: "Banner Desert Medical Center", city: "Mesa", state: "AZ", zip: "85202", type: "nonprofit", system: "Banner Health", confidence: "high", notes: "Nonprofit health system", region: "Phoenix" },
  { name: "HonorHealth Scottsdale Osborn Medical Center", city: "Scottsdale", state: "AZ", zip: "85251", type: "nonprofit", system: "HonorHealth", confidence: "high", notes: "Nonprofit 501(c)(3) organization", region: "Phoenix" },
  { name: "HonorHealth Deer Valley Medical Center", city: "Phoenix", state: "AZ", zip: "85027", type: "nonprofit", system: "HonorHealth", confidence: "high", notes: "Nonprofit 501(c)(3) organization", region: "Phoenix" },
  { name: "Arizona General Hospital Mesa", city: "Mesa", state: "AZ", zip: "85204", type: "nonprofit", system: "Dignity Health / CommonSpirit", confidence: "high", notes: "Part of nonprofit CommonSpirit", region: "Phoenix" },
  { name: "Mayo Clinic Hospital, Phoenix", city: "Phoenix", state: "AZ", zip: "85054", type: "nonprofit", system: "Mayo Clinic", confidence: "high", notes: "Nonprofit, verify exact employing entity", region: "Phoenix" },
  { name: "Phoenix Children's Hospital", city: "Phoenix", state: "AZ", zip: "85016", type: "nonprofit", system: "Phoenix Children's", confidence: "high", notes: "Nonprofit 501(c)(3) hospital", region: "Phoenix" },
  { name: "Phoenix VA Health Care System", city: "Phoenix", state: "AZ", zip: "85012", type: "government", system: "VA Health", confidence: "high", notes: "Federal government employer — safest PSLF bet", region: "Phoenix" },
  { name: "Phoenix Indian Medical Center", city: "Phoenix", state: "AZ", zip: "85016", type: "government", system: "Indian Health Service", confidence: "high", notes: "Federal employer — safest PSLF bet", region: "Phoenix" },
  // Houston / Texas
  { name: "Houston Methodist Hospital", city: "Houston", state: "TX", zip: "77030", type: "nonprofit", system: "Houston Methodist", confidence: "high", notes: "Nonprofit academic medical center", region: "Houston" },
  { name: "Memorial Hermann - Texas Medical Center", city: "Houston", state: "TX", zip: "77030", type: "nonprofit", system: "Memorial Hermann", confidence: "high", notes: "Nonprofit health system", region: "Houston" },
  { name: "Ben Taub Hospital", city: "Houston", state: "TX", zip: "77030", type: "government", system: "Harris Health System", confidence: "high", notes: "County public hospital — safest PSLF bet", region: "Houston" },
  { name: "Michael E. DeBakey VA Medical Center", city: "Houston", state: "TX", zip: "77030", type: "government", system: "VA Health", confidence: "high", notes: "Federal government employer — safest PSLF bet", region: "Houston" },
  { name: "Texas Children's Hospital", city: "Houston", state: "TX", zip: "77030", type: "nonprofit", system: "Texas Children's", confidence: "high", notes: "Nonprofit 501(c)(3) hospital", region: "Houston" },
  { name: "MD Anderson Cancer Center", city: "Houston", state: "TX", zip: "77030", type: "government", system: "UT System", confidence: "high", notes: "State government institution", region: "Houston" },
  // Indianapolis / Hamilton County
  { name: "IU Health Methodist Hospital", city: "Indianapolis", state: "IN", zip: "46202", type: "nonprofit", system: "IU Health", confidence: "high", notes: "Nonprofit health system", region: "Indianapolis" },
  { name: "Eskenazi Health", city: "Indianapolis", state: "IN", zip: "46202", type: "government", system: "Health & Hospital Corp", confidence: "high", notes: "Public hospital — safest PSLF bet", region: "Indianapolis" },
  { name: "Richard L. Roudebush VA Medical Center", city: "Indianapolis", state: "IN", zip: "46202", type: "government", system: "VA Health", confidence: "high", notes: "Federal government employer — safest PSLF bet", region: "Indianapolis" },
  { name: "Ascension St. Vincent Indianapolis", city: "Indianapolis", state: "IN", zip: "46260", type: "nonprofit", system: "Ascension", confidence: "high", notes: "Catholic nonprofit health system", region: "Indianapolis" },
  { name: "Community Hospital North", city: "Indianapolis", state: "IN", zip: "46256", type: "nonprofit", system: "Community Health Network", confidence: "high", notes: "Nonprofit health network", region: "Indianapolis" },
  // Iowa
  { name: "UnityPoint Health - Allen Hospital", city: "Waterloo", state: "IA", zip: "50702", type: "nonprofit", system: "UnityPoint Health", confidence: "high", notes: "Nonprofit health system", region: "Waterloo" },
  { name: "MercyOne Waterloo Medical Center", city: "Waterloo", state: "IA", zip: "50702", type: "nonprofit", system: "MercyOne / CommonSpirit", confidence: "high", notes: "Part of nonprofit CommonSpirit", region: "Waterloo" },
  { name: "Iowa City VA Health Care System", city: "Iowa City", state: "IA", zip: "52246", type: "government", system: "VA Health", confidence: "high", notes: "Federal government employer — safest PSLF bet", region: "Waterloo" },
  { name: "University of Iowa Hospitals and Clinics", city: "Iowa City", state: "IA", zip: "52242", type: "government", system: "University of Iowa", confidence: "high", notes: "State government institution", region: "Waterloo" },
];

const PSLFHospitalFinder = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'government' | 'nonprofit'>('all');

  const results = useMemo(() => {
    if (!search.trim() && typeFilter === 'all') return PSLF_HOSPITALS;

    return PSLF_HOSPITALS.filter(h => {
      const matchesType = typeFilter === 'all' || h.type === typeFilter;
      if (!search.trim()) return matchesType;

      const q = search.toLowerCase().trim();
      const matchesSearch =
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.state.toLowerCase().includes(q) ||
        h.zip.startsWith(q) ||
        h.system.toLowerCase().includes(q) ||
        h.region.toLowerCase().includes(q);

      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  const govCount = results.filter(h => h.type === 'government').length;
  const npCount = results.filter(h => h.type === 'nonprofit').length;

  return (
    <div className="my-12 p-6 md:p-8 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 mb-2">
        <Building2 className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">PSLF Hospital Finder</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Search by city, zip code, state, or hospital name to find PSLF-qualifying employers. 
        Always verify with the <a href="https://studentaid.gov/pslf/" className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">federal PSLF Help Tool</a> before committing.
      </p>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by city, zip code, state, or hospital name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {(['all', 'government', 'nonprofit'] as const).map(type => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
              typeFilter === type
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-primary/50'
            }`}
          >
            {type === 'all' ? `All (${results.length})` : type === 'government' ? `Government (${govCount})` : `Nonprofit (${npCount})`}
          </button>
        ))}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Building2 className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-semibold">No hospitals found</p>
          <p className="text-sm">Try a different city, zip code, or state abbreviation (e.g., "CA", "AZ", "TX")</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {results.map((hospital, i) => (
            <div
              key={`${hospital.name}-${i}`}
              className="rounded-lg border border-border p-4 hover:border-primary/30 transition-colors bg-background"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-sm text-foreground">{hospital.name}</span>
                    {hospital.confidence === 'high' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {hospital.city}, {hospital.state} {hospital.zip} · {hospital.system}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 italic">{hospital.notes}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge
                    variant={hospital.type === 'government' ? 'default' : 'secondary'}
                    className="text-[10px] px-1.5"
                  >
                    {hospital.type === 'government' ? (
                      <><Shield className="h-3 w-3 mr-1" />Gov</>
                    ) : 'Nonprofit'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">⚠️ Important:</strong> PSLF qualification is based on your actual W-2 employer, not the hospital building. 
          Government employers (VA, county health systems, IHS) are the least ambiguous. For nonprofits, always verify the exact employing entity 
          through the <a href="https://studentaid.gov/pslf/" className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">federal PSLF Help Tool</a>.
        </p>
      </div>
    </div>
  );
};

export default PSLFHospitalFinder;
