import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NavView,
  AutonomousAgent,
  RouteOption,
  ColdChainTelemetry,
  SmartPortPlug,
  SupplyPreOrderItem,
  BlockchainAuditRecord,
  ThreatHazard,
  NewsBulletin,
  ChatMessage,
  BunkerFuelPrice,
  EmergencyMedicineItem,
  NearbyPharmaSource,
  EmergencyBuyer,
  EmergencyPreOrder,
  PortContactDirectoryItem,
} from '../types';
import {
  INITIAL_AGENTS,
  INITIAL_ROUTES,
  INITIAL_COLD_CHAIN,
  INITIAL_SMART_PORTS,
  INITIAL_SUPPLIES,
  INITIAL_BLOCKCHAIN_RECORDS,
  INITIAL_THREATS,
  INITIAL_NEWS,
  INITIAL_BUNKER_PRICES,
  EMERGENCY_MEDICINES,
  NEARBY_PHARMA_SOURCES,
  EMERGENCY_BUYERS,
  INITIAL_EMERGENCY_PRE_ORDERS,
} from '../data/mockData';
import { PORT_CONTACTS_DIRECTORY } from '../data/portContactsData';
import { Language } from '../utils/i18n';

interface CommandContextType {
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  selectedRouteId: 'Plan A' | 'Plan B' | 'Plan C';
  setSelectedRouteId: (routeId: 'Plan A' | 'Plan B' | 'Plan C') => void;
  routes: RouteOption[];
  agents: AutonomousAgent[];
  coldChain: ColdChainTelemetry;
  updateColdChainTemp: (newTemp: number) => void;
  smartPorts: SmartPortPlug[];
  reservePlug: (portName: string) => void;
  captainUplink: {
    fuelVlsfoTons: number;
    fuelMgoTons: number;
    crewRationsDays: number;
    freshWaterLiters: number;
    seaConditionBeaufort: number;
    waveHeightMeters: number;
    windKnots: number;
    crewCount: number;
    emergencyDistressTriggered: boolean;
  };
  updateCaptainUplink: (updates: Partial<CommandContextType['captainUplink']>) => void;
  triggerEmergencyDistress: () => void;
  supplies: SupplyPreOrderItem[];
  toggleSupplyMasterApproval: (id: string) => void;
  addSupplyItem: (item: Omit<SupplyPreOrderItem, 'id'>) => void;
  blockchainRecords: BlockchainAuditRecord[];
  signAndExecuteReroute: (
    routeId: 'Plan A' | 'Plan B' | 'Plan C',
    initiatorName: string,
    role: string,
    ownerNote?: string
  ) => { txHash: string; success: boolean };
  threats: ThreatHazard[];
  newsBulletins: NewsBulletin[];
  newsFeed: NewsBulletin[];
  bunkerFuelPrices: BunkerFuelPrice[];
  chatMessages: ChatMessage[];
  sendChatMessage: (msg: string, destinationPort: string, attachment?: { name: string; size: string; type: string }) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  nightVisionMode: boolean;
  setNightVisionMode: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  isSatelliteOnline: boolean;
  toggleSatelliteSync: () => void;
  syncQueueCount: number;
  triggerManualSync: () => void;
  locationPermissionGranted: boolean;
  requestLocationPermission: () => Promise<boolean>;
  deviceCoordinates: { lat: number; lng: number } | null;
  // Modals
  isBlockchainModalOpen: boolean;
  setIsBlockchainModalOpen: (open: boolean) => void;
  isPortCommsOpen: boolean;
  setIsPortCommsOpen: (open: boolean) => void;
  selectedPortDetails: SmartPortPlug | null;
  setSelectedPortDetails: (port: SmartPortPlug | null) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isTourOpen: boolean;
  setIsTourOpen: (open: boolean) => void;
  // Emergency Medicine Pre-Ordering Protocol
  isPreOrderingOpen: boolean;
  setIsPreOrderingOpen: (open: boolean) => void;
  isExtremelyDire: boolean;
  direUncertaintyOverride: boolean;
  toggleDireUncertainty: () => void;
  emergencyPreOrders: EmergencyPreOrder[];
  executeEmergencyPreOrder: (order: {
    buyerId: string;
    sourceId: string;
    medicines: { medicineId: string; quantity: number }[];
    initiatorName: string;
    role: string;
  }) => { success: boolean; orderNumber: string; txHash: string };
  emergencyMedicines: EmergencyMedicineItem[];
  nearbyPharmaSources: NearbyPharmaSource[];
  emergencyBuyers: EmergencyBuyer[];
  ownerNotificationSent: boolean;
  vesselMasterNotificationSent: boolean;
  // Port Authority & Maritime Agent Directory
  isPortDirectoryOpen: boolean;
  setIsPortDirectoryOpen: (open: boolean) => void;
  portDirectoryFilter: string;
  setPortDirectoryFilter: (filter: string) => void;
  openPortDirectoryWithFilter: (filter?: string) => void;
  portDirectory: PortContactDirectoryItem[];
  selectedPortContact: PortContactDirectoryItem | null;
  setSelectedPortContact: (port: PortContactDirectoryItem | null) => void;
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export const CommandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<NavView>('map');
  const [selectedRouteId, setSelectedRouteId] = useState<'Plan A' | 'Plan B' | 'Plan C'>('Plan B');
  const [routes, setRoutes] = useState<RouteOption[]>(INITIAL_ROUTES);
  const [agents, setAgents] = useState<AutonomousAgent[]>(INITIAL_AGENTS);
  const [coldChain, setColdChain] = useState<ColdChainTelemetry>(INITIAL_COLD_CHAIN);
  const [smartPorts, setSmartPorts] = useState<SmartPortPlug[]>(INITIAL_SMART_PORTS);
  const [supplies, setSupplies] = useState<SupplyPreOrderItem[]>(INITIAL_SUPPLIES);
  const [blockchainRecords, setBlockchainRecords] = useState<BlockchainAuditRecord[]>(INITIAL_BLOCKCHAIN_RECORDS);
  const [threats] = useState<ThreatHazard[]>(INITIAL_THREATS);
  const [newsBulletins] = useState<NewsBulletin[]>(INITIAL_NEWS);
  const [bunkerFuelPrices] = useState<BunkerFuelPrice[]>(INITIAL_BUNKER_PRICES);

  const [language, setLanguage] = useState<Language>(() => {
    try {
      return (localStorage.getItem('fluxora_lang') as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  const [nightVisionMode, setNightVisionMode] = useState<boolean>(false);
  const [isSatelliteOnline, setIsSatelliteOnline] = useState<boolean>(true);
  const [syncQueueCount, setSyncQueueCount] = useState<number>(0);

  const [locationPermissionGranted, setLocationPermissionGranted] = useState<boolean>(false);
  const [deviceCoordinates, setDeviceCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // Modals state
  const [isBlockchainModalOpen, setIsBlockchainModalOpen] = useState<boolean>(false);
  const [isPortCommsOpen, setIsPortCommsOpen] = useState<boolean>(false);
  const [selectedPortDetails, setSelectedPortDetails] = useState<SmartPortPlug | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [ownerNotificationSent, setOwnerNotificationSent] = useState<boolean>(true);
  const [vesselMasterNotificationSent, setVesselMasterNotificationSent] = useState<boolean>(true);

  // Emergency Medicine Pre-Ordering Protocol states
  const [isPreOrderingOpen, setIsPreOrderingOpen] = useState<boolean>(false);
  const [direUncertaintyOverride, setDireUncertaintyOverride] = useState<boolean>(false);
  const [emergencyPreOrders, setEmergencyPreOrders] = useState<EmergencyPreOrder[]>(INITIAL_EMERGENCY_PRE_ORDERS);

  // Port Authority & Maritime Agent Directory state
  const [isPortDirectoryOpen, setIsPortDirectoryOpen] = useState<boolean>(false);
  const [portDirectoryFilter, setPortDirectoryFilter] = useState<string>('ALL');
  const [selectedPortContact, setSelectedPortContact] = useState<PortContactDirectoryItem | null>(null);

  const openPortDirectoryWithFilter = (filter: string = 'ALL') => {
    setPortDirectoryFilter(filter);
    setIsPortDirectoryOpen(true);
  };

  // Captain Uplink
  const [captainUplink, setCaptainUplink] = useState({
    fuelVlsfoTons: 1420,
    fuelMgoTons: 310,
    crewRationsDays: 38,
    freshWaterLiters: 84000,
    seaConditionBeaufort: 6,
    waveHeightMeters: 3.8,
    windKnots: 28,
    crewCount: 24,
    emergencyDistressTriggered: false,
  });

  // Chat messages with Port Authorities
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'chat-1',
      sender: 'Djibouti VTMIS Control',
      senderRole: 'Port Authority Vessel Traffic Service',
      senderPort: 'DJJIB',
      message: 'MV FLUXORA VOYAGER: Berth 4 Shore-Power Reefer Bank reserved for October 1. Priority channel 12.',
      timestamp: '10:15 UTC',
      encrypted: true,
      verified: true,
    },
    {
      id: 'chat-2',
      sender: 'Rotterdam Maasvlakte Harbor Master',
      senderRole: 'Port Operations Directorate',
      senderPort: 'NLRTM',
      message: 'EU-ETS Green Corridor pre-clearance token verified via Fluxora Blockchain Smart Contract #0x8f...3a9.',
      timestamp: '11:40 UTC',
      encrypted: true,
      verified: true,
      attachment: {
        name: 'Clearance_Cert_IMO_9982410.pdf',
        size: '1.4 MB',
        type: 'application/pdf',
      },
    },
  ]);

  useEffect(() => {
    localStorage.setItem('fluxora_lang', language);
  }, [language]);

  // Subtle live telemetry oscillation for realistic command center feel
  useEffect(() => {
    const interval = setInterval(() => {
      setColdChain((prev) => {
        const delta = (Math.random() - 0.5) * 0.08;
        const newActual = Number((prev.actualTempC + delta).toFixed(2));
        return {
          ...prev,
          actualTempC: newActual > -16 ? -16.5 : newActual < -20.5 ? -20.1 : newActual,
        };
      });

      setAgents((prev) =>
        prev.map((agent) => {
          const loadVariance = Math.floor((Math.random() - 0.5) * 6);
          const newLoad = Math.max(10, Math.min(95, agent.computeLoad + loadVariance));
          return { ...agent, computeLoad: newLoad };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const updateColdChainTemp = (newTemp: number) => {
    setColdChain((prev) => ({
      ...prev,
      actualTempC: Number(newTemp.toFixed(1)),
      holdTimeRemainingHours: newTemp < -18 ? 16.5 : 12.2,
    }));
  };

  const reservePlug = (portName: string) => {
    setSmartPorts((prev) =>
      prev.map((p) => {
        if (p.portName === portName && p.availablePlugs > 0) {
          return {
            ...p,
            availablePlugs: p.availablePlugs - 1,
            occupancyRatePct: Math.min(100, Math.round(((p.totalPlugs - (p.availablePlugs - 1)) / p.totalPlugs) * 100)),
          };
        }
        return p;
      })
    );
  };

  const updateCaptainUplink = (updates: Partial<typeof captainUplink>) => {
    setCaptainUplink((prev) => ({ ...prev, ...updates }));
    if (!isSatelliteOnline) {
      setSyncQueueCount((q) => q + 1);
    }
  };

  const triggerEmergencyDistress = () => {
    setCaptainUplink((prev) => ({ ...prev, emergencyDistressTriggered: true }));
    setSelectedRouteId('Plan B');
    const emergencyTx = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setBlockchainRecords((prev) => [
      {
        txHash: emergencyTx,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        action: 'SOLAS_DISTRESS_EMERGENCY_REROUTE_TRIGGER',
        initiator: 'Vessel Captain Emergency Uplink',
        role: 'Vessel Captain',
        blockNumber: 19842104 + prev.length,
        complianceProof: 'IMO-GMDSS-SAR-PRIORITY-DISTRESS-SIG',
        ownerConfirmationStatus: 'CONFIRMED',
        shipMasterNotificationSent: true,
      },
      ...prev,
    ]);
  };

  // Pre-Ordering Emergency Uncertainty Condition Logic
  // Works ONLY if the situation is extremely dire:
  // 1) Captain Emergency Distress active, OR
  // 2) Cold-Chain Temperature anomaly (> -15°C or CRITICAL risk), OR
  // 3) Manual Master Dire Uncertainty Override declared
  const isExtremelyDire = Boolean(
    captainUplink.emergencyDistressTriggered ||
    coldChain.currentTempCelsius > -15.0 ||
    coldChain.cargoIntegrityRisk === 'CRITICAL' ||
    direUncertaintyOverride
  );

  const toggleDireUncertainty = () => {
    setDireUncertaintyOverride((prev) => !prev);
  };

  const executeEmergencyPreOrder = ({
    buyerId,
    sourceId,
    medicines: selectedMeds,
    initiatorName,
    role,
  }: {
    buyerId: string;
    sourceId: string;
    medicines: { medicineId: string; quantity: number }[];
    initiatorName: string;
    role: string;
  }) => {
    const buyer = EMERGENCY_BUYERS.find((b) => b.id === buyerId) || EMERGENCY_BUYERS[0];
    const source = NEARBY_PHARMA_SOURCES.find((s) => s.id === sourceId) || NEARBY_PHARMA_SOURCES[0];

    const orderedItems = selectedMeds.map((sm) => {
      const med = EMERGENCY_MEDICINES.find((m) => m.id === sm.medicineId);
      return {
        medicineName: med?.name || 'Emergency Medical Asset',
        quantity: sm.quantity,
        unit: med?.unit || 'Units',
      };
    });

    const calculatedTotal = selectedMeds.reduce((sum, sm) => {
      const med = EMERGENCY_MEDICINES.find((m) => m.id === sm.medicineId);
      return sum + (med ? med.pricePerUnitUsd * sm.quantity : 0);
    }, 45000); // 45,000 USD charter air-medevac logistics baseline

    const randomTx = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const orderNum = `PRE-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPreOrder: EmergencyPreOrder = {
      id: 'ord-' + Date.now().toString(36),
      orderNumber: orderNum,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
      status: 'DISPATCHED',
      uncertaintyCause: 'Extremely Dire Maritime Voyage Crisis: Route Blockade & Cold-Chain Threat',
      buyerName: buyer.name,
      destinationCity: `${buyer.city}, ${buyer.country}`,
      sourceHubName: source.name,
      sourceHubCountry: source.country,
      medicines: orderedItems,
      totalCostUsd: calculatedTotal,
      transportMode: source.transportMode,
      etaBuyer: `In ${source.dispatchTransitHours}h (Express Shore Dispatch to ${buyer.city})`,
      authorizedBy: `${initiatorName} (${role})`,
      blockchainProof: `SHA256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    };

    setEmergencyPreOrders((prev) => [newPreOrder, ...prev]);

    // Record on Blockchain
    setBlockchainRecords((prev) => [
      {
        txHash: randomTx,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        action: `EMERGENCY_MEDICINE_PRE_ORDER_DISPATCH_${orderNum}`,
        initiator: `${initiatorName} (${role})`,
        role,
        blockNumber: 19842106 + prev.length,
        complianceProof: `WHO-GDP-EMERGENCY-DISPATCH-${source.portOrCity.toUpperCase().replace(/\s+/g, '_')}`,
        ownerConfirmationStatus: 'CONFIRMED',
        shipMasterNotificationSent: true,
      },
      ...prev,
    ]);

    // Also notify Port Comms
    const alertMsg: ChatMessage = {
      id: 'msg-' + Date.now().toString(36),
      sender: 'Fluxora Emergency Pharma Dispatch System',
      senderRole: 'Automated GDP Medical Dispatcher',
      senderPort: source.portOrCity,
      message: `[PRE-ORDER DISPATCH CONFIRMED] Emergency medical consignment ${orderNum} dispatched from ${source.name} directly to ${buyer.name} (${buyer.city}) via ${source.transportMode}. ETA: ${source.dispatchTransitHours} hours.`,
      timestamp: new Date().toISOString().slice(11, 16) + ' UTC',
      encrypted: true,
      verified: true,
    };
    setChatMessages((prev) => [...prev, alertMsg]);

    return { success: true, orderNumber: orderNum, txHash: randomTx };
  };

  const toggleSupplyMasterApproval = (id: string) => {
    setSupplies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, approvedByMaster: !s.approvedByMaster } : s))
    );
  };

  const addSupplyItem = (item: Omit<SupplyPreOrderItem, 'id'>) => {
    const newItem: SupplyPreOrderItem = {
      ...item,
      id: 'sup-' + Date.now().toString(36),
    };
    setSupplies((prev) => [...prev, newItem]);
  };

  const signAndExecuteReroute = (
    routeId: 'Plan A' | 'Plan B' | 'Plan C',
    initiatorName: string,
    role: string,
    _ownerNote?: string
  ) => {
    setSelectedRouteId(routeId);
    const generatedHash =
      '0x' +
      Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const newBlock: BlockchainAuditRecord = {
      txHash: generatedHash,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      action: `BLOCKCHAIN_AUTHORIZATION_EXECUTE_${routeId.toUpperCase().replace(' ', '_')}`,
      initiator: `${initiatorName} (${role})`,
      role,
      blockNumber: 19842100 + blockchainRecords.length + 1,
      complianceProof: `SHA256:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      ownerConfirmationStatus: 'CONFIRMED',
      shipMasterNotificationSent: true,
    };

    setBlockchainRecords((prev) => [newBlock, ...prev]);
    setOwnerNotificationSent(true);
    setVesselMasterNotificationSent(true);

    return { txHash: generatedHash, success: true };
  };

  const sendChatMessage = (
    msg: string,
    destinationPort: string,
    attachment?: { name: string; size: string; type: string }
  ) => {
    if (!msg.trim() && !attachment) return;
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now().toString(36),
      sender: 'MV FLUXORA Bridge Navigation Command',
      senderRole: 'Vessel Master / Comms Officer',
      senderPort: destinationPort,
      message: msg.trim(),
      timestamp: new Date().toISOString().slice(11, 16) + ' UTC',
      encrypted: true,
      verified: true,
      attachment,
    };
    setChatMessages((prev) => [...prev, newMsg]);

    // Simulated automated encrypted handshake response from port VTMIS
    setTimeout(() => {
      const reply: ChatMessage = {
        id: 'msg-' + Date.now().toString(36) + '-ack',
        sender: `${destinationPort} Maritime Operations Control`,
        senderRole: 'Port VTMIS Autonomous Terminal Controller',
        senderPort: destinationPort,
        message: `ACK: Transmission received & decrypted with 256-bit ECDSA cipher. Docking lane and shore connection scheduled.`,
        timestamp: new Date().toISOString().slice(11, 16) + ' UTC',
        encrypted: true,
        verified: true,
      };
      setChatMessages((p) => [...p, reply]);
    }, 2500);
  };

  const toggleSatelliteSync = () => {
    setIsSatelliteOnline((prev) => !prev);
  };

  const triggerManualSync = () => {
    setSyncQueueCount(0);
    setIsSatelliteOnline(true);
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    if ('geolocation' in navigator) {
      try {
        return await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setLocationPermissionGranted(true);
              setDeviceCoordinates({
                lat: Number(pos.coords.latitude.toFixed(4)),
                lng: Number(pos.coords.longitude.toFixed(4)),
              });
              resolve(true);
            },
            () => {
              // User denied or error, default to high-precision marine coordinates (e.g. Bab-el-Mandeb vicinity)
              setLocationPermissionGranted(true);
              setDeviceCoordinates({ lat: 12.784, lng: 43.412 });
              resolve(true);
            },
            { timeout: 5000 }
          );
        });
      } catch {
        setLocationPermissionGranted(true);
        setDeviceCoordinates({ lat: 12.784, lng: 43.412 });
        return true;
      }
    } else {
      setLocationPermissionGranted(true);
      setDeviceCoordinates({ lat: 12.784, lng: 43.412 });
      return true;
    }
  };

  return (
    <CommandContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedRouteId,
        setSelectedRouteId,
        routes,
        agents,
        coldChain,
        updateColdChainTemp,
        smartPorts,
        reservePlug,
        captainUplink,
        updateCaptainUplink,
        triggerEmergencyDistress,
        supplies,
        toggleSupplyMasterApproval,
        addSupplyItem,
        blockchainRecords,
        signAndExecuteReroute,
        threats,
        newsBulletins,
        newsFeed: newsBulletins,
        bunkerFuelPrices,
        chatMessages,
        sendChatMessage,
        language,
        setLanguage,
        nightVisionMode,
        setNightVisionMode,
        isSatelliteOnline,
        toggleSatelliteSync,
        syncQueueCount,
        triggerManualSync,
        locationPermissionGranted,
        requestLocationPermission,
        deviceCoordinates,
        isBlockchainModalOpen,
        setIsBlockchainModalOpen,
        isPortCommsOpen,
        setIsPortCommsOpen,
        selectedPortDetails,
        setSelectedPortDetails,
        isSettingsOpen,
        setIsSettingsOpen,
        isTourOpen,
        setIsTourOpen,
        isPreOrderingOpen,
        setIsPreOrderingOpen,
        isExtremelyDire,
        direUncertaintyOverride,
        toggleDireUncertainty,
        emergencyPreOrders,
        executeEmergencyPreOrder,
        emergencyMedicines: EMERGENCY_MEDICINES,
        nearbyPharmaSources: NEARBY_PHARMA_SOURCES,
        emergencyBuyers: EMERGENCY_BUYERS,
        ownerNotificationSent,
        vesselMasterNotificationSent,
        isPortDirectoryOpen,
        setIsPortDirectoryOpen,
        portDirectoryFilter,
        setPortDirectoryFilter,
        openPortDirectoryWithFilter,
        portDirectory: PORT_CONTACTS_DIRECTORY,
        selectedPortContact,
        setSelectedPortContact,
      }}
    >
      {children}
    </CommandContext.Provider>
  );
};

export const useCommand = () => {
  const context = useContext(CommandContext);
  if (!context) {
    throw new Error('useCommand must be used within a CommandProvider');
  }
  return context;
};
