import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import { useAuth } from '../../context/AuthContext';
import {
  Pill,
  HeartPulse,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Plane,
  MapPin,
  Building2,
  Boxes,
  FileCheck2,
  X,
  Lock,
  Unlock,
  Send,
  Zap,
  ThermometerSnowflake,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react';

export const PreOrderingModal: React.FC = () => {
  const {
    isPreOrderingOpen,
    setIsPreOrderingOpen,
    isExtremelyDire,
    direUncertaintyOverride,
    toggleDireUncertainty,
    triggerEmergencyDistress,
    captainUplink,
    coldChain,
    emergencyMedicines,
    nearbyPharmaSources,
    emergencyBuyers,
    emergencyPreOrders,
    executeEmergencyPreOrder,
  } = useCommand();

  const { currentUser } = useAuth();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'order' | 'history'>('order');

  // Form selections
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>(emergencyBuyers[0]?.id || '');
  const [selectedSourceId, setSelectedSourceId] = useState<string>(nearbyPharmaSources[0]?.id || '');
  const [selectedMeds, setSelectedMeds] = useState<{ [id: string]: number }>({
    'med-1': 5000,
    'med-2': 12000,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<{ orderNumber: string; txHash: string } | null>(null);

  if (!isPreOrderingOpen) return null;

  const selectedBuyer = emergencyBuyers.find((b) => b.id === selectedBuyerId) || emergencyBuyers[0];
  const selectedSource = nearbyPharmaSources.find((s) => s.id === selectedSourceId) || nearbyPharmaSources[0];

  const handleToggleMed = (medId: string, defaultQty: number) => {
    setSelectedMeds((prev) => {
      const next = { ...prev };
      if (next[medId]) {
        delete next[medId];
      } else {
        next[medId] = defaultQty;
      }
      return next;
    });
  };

  const handleQtyChange = (medId: string, qty: number) => {
    setSelectedMeds((prev) => ({
      ...prev,
      [medId]: Math.max(100, qty),
    }));
  };

  const totalMedicinesCount = Object.keys(selectedMeds).length;
  const calculatedCargoTotal = Object.entries(selectedMeds).reduce((sum, [medId, qty]) => {
    const med = emergencyMedicines.find((m) => m.id === medId);
    return sum + (med ? med.pricePerUnitUsd * Number(qty) : 0);
  }, 0);
  const charterAirTransportCost = 45000;
  const totalCostUsd = calculatedCargoTotal + charterAirTransportCost;

  const handleExecuteDispatch = () => {
    if (totalMedicinesCount === 0) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const medicinesList = Object.entries(selectedMeds).map(([medicineId, quantity]) => ({
        medicineId,
        quantity,
      }));

      const res = executeEmergencyPreOrder({
        buyerId: selectedBuyer.id,
        sourceId: selectedSource.id,
        medicines: medicinesList,
        initiatorName: currentUser?.name || 'Captain Elena Rostova',
        role: currentUser?.role || 'Vessel Captain',
      });

      setIsSubmitting(false);
      setSuccessMessage({
        orderNumber: res.orderNumber,
        txHash: res.txHash,
      });
      setActiveTab('history');
    }, 900);
  };

  return (
    <div
      id="modal-pre-ordering-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsPreOrderingOpen(false);
      }}
    >
      <div
        id="modal-pre-ordering-container"
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-cyan-950/40 overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border flex items-center justify-center ${
                isExtremelyDire
                  ? 'bg-red-500/20 border-red-500/50 text-red-400'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
              }`}
            >
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Pre-Ordering Protocol</h2>
                {isExtremelyDire ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-600 animate-pulse flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    EXTREMELY DIRE SITUATION ACTIVE
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    STANDBY MODE (PROTECTED)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Emergency Medical Shore Dispatch to Destination Buyers During Maritime Uncertainties
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nav Tabs */}
            <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('order')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  activeTab === 'order'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Pre-Order Console
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'history'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Dispatch History</span>
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-400 text-[10px] font-mono font-bold">
                  {emergencyPreOrders.length}
                </span>
              </button>
            </div>

            <button
              onClick={() => setIsPreOrderingOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Uncertainty Governance Banner & Dire Override Bar */}
        <div className="bg-slate-950/80 px-4 sm:px-5 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-300 text-[11px] sm:text-xs">
              <strong>Mandatory Protocol Rule:</strong> If voyage uncertainties threaten buyer medicines,
              supplies are pre-ordered from nearby shore depots directly to buyers.
              <span className="text-amber-400 font-semibold ml-1">
                Active only when the situation is extremely dire.
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDireUncertainty}
              className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                isExtremelyDire
                  ? 'bg-red-500/20 border-red-500/60 text-red-300 hover:bg-red-500/30'
                  : 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30'
              }`}
              title="Toggle extremely dire uncertainty simulation"
            >
              {isExtremelyDire ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Dire Mode: Engaged (Click to Standby)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Simulate / Declare Dire Uncertainty</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-xs flex items-start gap-3 shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-sm text-emerald-300">
                  Emergency Pre-Order Dispatched Successfully to Buyers!
                </div>
                <p className="text-slate-300">
                  Consignment <strong>{successMessage.orderNumber}</strong> has been secured from the nearest certified
                  depot. Direct air charter courier initiated. Buyer hospital procurement and Vessel Master notified.
                </p>
                <div className="font-mono text-[10px] text-emerald-400 break-all pt-1">
                  Blockchain Proof: {successMessage.txHash}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' ? (
            /* Pre-Order History View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-cyan-400" />
                  Emergency Pre-Order Dispatch Ledger & Audit Trail
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {emergencyPreOrders.length} Executed Contingency Orders
                </span>
              </div>

              <div className="space-y-3">
                {emergencyPreOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-400">{ord.orderNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 border border-blue-700 text-blue-300 font-mono">
                          {ord.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{ord.timestamp}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Destination Buyer
                        </span>
                        <div className="font-bold text-white mt-0.5">{ord.buyerName}</div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                          {ord.destinationCity}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Nearby Source Depot
                        </span>
                        <div className="font-bold text-white mt-0.5">{ord.sourceHubName}</div>
                        <div className="text-emerald-400 text-[11px] flex items-center gap-1 mt-0.5 font-mono">
                          <Plane className="w-3 h-3 shrink-0" />
                          {ord.transportMode}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Delivery Window & Cost
                        </span>
                        <div className="font-bold text-cyan-300 font-mono mt-0.5">{ord.etaBuyer}</div>
                        <div className="text-slate-300 text-[11px] font-mono mt-0.5">
                          ${ord.totalCostUsd.toLocaleString()} USD (Insurance Covered)
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items Pill List */}
                    <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">Pre-Ordered Assets:</span>
                      {ord.medicines.map((m, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono"
                        >
                          {m.quantity.toLocaleString()} {m.unit} • {m.medicineName}
                        </span>
                      ))}
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 break-all flex items-center justify-between">
                      <span>Authorized: {ord.authorizedBy}</span>
                      <span className="text-cyan-400/80">Audit Hash: {ord.blockchainProof.slice(0, 24)}...</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !isExtremelyDire ? (
            /* STANDBY / LOCKED VIEW: Explains condition requirement */
            <div className="py-8 px-4 text-center max-w-xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Pre-Ordering Protocol is in Standby Mode</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Per standard International Maritime Good Distribution Practice (GDP), emergency medicine
                  pre-ordering to destination buyers is strictly safeguarded.
                  <strong className="text-amber-300 block mt-1">
                    This scenario activates exclusively if the voyage uncertainty is extremely dire
                  </strong>
                  (e.g., choke-point closure, hostile missile threat, cargo cold-chain failure, or distress declaration).
                </p>
              </div>

              {/* Uncertainty Diagnostic Checklist */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Voyage Uncertainty Safety Thresholds:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Chokepoint Security</span>
                      <span className="font-semibold text-amber-400">Bab-el-Mandeb Tension</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono">
                      High Alert
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Cold-Chain Temp</span>
                      <span className="font-semibold text-emerald-400">{coldChain.currentTempCelsius}°C</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">
                      Sub-Cooling OK
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Vessel Distress</span>
                      <span className="font-semibold text-slate-300">
                        {captainUplink.emergencyDistressTriggered ? 'ACTIVE' : 'Normal Navigation'}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {captainUplink.emergencyDistressTriggered ? 'TRIGGERED' : 'STANDBY'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Destination Buyers</span>
                      <span className="font-semibold text-cyan-300">3 European Hospitals</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">
                      Monitoring
                    </span>
                  </div>
                </div>
              </div>

              {/* Action to Declare Dire Uncertainty */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={toggleDireUncertainty}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Declare Dire Uncertainty (Unlock Pre-Ordering)</span>
                </button>

                <button
                  onClick={triggerEmergencyDistress}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Trigger Master Emergency Distress</span>
                </button>
              </div>
            </div>
          ) : (
            /* UNLOCKED: EXTREMELY DIRE SITUATION PRE-ORDERING CONSOLE */
            <div className="space-y-6">
              {/* Active Dire Uncertainty Alert Card */}
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-red-300 uppercase tracking-wide">
                    Extremely Dire Maritime Uncertainty Declared:
                  </div>
                  <p className="text-slate-200">
                    Bab-el-Mandeb closure and 9-day detour threaten imminent stockout for critical inpatient buyers.
                    Under Maritime GDP Emergency Protocols, certified regional medical depots have been mobilized
                    to pre-order and dispatch replacement medicine batches directly to destination hospital facilities.
                  </p>
                </div>
              </div>

              {/* Step 1: Select Affected Destination Buyer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    Step 1: Select Destination Buyer in Urgent Need
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Select Hospital / Consortium</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {emergencyBuyers.map((buyer) => {
                    const isSelected = selectedBuyerId === buyer.id;
                    return (
                      <div
                        key={buyer.id}
                        onClick={() => setSelectedBuyerId(buyer.id)}
                        className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-md shadow-cyan-950/40'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                                buyer.criticalityLevel === 'EXTREME'
                                  ? 'bg-red-950 text-red-300 border border-red-800'
                                  : 'bg-amber-950 text-amber-300 border border-amber-800'
                              }`}
                            >
                              {buyer.criticalityLevel} RISK
                            </span>
                            <span className="text-[10px] text-cyan-400 font-mono">
                              {buyer.estimatedStockRemainingDays}d Stock Left
                            </span>
                          </div>

                          <div className="font-bold text-xs text-white leading-snug">{buyer.name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                            {buyer.city}, {buyer.country}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 pt-1">
                            Need: {buyer.urgentNeed}
                          </p>
                        </div>

                        <div className="pt-2 mt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                          <span>{buyer.contactPerson.split(',')[0]}</span>
                          <span className="font-mono text-cyan-400">{isSelected ? '● Selected' : 'Select'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select Required Emergency Medicines */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-purple-400" />
                    Step 2: Required Emergency Medicines for Pre-Order
                  </h3>
                  <span className="text-[10px] text-purple-300 font-mono">
                    {totalMedicinesCount} Selected / ${calculatedCargoTotal.toLocaleString()} USD
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {emergencyMedicines.map((med) => {
                    const isChecked = Boolean(selectedMeds[med.id]);
                    const currentQty = selectedMeds[med.id] || med.standardDoseCount;

                    return (
                      <div
                        key={med.id}
                        className={`p-3 rounded-xl border transition flex flex-col justify-between ${
                          isChecked
                            ? 'bg-purple-950/20 border-purple-500/60 shadow-sm'
                            : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <label className="flex items-start gap-2.5 cursor-pointer flex-1">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleMed(med.id, med.standardDoseCount)}
                              className="mt-1 w-4 h-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500 bg-slate-900 cursor-pointer"
                            />
                            <div>
                              <div className="text-xs font-bold text-white leading-tight">{med.name}</div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                <ThermometerSnowflake className="w-3 h-3 text-cyan-400" />
                                <span>{med.temperatureRequirement}</span>
                                <span>•</span>
                                <span className="text-purple-300 font-mono">${med.pricePerUnitUsd}/unit</span>
                              </div>
                            </div>
                          </label>

                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                              med.criticality === 'LIFE_SAVING'
                                ? 'bg-red-950 text-red-300 border border-red-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {med.criticality.replace('_', ' ')}
                          </span>
                        </div>

                        {isChecked && (
                          <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-slate-400">Pre-Order Units:</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={100}
                                step={500}
                                value={currentQty}
                                onChange={(e) => handleQtyChange(med.id, Number(e.target.value))}
                                className="w-24 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-xs font-mono text-white focus:outline-none focus:border-purple-400"
                              />
                              <span className="text-[11px] text-slate-400 font-mono">{med.unit.split(' ')[0]}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Select Nearest Available Shore Source Depot */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                    <Plane className="w-4 h-4 text-emerald-400" />
                    Step 3: Sourced From Nearest Certified Shore Depots
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono">Immediate Stock Allocation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {nearbyPharmaSources.map((source) => {
                    const isSelected = selectedSourceId === source.id;
                    return (
                      <div
                        key={source.id}
                        onClick={() => setSelectedSourceId(source.id)}
                        className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-950/30 border-emerald-500 text-white shadow-md shadow-emerald-950/40'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{source.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono">
                              {source.availableStockPercent}% In-Stock
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {source.portOrCity} ({source.country})
                            </span>
                            <span className="font-mono text-cyan-400">{source.distanceNm} NM away</span>
                          </div>

                          <div className="text-[11px] text-emerald-300 flex items-center gap-1 font-mono pt-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Flight Dispatch Transit: {source.dispatchTransitHours} Hours to Buyer</span>
                          </div>
                        </div>

                        <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{source.certification}</span>
                          <span className="font-mono text-emerald-400">{isSelected ? '● Selected Depot' : 'Select'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Dispatch Summary & Authorization Button */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase font-mono">
                    Emergency Pre-Order Dispatch Summary
                  </span>
                  <span className="text-xs text-cyan-400 font-mono">SOLAS Ch. V Emergency Article 14</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Recipient Buyer</span>
                    <span className="font-bold text-white">{selectedBuyer.name}</span>
                    <span className="text-slate-400 block text-[11px]">{selectedBuyer.city}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Dispatching Depot & Route</span>
                    <span className="font-bold text-white">{selectedSource.name}</span>
                    <span className="text-emerald-400 block text-[11px] font-mono">
                      {selectedSource.transportMode} (~{selectedSource.dispatchTransitHours}h ETA)
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Total Pre-Order Allocation</span>
                    <span className="font-bold text-cyan-300 font-mono text-base">
                      ${totalCostUsd.toLocaleString()} USD
                    </span>
                    <span className="text-slate-400 block text-[10px]">
                      ${calculatedCargoTotal.toLocaleString()} Meds + $45,000 Air Charter
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400">
                    Authorization: <strong>{currentUser?.name || 'Captain Elena Rostova'}</strong> ({currentUser?.role || 'Vessel Master'})
                  </div>

                  <button
                    id="btn-execute-pre-order"
                    disabled={isSubmitting || totalMedicinesCount === 0}
                    onClick={handleExecuteDispatch}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer ${
                      totalMedicinesCount === 0
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-cyan-950/50 active:scale-95'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Securing Shore Stock & Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirm Pre-Order & Dispatch to Buyer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
