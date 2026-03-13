import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

export type UserRole = 'system_admin' | 'property_manager' | 'security' | 'superadmin';

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
    role: 'system_admin',
    name: 'System Administrator',
  },
  {
    id: '2',
    username: 'security',
    role: 'security',
    name: 'John Security',
  },
];

interface AuthContextType {
  loginAs: (role: 'security' | 'property_manager') => void;
  userRole: 'system_admin' | 'property_manager' | 'security';
  logout: () => void;
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; user?: User }>;
  systemLogin: (username: string, password: string) => Promise<{ success: boolean; user?: User }>;
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
  const [userRole, setUserRole] = useState<'system_admin' | 'property_manager' | 'security'>('security');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Add debugging for authentication state changes
  useEffect(() => {
    console.log('Auth state changed:', { user, isAuthenticated, userRole });
  }, [user, isAuthenticated, userRole]);

  const login = async (username: string, password: string): Promise<{ success: boolean; user?: User }> => {
    try {
      console.log('Attempting login with username:', username);
      
      // First try regular login
      try {
        const response = await apiService.login(username, password);
        console.log('Backend response:', response);
        const user: User = {
          id: response.user.id,
          username: response.user.username,
          role: response.user.role as UserRole,
          name: response.user.name,
        };
        
        console.log('Processed user object:', user);
        setUser(user);
        // Handle different roles properly
        if (user.role === 'system_admin') {
          console.log('Setting user role to system_admin');
          setUserRole('system_admin');
        } else if (user.role === 'property_manager') {
          console.log('Setting user role to property_manager');
          setUserRole('property_manager');
        } else {
          console.log('Setting user role to security');
          setUserRole('security');
        }
        setIsAuthenticated(true);
        
        // Store token in localStorage for API service
        localStorage.setItem('access_token', response.access_token);
        
        return { success: true, user };
      } catch (regularLoginError) {
        console.log('Regular login failed, trying security login:', regularLoginError);
        
        // Try security staff login
        try {
          const response = await apiService.securityLogin(username, password);
          console.log('Security login response:', response);
          const user: User = {
            id: response.user.id,
            username: response.user.username,
            role: response.user.role as UserRole,
            name: response.user.name,
          };
          
          console.log('Processed security user object:', user);
          setUser(user);
          setUserRole('security');
          setIsAuthenticated(true);
          
          // Store token in localStorage for API service
          localStorage.setItem('access_token', response.access_token);
          
          return { success: true, user };
        } catch (securityLoginError) {
          console.log('Security login also failed:', securityLoginError);
          throw securityLoginError;
        }
      }
    } catch (error) {
      console.error('All login attempts failed, trying fallback:', error);
      
      // Fallback to DEFAULT_USERS when backend is not available
      const defaultUser = DEFAULT_USERS.find(u => u.username === username);
      if (defaultUser) {
        console.log('Using fallback user:', defaultUser);
        setUser(defaultUser);
        if (defaultUser.role === 'system_admin') {
          console.log('Setting fallback user role to system_admin');
          setUserRole('system_admin');
        } else if (defaultUser.role === 'property_manager') {
          console.log('Setting fallback user role to property_manager');
          setUserRole('property_manager');
        } else {
          console.log('Setting fallback user role to security');
          setUserRole('security');
        }
        setIsAuthenticated(true);
        return { success: true, user: defaultUser };
      }
      
      console.error('Login failed and no fallback found');
      return { success: false };
    }
  };

  const loginAs = (role: 'security' | 'property_manager') => {
    const selectedUser = DEFAULT_USERS.find((u) => u.role === role);
    if (selectedUser) {
      setUser(selectedUser);
      setUserRole(role === 'property_manager' ? 'property_manager' : 'security');
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setUser(null);
    setUserRole('security');
    setIsAuthenticated(false);
    
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

  const updatePassword = () => {
    // Password updates should be handled via API
    // This is just for UI state management
  };

  const systemLogin = async (username: string, password: string): Promise<{ success: boolean; user?: User }> => {
    try {
      console.log('Attempting system login with username:', username);
      const response = await apiService.systemLogin(username, password);
      console.log('System login response:', response);
      const user: User = {
        id: response.user.id,
        username: response.user.username,
        role: response.user.role as UserRole,
        name: response.user.name,
      };
      
      console.log('Processed system user object:', user);
      setUser(user);
      
      // Handle different roles properly
      if (user.role === 'system_admin') {
        console.log('Setting user role to system_admin');
        setUserRole('system_admin');
      } else if (user.role === 'property_manager') {
        console.log('Setting user role to property_manager');
        setUserRole('property_manager');
      } else if (user.role === 'security') {
        console.log('Setting user role to security');
        setUserRole('security');
      } else if (user.role === 'superadmin') {
        console.log('Setting user role to system_admin for superadmin');
        setUserRole('system_admin');
      } else {
        console.log('Setting default user role to security');
        setUserRole('security');
      }
      setIsAuthenticated(true);
      
      // Store token in localStorage for API service
      localStorage.setItem('access_token', response.access_token);
      
      return { success: true, user };
    } catch (error) {
      console.error('System login failed:', error);
      return { success: false };
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
        systemLogin,
        isAuthenticated,
        isAdmin: userRole === 'system_admin' || userRole === 'property_manager',
        isSuperAdmin: userRole === 'system_admin',
        isSecurity: userRole === 'security',
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
