import { createContext, useContext, useState } from 'react';

export type UserRole = 'admin' | 'security';

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
  password: string;
  role: UserRole;
  name: string;
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
    role: 'admin',
    name: 'System Administrator',
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
  loginAs: (role: 'security' | 'admin') => void;
  userRole: 'admin' | 'security_desk';
  logout: () => void;
  user: User | null;
  login: (username: string, password: string) => boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateProfile: (updates: Partial<User>) => void;
  updateAvatar: (avatar: string) => void;
  removeAvatar: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'security_desk'>('security_desk');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (username: string, password: string): boolean => {
    const foundUser = DEFAULT_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      setUserRole(foundUser.role === 'admin' ? 'admin' : 'security_desk');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const loginAs = (role: 'security' | 'admin') => {
    const selectedUser = DEFAULT_USERS.find((u) => u.role === role);
    if (selectedUser) {
      setUser(selectedUser);
      setUserRole(role === 'admin' ? 'admin' : 'security_desk');
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setUser(null);
    setUserRole('security_desk');
    setIsAuthenticated(false);
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
        updateProfile,
        updateAvatar,
        removeAvatar,
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
