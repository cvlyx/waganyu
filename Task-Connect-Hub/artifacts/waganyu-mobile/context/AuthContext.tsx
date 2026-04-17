import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type UserIntent = "find_work" | "hire" | "both";

export interface User {
  id: string;
  name: string;
  email: string;
  // intent replaces hard role — everyone sees everything
  intent?: UserIntent;
  avatar?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  location: string;
  city?: string;
  bio?: string;
  skills?: string[];
  jobsPosted?: number;
  jobsDone?: number;
  joinedDate: string;
  heardFrom?: string;
  profileComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  completeProfile: (updates: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    intent: "hire",
    rating: 4.8,
    reviewCount: 24,
    isVerified: true,
    location: "Lilongwe, Malawi",
    city: "Lilongwe",
    bio: "Busy professional who needs help with tasks",
    jobsPosted: 15,
    jobsDone: 0,
    joinedDate: "2024-01-15",
    profileComplete: true,
  },
  {
    id: "2",
    name: "James Banda",
    email: "james@example.com",
    intent: "find_work",
    rating: 4.9,
    reviewCount: 87,
    isVerified: true,
    location: "Blantyre, Malawi",
    city: "Blantyre",
    bio: "Licensed electrician with 10+ years experience",
    skills: ["Electrical", "Wiring", "Solar Installation"],
    jobsDone: 203,
    jobsPosted: 0,
    joinedDate: "2023-06-20",
    profileComplete: true,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadUser(); }, []);

  async function loadUser() {
    try {
      const stored = await AsyncStorage.getItem("waganyu_user");
      if (stored) setUser(JSON.parse(stored));
    } catch { /* ignore */ }
    finally { setIsLoading(false); }
  }

  async function login(email: string, _password: string) {
    const found = MOCK_USERS.find(u => u.email === email) ?? MOCK_USERS[0];
    await AsyncStorage.setItem("waganyu_user", JSON.stringify(found));
    setUser(found);
  }

  // Register — minimal, no role. Profile setup happens next.
  async function register(name: string, email: string, _password: string) {
    const newUser: User = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      email,
      rating: 0,
      reviewCount: 0,
      isVerified: false,
      location: "Malawi",
      jobsPosted: 0,
      jobsDone: 0,
      joinedDate: new Date().toISOString().split("T")[0],
      profileComplete: false,
    };
    await AsyncStorage.setItem("waganyu_user", JSON.stringify(newUser));
    setUser(newUser);
  }

  async function completeProfile(updates: Partial<User>) {
    if (!user) return;
    const updated: User = { ...user, ...updates, profileComplete: true };
    await AsyncStorage.setItem("waganyu_user", JSON.stringify(updated));
    setUser(updated);
  }

  async function logout() {
    await AsyncStorage.removeItem("waganyu_user");
    setUser(null);
  }

  function updateUser(updates: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    AsyncStorage.setItem("waganyu_user", JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, completeProfile, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
