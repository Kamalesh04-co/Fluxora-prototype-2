import React from 'react';
import { useCommand } from '../../context/CommandContext';
import { SmartPortPlug } from '../../types';
import {
  Anchor,
  Zap,
  Clock,
  Fuel,
  Info,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export const SmartPortWidget: React.FC = () => {
  const { smartPorts, reservePlug, setSelectedPortDetails } = useCommand();

  return (
    <div
      id="widget-smart-port-index"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Smart Port Cold-Storage Index</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/60 font-mono">
                OPS-GRID
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Live shore-power refrigerated plug capacity & bunkering availability
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          5 Monitored Rerouting Hubs
        </span>
      </div>

      <div className="space-y-2.5">
        {(smartPorts || []).map((port) => {
          const isHighOccupancy = port.occupancyRatePct >= 85;
          return (
            <div
              key={port.unLoCode}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* Port details */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-100">{port.portName}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                    {port.unLoCode}
                  </span>
                  <span className="text-xs text-slate-400">({port.country})</span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Anchor className="w-3.5 h-3.5 text-slate-500" />
                    <span>{port.distanceNm} NM distance</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500/80" />
                    <span>Berth Queue: {port.berthDelayHours}h delay</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-slate-300">
                    <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {[
                        port.bunkerAvailability.vlsfo && 'VLSFO',
                        port.bunkerAvailability.mgo && 'MGO',
                        port.bunkerAvailability.lng && 'LNG',
                        port.bunkerAvailability.bioMethanol && 'Bio-MeOH',
                      ]
                        .filter(Boolean)
                        .join(' | ')}
                    </span>
                  </span>
                </div>
              </div>

              {/* Plugs capacity meter & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {port.availablePlugs} Plugs Available
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {port.occupancyRatePct}% Occupied ({port.totalPlugs} total)
                  </div>
                  <div className="w-28 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden ml-auto">
                    <div
                      className={`h-full rounded-full ${
                        isHighOccupancy ? 'bg-amber-500' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${port.occupancyRatePct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => reservePlug(port.portName)}
                    disabled={port.availablePlugs <= 0}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Reserve</span>
                  </button>

                  <button
                    onClick={() => setSelectedPortDetails(port)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="View port berth schedules & fueling options"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
