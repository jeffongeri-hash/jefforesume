import { useState, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, TrendingUp, DollarSign, Home, Users, User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface LocationResult {
  name: string;
  stateTax: number;
  monthlyTakeHome: number;
  leftAfter1BR: number;
  leftAfter2BR: number;
  rent1BR: number;
  rent2BR: number;
}

type FilingStatus = 'single' | 'married';

const FEDERAL_BRACKETS: Record<FilingStatus, { min: number; max: number; rate: number }[]> = {
  single: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
  married: [
    { min: 0, max: 23850, rate: 0.10 },
    { min: 23850, max: 96950, rate: 0.12 },
    { min: 96950, max: 206700, rate: 0.22 },
    { min: 206700, max: 394600, rate: 0.24 },
    { min: 394600, max: 501050, rate: 0.32 },
    { min: 501050, max: 751600, rate: 0.35 },
    { min: 751600, max: Infinity, rate: 0.37 },
  ],
};

const STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 15750,
  married: 31500,
};

const CA_STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 5706,
  married: 11412,
};

const CA_BRACKETS: Record<FilingStatus, { min: number; max: number; rate: number }[]> = {
  single: [
    { min: 0, max: 10412, rate: 0.01 },
    { min: 10412, max: 24684, rate: 0.02 },
    { min: 24684, max: 38959, rate: 0.04 },
    { min: 38959, max: 54081, rate: 0.06 },
    { min: 54081, max: 68350, rate: 0.08 },
    { min: 68350, max: 349137, rate: 0.093 },
    { min: 349137, max: 418961, rate: 0.103 },
    { min: 418961, max: 698271, rate: 0.113 },
    { min: 698271, max: Infinity, rate: 0.123 },
  ],
  married: [
    { min: 0, max: 20824, rate: 0.01 },
    { min: 20824, max: 49368, rate: 0.02 },
    { min: 49368, max: 77918, rate: 0.04 },
    { min: 77918, max: 108162, rate: 0.06 },
    { min: 108162, max: 136700, rate: 0.08 },
    { min: 136700, max: 698274, rate: 0.093 },
    { min: 698274, max: 837922, rate: 0.103 },
    { min: 837922, max: 1396542, rate: 0.113 },
    { min: 1396542, max: Infinity, rate: 0.123 },
  ],
};

const SS_RATE = 0.062;
const SS_WAGE_BASE = 176100;
const MEDICARE_RATE = 0.0145;

const RENT_DATA: Record<string, { rent1BR: number; rent2BR: number }> = {
  'Sacramento, CA': { rent1BR: 1510, rent2BR: 1900 },
  'Phoenix, AZ': { rent1BR: 1204, rent2BR: 1550 },
  'Houston, TX': { rent1BR: 1150, rent2BR: 1500 },
  'Hamilton Co, IN': { rent1BR: 1504, rent2BR: 1776 },
  'Waterloo, IA': { rent1BR: 639, rent2BR: 825 },
};

const BAR_COLORS = [
  'hsl(var(--primary))',
  'hsl(142 71% 45%)',
  'hsl(217 91% 60%)',
  'hsl(38 92% 50%)',
  'hsl(280 67% 55%)',
];

function calcBracketTax(income: number, brackets: { min: number; max: number; rate: number }[]): number {
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

function calcStateTax(location: string, salary: number, retirement: number, hsa: number, filing: FilingStatus): number {
  switch (location) {
    case 'Houston, TX':
      return 0;
    case 'Phoenix, AZ':
      return Math.max(0, salary - retirement - hsa) * 0.025;
    case 'Waterloo, IA':
      return Math.max(0, salary - retirement - hsa) * 0.038;
    case 'Hamilton Co, IN':
      return Math.max(0, salary - retirement - hsa) * 0.041;
    case 'Sacramento, CA': {
      const caAGI = salary - retirement;
      const caTaxable = Math.max(0, caAGI - CA_STANDARD_DEDUCTION[filing]);
      return calcBracketTax(caTaxable, CA_BRACKETS[filing]);
    }
    default:
      return 0;
  }
}

export default function TaxCalculator() {
  const [salary, setSalary] = useState(130000);
  const [retirement401k, setRetirement401k] = useState(12);
  const [hsaAmount, setHsaAmount] = useState(4400);
  const [filing, setFiling] = useState<FilingStatus>('single');
  const [rentView, setRentView] = useState<'1BR' | '2BR'>('1BR');

  const results = useMemo<LocationResult[]>(() => {
    const locations = Object.keys(RENT_DATA);
    return locations.map((loc) => {
      const retirementAmt = salary * (retirement401k / 100);
      const federalAGI = salary - retirementAmt - hsaAmount;
      const federalTaxable = Math.max(0, federalAGI - STANDARD_DEDUCTION[filing]);
      const federalTax = calcBracketTax(federalTaxable, FEDERAL_BRACKETS[filing]);
      const ficaWages = salary - hsaAmount;
      const fica = calcFICA(ficaWages);
      const stateTax = calcStateTax(loc, salary, retirementAmt, hsaAmount, filing);
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
  }, [salary, retirement401k, hsaAmount, filing]);

  const bestLocation = results[0];

  const chartData = results.map((r) => ({
    name: r.name.replace(', ', '\n'),
    '1BR': r.leftAfter1BR,
    '2BR': r.leftAfter2BR,
  }));

  return (
    <div className="my-12 rounded-2xl border-2 border-primary/20 bg-card p-6 md:p-8 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Interactive Tax Calculator</h3>
          <p className="text-sm text-muted-foreground">Adjust inputs to compare take-home pay across locations</p>
        </div>
      </div>

      {/* Filing Status Toggle */}
      <div className="mb-6">
        <Label className="text-sm font-semibold text-foreground mb-2 block">Filing Status</Label>
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setFiling('single')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              filing === 'single'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <User className="w-4 h-4" />
            Single
          </button>
          <button
            onClick={() => setFiling('married')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-l border-border ${
              filing === 'married'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <Users className="w-4 h-4" />
            Married Filing Jointly
          </button>
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
            max={filing === 'married' ? 9300 : 4400}
            step={100}
            value={hsaAmount}
            onChange={(e) => setHsaAmount(Math.max(0, Number(e.target.value)))}
            className="text-lg font-semibold"
          />
          <Slider
            value={[hsaAmount]}
            min={0}
            max={filing === 'married' ? 9300 : 4400}
            step={100}
            onValueChange={([v]) => setHsaAmount(v)}
          />
          <p className="text-xs text-muted-foreground">${hsaAmount.toLocaleString()}/year</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-foreground">Monthly Leftover After Rent</h4>
          <div className="inline-flex rounded-md border border-border overflow-hidden text-xs">
            <button
              onClick={() => setRentView('1BR')}
              className={`px-3 py-1.5 font-medium transition-colors ${
                rentView === '1BR' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted/50'
              }`}
            >
              1BR
            </button>
            <button
              onClick={() => setRentView('2BR')}
              className={`px-3 py-1.5 font-medium transition-colors border-l border-border ${
                rentView === '2BR' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted/50'
              }`}
            >
              2BR
            </button>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toLocaleString()}/mo`, `After ${rentView}`]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
              />
              <Bar dataKey={rentView} radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
          <strong className="text-foreground">At ${salary.toLocaleString()}/year ({filing === 'married' ? 'MFJ' : 'Single'}):</strong>{' '}
          {bestLocation.name} gives you the most monthly cash after rent at{' '}
          <strong className="text-primary">${bestLocation.leftAfter1BR.toLocaleString()}/mo</strong> (1BR) or{' '}
          <strong className="text-primary">${bestLocation.leftAfter2BR.toLocaleString()}/mo</strong> (2BR).
        </p>
        <p className="text-xs text-muted-foreground mt-2 italic">
          Planning model only — uses 2025 federal brackets, standard deduction, and simplified state tax rates.
          CA does not conform to HSA deductions. MFJ uses doubled brackets where applicable. Verify with a tax professional.
        </p>
      </div>
    </div>
  );
}
