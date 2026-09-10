import React from 'react';
import { useCommand } from '../../context/CommandContext';
import { useAuth } from '../../context/AuthContext';
import { NavView } from '../../types';
import {
  ShieldAlert,
  ReceiptText,
  Activity,
  MapPin,
  GitFork,
  Sparkles,
  FileCheck2,
  Ship,
  Boxes,
  HelpCircle,
  Pill,
  BookUser,
} from 'lucide-react';
import { translations } from '../../utils/i18n';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    language,
    setIsBlockchainModalOpen,
    setIsTourOpen,
    setIsPreOrderingOpen,
    isExtremelyDire,
    setIsPortDirectoryOpen,
    portDirectory,
  } = useCommand();
  const { currentUser } = useAuth();
  const t = translations[language];

  const navItems: Array<{
    id: NavView;
    label: string;
    icon: React.ElementType;
    badge?: string;
    color: string;
    roleRequired?: string;
  }> = [
    {
      id: 'threats',
      label: t.navThreats,
      icon: ShieldAlert,
      badge: '4 Active',
      color: 'text-red-400',
    },
    {
      id: 'tariffs',
      label: t.navTariffs,
      icon: ReceiptText,
      badge: 'Arbitrage',
      color: 'text-amber-400',
    },
    {
      id: 'telemetry',
      label: t.navTelemetry,
      icon: Activity,
      badge: '-18.2°C',
      color: 'text-emerald-400',
    },
    {
      id: 'map',
      label: t.navMap,
      icon: MapPin,
      badge: 'Live GIS',
      color: 'text-cyan-400',
    },
    {
      id: 'routes',
      label: t.navRoutes,
      icon: GitFork,
      badge: 'Plan B 98%',
      color: 'text-blue-400',
    },
    {
      id: 'ai-intel',
      label: t.navAIIntel,
      icon: Sparkles,
      badge: 'Gemini 3.8',
      color: 'text-purple-400',
    },
  ];

  return (
    <aside
      id="tour-navigation-sidebar"
      className="w-16 md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none z-20"
    >
      {/* 6 Core Navigation Icons */}
      <div className="p-3 space-y-1.5">
        <div className="hidden md:block px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          Command Core Matrix
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer group ${
                isActive
                  ? 'bg-slate-800/90 text-white font-semibold border border-cyan-500/50 shadow-md shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
              title={item.label}
            >
              <div
                className={`p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-slate-900 text-slate-400 group-hover:text-cyan-300'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="hidden md:flex flex-1 items-center justify-between overflow-hidden">
                <span className="text-xs truncate">{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded ml-1.5 whitespace-nowrap border ${
                      isActive
                        ? 'bg-cyan-950/80 border-cyan-700/60 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Section: Human-in-the-loop Blockchain execution button & quick shortcuts */}
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        {/* Emergency Medicine Pre-Ordering Protocol Action */}
        <button
          id="btn-pre-ordering-sidebar"
          onClick={() => setIsPreOrderingOpen(true)}
          className={`w-full py-2 px-3 rounded-xl border flex items-center gap-2.5 transition-all text-left cursor-pointer group shadow-md ${
            isExtremelyDire
              ? 'bg-red-950/50 border-red-500/70 text-red-300 hover:bg-red-900/50 shadow-red-950/40 animate-pulse'
              : 'bg-slate-900/70 border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300'
          }`}
          title="Pre-Ordering: Emergency Medicine Shore Supply Protocol"
        >
          <div
            className={`p-1.5 rounded-lg transition-transform group-hover:scale-105 ${
              isExtremelyDire ? 'bg-red-500/30 text-red-300' : 'bg-slate-800 text-cyan-400'
            }`}
          >
            <Pill className="w-4 h-4" />
          </div>
          <div className="hidden md:block overflow-hidden">
            <div className="text-xs font-bold leading-tight truncate flex items-center gap-1.5">
              <span>Pre-Ordering</span>
              {isExtremelyDire && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-red-600 text-white font-mono font-bold">
                  DIRE
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate">
              {isExtremelyDire ? 'Nearby Shore Supply Active' : 'Emergency Medicine Dispatch'}
            </div>
          </div>
        </button>

        {/* Port Authorities & Maritime Agents Directory Action */}
        <button
          id="btn-port-directory-sidebar"
          onClick={() => setIsPortDirectoryOpen(true)}
          className="w-full py-2 px-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 flex items-center gap-2.5 transition-all text-left cursor-pointer group shadow-md"
          title="Port Authorities & Maritime Agents Directory"
        >
          <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:scale-105 transition-transform">
            <BookUser className="w-4 h-4" />
          </div>
          <div className="hidden md:block overflow-hidden">
            <div className="text-xs font-bold leading-tight truncate flex items-center gap-1.5">
              <span>Port & Agent Contacts</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
                {portDirectory.length}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate">
              Destination, Plan A, B, C & Reroutes
            </div>
          </div>
        </button>

        {/* Digitally Sign & Execute Reroute Modal Action */}
        <button
          id="btn-sign-reroute-sidebar"
          onClick={() => setIsBlockchainModalOpen(true)}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/50 text-cyan-300 flex items-center gap-2.5 transition-all text-left cursor-pointer group shadow-lg shadow-cyan-950/30"
          title={t.digitallySign}
        >
          <div className="p-1.5 rounded-lg bg-cyan-500/30 text-cyan-200 group-hover:scale-105 transition-transform">
            <FileCheck2 className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="hidden md:block overflow-hidden">
            <div className="text-xs font-bold text-cyan-200 leading-tight truncate">
              Sign & Execute Reroute
            </div>
            <div className="text-[10px] text-cyan-400/80 font-mono truncate">
              Zero-Knowledge Audit
            </div>
          </div>
        </button>

        {/* Role Access Indicator */}
        {currentUser && (
          <div className="hidden md:flex items-center gap-2 p-2 bg-slate-900/60 rounded-lg border border-slate-800/60 text-[11px] text-slate-400">
            {currentUser.role === 'Vessel Captain' ? (
              <Ship className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            ) : currentUser.role === 'Logistics Officer' ? (
              <Boxes className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            )}
            <div className="truncate">
              <span className="font-semibold text-slate-300">{currentUser.role}:</span>
              <span className="ml-1 text-slate-400 font-mono">
                {currentUser.role === 'Fleet Administrator'
                  ? 'All Clearance'
                  : currentUser.role === 'Vessel Captain'
                  ? 'Bridge Master'
                  : 'Port & Tariff Ops'}
              </span>
            </div>
          </div>
        )}

        {/* Revisit Tour */}
        <button
          onClick={() => setIsTourOpen(true)}
          className="hidden md:flex items-center justify-center gap-1.5 w-full py-1 text-[11px] text-slate-400 hover:text-cyan-300 transition"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t.welcomeTour}</span>
        </button>
      </div>
    </aside>
  );
};
