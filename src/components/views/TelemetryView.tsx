import React from 'react';
import { useCommand } from '../../context/CommandContext';
import { ColdChainCard } from '../widgets/ColdChainCard';
import { CaptainUplinkWidget } from '../widgets/CaptainUplinkWidget';
import { SmartPortWidget } from '../widgets/SmartPortWidget';
import { InventoryRebalancingWidget } from '../widgets/InventoryRebalancingWidget';
import {
  Activity,
  Fuel,
  Droplets,
  Utensils,
  Users,
  Gauge,
  TrendingDown,
  Waves,
  Zap,
} from 'lucide-react';

export const TelemetryView: React.FC = () => {
  const { captainUplink, coldChain } = useCommand();

  return (
    <div id="view-life-sources-telemetry" className="space-y-4">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Life Sources & Cargo Telemetry Hub</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/80 text-emerald-300 font-mono">
                SOLAS CHAPTER V COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cold-chain thermal stability • Bunker fuel consumption curve • Potable water • Crew rations & safety
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-950 text-cyan-300 border border-slate-800 font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Aux Gens: 100% Load Balanced
          </span>
        </div>
      </div>

      {/* Primary Life Sources Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* VLSFO Main Fuel */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold">
              <Fuel className="w-4 h-4 text-cyan-400" />
              <span>VLSFO Fuel</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400">68% Capacity</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono text-white">
              {(captainUplink?.fuelVlsfoTons ?? 0).toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400">MT</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full mt-2 overflow-hidden border border-slate-800">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: '68%' }} />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex justify-between">
            <span>Burn: 38.4 MT/Day</span>
            <span>Est: 36.9 Days</span>
          </div>
        </div>

        {/* Marine Gas Oil (MGO) */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold">
              <Fuel className="w-4 h-4 text-emerald-400" />
              <span>MGO Reserves</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400">82% Capacity</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono text-white">
              {(captainUplink?.fuelMgoTons ?? 0).toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400">MT</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full mt-2 overflow-hidden border border-slate-800">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '82%' }} />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex justify-between">
            <span>Port Transit Fuel</span>
            <span>Aux Generators</span>
          </div>
        </div>

        {/* Potable Fresh Water */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold">
              <Droplets className="w-4 h-4 text-blue-400" />
              <span>Fresh Water</span>
            </span>
            <span className="text-[10px] font-mono text-blue-400">88% Capacity</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono text-white">
              {(captainUplink?.freshWaterLiters ?? 0).toLocaleString()}{' '}
              <span className="text-xs font-normal text-slate-400">Liters</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full mt-2 overflow-hidden border border-slate-800">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: '88%' }} />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex justify-between">
            <span>Desal: 12k L/Day</span>
            <span>Nominal</span>
          </div>
        </div>

        {/* Crew Rations & Headcount */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Crew on Board</span>
            </span>
            <span className="text-[10px] font-mono text-amber-400">24 Officers</span>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black font-mono text-white">
              {captainUplink.crewRationsDays}{' '}
              <span className="text-xs font-normal text-slate-400">Days Food</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full mt-2 overflow-hidden border border-slate-800">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: '92%' }} />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex justify-between">
            <span>Safety Margin: +24d</span>
            <span>Cold Pantry 100%</span>
          </div>
        </div>
      </div>

      {/* Cold Chain Cargo Telemetry Guard Card */}
      <ColdChainCard />

      {/* Captain Operational Uplink Portal Component */}
      <CaptainUplinkWidget />

      {/* Smart Port Cold-Storage Index & Shore Plug Availability */}
      <SmartPortWidget />

      {/* Regional Safety Stock & Inventory Rebalancing Panel */}
      <InventoryRebalancingWidget />
    </div>
  );
};
