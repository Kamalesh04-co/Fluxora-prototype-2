import React from 'react';
import {
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Fuel,
  Shield,
  ArrowRight,
} from 'lucide-react';

export const LogisticsOnePagerWidget: React.FC = () => {
  return (
    <div
      id="widget-logistics-one-pager"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Logistics Officer One-Pager Briefing</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/60 font-mono">
                FINANCIAL ARBITRAGE
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Quantitative Cost-Benefit Model: Canal Demurrage vs Detour Bunker Fuel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono font-bold">
            NET DELTA: +$284,500 (+14.2%)
          </span>
        </div>
      </div>

      {/* Financial Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Baseline (Suez Canal) */}
        <div className="p-4 rounded-xl bg-slate-950 border border-red-900/40 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              Plan A: Suez Canal (Baseline Route)
            </span>
            <span className="text-xs font-mono text-slate-400">18.2 Days Transit</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-red-400" />
                <span>Anchor Queue Demurrage (7 Days @ $42k/day)</span>
              </span>
              <span className="font-mono text-red-400 font-semibold">-$294,000</span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                <span>Suez Canal Authority Transit Toll</span>
              </span>
              <span className="font-mono text-red-400 font-semibold">-$482,000</span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>War-Risk Lloyd's Insurance Surcharge (380 bps)</span>
              </span>
              <span className="font-mono text-red-400 font-semibold">-$145,000</span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Fuel className="w-3.5 h-3.5 text-cyan-400" />
                <span>Baseline Bunker Fuel Consumption</span>
              </span>
              <span className="font-mono text-slate-300">-$416,000</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-400">Total Route Expense:</span>
            <span className="font-bold font-mono text-red-400 text-sm">$1,337,000 USD</span>
          </div>
        </div>

        {/* AI Recommendation (Cape of Good Hope Tactical Bypass) */}
        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/60 space-y-3 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Plan B: Cape Tactical Bypass</span>
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">AI Recommended</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Port Queue Demurrage</span>
              </span>
              <span className="font-mono text-emerald-400 font-semibold">$0 (Continuous Steaming)</span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Canal Transit Tolls</span>
              </span>
              <span className="font-mono text-emerald-400 font-semibold">$0 (Open Sea Corridor)</span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>War-Risk Insurance (Open Ocean Standard)</span>
              </span>
              <span className="font-mono text-slate-400">-$12,000 (Low Risk)</span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Fuel className="w-3.5 h-3.5 text-amber-400" />
                <span>Extra Bunker Fuel (280 MT added @ 16.2 kts)</span>
              </span>
              <span className="font-mono text-amber-400 font-semibold">-$636,500</span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>EU-ETS Speed Eco-Credit Offset</span>
              </span>
              <span className="font-mono text-emerald-400 font-semibold">+$42,000</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-400">Total Route Expense:</span>
            <span className="font-bold font-mono text-emerald-300 text-sm">$1,052,500 USD</span>
          </div>
        </div>
      </div>

      {/* Net Outcome Summary Strip */}
      <div className="p-3 bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-950 rounded-xl border border-emerald-800/40 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-emerald-300">
          <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Executive Decision Logic:</strong> Extra fuel cost ($636.5k) is heavily offset by avoiding Suez toll ($482k), war risk ($133k saved), and anchorage demurrage ($294k saved).
          </span>
        </div>
        <div className="text-right">
          <span className="font-mono font-bold text-cyan-400 text-sm">+$284,500 NET GAIN</span>
        </div>
      </div>
    </div>
  );
};
