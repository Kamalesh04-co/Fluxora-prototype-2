import React, { useState, useRef } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  Navigation,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crosshair,
  AlertTriangle,
  Anchor,
  Wind,
  Shield,
  Zap,
  Info,
  BookUser,
} from 'lucide-react';

export const MapView: React.FC = () => {
  const {
    routes,
    selectedRouteId,
    setSelectedRouteId,
    threats,
    smartPorts,
    setSelectedPortDetails,
    setIsBlockchainModalOpen,
    openPortDirectoryWithFilter,
  } = useCommand();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Layer toggles
  const [showPlanA, setShowPlanA] = useState(true);
  const [showPlanB, setShowPlanB] = useState(true);
  const [showPlanC, setShowPlanC] = useState(false);
  const [showHazards, setShowHazards] = useState(true);
  const [showPorts, setShowPorts] = useState(true);
  const [selectedWaypoint, setSelectedWaypoint] = useState<string | null>(null);

  // Vessel current simulated position (approaching Bab-el-Mandeb / Arabian Sea fork)
  const shipPos = { x: 535, y: 265, name: 'MV FLUXORA VOYAGER', speedKts: 16.2, cog: 246 };

  // Map projection helpers for SVG coordinate space (800x480 box representing Indian Ocean & Afro-Eurasia)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const centerOnVessel = () => {
    setZoomLevel(1.3);
    setPanOffset({ x: -140, y: -40 });
  };

  // Static coordinate paths for SVG maritime visualization
  // Plan A: Singapore -> Sri Lanka -> Bab-el-Mandeb -> Suez -> Rotterdam
  const planAPath = 'M 720,290 L 610,270 L 515,255 L 490,195 L 485,160 L 410,135 L 360,110';
  // Plan B: Singapore -> Chagos -> South of Madagascar -> Cape Agulhas -> South Atlantic -> Rotterdam
  const planBPath = 'M 720,290 L 590,320 L 535,370 L 460,420 L 420,430 L 370,360 L 335,270 L 320,180 L 360,110';
  // Plan C: Sunda / Lombok -> Southern Indian Ocean -> Mauritius -> Cape -> Rotterdam
  const planCPath = 'M 720,290 L 740,335 L 670,390 L 560,400 L 460,420 L 420,430 L 320,180 L 360,110';

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[1];

  return (
    <div id="view-live-navigation-gis" className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Live GIS Navigation & Route Optimization</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
                WGS-84 VECTOR CHART
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive maritime waypoint trajectory • Real-time AIS positioning • Hazard spatial analysis
            </p>
          </div>
        </div>

        {/* Route Selector Quick Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          {(routes || []).map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRouteId(r.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                selectedRouteId === r.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{r.id}</span>
              {r.recommended && (
                <span className="text-[9px] px-1 py-0.2 bg-emerald-950 text-emerald-300 rounded font-mono border border-emerald-700/50">
                  AI
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive SVG Map Canvas */}
      <div className="relative w-full h-[520px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl select-none">
        {/* Layer Toggles Floating Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 shadow-lg space-y-1.5 text-xs text-slate-300">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>Map Overlays</span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showPlanA}
              onChange={(e) => setShowPlanA(e.target.checked)}
              className="accent-red-400 rounded"
            />
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-3 h-0.5 bg-red-400 inline-block border-b border-dashed" />
              Plan A (Suez)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showPlanB}
              onChange={(e) => setShowPlanB(e.target.checked)}
              className="accent-cyan-400 rounded"
            />
            <span className="flex items-center gap-1 text-cyan-400 font-semibold">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
              Plan B (Cape Bypass)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showPlanC}
              onChange={(e) => setShowPlanC(e.target.checked)}
              className="accent-purple-400 rounded"
            />
            <span className="flex items-center gap-1 text-purple-400">
              <span className="w-3 h-0.5 bg-purple-400 inline-block border-b border-dotted" />
              Plan C (Lombok Hybrid)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-white pt-1 border-t border-slate-800">
            <input
              type="checkbox"
              checked={showHazards}
              onChange={(e) => setShowHazards(e.target.checked)}
              className="accent-amber-400 rounded"
            />
            <span className="text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Hazard Zones (4)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={showPorts}
              onChange={(e) => setShowPorts(e.target.checked)}
              className="accent-blue-400 rounded"
            />
            <span className="text-blue-400 flex items-center gap-1">
              <Anchor className="w-3 h-3" />
              Cold-Plug Ports (5)
            </span>
          </label>
        </div>

        {/* Map Control Buttons (Zoom, Pan, Center) */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-1 shadow-lg">
          <button
            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
            className="p-2 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
            className="p-2 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={centerOnVessel}
            className="p-2 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition"
            title="Center on Vessel"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition"
            title="Reset Map View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Live Ship Status HUD Floating Overlay */}
        <div className="absolute bottom-4 left-4 z-10 bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-xl p-3 shadow-xl max-w-sm text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {shipPos.name}
            </span>
            <span className="font-mono text-cyan-400 font-bold">COG 246° / 16.2 kts</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Position: <span className="font-mono text-slate-200">12°47.0'N, 43°24.7'E</span> (Approaching Bab-el-Mandeb Divergence)
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
            <span className="text-slate-400">Executing:</span>
            <span className="font-bold font-mono text-cyan-300">{selectedRoute.title}</span>
          </div>
        </div>

        {/* Interactive SVG Layer */}
        <div
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <svg
            viewBox="0 0 900 500"
            className="w-full h-full"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            }}
          >
            <defs>
              {/* Gradients & Filters */}
              <radialGradient id="threatPulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                <stop offset="70%" stopColor="#ef4444" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="cyclonePulse" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#030712" />
                <stop offset="100%" stopColor="#091428" />
              </linearGradient>
            </defs>

            {/* Ocean Basin Background */}
            <rect width="900" height="500" fill="url(#oceanGrad)" />

            {/* Nautical Coordinate Grid Lines */}
            {[100, 200, 300, 400, 500, 600, 700, 800].map((x) => (
              <line key={x} x1={x} y1="0" x2={x} y2="500" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3" />
            ))}
            {[100, 200, 300, 400].map((y) => (
              <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3 3" />
            ))}

            {/* Stylized Continental Landmass Outlines (Africa, Middle East, Europe, South Asia) */}
            {/* Africa Outline */}
            <path
              d="M 400,160 Q 420,180 430,220 Q 450,260 480,260 Q 520,260 520,300 Q 500,340 480,380 L 460,430 L 420,440 L 400,390 L 370,300 L 350,220 L 370,170 Z"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1.2"
            />
            {/* Madagascar */}
            <path d="M 525,360 L 540,375 L 530,410 L 518,390 Z" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            {/* Arabian Peninsula & Middle East */}
            <path
              d="M 470,165 L 515,160 L 570,180 L 580,220 L 530,245 L 485,210 Z"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1.2"
            />
            {/* India Subcontinent */}
            <path d="M 600,200 L 645,215 L 625,270 L 600,250 Z" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
            {/* Europe / Med Basin Coastline */}
            <path
              d="M 320,110 L 360,110 L 390,120 L 410,135 L 460,150 L 440,165 L 360,160 Z"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1.2"
            />
            {/* Southeast Asia / Malacca / Indonesia */}
            <path
              d="M 690,260 L 730,280 L 745,320 L 710,325 L 685,290 Z"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1.2"
            />

            {/* HAZARD OVERLAYS */}
            {showHazards && (
              <>
                {/* Bab-el-Mandeb Hostile Threat Corridor */}
                <circle cx="515" cy="255" r="32" fill="url(#threatPulse)" className="animate-pulse" />
                <circle cx="515" cy="255" r="32" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 2" fill="none" />
                <text x="525" y="245" fill="#f87171" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  ⚠ BAB-EL-MANDEB DRONE HAZARD
                </text>

                {/* Arabian Sea Cyclone Swell */}
                <circle cx="585" cy="245" r="28" fill="url(#cyclonePulse)" />
                <circle cx="585" cy="245" r="28" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 3" fill="none" />
                <text x="590" y="235" fill="#fbbf24" fontSize="8" fontFamily="monospace">
                  5.2m SWELL
                </text>

                {/* Port Said / East Med GPS Spoofing Cluster */}
                <circle cx="485" cy="160" r="22" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="2 2" fill="none" />
                <text x="495" y="155" fill="#c084fc" fontSize="8" fontFamily="monospace">
                  GPS SPOOF
                </text>
              </>
            )}

            {/* ROUTE PATHS */}
            {/* Plan A: Suez Canal (Red Dashed) */}
            {showPlanA && (
              <g opacity={selectedRouteId === 'Plan A' ? 1 : 0.45}>
                <path
                  d={planAPath}
                  fill="none"
                  stroke="#f87171"
                  strokeWidth={selectedRouteId === 'Plan A' ? 3.5 : 2}
                  strokeDasharray="6 4"
                />
                <text x="440" y="180" fill="#f87171" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  PLAN A: SUEZ (HIGH RISK)
                </text>
              </g>
            )}

            {/* Plan B: Cape of Good Hope Tactical Bypass (Cyan Solid - AI Preferred) */}
            {showPlanB && (
              <g opacity={selectedRouteId === 'Plan B' ? 1 : 0.6}>
                <path
                  d={planBPath}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth={selectedRouteId === 'Plan B' ? 3.5 : 2}
                />
                <text x="440" y="460" fill="#22d3ee" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  PLAN B: CAPE OF GOOD HOPE (98.4% SAFETY - RECOMMENDED)
                </text>
              </g>
            )}

            {/* Plan C: Sunda / Lombok Hybrid (Purple Dotted) */}
            {showPlanC && (
              <g opacity={selectedRouteId === 'Plan C' ? 1 : 0.45}>
                <path
                  d={planCPath}
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth={selectedRouteId === 'Plan C' ? 3.5 : 2}
                  strokeDasharray="3 3"
                />
              </g>
            )}

            {/* SMART PORT PLUG HUBS */}
            {showPorts && (
              <>
                {/* Port of Singapore */}
                <g className="cursor-pointer" onClick={() => setSelectedPortDetails(smartPorts[0])}>
                  <circle cx="720" cy="290" r="5" fill="#38bdf8" />
                  <circle cx="720" cy="290" r="9" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.6" />
                  <text x="730" y="293" fill="#bae6fd" fontSize="9" fontWeight="bold">Singapore</text>
                </g>

                {/* Port of Djibouti */}
                <g className="cursor-pointer" onClick={() => setSelectedPortDetails(smartPorts[0])}>
                  <circle cx="510" cy="265" r="5" fill="#38bdf8" />
                  <text x="450" y="278" fill="#38bdf8" fontSize="9" fontWeight="bold">Djibouti (142 Plugs)</text>
                </g>

                {/* Port of Salalah */}
                <g className="cursor-pointer" onClick={() => setSelectedPortDetails(smartPorts[1])}>
                  <circle cx="555" cy="235" r="5" fill="#38bdf8" />
                  <text x="560" y="230" fill="#38bdf8" fontSize="9" fontWeight="bold">Salalah (210 Plugs)</text>
                </g>

                {/* Port of Durban */}
                <g className="cursor-pointer" onClick={() => setSelectedPortDetails(smartPorts[3])}>
                  <circle cx="460" cy="410" r="5" fill="#38bdf8" />
                  <text x="470" y="415" fill="#38bdf8" fontSize="9" fontWeight="bold">Durban (340 Plugs)</text>
                </g>

                {/* Port of Rotterdam */}
                <g className="cursor-pointer" onClick={() => setSelectedPortDetails(smartPorts[4])}>
                  <circle cx="360" cy="110" r="5" fill="#38bdf8" />
                  <text x="310" y="105" fill="#38bdf8" fontSize="9" fontWeight="bold">Rotterdam Destination</text>
                </g>
              </>
            )}

            {/* MV FLUXORA VOYAGER Vessel Marker & Heading Vector */}
            <g transform={`translate(${shipPos.x}, ${shipPos.y})`}>
              {/* Radar pulse wave */}
              <circle cx="0" cy="0" r="16" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.7">
                <animate attributeName="r" values="6;22" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
              </circle>

              {/* Ship Icon (Diamond with Heading Pointer) */}
              <g transform="rotate(246)">
                <polygon points="0,-10 6,6 0,3 -6,6" fill="#22d3ee" stroke="#0891b2" strokeWidth="1.5" />
                <line x1="0" y1="-10" x2="0" y2="-22" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="2 2" />
              </g>

              <text x="14" y="-8" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                MV FLUXORA VOYAGER
              </text>
              <text x="14" y="3" fill="#22d3ee" fontSize="8" fontFamily="monospace">
                16.2 kts • Reefer -18.2°C
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Waypoints & Routing Matrix Card */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Current Planned Navigation Course:</span>
              <span className="text-cyan-300 font-mono text-sm">{selectedRoute?.title || 'Selected Route'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ETA: <strong className="text-slate-200">{selectedRoute?.eta || 'Pending'}</strong> • Total Distance:{' '}
              <strong className="text-slate-200">{(selectedRoute?.distanceNm ?? 0).toLocaleString()} NM</strong> • Transit:{' '}
              <strong className="text-slate-200">{selectedRoute?.transitDays || 0} Days</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const mapRoute: Record<string, string> = {
                  'Plan A': 'PLAN_A',
                  'Plan B': 'PLAN_B',
                  'Plan C': 'PLAN_C',
                };
                openPortDirectoryWithFilter(mapRoute[selectedRouteId] || 'ALL');
              }}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
              title="View Port Authorities & Agents for this route"
            >
              <BookUser className="w-4 h-4 text-cyan-400" />
              <span>Port Authorities & Agents</span>
            </button>

            <button
              onClick={() => setIsBlockchainModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold rounded-xl transition shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
            >
              <span>Digitally Sign & Execute Reroute</span>
            </button>
          </div>
        </div>

        {/* Waypoints Horizontal Breadcrumbs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 text-xs">
          {(selectedRoute?.waypoints || []).map((wp, idx) => (
            <div
              key={wp.name}
              className="flex items-center gap-2 shrink-0 p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"
            >
              <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono text-[10px] font-bold">
                {idx + 1}
              </span>
              <div>
                <div className="font-semibold text-slate-200">{wp.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {wp.lat.toFixed(2)}°, {wp.lng.toFixed(2)}°
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
