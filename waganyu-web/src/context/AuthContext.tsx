import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import toast from "react-hot-toast";

export type UserIntent = "hire" | "find_work" | "both";

export interface User {
  id: string;
  name: string;
  email: string;
  profileComplete: boolean;
  intent?: UserIntent;
  skills?: string[];
  city?: string;
  location?: string;
  heardFrom?: string;
  bio?: string;
  avatar?: string;
  rating?: number;
  verified?: boolean;
  joinedAt?: string;
}

export interface ProfileSetupData {
  intent: UserIntent;
  skills: string[];
  city: string;
  location: string;
  heardFrom: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  completeProfile: (data: ProfileSetupData) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("waganyu_user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        localStorage.removeItem("waganyu_user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, _password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app, this would come from API
      const mockUser: User = {
        id: "user_" + Date.now(),
        name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        email,
        profileComplete: false, // New users need to complete profile
        rating: 0,
        verified: false,
        joinedAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem("waganyu_user", JSON.stringify(mockUser));
      toast.success("Welcome back to Waganyu!");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, _password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - in real app, this would come from API
      const mockUser: User = {
        id: "user_" + Date.now(),
        name: name.trim(),
        email,
        profileComplete: false, // New users need to complete profile
        rating: 0,
        verified: false,
        joinedAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem("waganyu_user", JSON.stringify(mockUser));
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeProfile = async (data: ProfileSetupData) => {
    try {
      setIsLoading(true);
      
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        throw new Error("No user found");
      }

      const updatedUser: User = {
        ...user,
        profileComplete: true,
        intent: data.intent,
        skills: data.skills,
        city: data.city,
        location: data.location,
        heardFrom: data.heardFrom,
        bio: data.bio,
        verified: true, // Auto-verify after profile completion
      };

      setUser(updatedUser);
      localStorage.setItem("waganyu_user", JSON.stringify(updatedUser));
      toast.success("Profile setup complete! Welcome to Waganyu! ???");
    } catch (error) {
      toast.error("Profile setup failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("waganyu_user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("waganyu_user");
    toast.success("Logged out successfully");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    completeProfile,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
