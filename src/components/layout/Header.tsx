import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCommand } from '../../context/CommandContext';
import {
  Compass,
  Radio,
  Wifi,
  WifiOff,
  Moon,
  Sun,
  Globe,
  TrendingUp,
  ShieldCheck,
  Award,
  Cpu,
  MessageSquare,
  HelpCircle,
  Settings,
  Flame,
  Activity,
  Pill,
  Building2,
  BookUser,
} from 'lucide-react';
import { translations, Language } from '../../utils/i18n';

export const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    agents,
    language,
    setLanguage,
    nightVisionMode,
    setNightVisionMode,
    isSatelliteOnline,
    toggleSatelliteSync,
    syncQueueCount,
    triggerManualSync,
    setIsPortCommsOpen,
    setIsSettingsOpen,
    setIsTourOpen,
    setIsPreOrderingOpen,
    isExtremelyDire,
    emergencyPreOrders,
    chatMessages,
    captainUplink,
    setIsPortDirectoryOpen,
    portDirectory,
  } = useCommand();

  const t = translations[language];

  const optimalAgentsCount = (agents || []).filter((a) => a.status === 'OPTIMAL' || a.status === 'ACTIVE').length;

  return (
    <header
      id="fluxora-command-header"
      className={`border-b transition-colors ${
        nightVisionMode
          ? 'bg-red-950/90 border-red-900/60 text-red-100'
          : 'bg-slate-900/90 border-slate-800 text-slate-100'
      } sticky top-0 z-30 backdrop-blur-md px-4 py-3 shadow-md`}
    >
      {/* Top Row: System Brand, Agent Status Bar, SatComms, Night Mode, Language & Profile */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        {/* Brand & Vessel Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-wider text-white">FLUXORA</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-700/50 text-cyan-300 font-mono">
                CMD-OS v4.8
              </span>
              {captainUplink.emergencyDistressTriggered && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-bold animate-pulse flex items-center gap-1">
                  <Flame className="w-3 h-3" /> DISTRESS ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>MV FLUXORA VOYAGER</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-mono">IMO 9982410</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live AIS Track
              </span>
            </p>
          </div>
        </div>

        {/* 6 Autonomous Agents Status Chip Ribbon */}
        <div
          id="tour-agents-ribbon"
          className="hidden lg:flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800/80 text-xs"
        >
          <div className="flex items-center gap-1.5 font-semibold text-slate-300 mr-1">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>6 Agents:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {(agents || []).map((agent) => (
              <span
                key={agent.id}
                title={`${agent.name} (${agent.category}) - ${agent.healthScore}% health - Load: ${agent.computeLoad}%`}
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono border transition-all cursor-default ${
                  agent.status === 'OPTIMAL'
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                    : agent.status === 'ACTIVE'
                    ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-300'
                    : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                }`}
              >
                {agent.category.split(' ')[0]}
                <span className="ml-1 opacity-70">
                  {agent.status === 'OPTIMAL' ? '●' : '▲'}
                </span>
              </span>
            ))}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono ml-1">
            {optimalAgentsCount}/6 Online
          </span>
        </div>

        {/* Quick Utilities: Satellite hardware sync, Port Comms, Night vision, Language, Settings */}
        <div className="flex items-center gap-2">
          {/* Satellite Comms link toggle / offline mode */}
          <button
            id="btn-sat-sync"
            onClick={toggleSatelliteSync}
            title={isSatelliteOnline ? 'Starlink Maritime Connected (18ms)' : 'Offline Resilient Mode Active'}
            className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isSatelliteOnline
                ? 'bg-cyan-950/40 border-cyan-700/50 text-cyan-300 hover:bg-cyan-900/30'
                : 'bg-amber-950/60 border-amber-700/80 text-amber-300 hover:bg-amber-900/40 animate-pulse'
            }`}
          >
            {isSatelliteOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline font-mono text-[11px]">Starlink 18ms</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[11px]">Offline ({syncQueueCount} queued)</span>
              </>
            )}
          </button>

          {!isSatelliteOnline && syncQueueCount > 0 && (
            <button
              onClick={triggerManualSync}
              className="text-[11px] px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded hover:bg-amber-400 transition"
              title="Force sync queued packets"
            >
              Sync Now
            </button>
          )}

          {/* Emergency Medicine Pre-Ordering Protocol button */}
          <button
            id="btn-pre-ordering-header"
            onClick={() => setIsPreOrderingOpen(true)}
            className={`relative px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isExtremelyDire
                ? 'bg-red-950/80 border-red-500/80 text-red-200 hover:bg-red-900/80 shadow-md shadow-red-900/40 animate-pulse'
                : 'bg-slate-950 border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300'
            }`}
            title="Pre-Ordering: Emergency Medicine Shore Supply Protocol"
          >
            <Pill className={`w-3.5 h-3.5 ${isExtremelyDire ? 'text-red-400' : 'text-cyan-400'}`} />
            <span className="font-semibold hidden sm:inline">Pre-Ordering</span>
            {isExtremelyDire ? (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            ) : (
              <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                {emergencyPreOrders.length}
              </span>
            )}
          </button>

          {/* Port Authorities & Maritime Agents Directory button */}
          <button
            id="btn-port-directory-header"
            onClick={() => setIsPortDirectoryOpen(true)}
            className="relative px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer bg-slate-950 border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300"
            title="Port Authorities & Maritime Agents Directory (Plan A, B, C & Reroutes)"
          >
            <BookUser className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold hidden sm:inline">Port Contacts</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono font-bold">
              {portDirectory.length}
            </span>
          </button>

          {/* Port Authority Encrypted Comms button */}
          <button
            id="btn-port-comms-header"
            onClick={() => setIsPortCommsOpen(true)}
            className="relative p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300 transition cursor-pointer"
            title="Encrypted Port Authority Comms"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[9px] font-bold flex items-center justify-center">
              {chatMessages.length}
            </span>
          </button>

          {/* Bridge Night Watch / Red Vision toggle */}
          <button
            id="btn-night-mode-toggle"
            onClick={() => setNightVisionMode((prev) => !prev)}
            className={`p-2 rounded-lg border transition cursor-pointer ${
              nightVisionMode
                ? 'bg-red-900 text-red-200 border-red-700'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-cyan-300'
            }`}
            title={nightVisionMode ? t.dayMode : t.nightMode}
          >
            {nightVisionMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            <select
              id="select-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="pl-7 pr-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer font-medium"
            >
              <option value="en">EN</option>
              <option value="zh">中文</option>
              <option value="es">ES</option>
              <option value="tl">FIL</option>
              <option value="fr">FR</option>
            </select>
          </div>

          {/* Welcome Tour Trigger */}
          <button
            id="btn-start-tour-header"
            onClick={() => setIsTourOpen(true)}
            className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition cursor-pointer"
            title={t.welcomeTour}
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Profile & Settings Trigger */}
          {currentUser && (
            <button
              id="btn-user-settings-trigger"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 bg-slate-950 hover:bg-slate-800/60 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer text-left"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-cyan-500/40"
                referrerPolicy="no-referrer"
              />
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-white leading-none truncate max-w-[110px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono leading-tight">
                  {currentUser.role.replace('Administrator', 'Admin')}
                </div>
              </div>
              <Settings className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Top Metric Cards & Status Bar */}
      <div
        id="tour-top-metric-cards"
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-1"
      >
        {/* Metric 1: Net Profit Margin Delta */}
        <div className="bg-slate-950/70 border border-cyan-900/40 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-cyan-400" />
              <span>{t.profitMarginDelta}</span>
            </div>
            <div className="text-base font-bold text-cyan-300 mt-0.5 flex items-baseline gap-1">
              <span>+14.2%</span>
              <span className="text-[11px] text-emerald-400 font-normal font-mono">(+$284.5k)</span>
            </div>
          </div>
          <div className="text-[10px] text-cyan-400/80 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40 font-mono">
            ARBITRAGE
          </div>
        </div>

        {/* Metric 2: Vessel & Cargo Safety Score */}
        <div className="bg-slate-950/70 border border-emerald-900/40 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{t.safetyScore}</span>
            </div>
            <div className="text-base font-bold text-emerald-300 mt-0.5 flex items-baseline gap-1">
              <span>98.4%</span>
              <span className="text-[10px] text-slate-400 font-normal font-mono">NOMINAL</span>
            </div>
          </div>
          <div className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
            0% THREAT
          </div>
        </div>

        {/* Metric 3: Customer Comfortable / SLA Percentile */}
        <div className="bg-slate-950/70 border border-blue-900/40 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 flex items-center gap-1">
              <Award className="w-3 h-3 text-blue-400" />
              <span>{t.customerComfort}</span>
            </div>
            <div className="text-base font-bold text-blue-300 mt-0.5 flex items-baseline gap-1">
              <span>96.8%</span>
              <span className="text-[10px] text-slate-400 font-normal font-mono">SLA ON-TIME</span>
            </div>
          </div>
          <div className="text-[10px] text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800/40 font-mono">
            P98 SLA
          </div>
        </div>

        {/* Metric 4: Active Fleet Voyages */}
        <div className="bg-slate-950/70 border border-purple-900/40 rounded-xl p-2.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-purple-400" />
              <span>{t.activeVoyages}</span>
            </div>
            <div className="text-base font-bold text-purple-300 mt-0.5 flex items-baseline gap-1">
              <span>18 Vessels</span>
              <span className="text-[10px] text-amber-400 font-normal font-mono">(4 Rerouted)</span>
            </div>
          </div>
          <div className="text-[10px] text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800/40 font-mono">
            GLOBAL
          </div>
        </div>

        {/* Metric 5: Global Carbon Saved */}
        <div className="hidden lg:flex bg-slate-950/70 border border-emerald-900/40 rounded-xl p-2.5 items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-emerald-400" />
              <span>{t.carbonSaved}</span>
            </div>
            <div className="text-base font-bold text-emerald-300 mt-0.5 flex items-baseline gap-1">
              <span>14,820 MT</span>
              <span className="text-[10px] text-slate-400 font-normal font-mono">CO2e</span>
            </div>
          </div>
          <div className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
            EU ETS
          </div>
        </div>
      </div>
    </header>
  );
};
