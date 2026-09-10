export type Language = 'en' | 'zh' | 'es' | 'tl' | 'fr';

export interface TranslationDictionary {
  appName: string;
  commandCenter: string;
  loginTitle: string;
  loginSubtitle: string;
  registerTitle: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: string;
  enterCommandCenter: string;
  createAccount: string;
  alreadyHaveAccount: string;
  noAccountYet: string;
  quickDemo: string;
  logout: string;
  welcomeTour: string;
  nightMode: string;
  dayMode: string;
  satSync: string;
  offlineMode: string;
  activeVoyages: string;
  carbonSaved: string;
  profitMarginDelta: string;
  safetyScore: string;
  customerComfort: string;
  navThreats: string;
  navTariffs: string;
  navTelemetry: string;
  navMap: string;
  navRoutes: string;
  navAIIntel: string;
  digitallySign: string;
  captainUplink: string;
  portComms: string;
  userSettings: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'FLUXORA',
    commandCenter: 'Autonomous Ship Routing Command Center',
    loginTitle: 'Access Security Gate',
    loginSubtitle: 'Cryptographic credentials required for maritime command authorization',
    registerTitle: 'Personnel Credential Registration',
    email: 'Officer Email / ID',
    password: 'Master Access Password',
    fullName: 'Full Name & Rank',
    phone: 'Maritime Satellite Phone',
    role: 'Operational Role',
    enterCommandCenter: 'Verify & Authorize Entry',
    createAccount: 'Register Operational Credential',
    alreadyHaveAccount: 'Already have verified credentials? Sign In',
    noAccountYet: 'New Officer? Register Verified Profile',
    quickDemo: 'Quick Demo Profiles (Click to fill)',
    logout: 'Lock & Terminate Session',
    welcomeTour: 'Start Bridge Tour',
    nightMode: 'Bridge Night Watch',
    dayMode: 'Day High-Vis',
    satSync: 'Starlink SatComms 18ms',
    offlineMode: 'Offline Resilient Mode',
    activeVoyages: 'Active Voyages',
    carbonSaved: 'Global Carbon Saved',
    profitMarginDelta: 'Net Profit Margin Delta',
    safetyScore: 'Vessel & Cargo Safety',
    customerComfort: 'Customer SLA Percentile',
    navThreats: 'Threats & Geopolitical',
    navTariffs: 'Taxes & Tariffs',
    navTelemetry: 'Life Sources & Telemetry',
    navMap: 'Live GIS Navigation Map',
    navRoutes: 'Preference Routes (A / B / C)',
    navAIIntel: 'AI Situation & Global News',
    digitallySign: 'Digitally Sign & Execute Reroute',
    captainUplink: 'Captain Uplink Portal',
    portComms: 'Port Authority Comms',
    userSettings: 'Officer Settings',
  },
  zh: {
    appName: 'FLUXORA 领航',
    commandCenter: '自主船舶航线指挥中心',
    loginTitle: '安全授权验证网关',
    loginSubtitle: '海事指挥许可需要加密认证凭证',
    registerTitle: '人员操作凭证注册',
    email: '船员邮箱 / 标识码',
    password: '主访问密码',
    fullName: '全名及军衔职务',
    phone: '海事卫星电话',
    role: '操作角色权限',
    enterCommandCenter: '验证并授权进入',
    createAccount: '注册新操作凭证',
    alreadyHaveAccount: '已有授权凭据？立即登录',
    noAccountYet: '新军官登船？注册验证资料',
    quickDemo: '快速测试账号 (一键填入)',
    logout: '锁定并退出会话',
    welcomeTour: '开启指挥舱指引',
    nightMode: '舰桥夜航红光',
    dayMode: '日间高对比度',
    satSync: '星链卫通 18毫秒',
    offlineMode: '离线自主运行模式',
    activeVoyages: '在途航次总数',
    carbonSaved: '累计减碳排放量',
    profitMarginDelta: '净利润率套利增量',
    safetyScore: '船舶与货物安全分',
    customerComfort: '客户SLA准点满意率',
    navThreats: '地缘威胁与风险',
    navTariffs: '运河关税与碳税',
    navTelemetry: '生命维持与冷链遥测',
    navMap: '实时GIS导航海图',
    navRoutes: '航线方案优选 (A/B/C)',
    navAIIntel: 'AI态势预测与新闻',
    digitallySign: '数字签名并执行改道',
    captainUplink: '船长操作上行通道',
    portComms: '港务局加密通讯',
    userSettings: '人员与系统设置',
  },
  es: {
    appName: 'FLUXORA',
    commandCenter: 'Centro de Comando de Rutas Autónomas',
    loginTitle: 'Puerta de Acceso Seguro',
    loginSubtitle: 'Credenciales criptográficas obligatorias para autorización marítima',
    registerTitle: 'Registro de Credenciales de Personal',
    email: 'Correo de Oficial / ID',
    password: 'Clave de Acceso Maestra',
    fullName: 'Nombre Completo y Rango',
    phone: 'Teléfono Satelital Marítimo',
    role: 'Rol Operativo',
    enterCommandCenter: 'Verificar y Autorizar Entrada',
    createAccount: 'Registrar Credencial Operativa',
    alreadyHaveAccount: '¿Ya tiene credenciales verificadas? Entrar',
    noAccountYet: '¿Nuevo Oficial? Registrar Perfil Verificado',
    quickDemo: 'Perfiles de Demostración Rápida',
    logout: 'Bloquear y Terminar Sesión',
    welcomeTour: 'Iniciar Recorrido del Puente',
    nightMode: 'Visión Nocturna de Guardia',
    dayMode: 'Modo Día Claro',
    satSync: 'SatCom Starlink 18ms',
    offlineMode: 'Modo Autónomo sin Conexión',
    activeVoyages: 'Viajes Activos',
    carbonSaved: 'Carbono Global Ahorrado',
    profitMarginDelta: 'Delta Margen de Ganancia Neta',
    safetyScore: 'Puntuación Seguridad y Carga',
    customerComfort: 'Percentil Cumplimiento SLA',
    navThreats: 'Amenazas y Geopolítica',
    navTariffs: 'Impuestos y Peajes de Canal',
    navTelemetry: 'Soporte Vital y Telemetría',
    navMap: 'Mapa de Navegación GIS en Vivo',
    navRoutes: 'Rutas de Preferencia (A / B / C)',
    navAIIntel: 'Predicción IA y Noticias',
    digitallySign: 'Firmar Digitalmente y Ejecutar Desvío',
    captainUplink: 'Portal de Enlace del Capitán',
    portComms: 'Comunicaciones Portuarias',
    userSettings: 'Configuración de Oficial',
  },
  tl: {
    appName: 'FLUXORA',
    commandCenter: 'Sentro ng Pagpapagana ng Barko (Command Center)',
    loginTitle: 'Seguridad sa Pagpasok',
    loginSubtitle: 'Kailangan ang beripikadong kredensyal para sa pag-navigate',
    registerTitle: 'Rehistro ng Opisyal ng Barko',
    email: 'Email ng Opisyal / ID',
    password: 'Lihim na Password',
    fullName: 'Buong Pangalan at Ranggo',
    phone: 'Numero ng Satellite Phone',
    role: 'Tungkulin sa Barko',
    enterCommandCenter: 'Patunayan at Pumasok',
    createAccount: 'Magrehistro ng Kredensyal',
    alreadyHaveAccount: 'May account na? Mag-sign in',
    noAccountYet: 'Bagong Opisyal? Gumawa ng Account',
    quickDemo: 'Mabilisang Demo Profiles',
    logout: 'I-lock at Lumabas',
    welcomeTour: 'Simulan ang Gabay ng Barko',
    nightMode: 'Panggabing Mode ng Tulay',
    dayMode: 'Pang-araw na Mode',
    satSync: 'Starlink SatComms 18ms',
    offlineMode: 'Koneksyon sa Karagatan (Offline)',
    activeVoyages: 'Kasalukuyang Biyahe',
    carbonSaved: 'Kabuuang Carbon Na-save',
    profitMarginDelta: 'Karagdagang Kita (Net Profit)',
    safetyScore: 'Kaligtasan ng Barko at Kargamento',
    customerComfort: 'Kuntentong Kostumer (SLA %)',
    navThreats: 'Panganib at Pandaigdigang Sitwasyon',
    navTariffs: 'Bayarin sa Kanal at Buwis sa Carbon',
    navTelemetry: 'Tubig, Pagkain, Langis at Lamig',
    navMap: 'GIS Buhay na Mapa ng Karagatan',
    navRoutes: 'Mga Rutang Pagpipilian (Plan A/B/C)',
    navAIIntel: 'Pagsusuri ng AI at Balita',
    digitallySign: 'Pirmahang Digital at Ilipat ang Ruta',
    captainUplink: 'Uplink ng Kapitan ng Barko',
    portComms: 'Mensahe sa Awtoridad ng Pantalan',
    userSettings: 'Kagamitan ng Gumagamit',
  },
  fr: {
    appName: 'FLUXORA',
    commandCenter: 'Centre de Commandement de Navigation Autonome',
    loginTitle: 'Portail de Sécurité Cryptographique',
    loginSubtitle: 'Identifiants vérifiés requis pour le contrôle maritime',
    registerTitle: 'Enregistrement des Officiers',
    email: 'E-mail Officier / ID',
    password: 'Mot de Passe Maître',
    fullName: 'Nom Complet & Grade',
    phone: 'Téléphone Satellite Maritime',
    role: 'Rôle Opérationnel',
    enterCommandCenter: 'Vérifier & Autoriser Accès',
    createAccount: 'Créer Identifiant Opérationnel',
    alreadyHaveAccount: 'Déjà enregistré ? Connexion',
    noAccountYet: 'Nouvel Officier ? S’inscrire',
    quickDemo: 'Profils de Démonstration Rapide',
    logout: 'Verrouiller la Passerelle',
    welcomeTour: 'Visite Guidée de la Passerelle',
    nightMode: 'Veille de Nuit Passerelle',
    dayMode: 'Mode Jour Haute Visibilité',
    satSync: 'Starlink SatCom 18ms',
    offlineMode: 'Mode Hors-Ligne Résilient',
    activeVoyages: 'Voyages en Mer Actifs',
    carbonSaved: 'Carbone Épargné Total',
    profitMarginDelta: 'Delta Marge Nette d’Arbitrage',
    safetyScore: 'Indice Sécurité Navire & Fret',
    customerComfort: 'Percentile Respect SLA Client',
    navThreats: 'Menaces & Risques Géopolitiques',
    navTariffs: 'Taxes, Péages & Taxe Carbone',
    navTelemetry: 'Ressources Vitales & Télémétrie',
    navMap: 'Carte de Navigation SIG en Temps Réel',
    navRoutes: 'Options de Route (Plan A / B / C)',
    navAIIntel: 'Prédictions IA & Actualités Mondiales',
    digitallySign: 'Signer & Exécuter le Déroutement',
    captainUplink: 'Liaison Opérationnelle du Capitaine',
    portComms: 'Communications Portuaires Sécurisées',
    userSettings: 'Paramètres du Profil',
  },
};
