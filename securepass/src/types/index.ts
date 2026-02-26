export type UserRole = 'property_manager' | 'security';

export type VisitorCategory =
  | 'contractor'
  | 'technician'
  | 'delivery'
  | 'staff'
  | 'visitor';

export type VisitorStatus = 'checked-in' | 'checked-out';

export type Gender = 'male' | 'female' | 'other';

export type BillingStatus = 'trial' | 'active' | 'suspended';

export interface BillingAccount {
  id: string;
  totalRecordsAllowed: number;
  recordsUsed: number;
  balance: number; // in KSH
  status: BillingStatus;
  trialRecordsUsed: number;
  createdAt: string;
  lastPaymentAt?: string;
  payments: Payment[];
}

export interface Payment {
  id: string;
  amount: number; // in KSH
  recordsAdded: number;
  paymentMethod: string;
  createdAt: string;
  status: 'completed' | 'pending' | 'failed';
}

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

export interface Category {
  id: string;
  name: string;
  value: string;
  color: string;
  icon: string;
  isActive: boolean;
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
  checkedOutBy: string | null;
  notes?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
  category?: VisitorCategory;
}

export interface Member {
  id: string;
  mId: string; // Unique Member ID (e.g., MEM-001-2024)
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  position: string;
  company: string;
  idNumber: string;
  gender: Gender;
  dateRegistered: string;
  status: 'active' | 'inactive';
  lastAccess?: string;
}

export interface SystemSettings {
  propertyName: string;
  propertyAddress: string;
  categories: VisitorCategory[];
  tools: string[];
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

export interface HourlyData {
  hour: string;
  checkIns: number;
  checkOuts: number;
}

export interface DailyData {
  date: string;
  total: number;
  checkIns: number;
  checkOuts: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
  icon: string;
}

export const CATEGORIES: { value: VisitorCategory; label: string; color: string; icon: string }[] = [
  { value: 'visitor', label: 'Visitor / Customer', color: 'bg-blue-500', icon: '👤' },
  { value: 'contractor', label: 'Contractor', color: 'bg-orange-500', icon: '🔧' },
  { value: 'technician', label: 'Technician', color: 'bg-purple-500', icon: '⚙️' },
  { value: 'delivery', label: 'Delivery Personnel', color: 'bg-green-500', icon: '📦' },
  { value: 'staff', label: 'Staff', color: 'bg-indigo-500', icon: '🏢' },
];

export const CATEGORY_LABELS: Record<VisitorCategory, string> = {
  'visitor': 'Visitor / Customer',
  'contractor': 'Contractor',
  'technician': 'Technician',
  'delivery': 'Delivery Personnel',
  'staff': 'Staff',
};

export const CATEGORY_CHART_COLORS: Record<VisitorCategory, string> = {
  'visitor': '#3b82f6',
  'contractor': '#f97316',
  'technician': '#8b5cf6',
  'delivery': '#22c55e',
  'staff': '#6366f1',
};

export const TOOLS_LIST: string[] = [
  'Hammer',
  'Screwdriver',
  'Drill Machine',
  'Spanner Set',
  'Welding Machine',
  'Ladder',
  'Pliers',
  'Tape Measure',
  'Level',
  'Wire Cutter',
  'Angle Grinder',
  'Pipe Wrench',
  'Soldering Iron',
  'Circular Saw',
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

// Subscription & Package Management Types
export type SubscriptionStatus = 'active' | 'expiring' | 'expired' | 'trial' | 'suspended';
export type PackageBilling = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
export type SystemUserRole = 'superadmin' | 'admin' | 'security';
export type SystemUserStatus = 'active' | 'inactive' | 'suspended';

// Coin System Types
export interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  price: number; // KES price
  currency: string;
  bonusCoins?: number; // Extra coins as bonus
  isActive: boolean;
  createdAt: string;
}

export interface CoinTransaction {
  id: string;
  userId: string;
  type: 'purchase' | 'redemption' | 'refund' | 'bonus';
  amount: number;
  balance: number; // Balance after transaction
  description: string;
  createdAt: string;
  packageId?: string; // For redemption
  coinPackageId?: string; // For purchase
}

export interface Package {
  id: string;
  name: string;
  billing: PackageBilling;
  price: number; // KES price (legacy)
  currency: string;
  coinCost: number; // Cost in coins
  maxUsers: number;
  maxVisitorsPerDay: number;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  packageId: string;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  autoRenew: boolean;
  paymentMethod?: string;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  amount: number;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: SystemUserRole;
  status: SystemUserStatus;
  avatar?: string;
  company?: string;
  property?: string;
  subscriptionId?: string;
  createdAt: string;
  lastActive?: string;
  totalVisitors?: number;
  coinBalance: number; // Current coin balance
  totalCoinsPurchased: number; // Total coins ever purchased
  totalCoinsRedeemed: number; // Total coins redeemed for packages
}

export interface SubscriptionReminder {
  id: string;
  userId: string;
  type: 'expiring_soon' | 'expired' | 'payment_due' | 'trial_ending';
  message: string;
  sentAt?: string;
  read: boolean;
  dueDate: string;
  createdAt: string;
}

export const BILLING_LABELS: Record<PackageBilling, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annually: 'Annually',
};

export const BILLING_COLORS: Record<PackageBilling, string> = {
  daily: 'bg-slate-500',
  weekly: 'bg-blue-500',
  monthly: 'bg-indigo-500',
  quarterly: 'bg-purple-500',
  annually: 'bg-emerald-500',
};

export const SUB_STATUS_CONFIG: Record<
  SubscriptionStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  active: { label: 'Active', color: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  expiring: { label: 'Expiring Soon', color: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
  expired: { label: 'Expired', color: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' },
  trial: { label: 'Trial', color: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' },
  suspended: { label: 'Suspended', color: 'text-slate-700', bg: 'bg-slate-100', dot: 'bg-slate-500' },
};
