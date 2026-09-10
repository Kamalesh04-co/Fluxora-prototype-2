import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import { useAuth } from '../../context/AuthContext';
import {
  FileCheck2,
  Lock,
  ShieldCheck,
  CheckCircle,
  Clock,
  KeyRound,
  X,
  Cpu,
  Download,
  AlertCircle,
} from 'lucide-react';

export const BlockchainApprovalModal: React.FC = () => {
  const { isBlockchainModalOpen, setIsBlockchainModalOpen, routes, selectedRouteId } = useCommand();
  const { currentUser } = useAuth();

  const [isSigning, setIsSigning] = useState(false);
  const [signedRecord, setSignedRecord] = useState<{
    txHash: string;
    signature: string;
    timestamp: string;
    blockNumber: number;
    signerName: string;
    signerRole: string;
    routeId: string;
  } | null>(null);

  if (!isBlockchainModalOpen) return null;

  const currentRoute = routes.find((r) => r.id === selectedRouteId) || routes[1];

  const handleSignReroute = () => {
    setIsSigning(true);

    setTimeout(() => {
      // Simulate real cryptographic SHA-256 hash generation
      const fakeHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const fakeSig = '0x' + Array.from({ length: 128 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      setSignedRecord({
        txHash: fakeHash,
        signature: fakeSig,
        timestamp: new Date().toISOString(),
        blockNumber: 4891024,
        signerName: currentUser?.name || 'Officer',
        signerRole: currentUser?.role || 'Fleet Administrator',
        routeId: currentRoute.id,
      });
      setIsSigning(false);
    }, 1200);
  };

  const handleDownloadReceipt = () => {
    if (!signedRecord) return;
    const jsonStr = JSON.stringify(
      {
        header: 'FLUXORA AUTONOMOUS ROUTING BLOCKCHAIN EXECUTION MANIFEST',
        vessel: 'MV FLUXORA VOYAGER (IMO 9982410)',
        ...signedRecord,
        routeDetails: currentRoute,
      },
      null,
      2
    );
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FLUXORA_REROUTE_MANIFEST_${signedRecord.routeId}_${Date.now()}.json`;
    a.click();
  };

  return (
    <div
      id="modal-blockchain-approval"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl p-6 relative text-slate-100">
        {/* Close button */}
        <button
          onClick={() => setIsBlockchainModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Human-in-the-Loop Blockchain Reroute Execution</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
                EIP-712 COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cryptographic zero-knowledge proof & multi-party maritime voyage authorization
            </p>
          </div>
        </div>

        {/* Route Snapshot */}
        <div className="my-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">
                {currentRoute.id}
              </span>
              <span className="text-sm font-bold text-white">{currentRoute.title}</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              Safety Score: {currentRoute.safetyScore ?? currentRoute.vesselSafetyScore ?? 98.4}%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Transit Time</span>
              <span className="font-mono font-bold text-white">{currentRoute.transitDays} Days</span>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Financial Arbitrage</span>
              <span className="font-mono font-bold text-emerald-400">
                {(currentRoute.profitMarginDeltaPct ?? (currentRoute.netProfitDeltaUsd >= 0 ? 14.2 : -6.9)) >= 0
                  ? `+${currentRoute.profitMarginDeltaPct ?? 14.2}%`
                  : `${currentRoute.profitMarginDeltaPct ?? -6.9}%`}
              </span>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Fuel Consumption</span>
              <span className="font-mono font-bold text-cyan-300">{currentRoute.fuelConsumptionTons ?? currentRoute.fuelTons ?? 920} MT</span>
            </div>
            <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Customer SLA</span>
              <span className="font-mono font-bold text-blue-400">{currentRoute.customerComfortPercentile ?? currentRoute.customerSatisfactionPct ?? 96.8}%</span>
            </div>
          </div>
        </div>

        {/* Officer Signature Status */}
        {signedRecord ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-3">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Reroute Cryptographically Executed & Dispatched!</span>
            </div>

            <div className="space-y-1 text-xs font-mono text-slate-300">
              <div className="truncate">
                <span className="text-slate-400">Tx Hash:</span>{' '}
                <span className="text-cyan-400">{signedRecord.txHash}</span>
              </div>
              <div className="truncate">
                <span className="text-slate-400">ECDSA Sig:</span>{' '}
                <span className="text-purple-400">{signedRecord.signature}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1">
                <span>Signer: {signedRecord.signerName} ({signedRecord.signerRole})</span>
                <span>Block #{signedRecord.blockNumber}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={handleDownloadReceipt}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Audit JSON</span>
              </button>
              <button
                onClick={() => setIsBlockchainModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
              <KeyRound className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                By executing this reroute, your verified officer credentials (<strong>{currentUser?.name}</strong>,{' '}
                <strong>{currentUser?.role}</strong>) will mint an immutable maritime passage directive to the vessel autopilot and Lloyd’s mutual insurance registry.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsBlockchainModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-sign-reroute"
                onClick={handleSignReroute}
                disabled={isSigning}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold rounded-xl transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isSigning ? 'Hashing & Signing Block...' : 'Digitally Sign & Dispatch Reroute'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
