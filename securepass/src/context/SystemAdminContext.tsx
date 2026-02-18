import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  Package,
  Subscription,
  SystemUser,
  SubscriptionReminder,
  PackageBilling,
  SubscriptionStatus,
  SystemUserRole,
  SystemUserStatus,
} from '../types';
import { addDays, addWeeks, addMonths, addYears, differenceInDays } from 'date-fns';

interface SystemAdminContextType {
  packages: Package[];
  subscriptions: Subscription[];
  systemUsers: SystemUser[];
  reminders: SubscriptionReminder[];

  // Package CRUD
  addPackage: (pkg: Omit<Package, 'id' | 'createdAt'>) => void;
  updatePackage: (id: string, data: Partial<Package>) => void;
  deletePackage: (id: string) => void;

  // User CRUD
  addSystemUser: (user: Omit<SystemUser, 'id' | 'createdAt'>) => void;
  updateSystemUser: (id: string, data: Partial<SystemUser>) => void;
  deleteSystemUser: (id: string) => void;

  // Subscription
  createSubscription: (sub: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, data: Partial<Subscription>) => void;
  cancelSubscription: (id: string) => void;
  extendSubscription: (id: string, days: number) => void;

  // Reminders
  addReminder: (r: Omit<SubscriptionReminder, 'id' | 'createdAt'>) => void;
  markReminderRead: (id: string) => void;
  sendReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  generateAutoReminders: () => void;

  // Queries
  getUserSubscription: (userId: string) => Subscription | undefined;
  getUserPackage: (userId: string) => Package | undefined;
  getExpiringSubscriptions: (days?: number) => (Subscription & { user?: SystemUser })[];
  getExpiredSubscriptions: () => (Subscription & { user?: SystemUser })[];
  getUnreadReminders: () => SubscriptionReminder[];
  getSystemStats: () => {
    totalUsers: number;
    activeUsers: number;
    activeSubscriptions: number;
    expiringSubscriptions: number;
    expiredSubscriptions: number;
    totalRevenue: number;
    monthlyRevenue: number;
    totalPackages: number;
  };
}

const SystemAdminContext = createContext<SystemAdminContextType | undefined>(undefined);

const KEYS = {
  packages: 'sp_packages',
  subscriptions: 'sp_subscriptions',
  systemUsers: 'sp_system_users',
  reminders: 'sp_reminders',
};

const load = <T,>(key: string, fallback: T[]): T[] => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
};

const save = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Default packages
const DEFAULT_PACKAGES: Package[] = [
  {
    id: 'pkg-1',
    name: 'Starter',
    billing: 'daily',
    price: 50,
    currency: 'KES',
    maxUsers: 2,
    maxVisitorsPerDay: 50,
    features: ['Basic registration', 'QR Code access', 'Daily reports'],
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'pkg-2',
    name: 'Basic',
    billing: 'weekly',
    price: 300,
    currency: 'KES',
    maxUsers: 5,
    maxVisitorsPerDay: 100,
    features: ['All Starter features', 'Tools tracking', 'Email notifications'],
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'pkg-3',
    name: 'Professional',
    billing: 'monthly',
    price: 2500,
    currency: 'KES',
    maxUsers: 15,
    maxVisitorsPerDay: 500,
    features: ['All Basic features', 'Analytics dashboard', 'CSV/PDF exports', 'Priority support'],
    isPopular: true,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'pkg-4',
    name: 'Enterprise',
    billing: 'annually',
    price: 25000,
    currency: 'KES',
    maxUsers: 50,
    maxVisitorsPerDay: 2000,
    features: ['All Pro features', 'Multi-property', 'API access', 'Custom branding', 'Dedicated support'],
    isActive: true,
    createdAt: '2024-01-01',
  },
];

// Default demo users
const DEFAULT_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'su-1',
    name: 'Riverside Apartments',
    email: 'admin@riverside.co.ke',
    phone: '+254 700 111 222',
    role: 'admin',
    status: 'active',
    company: 'Riverside Management Ltd',
    property: 'Riverside Apartments',
    subscriptionId: 'sub-1',
    createdAt: '2024-06-15',
    lastActive: new Date().toISOString(),
    totalVisitors: 1245,
  },
  {
    id: 'su-2',
    name: 'Greenfield Office Park',
    email: 'security@greenfield.co.ke',
    phone: '+254 711 222 333',
    role: 'admin',
    status: 'active',
    company: 'Greenfield Properties',
    property: 'Greenfield Office Park',
    subscriptionId: 'sub-2',
    createdAt: '2024-08-01',
    lastActive: new Date(Date.now() - 86400000).toISOString(),
    totalVisitors: 892,
  },
  {
    id: 'su-3',
    name: 'Sunset Mall',
    email: 'ops@sunsetmall.co.ke',
    phone: '+254 722 333 444',
    role: 'admin',
    status: 'active',
    company: 'Sunset Retail Group',
    property: 'Sunset Mall',
    subscriptionId: 'sub-3',
    createdAt: '2024-10-20',
    lastActive: new Date(Date.now() - 172800000).toISOString(),
    totalVisitors: 3210,
  },
  {
    id: 'su-4',
    name: 'Hilltop Residences',
    email: 'hilltop@properties.co.ke',
    phone: '+254 733 444 555',
    role: 'admin',
    status: 'inactive',
    company: 'Hilltop Properties',
    property: 'Hilltop Residences',
    subscriptionId: 'sub-4',
    createdAt: '2024-04-10',
    lastActive: new Date(Date.now() - 604800000).toISOString(),
    totalVisitors: 456,
  },
  {
    id: 'su-5',
    name: 'Parkview Heights',
    email: 'admin@parkview.co.ke',
    phone: '+254 744 555 666',
    role: 'security',
    status: 'active',
    company: 'Parkview Developers',
    property: 'Parkview Heights',
    subscriptionId: 'sub-5',
    createdAt: '2025-01-01',
    lastActive: new Date().toISOString(),
    totalVisitors: 78,
  },
];

const DEFAULT_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    userId: 'su-1',
    packageId: 'pkg-3',
    startDate: '2024-12-01',
    endDate: addMonths(new Date(), 1).toISOString(),
    status: 'active',
    autoRenew: true,
    amount: 2500,
    lastPaymentDate: '2025-01-01',
    nextPaymentDate: addMonths(new Date(), 1).toISOString(),
  },
  {
    id: 'sub-2',
    userId: 'su-2',
    packageId: 'pkg-4',
    startDate: '2024-08-01',
    endDate: addYears(new Date('2024-08-01'), 1).toISOString(),
    status: 'active',
    autoRenew: true,
    amount: 25000,
    lastPaymentDate: '2024-08-01',
    nextPaymentDate: addYears(new Date('2024-08-01'), 1).toISOString(),
  },
  {
    id: 'sub-3',
    userId: 'su-3',
    packageId: 'pkg-3',
    startDate: '2024-10-20',
    endDate: addDays(new Date(), 5).toISOString(),
    status: 'expiring',
    autoRenew: false,
    amount: 2500,
    lastPaymentDate: '2025-01-01',
    nextPaymentDate: addDays(new Date(), 5).toISOString(),
  },
  {
    id: 'sub-4',
    userId: 'su-4',
    packageId: 'pkg-2',
    startDate: '2024-04-10',
    endDate: new Date(Date.now() - 864000000).toISOString(),
    status: 'expired',
    autoRenew: false,
    amount: 300,
  },
  {
    id: 'sub-5',
    userId: 'su-5',
    packageId: 'pkg-1',
    startDate: '2025-01-01',
    endDate: addDays(new Date(), 12).toISOString(),
    status: 'trial',
    autoRenew: false,
    amount: 0,
  },
];

export const SystemAdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Package[]>(() => load(KEYS.packages, DEFAULT_PACKAGES));
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() =>
    load(KEYS.subscriptions, DEFAULT_SUBSCRIPTIONS)
  );
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(() =>
    load(KEYS.systemUsers, DEFAULT_SYSTEM_USERS)
  );
  const [reminders, setReminders] = useState<SubscriptionReminder[]>(() =>
    load(KEYS.reminders, [])
  );

  // ---------- Packages ----------
  const addPackage = useCallback(
    (pkg: Omit<Package, 'id' | 'createdAt'>) => {
      setPackages((prev) => {
        const updated = [
          ...prev,
          { ...pkg, id: uuidv4(), createdAt: new Date().toISOString() },
        ];
        save(KEYS.packages, updated);
        return updated;
      });
    },
    []
  );

  const updatePackage = useCallback((id: string, data: Partial<Package>) => {
    setPackages((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...data } : p));
      save(KEYS.packages, updated);
      return updated;
    });
  }, []);

  const deletePackage = useCallback((id: string) => {
    setPackages((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      save(KEYS.packages, updated);
      return updated;
    });
  }, []);

  // ---------- Users ----------
  const addSystemUser = useCallback(
    (user: Omit<SystemUser, 'id' | 'createdAt'>) => {
      setSystemUsers((prev) => {
        const updated = [
          ...prev,
          { ...user, id: uuidv4(), createdAt: new Date().toISOString() },
        ];
        save(KEYS.systemUsers, updated);
        return updated;
      });
    },
    []
  );

  const updateSystemUser = useCallback(
    (id: string, data: Partial<SystemUser>) => {
      setSystemUsers((prev) => {
        const updated = prev.map((u) => (u.id === id ? { ...u, ...data } : u));
        save(KEYS.systemUsers, updated);
        return updated;
      });
    },
    []
  );

  const deleteSystemUser = useCallback((id: string) => {
    setSystemUsers((prev) => {
      const updated = prev.filter((u) => u.id !== id);
      save(KEYS.systemUsers, updated);
      return updated;
    });
  }, []);

  // ---------- Subscriptions ----------
  const createSubscription = useCallback(
    (sub: Omit<Subscription, 'id'>) => {
      const newSub = { ...sub, id: uuidv4() };
      setSubscriptions((prev) => {
        const updated = [...prev, newSub];
        save(KEYS.subscriptions, updated);
        return updated;
      });
      // Link to user
      setSystemUsers((prev) => {
        const updated = prev.map((u) =>
          u.id === sub.userId ? { ...u, subscriptionId: newSub.id } : u
        );
        save(KEYS.systemUsers, updated);
        return updated;
      });
    },
    []
  );

  const updateSubscription = useCallback(
    (id: string, data: Partial<Subscription>) => {
      setSubscriptions((prev) => {
        const updated = prev.map((s) => (s.id === id ? { ...s, ...data } : s));
        save(KEYS.subscriptions, updated);
        return updated;
      });
    },
    []
  );

  const cancelSubscription = useCallback((id: string) => {
    updateSubscription(id, { status: 'suspended', autoRenew: false });
  }, [updateSubscription]);

  const extendSubscription = useCallback(
    (id: string, days: number) => {
      setSubscriptions((prev) => {
        const updated = prev.map((s) => {
          if (s.id !== id) return s;
          const current = new Date(s.endDate) > new Date() ? new Date(s.endDate) : new Date();
          return {
            ...s,
            endDate: addDays(current, days).toISOString(),
            status: 'active' as SubscriptionStatus,
          };
        });
        save(KEYS.subscriptions, updated);
        return updated;
      });
    },
    []
  );

  // ---------- Reminders ----------
  const addReminder = useCallback(
    (r: Omit<SubscriptionReminder, 'id' | 'createdAt'>) => {
      setReminders((prev) => {
        const updated = [
          { ...r, id: uuidv4(), createdAt: new Date().toISOString() },
          ...prev,
        ];
        save(KEYS.reminders, updated);
        return updated;
      });
    },
    []
  );

  const markReminderRead = useCallback((id: string) => {
    setReminders((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, read: true } : r));
      save(KEYS.reminders, updated);
      return updated;
    });
  }, []);

  const sendReminder = useCallback((id: string) => {
    setReminders((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, sentAt: new Date().toISOString() } : r
      );
      save(KEYS.reminders, updated);
      return updated;
    });
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      save(KEYS.reminders, updated);
      return updated;
    });
  }, []);

  const generateAutoReminders = useCallback(() => {
    const now = new Date();
    const newReminders: SubscriptionReminder[] = [];

    subscriptions.forEach((sub) => {
      const endDate = new Date(sub.endDate);
      const daysLeft = differenceInDays(endDate, now);
      const user = systemUsers.find((u) => u.id === sub.userId);
      const existing = reminders.find(
        (r) => r.userId === sub.userId && r.type === 'expiring_soon' && !r.read
      );

      if (daysLeft <= 7 && daysLeft > 0 && sub.status !== 'expired' && !existing) {
        newReminders.push({
          id: uuidv4(),
          userId: sub.userId,
          type: 'expiring_soon',
          message: `${user?.name || 'User'}'s subscription expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
          read: false,
          dueDate: sub.endDate,
          createdAt: now.toISOString(),
        });
      }

      if (daysLeft <= 0 && sub.status !== 'suspended') {
        const existingExpired = reminders.find(
          (r) => r.userId === sub.userId && r.type === 'expired' && !r.read
        );
        if (!existingExpired) {
          newReminders.push({
            id: uuidv4(),
            userId: sub.userId,
            type: 'expired',
            message: `${user?.name || 'User'}'s subscription has expired`,
            read: false,
            dueDate: sub.endDate,
            createdAt: now.toISOString(),
          });
        }
      }
    });

    if (newReminders.length > 0) {
      setReminders((prev) => {
        const updated = [...newReminders, ...prev];
        save(KEYS.reminders, updated);
        return updated;
      });
    }
  }, [subscriptions, systemUsers, reminders]);

  // ---------- Queries ----------
  const getUserSubscription = useCallback(
    (userId: string) => subscriptions.find((s) => s.userId === userId),
    [subscriptions]
  );

  const getUserPackage = useCallback(
    (userId: string) => {
      const sub = subscriptions.find((s) => s.userId === userId);
      return sub ? packages.find((p) => p.id === sub.packageId) : undefined;
    },
    [subscriptions, packages]
  );

  const getExpiringSubscriptions = useCallback(
    (days: number = 7) => {
      const now = new Date();
      return subscriptions
        .filter((s) => {
          const dLeft = differenceInDays(new Date(s.endDate), now);
          return dLeft > 0 && dLeft <= days && s.status !== 'expired' && s.status !== 'suspended';
        })
        .map((s) => ({ ...s, user: systemUsers.find((u) => u.id === s.userId) }));
    },
    [subscriptions, systemUsers]
  );

  const getExpiredSubscriptions = useCallback(
    () =>
      subscriptions
        .filter((s) => new Date(s.endDate) < new Date() || s.status === 'expired')
        .map((s) => ({ ...s, user: systemUsers.find((u) => u.id === s.userId) })),
    [subscriptions, systemUsers]
  );

  const getUnreadReminders = useCallback(
    () => reminders.filter((r) => !r.read),
    [reminders]
  );

  const getSystemStats = useCallback(() => {
    const now = new Date();
    return {
      totalUsers: systemUsers.length,
      activeUsers: systemUsers.filter((u) => u.status === 'active').length,
      activeSubscriptions: subscriptions.filter((s) => s.status === 'active' || s.status === 'trial').length,
      expiringSubscriptions: subscriptions.filter((s) => {
        const d = differenceInDays(new Date(s.endDate), now);
        return d > 0 && d <= 7;
      }).length,
      expiredSubscriptions: subscriptions.filter(
        (s) => s.status === 'expired' || new Date(s.endDate) < now
      ).length,
      totalRevenue: subscriptions.reduce((acc, s) => acc + s.amount, 0),
      monthlyRevenue: subscriptions
        .filter((s) => s.status === 'active')
        .reduce((acc, s) => acc + s.amount, 0),
      totalPackages: packages.filter((p) => p.isActive).length,
    };
  }, [systemUsers, subscriptions, packages]);

  const value = useMemo(
    () => ({
      packages,
      subscriptions,
      systemUsers,
      reminders,
      addPackage,
      updatePackage,
      deletePackage,
      addSystemUser,
      updateSystemUser,
      deleteSystemUser,
      createSubscription,
      updateSubscription,
      cancelSubscription,
      extendSubscription,
      addReminder,
      markReminderRead,
      sendReminder,
      deleteReminder,
      generateAutoReminders,
      getUserSubscription,
      getUserPackage,
      getExpiringSubscriptions,
      getExpiredSubscriptions,
      getUnreadReminders,
      getSystemStats,
    }),
    [
      packages, subscriptions, systemUsers, reminders,
      addPackage, updatePackage, deletePackage,
      addSystemUser, updateSystemUser, deleteSystemUser,
      createSubscription, updateSubscription, cancelSubscription, extendSubscription,
      addReminder, markReminderRead, sendReminder, deleteReminder, generateAutoReminders,
      getUserSubscription, getUserPackage, getExpiringSubscriptions, getExpiredSubscriptions,
      getUnreadReminders, getSystemStats,
    ]
  );

  return (
    <SystemAdminContext.Provider value={value}>
      {children}
    </SystemAdminContext.Provider>
  );
};

export const useSystemAdmin = (): SystemAdminContextType => {
  const ctx = useContext(SystemAdminContext);
  if (!ctx) throw new Error('useSystemAdmin must be inside SystemAdminProvider');
  return ctx;
};