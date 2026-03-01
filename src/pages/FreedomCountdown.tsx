import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Printer, Rocket, Trophy, Calendar, Target } from 'lucide-react';

const months = [
  "March 2026", "April 2026", "May 2026", "June 2026", "July 2026",
  "August 2026", "September 2026", "October 2026", "November 2026", "December 2026",
  "January 2027", "February 2027", "March 2027", "April 2027", "May 2027",
  "June 2027", "July 2027", "August 2027", "September 2027", "October 2027",
];

const TOTAL_DAYS = months.length * 10;

const FreedomCountdown = () => {
  const [doneDays, setDoneDays] = useState<Set<string>>(new Set());

  const toggleDay = (key: string) => {
    setDoneDays(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const monthData = useMemo(() => {
    let remaining = TOTAL_DAYS;
    return months.map((name, mIdx) => {
      const endDay = remaining;
      const startDay = remaining - 9;
      remaining -= 10;
      return { name, mIdx, endDay, startDay };
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        {/* Print button bar */}
        <div className="print:hidden bg-primary text-primary-foreground py-4 text-center">
          <p className="text-sm mb-2">🎉 Your Freedom Countdown Calendar — Print this page to track your work days!</p>
          <Button variant="destructive" onClick={() => window.print()} size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print Calendar
          </Button>
        </div>

        {/* Cover */}
        <section className="flex flex-col items-center justify-center min-h-[80vh] py-20 px-8 text-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white print:min-h-screen print:break-after-page">
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest uppercase mb-2 text-yellow-400 font-serif flex items-center gap-3">
            <Rocket className="h-10 w-10" />
            Freedom Countdown
          </h1>
          <p className="text-lg text-gray-400 mb-10">Every day crossed off is one day closer to freedom</p>
          <div className="text-3xl md:text-4xl font-bold text-red-500 border-3 border-red-500 rounded-xl px-10 py-4 mb-10 flex items-center gap-3" style={{ borderWidth: 3 }}>
            <Target className="h-8 w-8" />
            October 20, 2027
          </div>
          <div className="grid grid-cols-3 gap-5 w-full max-w-2xl mb-10">
            {[
              { num: months.length, label: "Months to Go" },
              { num: TOTAL_DAYS, label: "Work Days Left" },
              { num: 10, label: "Days Per Month" },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-5 border border-white/20">
                <span className="text-5xl font-bold text-yellow-400 block">{s.num}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-500 italic max-w-md">"The secret of getting ahead is getting started. Cross off one day at a time."</p>
        </section>

        {/* Monthly pages */}
        {monthData.map(({ name, mIdx, endDay, startDay }) => {
          const progressBefore = Math.round(((TOTAL_DAYS - endDay) / TOTAL_DAYS) * 100);
          const progressAfter = Math.round(((TOTAL_DAYS - startDay + 1) / TOTAL_DAYS) * 100);

          return (
            <section key={mIdx} className={`py-8 px-6 md:px-10 ${mIdx < months.length - 1 ? 'print:break-after-page' : ''}`}>
              <h2 className="text-2xl font-bold text-foreground border-b-[3px] border-red-500 pb-2 mb-5 flex justify-between items-center font-serif">
                {name}
                <span className="text-sm text-muted-foreground font-normal">Days {endDay} → {startDay} remaining</span>
              </h2>
              <div className="bg-muted rounded-full h-3 mb-2 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-400 h-full rounded-full transition-all" style={{ width: `${progressBefore}%` }} />
              </div>
              <p className="text-xs text-muted-foreground text-right mb-5">{progressAfter}% complete after this month</p>
              <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: 10 }, (_, d) => {
                  const dayNum = endDay - d;
                  const key = `${mIdx}-${d}`;
                  const isDone = doneDays.has(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggleDay(key)}
                      className={`border-2 rounded-lg p-4 text-center transition-all min-h-[70px] flex flex-col items-center justify-center cursor-pointer hover:border-red-500 ${
                        isDone
                          ? 'bg-green-600 border-green-600 text-white'
                          : 'border-border bg-background text-foreground hover:bg-muted'
                      }`}
                      title="Click to mark done!"
                    >
                      <span className="text-xl font-bold">{dayNum}</span>
                      <span className="text-[10px] uppercase tracking-wider opacity-70">Day {d + 1}</span>
                      {isDone && <span className="text-lg font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
              {mIdx < months.length - 1 && <hr className="border-dashed border-border mt-6" />}
            </section>
          );
        })}

        {/* Final page */}
        <section className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-10 text-center bg-[#1a1a2e] text-white">
          <Trophy className="h-16 w-16 text-yellow-400 mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-5 font-serif">YOU MADE IT!</h2>
          <p className="text-xl text-gray-400">
            October 20, 2027 — Today is YOUR day.<br />You earned every bit of this freedom.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FreedomCountdown;
