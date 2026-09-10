import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  ThermometerSnowflake,
  Waves,
  Clock,
  Zap,
  Activity,
  AlertCircle,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

export const ColdChainCard: React.FC = () => {
  const { coldChain, updateColdChainTemp } = useCommand();
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [sliderVal, setSliderVal] = useState(coldChain.actualTempC);

  const isTempCritical = coldChain.actualTempC > -17.5;
  const tempDelta = (coldChain.actualTempC - coldChain.targetTempC).toFixed(1);

  const handleApplyTemp = () => {
    updateColdChainTemp(sliderVal);
    setIsCalibrating(false);
  };

  return (
    <div
      id="widget-cold-chain-telemetry"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-lg"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ThermometerSnowflake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Cold-Chain Telemetry Guard</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
                REEFER-NET
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              168 Active Refrigerated TEU Containers • Class 1 Pharma / Food
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCalibrating(!isCalibrating)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition text-xs flex items-center gap-1 cursor-pointer"
          title="Simulate reefer temperature calibration"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Calibrate</span>
        </button>
      </div>

      {/* Primary Temperature Gauge Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {/* Actual vs Target Temp */}
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            isTempCritical
              ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
              : 'bg-slate-950/80 border-slate-800 text-slate-200'
          }`}
        >
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-between">
            <span>Reefer Cargo Temp</span>
            <span className="font-mono text-cyan-400">Target: {coldChain.targetTempC.toFixed(1)}°C</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono tracking-tight text-cyan-300">
              {coldChain.actualTempC.toFixed(1)}°C
            </span>
            <span className="text-xs font-mono text-amber-400">
              (+{tempDelta}°C)
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            {isTempCritical ? (
              <>
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span className="text-amber-300 font-medium">Elevated vs +32°C sea</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300">Within Cryo-Preservation Margin</span>
              </>
            )}
          </div>
        </div>

        {/* Ambient Sea & Air Surface Temp */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200">
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Waves className="w-3 h-3 text-blue-400" />
            <span>Ambient Sea Temp</span>
          </div>
          <div className="text-2xl font-black font-mono tracking-tight text-blue-300 mt-1">
            +{coldChain.ambientSeaTempC}°C
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Air: +{coldChain.ambientAirTempC}°C (Red Sea Basin)
          </div>
        </div>

        {/* Degree-Minute Thermal Stability Meter */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200">
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3 text-purple-400" />
            <span>Thermal Stability</span>
          </div>
          <div className="text-2xl font-black font-mono tracking-tight text-purple-300 mt-1">
            {coldChain.stabilityScore}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all"
              style={{ width: `${coldChain.stabilityScore}%` }}
            />
          </div>
        </div>

        {/* Hold Time Remaining */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200">
          <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>Hold Time Remaining</span>
          </div>
          <div className="text-2xl font-black font-mono tracking-tight text-emerald-300 mt-1">
            14h 20m
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span className="font-mono text-emerald-400">Aux Gens: 100% NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Temperature simulation modal/drawer */}
      {isCalibrating && (
        <div className="mb-4 p-3 bg-slate-950 rounded-xl border border-cyan-500/40 text-xs">
          <div className="font-semibold text-cyan-300 mb-2 flex items-center justify-between">
            <span>Reefer Compressor Setpoint Simulator</span>
            <span className="font-mono text-slate-300">{sliderVal.toFixed(1)}°C</span>
          </div>
          <input
            type="range"
            min="-24"
            max="-14"
            step="0.2"
            value={sliderVal}
            onChange={(e) => setSliderVal(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>-24.0°C (Deep Sub-Cool)</span>
            <span>-20.0°C (Baseline)</span>
            <span>-14.0°C (Warning)</span>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setIsCalibrating(false)}
              className="px-3 py-1 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyTemp}
              className="px-3 py-1 bg-cyan-500 text-slate-950 font-bold rounded hover:bg-cyan-400 transition"
            >
              Apply Calibration
            </button>
          </div>
        </div>
      )}

      {/* Sub-system Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <strong className="text-slate-200">168/168 Units Online</strong>
          </span>
          <span className="font-mono">Coolant Loop: {coldChain.coolantPressurePsi} PSI</span>
          <span className="font-mono">Sensor Polling: 5 sec</span>
        </div>
        <div className="text-[11px] text-cyan-400 font-mono">
          ISO 1496-2 Cold-Chain Audit Ready
        </div>
      </div>
    </div>
  );
};
