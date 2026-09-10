import React, { useState, useMemo } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  X,
  Phone,
  Radio,
  Mail,
  Building2,
  UserCheck,
  Search,
  Check,
  Copy,
  ExternalLink,
  Shield,
  Send,
  Navigation,
  Anchor,
  Clock,
  Zap,
  Activity,
  PhoneCall,
  CheckCircle2,
  PhoneForwarded,
  MapPin,
  Flame,
  AlertTriangle,
  FileText,
  Printer,
  Compass,
} from 'lucide-react';
import { PortContactDirectoryItem, PortRouteAffiliation } from '../../types';

export const PortDirectoryModal: React.FC = () => {
  const {
    isPortDirectoryOpen,
    setIsPortDirectoryOpen,
    portDirectoryFilter,
    setPortDirectoryFilter,
    portDirectory,
    setActiveView,
    sendChatMessage,
    setIsPortCommsOpen,
  } = useCommand();

  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [callingState, setCallingState] = useState<{
    isOpen: boolean;
    portName: string;
    contactName: string;
    contactRole: string;
    phoneNumber: string;
    channelType: 'SAT_COM_VOICE' | 'VHF_RADIO';
    durationSeconds: number;
    callStatus: 'DIALING' | 'CONNECTED' | 'ENDED';
  }>({
    isOpen: false,
    portName: '',
    contactName: '',
    contactRole: '',
    phoneNumber: '',
    channelType: 'SAT_COM_VOICE',
    durationSeconds: 0,
    callStatus: 'DIALING',
  });

  const [telexModalState, setTelexModalState] = useState<{
    isOpen: boolean;
    port: PortContactDirectoryItem | null;
    recipientType: 'PORT_AUTHORITY' | 'SHIPPING_AGENT';
    subject: string;
    urgency: 'STANDARD' | 'URGENT' | 'DISTRESS_EMERGENCY';
    customNotes: string;
    sentSuccess: boolean;
  }>({
    isOpen: false,
    port: null,
    recipientType: 'PORT_AUTHORITY',
    subject: '',
    urgency: 'STANDARD',
    customNotes: '',
    sentSuccess: false,
  });

  // Call timer simulation
  React.useEffect(() => {
    let timer: any;
    if (callingState.isOpen && callingState.callStatus === 'CONNECTED') {
      timer = setInterval(() => {
        setCallingState((prev) => ({ ...prev, durationSeconds: prev.durationSeconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callingState.isOpen, callingState.callStatus]);

  // Connect call after 1.8s
  React.useEffect(() => {
    let timeout: any;
    if (callingState.isOpen && callingState.callStatus === 'DIALING') {
      timeout = setTimeout(() => {
        setCallingState((prev) => ({ ...prev, callStatus: 'CONNECTED' }));
      }, 1800);
    }
    return () => clearTimeout(timeout);
  }, [callingState.isOpen, callingState.callStatus]);

  const handleStartCall = (
    portName: string,
    contactName: string,
    contactRole: string,
    phoneNumber: string,
    channelType: 'SAT_COM_VOICE' | 'VHF_RADIO' = 'SAT_COM_VOICE'
  ) => {
    setCallingState({
      isOpen: true,
      portName,
      contactName,
      contactRole,
      phoneNumber,
      channelType,
      durationSeconds: 0,
      callStatus: 'DIALING',
    });
  };

  const handleEndCall = () => {
    setCallingState((prev) => ({ ...prev, callStatus: 'ENDED' }));
    setTimeout(() => {
      setCallingState({
        isOpen: false,
        portName: '',
        contactName: '',
        contactRole: '',
        phoneNumber: '',
        channelType: 'SAT_COM_VOICE',
        durationSeconds: 0,
        callStatus: 'DIALING',
      });
    }, 400);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyFullCard = (port: PortContactDirectoryItem) => {
    const formatted = `=== MARITIME CONTACT DIRECTORY: ${port.portName.toUpperCase()} (${port.unLoCode}) ===
Country / Region: ${port.country} (${port.region})
Role: ${port.roleInVoyage}
Distance: ${port.distanceNm} NM

[PORT AUTHORITY: ${port.portAuthority.authorityName}]
Harbour Master: ${port.portAuthority.harborMaster}
24/7 Operations / VTS: ${port.portAuthority.vtsControlPhone24h}
VHF Channels: ${port.portAuthority.vhfChannels}
Email: ${port.portAuthority.opsEmail}
Emergency Hotline: ${port.portAuthority.emergencyPhone}
Inmarsat / MMSI: ${port.portAuthority.inmarsatOrMMSI}
Address: ${port.portAuthority.locationAddress}

[DESIGNATED SHIPPING AGENT: ${port.shippingAgent.agencyName}]
Designated Agent: ${port.shippingAgent.designatedAgentName} (${port.shippingAgent.title})
24/7 Mobile: ${port.shippingAgent.mobile24h}
Office Landline: ${port.shippingAgent.officePhone}
Agent Email: ${port.shippingAgent.email}
Quay Duty Desk: ${port.shippingAgent.dutyDesk}
Pilotage Hotline: ${port.shippingAgent.pilotageDeskPhone}
Services: ${port.shippingAgent.servicesProvided.join(', ')}

[TECHNICAL SPECIFICATIONS]
Max Draft: ${port.technicalCapabilities.maxDraftMeters}m
Shore Power Plugs: ${port.technicalCapabilities.availableShorePlugs} units
Bunkers Available: ${port.technicalCapabilities.bunkerTypes.join(', ')}
Berth Wait: ${port.technicalCapabilities.berthWaitTimeHours} hrs
Hospital Distance: ${port.technicalCapabilities.hospitalDistanceKm} km
Air Hub: ${port.technicalCapabilities.nearestAirHub}
Readiness: ${port.emergencyReadiness}`;

    handleCopy(formatted, `full-${port.id}`);
  };

  const handleOpenTelex = (port: PortContactDirectoryItem, recipientType: 'PORT_AUTHORITY' | 'SHIPPING_AGENT') => {
    const defaultSubject =
      recipientType === 'PORT_AUTHORITY'
        ? `VOYAGE NOTICE // MV FLUXORA VOYAGER (IMO 9982410) - BERTH CLEARANCE REQ`
        : `HUSBANDRY & SPECIAL CARGO ADVICE // MV FLUXORA VOYAGER - ${port.unLoCode}`;
    setTelexModalState({
      isOpen: true,
      port,
      recipientType,
      subject: defaultSubject,
      urgency: 'STANDARD',
      customNotes: '',
      sentSuccess: false,
    });
  };

  const handleSendTelex = () => {
    if (!telexModalState.port) return;
    const recipient =
      telexModalState.recipientType === 'PORT_AUTHORITY'
        ? telexModalState.port.portAuthority.authorityName
        : `${telexModalState.port.shippingAgent.designatedAgentName} (${telexModalState.port.shippingAgent.agencyName})`;

    sendChatMessage(
      `[OFFICIAL TELEX DISPATCHED] To: ${recipient} | Port: ${telexModalState.port.portName} | Subject: ${telexModalState.subject} | Urgency: ${telexModalState.urgency} | Notes: ${telexModalState.customNotes || 'Vessel in transit. Cold-chain payload at -18.2°C nominal. Requesting priority berth reservation.'}`,
      telexModalState.port.portName,
      {
        name: `Telex_${telexModalState.port.unLoCode}_FLUXORA.pdf`,
        size: '142 KB',
        type: 'application/pdf',
      }
    );

    setTelexModalState((prev) => ({ ...prev, sentSuccess: true }));
    setTimeout(() => {
      setTelexModalState({
        isOpen: false,
        port: null,
        recipientType: 'PORT_AUTHORITY',
        subject: '',
        urgency: 'STANDARD',
        customNotes: '',
        sentSuccess: false,
      });
    }, 1800);
  };

  // Filtered port list
  const filteredPorts = useMemo(() => {
    return portDirectory.filter((port) => {
      // Filter by category tab
      if (portDirectoryFilter === 'CURRENT') {
        if (!port.routes.includes('CURRENT_DESTINATION') && !port.routes.includes('CURRENT_ORIGIN')) {
          return false;
        }
      } else if (portDirectoryFilter === 'PLAN_A') {
        if (!port.routes.includes('PLAN_A')) return false;
      } else if (portDirectoryFilter === 'PLAN_B') {
        if (!port.routes.includes('PLAN_B')) return false;
      } else if (portDirectoryFilter === 'PLAN_C') {
        if (!port.routes.includes('PLAN_C')) return false;
      } else if (portDirectoryFilter === 'REROUTE') {
        if (!port.routes.includes('REROUTE_CANDIDATE')) return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = port.portName.toLowerCase().includes(query);
        const matchesCountry = port.country.toLowerCase().includes(query);
        const matchesLoCode = port.unLoCode.toLowerCase().includes(query);
        const matchesAuth = port.portAuthority.authorityName.toLowerCase().includes(query);
        const matchesMaster = port.portAuthority.harborMaster.toLowerCase().includes(query);
        const matchesAgent = port.shippingAgent.designatedAgentName.toLowerCase().includes(query);
        const matchesAgency = port.shippingAgent.agencyName.toLowerCase().includes(query);
        const matchesRole = port.roleInVoyage.toLowerCase().includes(query);
        return (
          matchesName ||
          matchesCountry ||
          matchesLoCode ||
          matchesAuth ||
          matchesMaster ||
          matchesAgent ||
          matchesAgency ||
          matchesRole
        );
      }
      return true;
    });
  }, [portDirectory, portDirectoryFilter, searchQuery]);

  if (!isPortDirectoryOpen) return null;

  return (
    <div
      id="modal-port-directory"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto"
    >
      <div className="w-full max-w-6xl max-h-[94vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col relative text-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Port Authorities & Maritime Agents Directory
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-mono font-bold">
                  {filteredPorts.length} Ports Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct telecommunications, 24/7 Harbour Masters, VHF channels, and designated shipping agents across Current Voyage, Plan A, Plan B, Plan C, and Emergency Reroutes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsPortDirectoryOpen(false);
                setIsPortCommsOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 font-medium flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
              title="Open Encrypted Port Chat"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Live Port Comms</span>
            </button>
            <button
              onClick={() => setIsPortDirectoryOpen(false)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              title="Close Directory"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Navigation & Search Bar */}
        <div className="p-3 sm:px-5 sm:py-3 bg-slate-950/50 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              id="filter-all-ports"
              onClick={() => setPortDirectoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                portDirectoryFilter === 'ALL'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              All Ports ({portDirectory.length})
            </button>
            <button
              id="filter-current-ports"
              onClick={() => setPortDirectoryFilter('CURRENT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                portDirectoryFilter === 'CURRENT'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Currently Going To / Origin (2)</span>
            </button>
            <button
              id="filter-plana-ports"
              onClick={() => setPortDirectoryFilter('PLAN_A')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                portDirectoryFilter === 'PLAN_A'
                  ? 'bg-cyan-700 text-white shadow-md shadow-cyan-900/40'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              Plan A (Suez) (6)
            </button>
            <button
              id="filter-planb-ports"
              onClick={() => setPortDirectoryFilter('PLAN_B')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                portDirectoryFilter === 'PLAN_B'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              Plan B (Cape) (7)
            </button>
            <button
              id="filter-planc-ports"
              onClick={() => setPortDirectoryFilter('PLAN_C')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                portDirectoryFilter === 'PLAN_C'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              Plan C (Lombok) (7)
            </button>
            <button
              id="filter-reroute-ports"
              onClick={() => setPortDirectoryFilter('REROUTE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                portDirectoryFilter === 'REROUTE'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>Reroute Safe Havens (10)</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search port, country, UN/LOCODE, agent name, agency..."
              className="w-full pl-9 pr-8 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Port Cards Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-slate-950/40">
          {filteredPorts.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-cyan-400" />
              <h3 className="text-base font-bold text-white mb-1">No Ports Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No port authorities or shipping agents matched your search &quot;{searchQuery}&quot;. Clear search to view all {portDirectory.length} strategic maritime hubs.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPortDirectoryFilter('ALL');
                }}
                className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredPorts.map((port) => (
              <div
                key={port.id}
                id={`port-card-${port.unLoCode.toLowerCase()}`}
                className={`rounded-2xl border transition-all ${
                  port.routes.includes('CURRENT_DESTINATION')
                    ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                    : port.routes.includes('CURRENT_ORIGIN')
                    ? 'bg-slate-900/90 border-blue-500/50 shadow-lg shadow-blue-950/20'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                } p-4 sm:p-5`}
              >
                {/* Port Top Header Banner */}
                <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <span>{port.portName}</span>
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-950 text-cyan-300 border border-slate-700 font-mono font-bold">
                        {port.unLoCode}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {port.country} • {port.region}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {port.routes.map((routeTag) => (
                        <span
                          key={routeTag}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            routeTag === 'CURRENT_DESTINATION'
                              ? 'bg-emerald-950/70 border-emerald-600 text-emerald-300'
                              : routeTag === 'CURRENT_ORIGIN'
                              ? 'bg-blue-950/70 border-blue-600 text-blue-300'
                              : routeTag === 'PLAN_A'
                              ? 'bg-cyan-950/70 border-cyan-700 text-cyan-300'
                              : routeTag === 'PLAN_B'
                              ? 'bg-indigo-950/70 border-indigo-700 text-indigo-300'
                              : routeTag === 'PLAN_C'
                              ? 'bg-violet-950/70 border-violet-700 text-violet-300'
                              : 'bg-amber-950/70 border-amber-700 text-amber-300'
                          }`}
                        >
                          {routeTag === 'CURRENT_DESTINATION' && '★ CURRENT DESTINATION'}
                          {routeTag === 'CURRENT_ORIGIN' && 'ORIGIN PORT'}
                          {routeTag === 'PLAN_A' && 'PLAN A (Suez)'}
                          {routeTag === 'PLAN_B' && 'PLAN B (Cape)'}
                          {routeTag === 'PLAN_C' && 'PLAN C (Lombok)'}
                          {routeTag === 'REROUTE_CANDIDATE' && 'REROUTE SAFE HAVEN'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions right: Distance, Copy, Print */}
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-1">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Distance</span>
                      <span className="text-sm font-bold font-mono text-cyan-300">
                        {port.distanceNm === 0 ? 'AT BERTH' : `${port.distanceNm.toLocaleString()} NM`}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyFullCard(port)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                      title="Copy complete contact card to bridge log"
                    >
                      {copiedId === `full-${port.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Info</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Role Description */}
                <div className="my-3 px-3 py-1.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    <strong className="text-white">Role in Voyage:</strong> {port.roleInVoyage}
                  </span>
                </div>

                {/* Two-Column Grid: Port Authority vs Maritime Shipping Agent */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-3 text-xs">
                  {/* Left Column: Official Port Authority Contact Details */}
                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-blue-900/40 relative">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">
                            Official Port Authority
                          </span>
                          <span className="font-bold text-slate-100 text-xs">
                            {port.portAuthority.authorityName}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenTelex(port, 'PORT_AUTHORITY')}
                        className="px-2 py-1 rounded bg-blue-900/50 hover:bg-blue-800 text-blue-300 text-[11px] font-medium flex items-center gap-1 transition"
                        title="Send Official Arrival / Clearance Telex"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Telex</span>
                      </button>
                    </div>

                    <div className="space-y-2 text-slate-300">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-400">Harbour Master:</span>
                        <span className="font-bold text-white text-right">{port.portAuthority.harborMaster}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-400">24/7 Operations / VTS:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-cyan-300 font-bold">
                            {port.portAuthority.vtsControlPhone24h}
                          </span>
                          <button
                            onClick={() =>
                              handleStartCall(
                                port.portName,
                                port.portAuthority.harborMaster,
                                'Harbour Master / VTS Desk',
                                port.portAuthority.vtsControlPhone24h
                              )
                            }
                            className="p-1 rounded bg-cyan-950 border border-cyan-700/50 text-cyan-300 hover:bg-cyan-800 transition"
                            title="Call 24/7 VTS Desk via Satellite Link"
                          >
                            <Phone className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() =>
                              handleCopy(port.portAuthority.vtsControlPhone24h, `vts-${port.id}`)
                            }
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                            title="Copy Phone"
                          >
                            {copiedId === `vts-${port.id}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <span className="text-slate-400 shrink-0">VHF Calling Channels:</span>
                        <span className="font-mono text-amber-300 text-right font-medium">
                          {port.portAuthority.vhfChannels}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-400">Official Ops Email:</span>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`mailto:${port.portAuthority.opsEmail}`}
                            className="text-cyan-400 hover:underline font-mono truncate max-w-[180px]"
                          >
                            {port.portAuthority.opsEmail}
                          </a>
                          <button
                            onClick={() => handleCopy(port.portAuthority.opsEmail, `email-${port.id}`)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                            title="Copy Email"
                          >
                            {copiedId === `email-${port.id}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-red-400 font-semibold flex items-center gap-1">
                          <Flame className="w-3 h-3 text-red-500" />
                          Emergency / SAR:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-red-300 font-bold text-right truncate max-w-[200px]">
                            {port.portAuthority.emergencyPhone}
                          </span>
                          <button
                            onClick={() =>
                              handleStartCall(
                                port.portName,
                                'Emergency Command / SAR',
                                'Coast Guard & Maritime Rescue',
                                port.portAuthority.emergencyPhone
                              )
                            }
                            className="p-1 rounded bg-red-950 border border-red-700/50 text-red-300 hover:bg-red-800 transition"
                            title="Emergency Direct Dial"
                          >
                            <Phone className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
                        <span>Digital IDs:</span>
                        <span className="font-mono text-slate-300">{port.portAuthority.inmarsatOrMMSI}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Designated Maritime Shipping Agent */}
                  <div className="p-3.5 bg-slate-950/80 rounded-xl border border-emerald-900/40 relative">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                            Designated Shipping Agent
                          </span>
                          <span className="font-bold text-slate-100 text-xs">
                            {port.shippingAgent.agencyName}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenTelex(port, 'SHIPPING_AGENT')}
                        className="px-2 py-1 rounded bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 text-[11px] font-medium flex items-center gap-1 transition"
                        title="Dispatch Husbandry Instructions"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Agent Telex</span>
                      </button>
                    </div>

                    <div className="space-y-2 text-slate-300">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-400">Designated Agent:</span>
                        <div className="text-right">
                          <span className="font-bold text-white block">
                            {port.shippingAgent.designatedAgentName}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[200px]">
                            {port.shippingAgent.title}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-400">24/7 Agent Mobile:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-emerald-300 font-bold">
                            {port.shippingAgent.mobile24h}
                          </span>
                          <button
                            onClick={() =>
                              handleStartCall(
                                port.portName,
                                port.shippingAgent.designatedAgentName,
                                `Designated Agent (${port.shippingAgent.agencyName})`,
                                port.shippingAgent.mobile24h
                              )
                            }
                            className="p-1 rounded bg-emerald-950 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-800 transition"
                            title="Call Agent 24/7 Mobile via Satellite"
                          >
                            <Phone className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() =>
                              handleCopy(port.shippingAgent.mobile24h, `agent-mob-${port.id}`)
                            }
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                            title="Copy Mobile"
                          >
                            {copiedId === `agent-mob-${port.id}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-400">Office / Pilot Desk:</span>
                        <span className="font-mono text-slate-300 text-right">
                          {port.shippingAgent.officePhone} • {port.shippingAgent.pilotageDeskPhone}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-400">Agent Email:</span>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`mailto:${port.shippingAgent.email}`}
                            className="text-emerald-400 hover:underline font-mono truncate max-w-[180px]"
                          >
                            {port.shippingAgent.email}
                          </a>
                          <button
                            onClick={() => handleCopy(port.shippingAgent.email, `agent-mail-${port.id}`)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                            title="Copy Agent Email"
                          >
                            {copiedId === `agent-mail-${port.id}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-400">Duty Desk Location:</span>
                        <span className="text-slate-200 text-right truncate max-w-[200px]">
                          {port.shippingAgent.dutyDesk}
                        </span>
                      </div>

                      {/* Services Chips */}
                      <div className="pt-1.5 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-400 block mb-1">Guaranteed Services:</span>
                        <div className="flex flex-wrap gap-1">
                          {port.shippingAgent.servicesProvided.map((svc) => (
                            <span
                              key={svc}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                            >
                              ✓ {svc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Specs & Emergency Clearance Bar */}
                <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Anchor className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Max Draft:</span>
                      <strong className="text-white font-mono">{port.technicalCapabilities.maxDraftMeters}m</strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Shore Plugs:</span>
                      <strong className="text-white font-mono">
                        {port.technicalCapabilities.availableShorePlugs} Available
                      </strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>Berth Wait:</span>
                      <strong className="text-white font-mono">{port.technicalCapabilities.berthWaitTimeHours}h</strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-rose-400" />
                      <span>Hospital:</span>
                      <strong className="text-white font-mono">{port.technicalCapabilities.hospitalDistanceKm} km</strong>
                    </div>

                    <div className="hidden xl:flex items-center gap-1.5">
                      <span className="text-slate-500">Bunkers:</span>
                      <span className="text-slate-300 font-mono">
                        {port.technicalCapabilities.bunkerTypes.join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-mono border flex items-center gap-1.5 ${
                        port.emergencyReadiness === 'IMMEDIATE_CLEARANCE'
                          ? 'bg-emerald-950/60 border-emerald-700/80 text-emerald-300'
                          : port.emergencyReadiness === '24_7_STANDBY'
                          ? 'bg-blue-950/60 border-blue-700/80 text-blue-300'
                          : 'bg-amber-950/60 border-amber-700/80 text-amber-300'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>{port.emergencyReadiness.replace(/_/g, ' ')}</span>
                    </span>

                    <button
                      onClick={() => {
                        setIsPortDirectoryOpen(false);
                        setActiveView('map');
                      }}
                      className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition"
                      title="Plot Port on Live Chart"
                    >
                      <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Chart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:px-5 sm:py-3 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>
              All communication channels verified against IMO & Lloyd&apos;s Maritime Port Directory 2026.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-cyan-400 font-bold">FLUXORA SAT-COM BRIDGE V4.8</span>
            <button
              onClick={() => setIsPortDirectoryOpen(false)}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Sub-Modal: Simulated Satellite Phone / VHF Radio Call */}
        {callingState.isOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
            <div className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl p-6 text-slate-100 text-center relative overflow-hidden animate-in fade-in zoom-in duration-200">
              {/* Background radar animation */}
              <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 relative">
                {callingState.callStatus === 'DIALING' ? (
                  <PhoneForwarded className="w-8 h-8 animate-pulse" />
                ) : (
                  <PhoneCall className="w-8 h-8 text-emerald-400 animate-bounce" />
                )}
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="text-xs uppercase tracking-widest text-cyan-400 font-mono mb-1 font-bold">
                {callingState.channelType === 'SAT_COM_VOICE' ? 'Starlink Sat-Com Secure Voice' : 'Maritime VHF Radio'}
              </div>

              <h3 className="text-lg font-extrabold text-white mb-0.5">{callingState.contactName}</h3>
              <p className="text-xs text-slate-400 mb-1">{callingState.contactRole}</p>
              <p className="text-xs text-cyan-300 font-medium mb-3">{callingState.portName}</p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 mb-4 font-mono text-sm">
                <span className="text-slate-400 text-xs block mb-1">Target Number:</span>
                <span className="text-white font-bold tracking-wider">{callingState.phoneNumber}</span>
              </div>

              <div className="mb-6">
                {callingState.callStatus === 'DIALING' ? (
                  <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Establishing Encrypted Bridge Carrier...</span>
                  </div>
                ) : callingState.callStatus === 'CONNECTED' ? (
                  <div className="space-y-2">
                    <div className="text-emerald-400 text-xs font-mono font-bold flex items-center justify-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>LIVE AUDIO CARRIER • {Math.floor(callingState.durationSeconds / 60)}:{String(callingState.durationSeconds % 60).padStart(2, '0')}</span>
                    </div>
                    {/* Simulated voice wave bars */}
                    <div className="flex items-center justify-center gap-1 h-6">
                      {[12, 24, 18, 28, 14, 22, 32, 16, 26, 12].map((height, i) => (
                        <div
                          key={i}
                          style={{ height: `${height}px` }}
                          className="w-1 bg-cyan-400 rounded-full animate-pulse"
                        />
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      &quot;Bridge link acknowledged. MV FLUXORA VOYAGER, we read you loud and clear on priority channel.&quot;
                    </p>
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs font-mono">Call Terminated</div>
                )}
              </div>

              <button
                onClick={handleEndCall}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition cursor-pointer"
              >
                <Phone className="w-4 h-4 rotate-[135deg]" />
                <span>Disconnect Call</span>
              </button>
            </div>
          </div>
        )}

        {/* Sub-Modal: Official Telex Dispatcher */}
        {telexModalState.isOpen && telexModalState.port && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 text-slate-100 relative">
              <button
                onClick={() => setTelexModalState((prev) => ({ ...prev, isOpen: false }))}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-4">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Maritime Telex Dispatcher
                  </h3>
                  <p className="text-xs text-slate-400">
                    To: {telexModalState.recipientType === 'PORT_AUTHORITY' ? telexModalState.port.portAuthority.authorityName : telexModalState.port.shippingAgent.agencyName}
                  </p>
                </div>
              </div>

              {telexModalState.sentSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                  <h4 className="text-base font-bold text-white">Telex Successfully Transmitted</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Cryptographic acknowledgment received from {telexModalState.port.unLoCode} Station. Copy archived in bridge log and live port communications.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Priority / Urgency:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['STANDARD', 'URGENT', 'DISTRESS_EMERGENCY'] as const).map((urg) => (
                        <button
                          key={urg}
                          onClick={() => setTelexModalState((prev) => ({ ...prev, urgency: urg }))}
                          className={`py-1.5 px-2 rounded-lg border text-center font-bold text-[11px] transition ${
                            telexModalState.urgency === urg
                              ? urg === 'DISTRESS_EMERGENCY'
                                ? 'bg-red-600 text-white border-red-500'
                                : urg === 'URGENT'
                                ? 'bg-amber-600 text-white border-amber-500'
                                : 'bg-cyan-600 text-white border-cyan-500'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {urg.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Subject Line:</label>
                    <input
                      type="text"
                      value={telexModalState.subject}
                      onChange={(e) => setTelexModalState((prev) => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Custom Notice / Instructions:</label>
                    <textarea
                      rows={4}
                      value={telexModalState.customNotes}
                      onChange={(e) => setTelexModalState((prev) => ({ ...prev, customNotes: e.target.value }))}
                      placeholder="e.g., Requesting priority berth reservation for MV FLUXORA VOYAGER due to cold-chain pharmaceutical cargo at -18.2°C. Confirming shore power plug allocation upon docking."
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400">
                    <span className="block text-slate-500 uppercase text-[9px]">Vessel Particulars Attached:</span>
                    MV FLUXORA VOYAGER • IMO 9982410 • Flag Singapore • Master Capt. V. Sharma • Cold-Chain Pharma (-18.2°C)
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setTelexModalState((prev) => ({ ...prev, isOpen: false }))}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendTelex}
                      className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Telex</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
