import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, DollarSign, Home } from 'lucide-react';

interface LocationResult {
  name: string;
  stateTax: number;
  monthlyTakeHome: number;
  leftAfter1BR: number;
  leftAfter2BR: number;
  rent1BR: number;
  rent2BR: number;
}

const FEDERAL_BRACKETS_2025 = [
  { min: 0, max: 11925, rate: 0.10 },
  { min: 11925, max: 48475, rate: 0.12 },
  { min: 48475, max: 103350, rate: 0.22 },
  { min: 103350, max: 197300, rate: 0.24 },
  { min: 197300, max: 250525, rate: 0.32 },
  { min: 250525, max: 626350, rate: 0.35 },
  { min: 626350, max: Infinity, rate: 0.37 },
];

const STANDARD_DEDUCTION_2025 = 15750;
const CA_STANDARD_DEDUCTION = 5706;
const SS_RATE = 0.062;
const SS_WAGE_BASE = 176100;
const MEDICARE_RATE = 0.0145;

const CA_BRACKETS = [
  { min: 0, max: 10412, rate: 0.01 },
  { min: 10412, max: 24684, rate: 0.02 },
  { min: 24684, max: 38959, rate: 0.04 },
  { min: 38959, max: 54081, rate: 0.06 },
  { min: 54081, max: 68350, rate: 0.08 },
  { min: 68350, max: 349137, rate: 0.093 },
  { min: 349137, max: 418961, rate: 0.103 },
  { min: 418961, max: 698271, rate: 0.113 },
  { min: 698271, max: Infinity, rate: 0.123 },
];

const RENT_DATA: Record<string, { rent1BR: number; rent2BR: number }> = {
  'Sacramento, CA': { rent1BR: 1510, rent2BR: 1900 },
  'Phoenix, AZ': { rent1BR: 1204, rent2BR: 1550 },
  'Houston, TX': { rent1BR: 1150, rent2BR: 1500 },
  'Hamilton County, IN': { rent1BR: 1504, rent2BR: 1776 },
  'Waterloo, IA': { rent1BR: 639, rent2BR: 825 },
};

function calcBracketTax(income: number, brackets: typeof FEDERAL_BRACKETS_2025): number {
  let tax = 0;
  for (const bracket of brackets) {
    if (income <= bracket.min) break;
    const taxable = Math.min(income, bracket.max) - bracket.min;
    tax += taxable * bracket.rate;
  }
  return tax;
}

function calcFICA(wages: number): number {
  const ss = Math.min(wages, SS_WAGE_BASE) * SS_RATE;
  const medicare = wages * MEDICARE_RATE;
  return ss + medicare;
}

function calcStateTax(location: string, salary: number, retirement: number, hsa: number): number {
  switch (location) {
    case 'Houston, TX':
      return 0;
    case 'Phoenix, AZ':
      return Math.max(0, salary - retirement - hsa) * 0.025;
    case 'Waterloo, IA':
      return Math.max(0, salary - retirement - hsa) * 0.038;
    case 'Hamilton County, IN':
      return Math.max(0, salary - retirement - hsa) * 0.041; // 3.0% state + 1.1% county
    case 'Sacramento, CA': {
      // CA doesn't conform to HSA — only retirement reduces CA income
      const caAGI = salary - retirement;
      const caTaxable = Math.max(0, caAGI - CA_STANDARD_DEDUCTION);
      return calcBracketTax(caTaxable, CA_BRACKETS);
    }
    default:
      return 0;
  }
}

export default function TaxCalculator() {
  const [salary, setSalary] = useState(130000);
  const [retirement401k, setRetirement401k] = useState(12);
  const [hsaAmount, setHsaAmount] = useState(4400);

  const results = useMemo<LocationResult[]>(() => {
    const locations = Object.keys(RENT_DATA);
    return locations.map((loc) => {
      const retirementAmt = salary * (retirement401k / 100);
      const federalAGI = salary - retirementAmt - hsaAmount;
      const federalTaxable = Math.max(0, federalAGI - STANDARD_DEDUCTION_2025);
      const federalTax = calcBracketTax(federalTaxable, FEDERAL_BRACKETS_2025);
      
      // FICA is on gross wages (before 401k for traditional, but HSA is pre-tax for FICA)
      const ficaWages = salary - hsaAmount;
      const fica = calcFICA(ficaWages);
      
      const stateTax = calcStateTax(loc, salary, retirementAmt, hsaAmount);
      
      const annualTakeHome = salary - retirementAmt - hsaAmount - federalTax - fica - stateTax;
      const monthlyTakeHome = annualTakeHome / 12;
      
      const { rent1BR, rent2BR } = RENT_DATA[loc];
      
      return {
        name: loc,
        stateTax,
        monthlyTakeHome: Math.round(monthlyTakeHome),
        leftAfter1BR: Math.round(monthlyTakeHome - rent1BR),
        leftAfter2BR: Math.round(monthlyTakeHome - rent2BR),
        rent1BR,
        rent2BR,
      };
    }).sort((a, b) => b.leftAfter1BR - a.leftAfter1BR);
  }, [salary, retirement401k, hsaAmount]);

  const bestLocation = results[0];

  return (
    <div className="my-12 rounded-2xl border-2 border-primary/20 bg-card p-6 md:p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Interactive Tax Calculator</h3>
          <p className="text-sm text-muted-foreground">Adjust your salary and deductions to compare take-home pay</p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            Annual Salary
          </Label>
          <Input
            type="number"
            min={50000}
            max={500000}
            step={1000}
            value={salary}
            onChange={(e) => setSalary(Math.max(0, Number(e.target.value)))}
            className="text-lg font-semibold"
          />
          <Slider
            value={[salary]}
            min={50000}
            max={350000}
            step={5000}
            onValueChange={([v]) => setSalary(v)}
          />
          <p className="text-xs text-muted-foreground">${salary.toLocaleString()}/year</p>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            401(k) Contribution
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              max={100}
              step={1}
              value={retirement401k}
              onChange={(e) => setRetirement401k(Math.min(100, Math.max(0, Number(e.target.value))))}
              className="text-lg font-semibold"
            />
            <span className="text-lg font-semibold text-muted-foreground">%</span>
          </div>
          <Slider
            value={[retirement401k]}
            min={0}
            max={25}
            step={1}
            onValueChange={([v]) => setRetirement401k(v)}
          />
          <p className="text-xs text-muted-foreground">${Math.round(salary * retirement401k / 100).toLocaleString()}/year</p>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Home className="w-4 h-4 text-primary" />
            HSA Contribution
          </Label>
          <Input
            type="number"
            min={0}
            max={8550}
            step={100}
            value={hsaAmount}
            onChange={(e) => setHsaAmount(Math.max(0, Number(e.target.value)))}
            className="text-lg font-semibold"
          />
          <Slider
            value={[hsaAmount]}
            min={0}
            max={8550}
            step={100}
            onValueChange={([v]) => setHsaAmount(v)}
          />
          <p className="text-xs text-muted-foreground">${hsaAmount.toLocaleString()}/year</p>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left py-3 px-4 font-bold text-foreground">Location</th>
              <th className="text-right py-3 px-4 font-bold text-foreground">State/Local Tax</th>
              <th className="text-right py-3 px-4 font-bold text-foreground">Monthly Take-Home</th>
              <th className="text-right py-3 px-4 font-bold text-foreground">1BR Rent</th>
              <th className="text-right py-3 px-4 font-bold text-foreground">After 1BR</th>
              <th className="text-right py-3 px-4 font-bold text-foreground">2BR Rent</th>
              <th className="text-right py-3 px-4 font-bold text-foreground">After 2BR</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr
                key={r.name}
                className={`border-b border-border transition-colors ${
                  i === 0 ? 'bg-primary/5 font-semibold' : 'hover:bg-muted/30'
                }`}
              >
                <td className="py-3 px-4 text-foreground">
                  {i === 0 && <span className="inline-block mr-1.5 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-bold">BEST</span>}
                  {r.name}
                </td>
                <td className="text-right py-3 px-4 text-muted-foreground">${Math.round(r.stateTax).toLocaleString()}/yr</td>
                <td className="text-right py-3 px-4 text-foreground font-semibold">${r.monthlyTakeHome.toLocaleString()}/mo</td>
                <td className="text-right py-3 px-4 text-muted-foreground">${r.rent1BR.toLocaleString()}</td>
                <td className="text-right py-3 px-4 text-foreground font-semibold">${r.leftAfter1BR.toLocaleString()}/mo</td>
                <td className="text-right py-3 px-4 text-muted-foreground">${r.rent2BR.toLocaleString()}</td>
                <td className="text-right py-3 px-4 text-foreground">${r.leftAfter2BR.toLocaleString()}/mo</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">At ${salary.toLocaleString()}/year:</strong>{' '}
          {bestLocation.name} gives you the most monthly cash after rent at{' '}
          <strong className="text-primary">${bestLocation.leftAfter1BR.toLocaleString()}/mo</strong> (1BR) or{' '}
          <strong className="text-primary">${bestLocation.leftAfter2BR.toLocaleString()}/mo</strong> (2BR).
        </p>
        <p className="text-xs text-muted-foreground mt-2 italic">
          Planning model only — uses 2025 federal brackets, standard deduction ($15,750), and simplified state tax rates. 
          CA does not conform to HSA deductions. Verify with a tax professional.
        </p>
      </div>
    </div>
  );
}
