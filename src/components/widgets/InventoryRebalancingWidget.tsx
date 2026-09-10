import React from 'react';
import {
  Boxes,
  Globe2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Truck,
  Building2,
} from 'lucide-react';

export const InventoryRebalancingWidget: React.FC = () => {
  const hubs = [
    {
      region: 'Europe Hub',
      ports: 'Rotterdam Maasvlakte / Hamburg Waltershof',
      safetyStockPct: 88,
      daysCoverage: 14.5,
      tier2Status: 'ACTIVE & SYNCHRONIZED',
      tier2Supplier: 'Maersk Cold Logistics & Lineage EU',
      statusColor: 'emerald',
      bufferTons: 12400,
    },
    {
      region: 'Asia Hub',
      ports: 'Port of Singapore / Busan New Port',
      safetyStockPct: 94,
      daysCoverage: 21.0,
      tier2Status: 'OPTIMAL BUFFER',
      tier2Supplier: 'PSA Cold-Hub & Kerry Logistics Asia',
      statusColor: 'emerald',
      bufferTons: 18900,
    },
    {
      region: 'Americas Hub',
      ports: 'Port of Houston / Manzanillo (Panama)',
      safetyStockPct: 76,
      daysCoverage: 9.8,
      tier2Status: 'AUTO-SOURCING TIER-2 TRIGGERED',
      tier2Supplier: 'Americold Supply Network & Crowley',
      statusColor: 'amber',
      bufferTons: 8200,
    },
  ];

  return (
    <div
      id="widget-inventory-rebalancing"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Inventory Rebalancing & Tier-2 Sourcing Panel</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60 font-mono">
                SUPPLY-NET
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Regional safety stock buffers, dynamic cross-docking, and auto-dispatch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-purple-400 font-mono">
          <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Real-Time Hub Sync</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {hubs.map((hub) => (
          <div
            key={hub.region}
            className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>{hub.region}</span>
                </span>
                <span
                  className={`text-xs font-mono font-bold ${
                    hub.safetyStockPct >= 85 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {hub.safetyStockPct}% Stock
                </span>
              </div>

              <div className="text-[11px] text-slate-400 mb-2 truncate">
                {hub.ports}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all ${
                    hub.safetyStockPct >= 85 ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                  style={{ width: `${hub.safetyStockPct}%` }}
                />
              </div>

              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Coverage Remaining:</span>
                  <span className="font-mono text-slate-200 font-semibold">{hub.daysCoverage} Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Reserved Buffer:</span>
                  <span className="font-mono text-slate-200">{(hub.bufferTons ?? 0).toLocaleString()} MT</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80">
              <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider flex items-center gap-1">
                <Building2 className="w-3 h-3 text-cyan-400" />
                <span>Tier-2 Supplier Status:</span>
              </div>
              <div
                className={`text-[11px] font-mono font-semibold mt-0.5 flex items-center gap-1 ${
                  hub.statusColor === 'emerald' ? 'text-emerald-300' : 'text-amber-300'
                }`}
              >
                {hub.statusColor === 'emerald' ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertTriangle className="w-3 h-3" />
                )}
                <span>{hub.tier2Status}</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {hub.tier2Supplier}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
