import React from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  Anchor,
  Zap,
  Clock,
  Fuel,
  CheckCircle2,
  X,
  MapPin,
  Ship,
} from 'lucide-react';

export const PortDetailsModal: React.FC = () => {
  const { selectedPortDetails, setSelectedPortDetails, reservePlug } = useCommand();

  if (!selectedPortDetails) return null;

  return (
    <div
      id="modal-port-details"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative text-slate-100">
        {/* Close Button */}
        <button
          onClick={() => setSelectedPortDetails(null)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Anchor className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{selectedPortDetails.portName}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 text-cyan-400 border border-slate-800 font-mono">
                {selectedPortDetails.unLoCode}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {selectedPortDetails.country} • {selectedPortDetails.distanceNm} NM distance from vessel
            </p>
          </div>
        </div>

        {/* Plugs & Capacity Grid */}
        <div className="my-4 grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
              Available Shore Plugs
            </span>
            <span className="text-xl font-black font-mono text-cyan-300">
              {selectedPortDetails.availablePlugs}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              of {selectedPortDetails.totalPlugs} total units
            </span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
              Terminal Occupancy
            </span>
            <span className="text-xl font-black font-mono text-amber-300">
              {selectedPortDetails.occupancyRatePct}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Berth Delay: {selectedPortDetails.berthDelayHours} Hours
            </span>
          </div>
        </div>

        {/* Bunker Availability */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 mb-4 text-xs">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-emerald-400" />
            <span>Available Bunkering Fuels:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { name: 'VLSFO', ok: selectedPortDetails.bunkerAvailability.vlsfo },
              { name: 'MGO', ok: selectedPortDetails.bunkerAvailability.mgo },
              { name: 'LNG', ok: selectedPortDetails.bunkerAvailability.lng },
              { name: 'Bio-MeOH', ok: selectedPortDetails.bunkerAvailability.bioMethanol },
            ].map((b) => (
              <div
                key={b.name}
                className={`p-2 rounded-lg border text-center font-mono ${
                  b.ok
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500 line-through'
                }`}
              >
                {b.name}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setSelectedPortDetails(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              reservePlug(selectedPortDetails.portName);
              setSelectedPortDetails(null);
            }}
            disabled={selectedPortDetails.availablePlugs <= 0}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Reserve Refrigerated Shore Plug</span>
          </button>
        </div>
      </div>
    </div>
  );
};
