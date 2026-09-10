import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { PRESET_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (profile: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    avatarUrl?: string;
    department?: string;
  }) => { success: boolean; error?: string };
  updateProfile: (updated: Partial<UserProfile>) => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; error?: string };
  logout: () => void;
  registeredUsers: UserProfile[];
  quickLoginAs: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'fluxora_auth_user';
const STORAGE_KEY_REGISTRY = 'fluxora_registered_users';
const STORAGE_KEY_PASSWORDS = 'fluxora_user_passwords';

const DEFAULT_PASSWORDS: Record<string, string> = {
  'admin@fluxora.maritime': 'FleetAdmin2026!',
  'captain.ramirez@fluxora.maritime': 'Captain2026!',
  'logistics.chen@fluxora.maritime': 'Logistics2026!',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REGISTRY);
      return saved ? JSON.parse(saved) : PRESET_USERS;
    } catch {
      return PRESET_USERS;
    }
  });

  const [passwords, setPasswords] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PASSWORDS);
      return saved ? JSON.parse(saved) : DEFAULT_PASSWORDS;
    } catch {
      return DEFAULT_PASSWORDS;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.error('Failed to sync current user', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(registeredUsers));
      localStorage.setItem(STORAGE_KEY_PASSWORDS, JSON.stringify(passwords));
    } catch (e) {
      console.error('Failed to sync registry', e);
    }
  }, [registeredUsers, passwords]);

  const login = (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, error: 'Officer credential not recognized in naval directory.' };
    }

    const expectedPass = passwords[cleanEmail];
    if (expectedPass && expectedPass !== password) {
      return { success: false, error: 'Invalid master access password. Access denied.' };
    }

    const updatedUser: UserProfile = {
      ...user,
      lastLogin: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
    };

    setCurrentUser(updatedUser);
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );

    return { success: true };
  };

  const register = (profileData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    avatarUrl?: string;
    department?: string;
  }) => {
    const cleanEmail = profileData.email.trim().toLowerCase();

    if (registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An officer is already registered with this Mail ID.' };
    }

    if (!profileData.name.trim()) {
      return { success: false, error: 'Full name & rank is required.' };
    }

    if (!profileData.phone.trim()) {
      return { success: false, error: 'Satellite phone contact is required for maritime security verification.' };
    }

    if (!profileData.password || profileData.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters for security.' };
    }

    const defaultAvatar =
      profileData.avatarUrl ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`;

    const newUser: UserProfile = {
      id: 'usr-' + Date.now().toString(36),
      name: profileData.name.trim(),
      email: cleanEmail,
      phone: profileData.phone.trim(),
      role: profileData.role,
      avatarUrl: defaultAvatar,
      department:
        profileData.department ||
        (profileData.role === 'Vessel Captain'
          ? 'Bridge Navigation Command'
          : profileData.role === 'Logistics Officer'
          ? 'Global Port Operations & Arbitrage'
          : 'Fleet Operations Directorate'),
      vesselAssigned:
        profileData.role === 'Vessel Captain' ? 'MV FLUXORA VOYAGER (IMO 9982410)' : undefined,
      registeredAt: new Date().toISOString().slice(0, 10),
      lastLogin: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setPasswords((prev) => ({ ...prev, [cleanEmail]: profileData.password }));
    setCurrentUser(newUser);

    return { success: true };
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const modified: UserProfile = { ...currentUser, ...updated };
    setCurrentUser(modified);
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === modified.id ? modified : u))
    );
  };

  const changePassword = (oldPass: string, newPass: string) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    const currentPass = passwords[currentUser.email.toLowerCase()];

    if (currentPass && currentPass !== oldPass) {
      return { success: false, error: 'Current password does not match.' };
    }

    if (newPass.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    setPasswords((prev) => ({
      ...prev,
      [currentUser.email.toLowerCase()]: newPass,
    }));

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const quickLoginAs = (role: UserRole) => {
    const target = registeredUsers.find((u) => u.role === role) || PRESET_USERS.find((u) => u.role === role);
    if (target) {
      setCurrentUser({
        ...target,
        lastLogin: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        updateProfile,
        changePassword,
        logout,
        registeredUsers,
        quickLoginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
