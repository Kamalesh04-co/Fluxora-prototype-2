import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import { useAuth } from '../../context/AuthContext';
import {
  Ship,
  Fuel,
  Droplets,
  Utensils,
  Wind,
  Users,
  AlertTriangle,
  Radio,
  Save,
  CheckCircle,
  ShieldCheck,
} from 'lucide-react';

export const CaptainUplinkWidget: React.FC = () => {
  const { captainUplink, updateCaptainUplink, triggerEmergencyDistress, isSatelliteOnline } = useCommand();
  const { currentUser } = useAuth();

  const [fuelVlsfo, setFuelVlsfo] = useState(captainUplink.fuelVlsfoTons);
  const [fuelMgo, setFuelMgo] = useState(captainUplink.fuelMgoTons);
  const [rationsDays, setRationsDays] = useState(captainUplink.crewRationsDays);
  const [freshWater, setFreshWater] = useState(captainUplink.freshWaterLiters);
  const [seaBeaufort, setSeaBeaufort] = useState(captainUplink.seaConditionBeaufort);
  const [waveHeight, setWaveHeight] = useState(captainUplink.waveHeightMeters);
  const [windKnots, setWindKnots] = useState(captainUplink.windKnots);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isCaptain = currentUser?.role === 'Vessel Captain' || currentUser?.role === 'Fleet Administrator';

  const handleSaveUplink = (e: React.FormEvent) => {
    e.preventDefault();
    updateCaptainUplink({
      fuelVlsfoTons: Number(fuelVlsfo),
      fuelMgoTons: Number(fuelMgo),
      crewRationsDays: Number(rationsDays),
      freshWaterLiters: Number(freshWater),
      seaConditionBeaufort: Number(seaBeaufort),
      waveHeightMeters: Number(waveHeight),
      windKnots: Number(windKnots),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div
      id="widget-captain-operational-uplink"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Ship className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Captain Operational Uplink Portal</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/60 font-mono">
                BRIDGE-LINK
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Master authorization console for vessel vitals, fuel status, and emergency distress
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-cyan-400 font-mono">
            <Radio className="w-3.5 h-3.5" />
            {isSatelliteOnline ? 'SATCOM ACTIVE' : 'OFFLINE BUFFER'}
          </span>
        </div>
      </div>

      {!isCaptain && (
        <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            Read-only preview. Switch to <strong>Vessel Captain</strong> or <strong>Fleet Administrator</strong> to submit official master log entries.
          </span>
        </div>
      )}

      {savedSuccess && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Bridge telemetry updated and hashed to cryptographic ship log.</span>
        </div>
      )}

      <form onSubmit={handleSaveUplink} className="space-y-4">
        {/* Fuel & Vitals Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* VLSFO Fuel */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Fuel className="w-3.5 h-3.5 text-cyan-400" />
              <span>VLSFO Reserves (MT)</span>
            </label>
            <input
              type="number"
              value={fuelVlsfo}
              onChange={(e) => setFuelVlsfo(Number(e.target.value))}
              disabled={!isCaptain}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
            />
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              ~68% Tank Cap (2,088 MT Max)
            </div>
          </div>

          {/* MGO Fuel */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Fuel className="w-3.5 h-3.5 text-emerald-400" />
              <span>MGO Reserves (MT)</span>
            </label>
            <input
              type="number"
              value={fuelMgo}
              onChange={(e) => setFuelMgo(Number(e.target.value))}
              disabled={!isCaptain}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
            />
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Aux Gens & Port Transit Fuel
            </div>
          </div>

          {/* Fresh Water */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span>Fresh Water (L)</span>
            </label>
            <input
              type="number"
              value={freshWater}
              onChange={(e) => setFreshWater(Number(e.target.value))}
              disabled={!isCaptain}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
            />
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Desal Unit: 12,000 L/Day Active
            </div>
          </div>

          {/* Crew Rations */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              <span>Crew Rations (Days)</span>
            </label>
            <input
              type="number"
              value={rationsDays}
              onChange={(e) => setRationsDays(Number(e.target.value))}
              disabled={!isCaptain}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-cyan-400"
            />
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              For 24 Maritime Crew Members
            </div>
          </div>
        </div>

        {/* Sea State & Meteorological Sensors */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span>Bridge Environmental Observation (Beaufort & Swell)</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Wind: {windKnots} kts | Swell: {waveHeight}m
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Beaufort Scale: {seaBeaufort} (Rough Sea)
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={seaBeaufort}
                onChange={(e) => setSeaBeaufort(Number(e.target.value))}
                disabled={!isCaptain}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Significant Wave Height: {waveHeight}m
              </label>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.1"
                value={waveHeight}
                onChange={(e) => setWaveHeight(Number(e.target.value))}
                disabled={!isCaptain}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Sustained Wind Speed: {windKnots} Knots
              </label>
              <input
                type="range"
                min="5"
                max="65"
                value={windKnots}
                onChange={(e) => setWindKnots(Number(e.target.value))}
                disabled={!isCaptain}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions: Save & Emergency Distress Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Users className="w-4 h-4 text-slate-500" />
            <span>
              Crew Onboard: <strong className="text-slate-200">24 Persons</strong> (100% SOLAS compliant)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isCaptain && (
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Transmit Uplink</span>
              </button>
            )}

            {/* Emergency Distress Reroute Trigger */}
            <button
              type="button"
              onClick={triggerEmergencyDistress}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                captainUplink.emergencyDistressTriggered
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-300'
              }`}
              title="Activate emergency tactical reroute to open water"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>
                {captainUplink.emergencyDistressTriggered
                  ? 'DISTRESS REROUTE ACTIVE'
                  : 'TRIGGER EMERGENCY DISTRESS REROUTE'}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
