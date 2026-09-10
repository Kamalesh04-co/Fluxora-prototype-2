import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  ShieldAlert,
  AlertTriangle,
  Radio,
  Crosshair,
  Compass,
  FileWarning,
  Eye,
  CheckCircle,
  Clock,
  MapPin,
  Flame,
  Pill,
} from 'lucide-react';

export const ThreatsView: React.FC = () => {
  const { threats, setSelectedRouteId, setIsBlockchainModalOpen, setIsPreOrderingOpen } = useCommand();
  const [selectedThreatId, setSelectedThreatId] = useState<string>(threats[0].id);

  const activeThreat = threats.find((t) => t.id === selectedThreatId) || threats[0];

  return (
    <div id="view-threats-geopolitical" className="space-y-4">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Threats & Geopolitical Risk Center</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 border border-red-800/80 text-red-300 font-mono">
                MARITIME SECURITY LEVEL 2
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live hazard tracking • Anti-ship missile corridors • Piracy alerts • Extreme cyclonic weather
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedRouteId('Plan B');
              setIsBlockchainModalOpen(true);
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Tactical Threat Bypass (Execute Plan B)</span>
          </button>
        </div>
      </div>

      {/* Main Threat Tracking Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Threats List Panel */}
        <div className="lg:col-span-1 space-y-2.5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Active Hazard Bulletins ({(threats || []).length})
          </div>

          {(threats || []).map((threat) => {
            const isSelected = threat.id === selectedThreatId;
            const isCritical = threat.severity === 'CRITICAL';
            return (
              <button
                key={threat.id}
                onClick={() => setSelectedThreatId(threat.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-red-500/60 shadow-md shadow-red-950/20'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-xs font-bold leading-tight ${
                      isCritical ? 'text-red-400' : 'text-slate-200'
                    }`}
                  >
                    {threat.title}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 uppercase ${
                      isCritical
                        ? 'bg-red-950 text-red-300 border-red-800'
                        : threat.severity === 'HIGH'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-purple-950 text-purple-300 border-purple-800'
                    }`}
                  >
                    {threat.severity}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400 font-mono">
                  <span>{threat.location}</span>
                  <span className="text-slate-400">{threat.reportedAgo}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Threat Deep-Dive Panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-red-400 font-mono tracking-wider">
                  Hazard Analysis & Tactical Impact
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{activeThreat.title}</h3>
              </div>
              <span className="text-xs px-3 py-1 bg-red-950/80 text-red-300 border border-red-800/80 rounded-full font-mono font-bold">
                {activeThreat.type.replace('_', ' ')}
              </span>
            </div>

            <p className="text-sm text-slate-300 my-4 leading-relaxed">
              {activeThreat.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Geographic Center</span>
                </div>
                <div className="text-xs font-mono font-bold text-slate-200 mt-1">
                  {activeThreat.lat}°N, {activeThreat.lng}°E
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{activeThreat.location}</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                  <Crosshair className="w-3.5 h-3.5 text-red-400" />
                  <span>Hazard Radius</span>
                </div>
                <div className="text-xs font-mono font-bold text-red-400 mt-1">
                  {activeThreat.affectedRadiusNm} Nautical Miles
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Direct Interdiction Perimeter</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                  <FileWarning className="w-3.5 h-3.5 text-amber-400" />
                  <span>Insurance Surcharge</span>
                </div>
                <div className="text-xs font-mono font-bold text-amber-400 mt-1">
                  +380 bps ($145k USD)
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Lloyd's JWC Listed Zone</div>
              </div>
            </div>

            {/* Recommended Action Box */}
            <div className="p-3.5 bg-slate-950/90 rounded-xl border border-cyan-500/40 text-xs text-slate-300">
              <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>Autonomous Reroute Recommendation:</span>
              </div>
              <p className="leading-relaxed">
                Vessel telemetry suggests avoiding the Bab-el-Mandeb choke point entirely. Switching from Plan A to <strong>Plan B (Cape of Good Hope)</strong> eliminates 100% of projectile hazards, preserves cold-chain cargo integrity, and eliminates $482k canal toll fees.
              </p>
            </div>

            {/* Voyage Uncertainty Medicine Pre-Ordering Trigger */}
            <div className="p-3.5 bg-red-950/30 rounded-xl border border-red-500/40 text-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-300">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-red-200">
                    Voyage Uncertainty Pre-Ordering (Emergency Medicine Shore Dispatch)
                  </div>
                  <div className="text-[11px] text-slate-300">
                    If this threat delays medical cargo, mobilize nearby certified shore sources directly to buyers.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsPreOrderingOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Pre-Ordering</span>
                <Pill className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>Broadcast Source: UKMTO & NAVAREA IX Marine Broadcasts</span>
            </span>
            <span className="font-mono">Verification: IMO SOLAS VII</span>
          </div>
        </div>
      </div>
    </div>
  );
};
