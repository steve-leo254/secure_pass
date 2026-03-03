import { createContext, useContext, useState } from 'react';
import { apiService } from '../services/api';

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    username: string;
    name: string;
    role: string;
  };
}

export type UserRole = 'property_manager' | 'security' | 'superadmin';

export type VisitorCategory =
  | 'contractor'
  | 'technician'
  | 'delivery'
  | 'staff'
  | 'visitor';

export type VisitorStatus = 'checked-in' | 'checked-out';

export type Gender = 'male' | 'female' | 'other';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  password?: string;
  email?: string;
  phone?: string;
  bio?: string;
  department?: string;
  employeeId?: string;
  joinedDate?: string;
  avatar?: string;
}

export interface Visitor {
  id: string;
  fullName: string;
  phoneNumber: string;
  idNumber: string;
  category: VisitorCategory;
  purpose: string;
  gender: Gender;
  unitVisited: string;
  tools: string[];
  customTools: string[];
  timeIn: string;
  timeOut: string | null;
  status: VisitorStatus;
  registeredBy: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

export interface DashboardStats {
  totalToday: number;
  currentlyIn: number;
  checkedOut: number;
  contractors: number;
  visitors: number;
  deliveries: number;
  staff: number;
  technicians: number;
}

export const CATEGORIES: { value: VisitorCategory; label: string; color: string; icon: string }[] = [
  { value: 'visitor', label: 'Visitor / Customer', color: 'bg-blue-500', icon: '👤' },
  { value: 'contractor', label: 'Contractor', color: 'bg-orange-500', icon: '🔧' },
  { value: 'technician', label: 'Technician', color: 'bg-purple-500', icon: '⚙️' },
  { value: 'delivery', label: 'Delivery Personnel', color: 'bg-green-500', icon: '📦' },
  { value: 'staff', label: 'Staff', color: 'bg-indigo-500', icon: '🏢' },
];

export const TOOLS_LIST: string[] = [
  'Hammer',
  'Screwdriver',
  'Drill Machine',
  'Spanner Set',
  'Welding Machine',
  'Ladder',
  'Pliers',
  'Tape Measure',
  'Level Tool',
  'Saw',
  'Wire Cutters',
  'Pipe Wrench',
  'Paint Roller',
  'Angle Grinder',
  'Multimeter',
];


export const DEFAULT_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'property_manager',
    name: 'Property Manager',
  },
  {
    id: '2',
    username: 'security',
    password: 'security123',
    role: 'security',
    name: 'John Security',
  },
];

interface AuthContextType {
  loginAs: (role: 'security' | 'property_manager') => void;
  userRole: 'admin' | 'security_desk' | 'superadmin';
  logout: () => void;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isSecurity: boolean;
  updateProfile: (updates: Partial<User>) => void;
  updateAvatar: (avatar: string) => void;
  removeAvatar: () => void;
  updatePassword: (newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'security_desk' | 'superadmin'>('security_desk');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login(username, password);
      const user: User = {
        id: response.user.id,
        username: response.user.username,
        role: response.user.role as UserRole,
        name: response.user.name,
      };
      
      setUser(user);
      // Handle different roles properly
      if (user.role === 'superadmin') {
        setUserRole('superadmin');
      } else if (user.role === 'property_manager') {
        setUserRole('admin');
      } else if (user.role === 'security') {
        setUserRole('security_desk');
      }
      setIsAuthenticated(true);
      setAccessToken(response.access_token);
      
      // Store token in localStorage for API service
      localStorage.setItem('access_token', response.access_token);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const loginAs = (role: 'security' | 'property_manager') => {
    const selectedUser = DEFAULT_USERS.find((u) => u.role === role);
    if (selectedUser) {
      setUser(selectedUser);
      setUserRole(role === 'property_manager' ? 'admin' : 'security_desk');
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setUser(null);
    setUserRole('security_desk');
    setIsAuthenticated(false);
    setAccessToken(null);
    
    // Remove token from localStorage
    localStorage.removeItem('access_token');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const updateAvatar = (avatar: string) => {
    if (user) {
      setUser({ ...user, avatar });
    }
  };

  const removeAvatar = () => {
    if (user) {
      setUser({ ...user, avatar: undefined });
    }
  };

  const updatePassword = (newPassword: string) => {
    if (user) {
      setUser({ ...user, password: newPassword });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loginAs,
        userRole,
        logout,
        user,
        login,
        isAuthenticated,
        isAdmin: userRole === 'admin',
        isSuperAdmin: userRole === 'superadmin',
        isSecurity: userRole === 'security_desk',
        updateProfile,
        updateAvatar,
        removeAvatar,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
