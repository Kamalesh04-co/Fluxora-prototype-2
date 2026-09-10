import React from 'react';
import { useCommand } from '../../context/CommandContext';
import { LogisticsOnePagerWidget } from '../widgets/LogisticsOnePagerWidget';
import {
  ReceiptText,
  DollarSign,
  Fuel,
  Leaf,
  Scale,
  TrendingDown,
  ArrowUpRight,
  Landmark,
} from 'lucide-react';

export const TariffsView: React.FC = () => {
  const { bunkerFuelPrices, routes } = useCommand();

  return (
    <div id="view-tariffs-financial" className="space-y-4">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ReceiptText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Taxes, Tolls & Financial Tariffs</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800/80 text-amber-300 font-mono">
                TRI-FACTOR ARBITRAGE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Canal transit fees • EU ETS carbon tax offsets • Demurrage vs detour bunker calculations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono font-bold">
            EU ETS Spot: €84.50 / MT CO2e
          </span>
        </div>
      </div>

      {/* Logistics Officer One-Pager Briefing Highlight */}
      <LogisticsOnePagerWidget />

      {/* Canal Tolls vs Cape Detour Comparison & Bunker Price Index */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Global Canal Tolls & War Insurance Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Canal Transit Tolls & War-Risk Tariffs</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Q3 2026 TARIFF RATES</span>
          </div>

          <div className="space-y-3">
            {/* Suez Canal */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-red-900/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Suez Canal Authority (SCA)</span>
                <span className="text-xs font-mono font-bold text-red-400">$482,000 USD</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Base Net Tonnage Fee ($362k) + Convoy Escort Surcharge + 380 bps War-Risk Lloyd's surcharge ($145k).
              </p>
              <div className="mt-2 text-[10px] text-red-400 font-mono">
                Demurrage risk: 5-8 days anchor queue at Port Said / Suez Roads.
              </div>
            </div>

            {/* Panama Canal */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Panama Canal Authority (ACP)</span>
                <span className="text-xs font-mono font-bold text-slate-300">$385,000 USD</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Neopanamax reservation slot fee + Fresh Water Surcharge (drought level 4 restriction).
              </p>
            </div>

            {/* Cape of Good Hope Bypass */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">Cape of Good Hope Open Corridor</span>
                <span className="text-xs font-mono font-bold text-emerald-400">$0 USD Toll</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Zero chokepoint transit fee. Standard international high-seas rights. Extra bunker cost: $636.5k.
              </p>
              <div className="mt-2 text-[10px] text-emerald-400 font-mono">
                Demurrage avoided: +$294,000 net savings in customer vessel charter penalties!
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Global Bunker Fuel Price Index */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Global Bunker Fuel Price Index ($/MT)</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">PLATTS / SHIP & BUNKER</span>
          </div>

          <div className="space-y-2.5">
            {(bunkerFuelPrices || []).map((item) => (
              <div
                key={item.port}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-200">{item.port}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Bio-MeOH: ${item.bioMethanol}/MT
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">VLSFO</span>
                    <span className="font-bold text-cyan-300">${item.vlsfo}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">MGO</span>
                    <span className="font-bold text-emerald-300">${item.mgo}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">LNG</span>
                    <span className="font-bold text-purple-300">${item.lng}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* EU ETS Carbon Credit Offset Card */}
          <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-emerald-300">FuelEU Maritime Compliance:</span>
                <p className="text-[11px] text-slate-300">
                  Plan B slow-steaming engine load yields <strong>14,820 MT CO2e saved</strong> = $42,000 EU ETS tax rebate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
