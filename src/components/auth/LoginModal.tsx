import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  User,
  Camera,
  Compass,
  ArrowRight,
  Anchor,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Ship,
  Boxes,
} from 'lucide-react';
import { translations, Language } from '../../utils/i18n';

interface LoginModalProps {
  language: Language;
}

export const LoginModal: React.FC<LoginModalProps> = ({ language }) => {
  const { login, register, quickLoginAs } = useAuth();
  const t = translations[language];

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Fleet Administrator');
  const [regAvatar, setRegAvatar] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Profile photo must be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setRegAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const result = login(loginEmail, loginPassword);
    if (!result.success) {
      setErrorMsg(result.error || 'Authentication failed');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const result = register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: regRole,
      avatarUrl: regAvatar,
    });
    if (!result.success) {
      setErrorMsg(result.error || 'Registration failed');
    } else {
      setSuccessMsg('Officer credentials established. Initializing command bridge...');
    }
  };

  return (
    <div
      id="fluxora-auth-gate"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md px-4 py-6 overflow-y-auto"
    >
      <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/40 p-6 md:p-8 relative overflow-hidden text-slate-100">
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Branding */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-cyan-400 animate-spin-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-wider text-white">FLUXORA</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-mono">
                  SECURITY GATE
                </span>
              </div>
              <p className="text-xs text-slate-400">Autonomous Ship Routing Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-800/40">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-bit ECDSA</span>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 my-5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            id="tab-btn-login"
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
              mode === 'login'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Officer Sign-In</span>
          </button>
          <button
            id="tab-btn-register"
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
              mode === 'register'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>New Officer Registration</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.email}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  id="input-login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@fluxora.maritime"
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  id="input-login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="btn-login-submit"
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{t.enterCommandCenter}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Login profiles for rapid frictionless testing */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Anchor className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.quickDemo}</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  id="quick-login-admin"
                  type="button"
                  onClick={() => quickLoginAs('Fleet Administrator')}
                  className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-800/50 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Fleet Admin</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">Capt. Vance</div>
                  <div className="text-[10px] text-slate-500 font-mono">Full Access</div>
                </button>

                <button
                  id="quick-login-captain"
                  type="button"
                  onClick={() => quickLoginAs('Vessel Captain')}
                  className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-800/50 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold">
                    <Ship className="w-3.5 h-3.5" />
                    <span>Vessel Captain</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">Capt. Rostova</div>
                  <div className="text-[10px] text-slate-500 font-mono">Bridge & Distress</div>
                </button>

                <button
                  id="quick-login-logistics"
                  type="button"
                  onClick={() => quickLoginAs('Logistics Officer')}
                  className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-800/50 text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                    <Boxes className="w-3.5 h-3.5" />
                    <span>Logistics</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">Chen Wei, MSc</div>
                  <div className="text-[10px] text-slate-500 font-mono">Financial & Ports</div>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Avatar upload + preview */}
            <div className="flex items-center gap-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-500/50 bg-slate-900 shrink-0">
                {regAvatar ? (
                  <img
                    src={regAvatar}
                    alt="Officer preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white opacity-90 hover:opacity-100 transition-opacity"
                  title="Upload profile photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700 font-medium"
                >
                  Upload Profile Photo
                </button>
                <p className="text-[11px] text-slate-400 mt-1">
                  JPG, PNG or WEBP (Max 2MB) for maritime ID badge
                </p>
              </div>
            </div>

            {/* Full Name & Satellite Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.fullName}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    id="input-reg-name"
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Capt. Alexander Cross"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.phone}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    id="input-reg-phone"
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+870 773 123 456 (Inmarsat)"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.email}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    id="input-reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="officer@fluxora.maritime"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.password}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    id="input-reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    required
                    minLength={6}
                    className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Role selection with RBAC details */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {t.role} (Role-Based Access Control)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    role: 'Fleet Administrator' as UserRole,
                    label: 'Fleet Administrator',
                    desc: 'Full access to all command modules, blockchain override & audit.',
                    color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300',
                  },
                  {
                    role: 'Vessel Captain' as UserRole,
                    label: 'Vessel Captain',
                    desc: 'Bridge uplink, fuel/ration updates, and distress rerouting.',
                    color: 'border-blue-500/50 bg-blue-950/20 text-blue-300',
                  },
                  {
                    role: 'Logistics Officer' as UserRole,
                    label: 'Logistics Officer',
                    desc: 'Financial demurrage vs detour, inventory & cold-chain plugs.',
                    color: 'border-amber-500/50 bg-amber-950/20 text-amber-300',
                  },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setRegRole(item.role)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      regRole === item.role
                        ? item.color + ' ring-1 ring-cyan-400'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-snug">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              id="btn-register-submit"
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              <span>{t.createAccount}</span>
              <CheckCircle className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
