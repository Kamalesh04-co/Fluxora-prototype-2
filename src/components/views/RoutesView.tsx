import React from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  GitFork,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Award,
  Clock,
  Fuel,
  DollarSign,
  FileCheck2,
  Compass,
  Building2,
  BookUser,
} from 'lucide-react';

export const RoutesView: React.FC = () => {
  const { routes, selectedRouteId, setSelectedRouteId, setIsBlockchainModalOpen, openPortDirectoryWithFilter } =
    useCommand();

  return (
    <div id="view-preference-routes" className="space-y-4">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <GitFork className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">AI-Recommended Preference Routes</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 border border-blue-800/80 text-blue-300 font-mono">
                MULTI-OBJECTIVE OPTIMIZATION
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Evaluated against global news, canal taxes, geopolitical threats, bunker fuel, profit margins, and SLA reliability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBlockchainModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold rounded-xl transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Digitally Sign & Execute Reroute</span>
          </button>
        </div>
      </div>

      {/* Routes Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {(routes || []).map((route) => {
          const isSelected = route.id === selectedRouteId;
          const isRecommended = route.recommended;
          return (
            <div
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isRecommended && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-cyan-500 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-bl-xl shadow-sm uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  AI Preferred
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                    {route.id}
                  </span>
                  <h3 className="text-sm font-bold text-white truncate max-w-[200px]">{route.title}</h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">{route.riskDescription || (route as any).description}</p>

                {/* Core Decision Ratios */}
                {(() => {
                  const profitDelta = Number(route.profitMarginDeltaPct ?? (route.netProfitDeltaUsd >= 0 ? 14.2 : -6.9)) || 0;
                  const safety = Number(route.safetyScore ?? route.vesselSafetyScore ?? 95) || 0;
                  const slaComfort = Number(route.customerComfortPercentile ?? route.customerSatisfactionPct ?? 90) || 0;
                  const distance = Number(route.distanceNm ?? 0) || 0;
                  const fuelBurn = Number(route.fuelConsumptionTons ?? route.fuelTons ?? 0) || 0;
                  const tollsWarRisk = Number(route.tollAndWarRiskCostUsd ?? ((route.tollFeesUsd || 0) + (route.insuranceRiskUsd || 0)) ?? 0) || 0;
                  const totalCost = Number(route.totalFinancialCostUsd ?? ((route.fuelCostUsd || 0) + (route.tollFeesUsd || 0) + (route.carbonTaxUsd || 0) + (route.insuranceRiskUsd || 0)) ?? 0) || 0;

                  return (
                    <>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {/* Margin Delta */}
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Profit Delta</div>
                          <div
                            className={`text-sm font-black font-mono mt-0.5 ${
                              profitDelta >= 0 ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {profitDelta >= 0 ? `+${profitDelta}%` : `${profitDelta}%`}
                          </div>
                        </div>

                        {/* Vessel Safety */}
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Safety Score</div>
                          <div
                            className={`text-sm font-black font-mono mt-0.5 ${
                              safety >= 80
                                ? 'text-emerald-400'
                                : safety >= 50
                                ? 'text-amber-400'
                                : 'text-red-400'
                            }`}
                          >
                            {safety}%
                          </div>
                        </div>

                        {/* SLA Satisfaction */}
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">SLA Comf.</div>
                          <div className="text-sm font-black font-mono text-blue-400 mt-0.5">
                            {slaComfort}%
                          </div>
                        </div>
                      </div>

                      {/* Numerical Telemetry Breakdown */}
                      <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>Transit Duration:</span>
                          </span>
                          <span className="font-mono font-semibold text-slate-100">
                            {route.transitDays} Days ({(distance || 0).toLocaleString()} NM)
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-slate-500" />
                            <span>Estimated Arrival (ETA):</span>
                          </span>
                          <span className="font-mono text-cyan-300 font-semibold">{route.eta}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <Fuel className="w-3.5 h-3.5 text-slate-500" />
                            <span>Bunker Consumption:</span>
                          </span>
                          <span className="font-mono text-slate-100">{fuelBurn} MT VLSFO</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                            <span>Canal Tolls & War Tariffs:</span>
                          </span>
                          <span
                            className={`font-mono font-semibold ${
                              tollsWarRisk === 0 ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            ${(tollsWarRisk || 0).toLocaleString()} USD
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Route Cost:</span>
                          <span className="font-mono font-bold text-slate-100">
                            ${(totalCost || 0).toLocaleString()} USD
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Selection & Port Directory buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const filterMap: Record<string, string> = {
                      'Plan A': 'PLAN_A',
                      'Plan B': 'PLAN_B',
                      'Plan C': 'PLAN_C',
                    };
                    openPortDirectoryWithFilter(filterMap[route.id] || 'ALL');
                  }}
                  className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-700/80 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title={`View Port Authorities & Agents for ${route.id}`}
                >
                  <BookUser className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Port Contacts</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRouteId(route.id);
                    setIsBlockchainModalOpen(true);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Select & Sign {route.id}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
