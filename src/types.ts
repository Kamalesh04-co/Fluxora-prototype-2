export type UserRole = 'Fleet Administrator' | 'Vessel Captain' | 'Logistics Officer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl: string;
  department: string;
  vesselAssigned?: string;
  licenseNumber?: string;
  registeredAt: string;
  lastLogin: string;
}

export type NavView =
  | 'threats'
  | 'tariffs'
  | 'telemetry'
  | 'map'
  | 'routes'
  | 'ai-intel';

export interface AutonomousAgent {
  id: string;
  name: string;
  category: 'Disruption Sensing' | 'Scenario Planning' | 'Tri-Factor Arbitrage' | 'Logistics' | 'Inventory' | 'Blockchain Audit';
  status: 'OPTIMAL' | 'ACTIVE' | 'PROCESSING' | 'STANDBY';
  healthScore: number;
  computeLoad: number;
  lastTrigger: string;
  focusArea: string;
}

export interface RouteOption {
  id: 'Plan A' | 'Plan B' | 'Plan C';
  title: string;
  codename: string;
  via: string;
  distanceNm: number;
  transitDays: number;
  eta: string;
  fuelTons: number;
  fuelCostUsd: number;
  tollFeesUsd: number;
  carbonTaxUsd: number;
  insuranceRiskUsd: number;
  netProfitDeltaUsd: number;
  vesselSafetyScore: number; // 0-100%
  customerSatisfactionPct: number; // 0-100%
  co2EmissionsMt: number;
  riskDescription: string;
  recommended: boolean;
  waypoints: { lat: number; lng: number; name: string }[];
  tollAndWarRiskCostUsd?: number;
  totalFinancialCostUsd?: number;
  profitMarginDeltaPct?: number;
  safetyScore?: number;
  customerComfortPercentile?: number;
  fuelConsumptionTons?: number;
}

export interface ColdChainTelemetry {
  targetTempC: number;
  actualTempC: number;
  ambientSeaTempC: number;
  ambientAirTempC: number;
  stabilityScore: number; // degree-minute thermal stability %
  holdTimeRemainingHours: number;
  reeferUnitsActive: number;
  reeferUnitsFaults: number;
  backupGeneratorStatus: '100% NOMINAL' | 'FAILSAFE' | 'STANDBY';
  coolantPressurePsi: number;
}

export interface SmartPortPlug {
  portName: string;
  unLoCode: string;
  country: string;
  distanceNm: number;
  availablePlugs: number;
  totalPlugs: number;
  occupancyRatePct: number;
  berthDelayHours: number;
  bunkerAvailability: {
    vlsfo: boolean;
    mgo: boolean;
    lng: boolean;
    bioMethanol: boolean;
  };
  capacityDwt: string;
  contactChannel: string;
}

export interface SupplyPreOrderItem {
  id: string;
  category: 'Bunker Fuel' | 'Fresh Water' | 'Provisions / Rations' | 'Cold-Chain Parts' | 'Medical Supplies';
  name: string;
  quantity: number;
  unit: string;
  unitPriceUsd: number;
  approvedByMaster: boolean;
  urgency: 'Standard' | 'High' | 'Emergency';
}

export interface BlockchainAuditRecord {
  txHash: string;
  timestamp: string;
  action: string;
  initiator: string;
  role: string;
  blockNumber: number;
  complianceProof: string;
  ownerConfirmationStatus: 'DISPATCHED' | 'CONFIRMED' | 'DELIVERED';
  shipMasterNotificationSent: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderRole: string;
  senderPort?: string;
  message: string;
  timestamp: string;
  encrypted: boolean;
  verified: boolean;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

export interface NewsBulletin {
  id: string;
  headline: string;
  source: string;
  urgency: 'CRITICAL' | 'WARNING' | 'MODERATE' | 'INFO';
  timestamp: string;
  region: string;
  impact: string;
}

export interface ThreatHazard {
  id: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  type: 'PIRACY' | 'GEOPOLITICAL' | 'TYPHOON' | 'GPS_SPOOFING' | 'CHOKEPOINT_DELAY';
  severity: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MEDIUM';
  description: string;
  reportedAgo: string;
  affectedRadiusNm: number;
}

export interface BunkerFuelPrice {
  port: string;
  vlsfo: number;
  mgo: number;
  lng: number;
  bioMethanol: number;
}

export interface EmergencyMedicineItem {
  id: string;
  name: string;
  category: 'Vaccines' | 'Insulin & Diabetes' | 'Oncology' | 'Blood & Plasma' | 'Critical Antibiotics';
  temperatureRequirement: string;
  standardDoseCount: number;
  unit: string;
  criticality: 'LIFE_SAVING' | 'URGENT' | 'HIGH_PRIORITY';
  pricePerUnitUsd: number;
  description: string;
}

export interface NearbyPharmaSource {
  id: string;
  name: string;
  portOrCity: string;
  country: string;
  distanceNm: number;
  availableStockPercent: number;
  dispatchTransitHours: number;
  transportMode: 'Direct Medevac Air Charter' | 'Intercontinental Air Express' | 'Fast Sea-Air Transshipment';
  certification: string;
  contactChannel: string;
  reliabilityScore: number;
}

export interface EmergencyBuyer {
  id: string;
  name: string;
  facility: string;
  city: string;
  country: string;
  criticalityLevel: 'EXTREME' | 'CRITICAL' | 'URGENT';
  urgentNeed: string;
  contactPerson: string;
  estimatedStockRemainingDays: number;
}

export interface EmergencyPreOrder {
  id: string;
  orderNumber: string;
  timestamp: string;
  status: 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED';
  uncertaintyCause: string;
  buyerName: string;
  destinationCity: string;
  sourceHubName: string;
  sourceHubCountry: string;
  medicines: {
    medicineName: string;
    quantity: number;
    unit: string;
  }[];
  totalCostUsd: number;
  transportMode: string;
  etaBuyer: string;
  authorizedBy: string;
  blockchainProof: string;
}

export interface PortAuthorityContact {
  authorityName: string;
  harborMaster: string;
  vtsControlPhone24h: string;
  vhfChannels: string;
  opsEmail: string;
  emergencyPhone: string;
  inmarsatOrMMSI: string;
  locationAddress: string;
}

export interface MaritimeAgentContact {
  agencyName: string;
  designatedAgentName: string;
  title: string;
  mobile24h: string;
  officePhone: string;
  email: string;
  dutyDesk: string;
  servicesProvided: string[];
  pilotageDeskPhone: string;
}

export type PortRouteAffiliation =
  | 'CURRENT_DESTINATION'
  | 'CURRENT_ORIGIN'
  | 'PLAN_A'
  | 'PLAN_B'
  | 'PLAN_C'
  | 'REROUTE_CANDIDATE';

export interface PortContactDirectoryItem {
  id: string;
  portName: string;
  unLoCode: string;
  country: string;
  region: string;
  coordinates: { lat: number; lng: number };
  distanceNm: number;
  routes: PortRouteAffiliation[];
  roleInVoyage: string;
  portAuthority: PortAuthorityContact;
  shippingAgent: MaritimeAgentContact;
  technicalCapabilities: {
    maxDraftMeters: number;
    availableShorePlugs: number;
    bunkerTypes: string[];
    berthWaitTimeHours: number;
    hospitalDistanceKm: number;
    nearestAirHub: string;
  };
  emergencyReadiness: 'IMMEDIATE_CLEARANCE' | '24_7_STANDBY' | 'PRIOR_NOTICE_REQUIRED';
}

