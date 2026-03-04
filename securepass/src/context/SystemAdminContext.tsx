import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { apiService, type SystemUser as ApiSystemUser, type Package as ApiPackage, type Subscription as ApiSubscription, type SubscriptionReminder as ApiSubscriptionReminder } from '../services/api';
import { useAuth } from './AuthContext';
import type {
  Package,
  Subscription,
  SystemUser,
  SubscriptionReminder,
} from '../types';
import { differenceInDays } from 'date-fns';

interface SystemAdminContextType {
  packages: Package[];
  subscriptions: Subscription[];
  systemUsers: SystemUser[];
  reminders: SubscriptionReminder[];

  // Package CRUD
  addPackage: (pkg: Omit<Package, 'id' | 'createdAt'>) => Promise<void>;
  updatePackage: (id: string, data: Partial<Package>) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;

  // User CRUD
  addSystemUser: (user: Omit<SystemUser, 'id' | 'createdAt'>) => Promise<void>;
  updateSystemUser: (id: string, data: Partial<SystemUser>) => Promise<void>;
  deleteSystemUser: (id: string) => Promise<void>;

  // Subscription
  createSubscription: (sub: Omit<Subscription, 'id'>) => Promise<void>;
  updateSubscription: (id: string, data: Partial<Subscription>) => Promise<void>;
  cancelSubscription: (id: string) => Promise<void>;
  extendSubscription: (id: string, days: number) => Promise<void>;

  // Reminders
  addReminder: (r: Omit<SubscriptionReminder, 'id' | 'createdAt'>) => Promise<void>;
  markReminderRead: (id: string) => Promise<void>;
  sendReminder: (id: string) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  generateAutoReminders: () => Promise<void>;


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
    totalCoinsInSystem: number;
    totalCoinsRedeemed: number;
  };

  // Data Management
  resetToDefaults: () => void;
  loadData: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const SystemAdminContext = createContext<SystemAdminContextType | undefined>(undefined);

// Helper functions to convert between API and frontend types
const convertApiPackageToPackage = (apiPackage: ApiPackage): Package => ({
  id: apiPackage.id,
  name: apiPackage.name,
  billing: apiPackage.billing as any,
  price: apiPackage.price,
  currency: apiPackage.currency,
  coinCost: apiPackage.coin_cost,
  maxUsers: apiPackage.max_users,
  maxVisitorsPerDay: apiPackage.max_visitors_per_day,
  features: apiPackage.features,
  isPopular: apiPackage.is_popular,
  isActive: apiPackage.is_active,
  createdAt: new Date(apiPackage.created_at).toISOString(),
});

const convertPackageToApiPackage = (pkg: Omit<Package, 'id' | 'createdAt'>): Omit<ApiPackage, 'id' | 'created_at'> => ({
  name: pkg.name,
  billing: pkg.billing,
  price: pkg.price,
  currency: pkg.currency,
  coin_cost: pkg.coinCost,
  max_users: pkg.maxUsers,
  max_visitors_per_day: pkg.maxVisitorsPerDay,
  features: pkg.features,
  is_popular: pkg.isPopular,
  is_active: pkg.isActive,
});

const convertApiSystemUserToSystemUser = (apiUser: ApiSystemUser): SystemUser => ({
  id: apiUser.id,
  name: apiUser.name,
  email: apiUser.email,
  phone: apiUser.phone || '',
  role: apiUser.role as any,
  status: apiUser.status as any,
  company: apiUser.company || '',
  property: apiUser.property || '',
  totalVisitors: apiUser.total_visitors,
  coinBalance: apiUser.coin_balance,
  totalCoinsPurchased: apiUser.total_coins_purchased,
  totalCoinsRedeemed: apiUser.total_coins_redeemed,
  createdAt: new Date(apiUser.created_at).toISOString(),
});

const convertSystemUserToApiSystemUser = (user: Omit<SystemUser, 'id' | 'createdAt'>): Omit<ApiSystemUser, 'id' | 'created_at'> => ({
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  status: user.status,
  company: user.company,
  property: user.property,
  total_visitors: user.totalVisitors,
  coin_balance: user.coinBalance,
  total_coins_purchased: user.totalCoinsPurchased,
  total_coins_redeemed: user.totalCoinsRedeemed,
});

const convertApiSubscriptionToSubscription = (apiSub: ApiSubscription): Subscription => ({
  id: apiSub.id,
  userId: apiSub.user_id,
  packageId: apiSub.package_id,
  startDate: new Date(apiSub.start_date).toISOString(),
  endDate: new Date(apiSub.end_date).toISOString(),
  status: apiSub.status as any,
  autoRenew: apiSub.auto_renew,
  amount: apiSub.amount,
});

const convertSubscriptionToApiSubscription = (sub: Omit<Subscription, 'id'>): Omit<ApiSubscription, 'id' | 'created_at'> => ({
  user_id: sub.userId,
  package_id: sub.packageId,
  start_date: sub.startDate,
  end_date: sub.endDate,
  status: sub.status,
  auto_renew: sub.autoRenew,
  amount: sub.amount,
});


const convertApiReminderToReminder = (apiReminder: ApiSubscriptionReminder): SubscriptionReminder => ({
  id: apiReminder.id,
  userId: apiReminder.user_id,
  type: apiReminder.type as any,
  message: apiReminder.message,
  read: apiReminder.read,
  sentAt: apiReminder.sent ? new Date().toISOString() : undefined,
  dueDate: new Date().toISOString(), // Not available from API
  createdAt: new Date(apiReminder.created_at).toISOString(),
});

const convertReminderToApiReminder = (reminder: Omit<SubscriptionReminder, 'id' | 'createdAt'>): Omit<ApiSubscriptionReminder, 'id' | 'created_at'> => ({
  user_id: reminder.userId,
  subscription_id: '', // Not available in frontend interface
  type: reminder.type,
  message: reminder.message,
  read: reminder.read,
  sent: !!reminder.sentAt,
});

export const SystemAdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [reminders, setReminders] = useState<SubscriptionReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data from API
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load each endpoint individually to avoid one failure breaking all
      try {
        const packagesRes = await apiService.getPackages();
        setPackages(packagesRes.map(convertApiPackageToPackage));
      } catch (err) {
        console.error('Failed to load packages:', err);
      }

      try {
        const usersRes = await apiService.getSystemUsers();
        setSystemUsers(usersRes.map(convertApiSystemUserToSystemUser));
      } catch (err) {
        console.error('Failed to load users:', err);
      }

      try {
        const subscriptionsRes = await apiService.getSubscriptions();
        setSubscriptions(subscriptionsRes.map(convertApiSubscriptionToSubscription));
      } catch (err) {
        console.error('Failed to load subscriptions:', err);
      }

      
      try {
        const remindersRes = await apiService.getReminders();
        setReminders(remindersRes.map(convertApiReminderToReminder));
      } catch (err) {
        console.error('Failed to load reminders:', err);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      // Clear data when not authenticated
      setPackages([]);
      setSubscriptions([]);
      setSystemUsers([]);
      setReminders([]);
      setError(null);
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Package CRUD
  const addPackage = useCallback(async (pkg: Omit<Package, 'id' | 'createdAt'>) => {
    try {
      await apiService.createPackage(convertPackageToApiPackage(pkg));
      await loadData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add package');
      throw err;
    }
  }, [loadData]);

  const updatePackage = useCallback(async (id: string, data: Partial<Package>) => {
    try {
      await apiService.updatePackage(id, convertPackageToApiPackage(data as Omit<Package, 'id' | 'createdAt'>));
      await loadData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update package');
      throw err;
    }
  }, [loadData]);

  const deletePackage = useCallback(async (id: string) => {
    try {
      await apiService.deletePackage(id);
      await loadData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete package');
      throw err;
    }
  }, [loadData]);

  // User CRUD
  const addSystemUser = useCallback(async (user: Omit<SystemUser, 'id' | 'createdAt'>) => {
    try {
      // Create the user first
      await apiService.createSystemUser(convertSystemUserToApiSystemUser(user));
      
      // Generate a welcome reminder for the new user
      await apiService.createReminder({
        user_id: 'temp-user-id', // This will be updated after user creation
        subscription_id: '',
        type: 'payment_due',
        message: `Welcome ${user.name}! Please set up your subscription to activate your account.`,
        read: false,
        sent: false,
      });
      
      await loadData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user');
      throw err;
    }
  }, [loadData]);

  const updateSystemUser = useCallback(async (id: string, data: Partial<SystemUser>) => {
    try {
      await apiService.updateSystemUser(id, convertSystemUserToApiSystemUser(data as Omit<SystemUser, 'id' | 'createdAt'>));
      await loadData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    }
  }, [loadData]);

  const deleteSystemUser = useCallback(async (id: string) => {
    try {
      await apiService.deleteSystemUser(id);
      await loadData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      throw err;
    }
  }, [loadData]);

  // Subscription operations
  const createSubscription = useCallback(async (sub: Omit<Subscription, 'id'>) => {
    try {
      await apiService.createSubscription(convertSubscriptionToApiSubscription(sub));
      
      // Generate a confirmation reminder for the new subscription
      const user = systemUsers.find(u => u.id === sub.userId);
      if (user) {
        await apiService.createReminder({
          user_id: sub.userId,
          subscription_id: 'temp-sub-id', // This will be updated after subscription creation
          type: 'payment_due',
          message: `${user.name}'s subscription has been activated! Next payment: ${new Date(sub.endDate).toLocaleDateString()}`,
          read: false,
          sent: false,
        });
      }
      
      await loadData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create subscription');
      throw err;
    }
  }, [systemUsers, loadData]);

  const updateSubscription = useCallback(async (id: string, data: Partial<Subscription>) => {
    try {
      await apiService.updateSubscription(id, convertSubscriptionToApiSubscription(data as Omit<Subscription, 'id'>));
      await loadData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subscription');
      throw err;
    }
  }, [loadData]);

  const cancelSubscription = useCallback(async (id: string) => {
    try {
      await apiService.cancelSubscription(id);
      await loadData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
      throw err;
    }
  }, [loadData]);

  const extendSubscription = useCallback(async (id: string, days: number) => {
    try {
      await apiService.extendSubscription(id, days);
      await loadData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extend subscription');
      throw err;
    }
  }, [loadData]);

  // Reminder operations
  const addReminder = useCallback(async (r: Omit<SubscriptionReminder, 'id' | 'createdAt'>) => {
    try {
      await apiService.createReminder(convertReminderToApiReminder(r));
      await loadData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add reminder');
      throw err;
    }
  }, [loadData]);

  const markReminderRead = useCallback(async (id: string) => {
    try {
      await apiService.markReminderRead(id);
      await loadData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark reminder as read');
      throw err;
    }
  }, [loadData]);

  const sendReminder = useCallback(async (id: string) => {
    try {
      // In a real app, this would send an email/notification
      // For now, just mark as sent
      await apiService.markReminderRead(id);
      await loadData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reminder');
      throw err;
    }
  }, [loadData]);

  const deleteReminder = useCallback(async (id: string) => {
    try {
      await apiService.deleteReminder(id);
      await loadData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete reminder');
      throw err;
    }
  }, [loadData]);

  const generateAutoReminders = useCallback(async () => {
    try {
      const now = new Date();
      
      // Generate reminders for expiring subscriptions (within 7 days)
      const expiringSubs = subscriptions.filter(sub => {
        const daysUntilExpiry = differenceInDays(new Date(sub.endDate), now);
        return daysUntilExpiry <= 7 && daysUntilExpiry > 0 && sub.status === 'active';
      });

      // Generate reminders for expired subscriptions
      const expiredSubs = subscriptions.filter(sub => {
        const daysSinceExpiry = differenceInDays(now, new Date(sub.endDate));
        return daysSinceExpiry <= 3 && daysSinceExpiry > 0 && sub.status === 'active';
      });

      // Process expiring subscriptions
      for (const sub of expiringSubs) {
        const user = systemUsers.find(u => u.id === sub.userId);
        if (user) {
          const daysLeft = differenceInDays(new Date(sub.endDate), now);
          await apiService.createReminder({
            user_id: sub.userId,
            subscription_id: sub.id,
            type: 'expiring_soon',
            message: `${user.name}'s subscription expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`,
            read: false,
            sent: false,
          });
        }
      }

      // Process expired subscriptions
      for (const sub of expiredSubs) {
        const user = systemUsers.find(u => u.id === sub.userId);
        if (user) {
          await apiService.createReminder({
            user_id: sub.userId,
            subscription_id: sub.id,
            type: 'expired',
            message: `${user.name}'s subscription expired on ${new Date(sub.endDate).toLocaleDateString()}`,
            read: false,
            sent: false,
          });
        }
      }

      await loadData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate reminders');
      throw err;
    }
  }, [subscriptions, systemUsers, loadData]);

  
  // Queries
  const getUserSubscription = useCallback((userId: string) => {
    return subscriptions.find(sub => sub.userId === userId);
  }, [subscriptions]);

  const getUserPackage = useCallback((userId: string) => {
    const subscription = getUserSubscription(userId);
    if (!subscription) return undefined;
    return packages.find(pkg => pkg.id === subscription.packageId);
  }, [getUserSubscription, packages]);

  const getExpiringSubscriptions = useCallback((days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    return subscriptions
      .filter(sub => {
        const expiryDate = new Date(sub.endDate);
        return expiryDate <= cutoffDate && expiryDate > new Date() && sub.status === 'active';
      })
      .map(sub => ({
        ...sub,
        user: systemUsers.find(user => user.id === sub.userId),
      }));
  }, [subscriptions, systemUsers]);

  const getExpiredSubscriptions = useCallback(() => {
    return subscriptions
      .filter(sub => {
        const expiryDate = new Date(sub.endDate);
        return expiryDate <= new Date() && sub.status === 'active';
      })
      .map(sub => ({
        ...sub,
        user: systemUsers.find(user => user.id === sub.userId),
      }));
  }, [subscriptions, systemUsers]);

  const getUnreadReminders = useCallback(() => {
    return reminders.filter(reminder => !reminder.read);
  }, [reminders]);

  const getSystemStats = useCallback(() => {
    const totalUsers = systemUsers.length;
    const activeUsers = systemUsers.filter(user => user.status === 'active').length;
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
    const expiringSubscriptions = getExpiringSubscriptions().length;
    const expiredSubscriptions = getExpiredSubscriptions().length;
    const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    const monthlyRevenue = subscriptions
      .filter(sub => {
        const subDate = new Date(sub.startDate); // Use startDate instead of createdAt
        const now = new Date();
        return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, sub) => sum + sub.amount, 0);
    const totalPackages = packages.length;
    const totalCoinsInSystem = systemUsers.reduce((sum, user) => sum + user.coinBalance, 0);
    const totalCoinsRedeemed = systemUsers.reduce((sum, user) => sum + user.totalCoinsRedeemed, 0);

    return {
      totalUsers,
      activeUsers,
      activeSubscriptions,
      expiringSubscriptions,
      expiredSubscriptions,
      totalRevenue,
      monthlyRevenue,
      totalPackages,
      totalCoinsInSystem,
      totalCoinsRedeemed,
    };
  }, [systemUsers, subscriptions, packages, getExpiringSubscriptions, getExpiredSubscriptions]);

  const resetToDefaults = useCallback(() => {
    // In API-based version, this would reset to default data via API
    // For now, just reload data
    loadData();
  }, [loadData]);

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
      resetToDefaults,
      loadData,
      loading,
      error,
    }),
    [
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
      resetToDefaults,
      loadData,
      loading,
      error,
    ]
  );

  return <SystemAdminContext.Provider value={value}>{children}</SystemAdminContext.Provider>;
};

export const useSystemAdmin = () => {
  const context = useContext(SystemAdminContext);
  if (context === undefined) {
    throw new Error('useSystemAdmin must be used within a SystemAdminProvider');
  }
  return context;
};
