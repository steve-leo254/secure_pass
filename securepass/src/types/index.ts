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
  checkedOutBy: string | null;
  notes?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
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
