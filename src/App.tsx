import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CommandProvider, useCommand } from './context/CommandContext';
import { LoginModal } from './components/auth/LoginModal';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MapView } from './components/views/MapView';
import { ThreatsView } from './components/views/ThreatsView';
import { TariffsView } from './components/views/TariffsView';
import { TelemetryView } from './components/views/TelemetryView';
import { RoutesView } from './components/views/RoutesView';
import { AIIntelligenceView } from './components/views/AIIntelligenceView';
import { BlockchainApprovalModal } from './components/modals/BlockchainApprovalModal';
import { PortCommsModal } from './components/modals/PortCommsModal';
import { PortDetailsModal } from './components/modals/PortDetailsModal';
import { UserSettingsModal } from './components/modals/UserSettingsModal';
import { PreOrderingModal } from './components/modals/PreOrderingModal';
import { PortDirectoryModal } from './components/modals/PortDirectoryModal';
import { WelcomeTour } from './components/tour/WelcomeTour';

const CommandCenterContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeView, language, nightVisionMode, isSatelliteOnline, syncQueueCount, triggerManualSync } =
    useCommand();

  // Strict Access Guard: If not logged in, show mandatory login & registration gate
  if (!currentUser) {
    return <LoginModal language={language} />;
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 ${
        nightVisionMode ? 'bg-slate-950 text-red-100' : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Offline ship-to-shore sync alert ribbon if satellite is disconnected */}
      {!isSatelliteOnline && (
        <div className="bg-amber-950 border-b border-amber-800 text-amber-200 px-4 py-1.5 text-xs flex items-center justify-between z-40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>
              <strong>Satellite Hardware Disconnected:</strong> Running in offline-resilient local mode.{' '}
              {syncQueueCount} cryptographic state changes queued for shore uplink.
            </span>
          </div>
          {syncQueueCount > 0 && (
            <button
              onClick={triggerManualSync}
              className="px-2.5 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[11px] transition cursor-pointer"
            >
              Sync {syncQueueCount} Packets
            </button>
          )}
        </div>
      )}

      {/* Top Header with Metric Cards, Agent Ribbon & SatComms */}
      <Header />

      {/* Main Body: Left Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar with 6 Core Navigation Icons */}
        <Sidebar />

        {/* Dynamic Viewport Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="max-w-7xl mx-auto">
            {activeView === 'threats' && <ThreatsView />}
            {activeView === 'tariffs' && <TariffsView />}
            {activeView === 'telemetry' && <TelemetryView />}
            {activeView === 'map' && <MapView />}
            {activeView === 'routes' && <RoutesView />}
            {activeView === 'ai-intel' && <AIIntelligenceView />}
          </div>
        </main>
      </div>

      {/* Modals & Portals */}
      <BlockchainApprovalModal />
      <PortCommsModal />
      <PortDetailsModal />
      <UserSettingsModal />
      <PreOrderingModal />
      <PortDirectoryModal />
      <WelcomeTour />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CommandProvider>
        <CommandCenterContent />
      </CommandProvider>
    </AuthProvider>
  );
}
