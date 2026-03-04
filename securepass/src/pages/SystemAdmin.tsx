import React, { useState, useEffect } from 'react';
import { useSystemAdmin } from '../context/SystemAdminContext';
import { useAuth } from '../context/AuthContext';
import {
  BILLING_LABELS,
  BILLING_COLORS,
  SUB_STATUS_CONFIG,
} from '../types';
import type {
  PackageBilling,
  UserRole,
} from '../types';
import { format, differenceInDays, formatDistanceToNow } from 'date-fns';
import {
  Shield,
  Users,
  CreditCard,
  Package,
  Bell,
  UserPlus,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Search,
  Edit3,
  Trash2,
  Save,
  X,
  Plus,
  Eye,
  Mail,
  Send,
  RefreshCw,
  Star,
  Crown,
  Building2,
  Phone,
  Activity,
  ArrowUpRight,
  Ban,
  PlayCircle,
  CalendarPlus,
  Timer,
} from 'lucide-react';

type Tab = 'overview' | 'users' | 'subscriptions' | 'packages' | 'reminders' | 'property-managers';

const SystemAdmin: React.FC = () => {
  const { user } = useAuth();
  const {
    packages,
    subscriptions,
    systemUsers,
    reminders,
    coinPackages,
    coinTransactions,
    addPackage,
    updatePackage,
    deletePackage,
    addSystemUser,
    deleteSystemUser,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    extendSubscription,
    markReminderRead,
    sendReminder,
    deleteReminder,
    generateAutoReminders,
    getUserSubscription,
    getUserPackage,
    getExpiringSubscriptions,
    getUnreadReminders,
    getSystemStats,
    resetToDefaults,
    deleteCoinPackage,
    getUserCoinTransactions,
    loadData,
    loading,
    error,
  } = useSystemAdmin();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState<string | null>(null);
  const [showUserDetail, setShowUserDetail] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    type: 'user' | 'package';
    id: string;
  } | null>(null);
  const [editingPackage, setEditingPackage] = useState<string | null>(null);
  const [showAddPropertyManager, setShowAddPropertyManager] = useState(false);

  // Add User Form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('admin');
  const [newUserCompany, setNewUserCompany] = useState('');
  const [newUserProperty, setNewUserProperty] = useState('');
  const [newUserPackage, setNewUserPackage] = useState('');
  const [newUserEndDate, setNewUserEndDate] = useState('');

  // Property Manager Registration Form
  const [pmName, setPmName] = useState('');
  const [pmEmail, setPmEmail] = useState('');
  const [pmPhone, setPmPhone] = useState('');
  const [pmProperty, setPmProperty] = useState('');
  const [pmCompany, setPmCompany] = useState('');
  const [pmPassword, setPmPassword] = useState('');
  const [pmConfirmPassword, setPmConfirmPassword] = useState('');

  // Add Package Form
  const [pkgName, setPkgName] = useState('');
  const [pkgBilling, setPkgBilling] = useState<PackageBilling>('monthly');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgFeatures, setPkgFeatures] = useState('');
  const [pkgIsPopular, setPkgIsPopular] = useState(false);

  // Extend
  const [extendDays, setExtendDays] = useState('30');

  const stats = getSystemStats();
  const expiringList = getExpiringSubscriptions(7);
  const unreadReminders = getUnreadReminders();

  // Check if current user can assign specific roles
  const canAssignRole = (role: UserRole): boolean => {
    // Only admin can assign security and superadmin roles
    if (role === 'security' || role === 'superadmin') {
      return user?.role === 'property_manager';
    }
    // Admin can assign admin role
    if (role === 'admin') {
      return user?.role === 'property_manager';
    }
    return false;
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetUserForm = () => {
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserRole('admin');
    setNewUserCompany('');
    setNewUserProperty('');
    setNewUserPackage('');
    setNewUserEndDate('');
  };

  const resetPackageForm = () => {
    setPkgName('');
    setPkgBilling('monthly');
    setPkgPrice('');
    setPkgFeatures('');
    setPkgIsPopular(false);
  };

  const handleAddPropertyManager = () => {
    if (!pmName || !pmEmail || !pmPassword || !pmProperty) {
      alert('Please fill in all required fields (Name, Email, Password, and Property).');
      return;
    }

    if (pmPassword !== pmConfirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(pmEmail)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      addSystemUser({
        name: pmName,
        email: pmEmail,
        phone: pmPhone,
        role: 'property_manager',
        company: pmCompany,
        property: pmProperty,
        password: pmPassword, // In production, this should be hashed
        isActive: true,
      });

      // Reset form
      setPmName('');
      setPmEmail('');
      setPmPhone('');
      setPmProperty('');
      setPmCompany('');
      setPmPassword('');
      setPmConfirmPassword('');
      setShowAddPropertyManager(false);
      alert('Property Manager registered successfully!');
    } catch (error) {
      console.error('Error registering property manager:', error);
      alert('Error registering property manager. Please try again.');
    }
  };

  const handleAddUser = () => {
    if (!newUserName || !newUserEmail) {
      alert('Please fill in all required fields (Name and Email).');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUserEmail)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Validate role assignment permissions
    if (!canAssignRole(newUserRole)) {
      alert('You do not have permission to assign this role.');
      return;
    }
    
    try {
      addSystemUser({
        name: newUserName,
        email: newUserEmail,
        phone: newUserPhone,
        role: newUserRole,
        status: 'active',
        company: newUserCompany,
        property: newUserProperty,
        totalVisitors: 0,
        coinBalance: 0,
        totalCoinsPurchased: 0,
        totalCoinsRedeemed: 0,
      });

      // Create subscription if package selected
      if (newUserPackage && newUserEndDate) {
        // We need the user id â€” but it's auto-generated. For simplicity, we'll find the latest user
        setTimeout(() => {
          try {
            const latestUser = JSON.parse(localStorage.getItem('sp_system_users') || '[]');
            const lastUser = latestUser[latestUser.length - 1];
            if (lastUser) {
              createSubscription({
                userId: lastUser.id,
                packageId: newUserPackage,
                startDate: new Date().toISOString(),
                endDate: new Date(newUserEndDate).toISOString(),
                status: 'active',
                autoRenew: true,
                amount: packages.find((p) => p.id === newUserPackage)?.price || 0,
              });
            }
          } catch (error) {
            console.error('Error creating subscription:', error);
          }
        }, 100);
      }

      resetUserForm();
      setShowAddUser(false);
      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user. Please try again.');
    }
  };

  const handleAddPackage = () => {
    if (!pkgName || !pkgPrice) return;
    addPackage({
      name: pkgName,
      billing: pkgBilling,
      price: Number(pkgPrice),
      currency: 'KES',
      coinCost: 0,
      maxUsers: 10,
      maxVisitorsPerDay: 100,
      features: pkgFeatures
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
      isPopular: pkgIsPopular,
      isActive: true,
    });
    resetPackageForm();
    setShowAddPackage(false);
  };

  const handleExtend = () => {
    if (showExtendModal && extendDays) {
      extendSubscription(showExtendModal, Number(extendDays));
      setShowExtendModal(null);
      setExtendDays('30');
    }
  };

  const handleDelete = () => {
    if (!showDeleteConfirm) return;
    if (showDeleteConfirm.type === 'user') deleteSystemUser(showDeleteConfirm.id);
    else deletePackage(showDeleteConfirm.id);
    setShowDeleteConfirm(null);
  };

  const filteredUsers = systemUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.company || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs: { key: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'users', label: 'Users', icon: Users, badge: systemUsers.length },
    { key: 'subscriptions', label: 'Subscriptions', icon: CreditCard, badge: expiringList.length || undefined },
    { key: 'packages', label: 'Packages', icon: Package },
    { key: 'property-managers', label: 'Property Managers', icon: Building2 },
    { key: 'reminders', label: 'Reminders', icon: Bell, badge: unreadReminders.length || undefined },
  ];

  const getDaysLeft = (endDate: string) => {
    const d = differenceInDays(new Date(endDate), new Date());
    return d;
  };

  const getBillingIcon = (billing: PackageBilling) => {
    switch (billing) {
      case 'daily': return <Clock className="w-3.5 h-3.5" />;
      case 'weekly': return <Calendar className="w-3.5 h-3.5" />;
      case 'monthly': return <CalendarPlus className="w-3.5 h-3.5" />;
      case 'quarterly': return <Timer className="w-3.5 h-3.5" />;
      case 'annually': return <Crown className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-indigo-300 text-xs uppercase tracking-widest font-bold">
                      System Administration
                    </p>
                    <h1 className="text-2xl font-black">SECUREPASS Control Center</h1>
                  </div>
                </div>
                <p className="text-indigo-300 text-sm mt-1">
                  Manage users, subscriptions, packages, and system-wide settings
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddUser(true)}
                className="px-4 py-2.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-sm flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Add User
                </button>
                <button
                  onClick={() => setShowAddPackage(true)}
                  className="px-4 py-2.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Package
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all data to defaults? This will delete all custom data.')) {
                      resetToDefaults();
                    }
                  }}
                  className="px-4 py-2.5 bg-red-500/20 border border-red-500/30 text-red-300 font-semibold rounded-xl hover:bg-red-500/30 transition-all text-sm flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl border border-slate-100 p-1.5 shadow-sm overflow-x-auto animate-fade-in">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${active
                  ? 'bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.badge && (
                <span
                  className={`min-w-4.5 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${active ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'
                    }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============ OVERVIEW TAB ============ */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, gradient: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/15' },
              { label: 'Active Subscriptions', value: stats.activeSubscriptions, icon: CreditCard, gradient: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/15' },
              { label: 'Expiring Soon', value: stats.expiringSubscriptions, icon: AlertTriangle, gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/15' },
              { label: 'Total Coins in System', value: `${stats.totalCoinsInSystem.toLocaleString()} coins`, icon: Crown, gradient: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-500/15', isText: true },
              { label: 'Coins Redeemed', value: `${stats.totalCoinsRedeemed.toLocaleString()} coins`, icon: Activity, gradient: 'from-rose-500 to-pink-500', shadow: 'shadow-rose-500/15', isText: true },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all">
                  <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${card.gradient} flex items-center justify-center shadow-lg ${card.shadow} mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className={`${(card as any).isText ? 'text-lg' : 'text-2xl'} font-black text-slate-800`}>
                    {card.value}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{card.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Expiring Soon */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Expiring Soon
                </h3>
                <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg font-semibold border border-amber-100">
                  {expiringList.length} subscriptions
                </span>
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {expiringList.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No expiring subscriptions</p>
                ) : (
                  expiringList.map((sub) => {
                    const daysLeft = getDaysLeft(sub.endDate);
                    return (
                      <div key={sub.id} className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                          {daysLeft}d
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-700 text-sm truncate">{sub.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-400">{sub.user?.property}</p>
                        </div>
                        <button
                          onClick={() => setShowExtendModal(sub.id)}
                          className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-200 transition-all"
                        >
                          Extend
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recent Reminders */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-500" />
                  Recent Reminders
                </h3>
                <button
                  onClick={generateAutoReminders}
                  className="text-xs text-indigo-600 font-semibold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-all"
                >
                  <RefreshCw className="w-3 h-3" />
                  Refresh
                </button>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {reminders.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No reminders</p>
                ) : (
                  reminders.slice(0, 8).map((r) => {
                    const user = systemUsers.find((u) => u.id === r.userId);
                    return (
                      <div
                        key={r.id}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${r.read ? 'bg-slate-50/50' : 'bg-indigo-50/50 border border-indigo-100/50'}`}
                      >
                        <div className={`w-2 h-2 rounded-full shrink-0 ${r.type === 'expired' ? 'bg-red-500' : r.type === 'expiring_soon' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${r.read ? 'text-slate-500' : 'text-slate-700 font-medium'}`}>
                            {r.message}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        {!r.read && (
                          <button
                            onClick={() => markReminderRead(r.id)}
                            className="text-xs text-indigo-600 font-medium hover:underline"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* All Users Quick View */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800">All System Users</h3>
              <button
                onClick={() => setActiveTab('users')}
                className="text-xs text-indigo-600 font-semibold flex items-center gap-1"
              >
                View All <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['User', 'Property', 'Package', 'Status', 'Expires', 'Actions'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {systemUsers.slice(0, 5).map((user) => {
                    const sub = getUserSubscription(user.id);
                    const pkg = getUserPackage(user.id);
                    const statusCfg = sub ? SUB_STATUS_CONFIG[sub.status] : null;
                    const daysLeft = sub ? getDaysLeft(sub.endDate) : null;
                    return (
                      <tr key={user.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs ${user.status === 'active' ? 'bg-linear-to-br from-indigo-500 to-purple-600' : 'bg-slate-400'}`}>
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-700 text-sm">{user.name}</p>
                              <p className="text-[11px] text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-sm text-slate-600">{user.property || 'â€”'}</td>
                        <td className="py-3 pr-4">
                          {pkg ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${BILLING_COLORS[pkg.billing]} text-white`}>
                              {pkg.name}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">None</span>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          {statusCfg ? (
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold ${statusCfg.bg} ${statusCfg.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                              {statusCfg.label}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">â€”</span>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          {daysLeft !== null ? (
                            <span className={`text-sm font-semibold ${daysLeft <= 7 ? (daysLeft <= 0 ? 'text-red-600' : 'text-amber-600') : 'text-slate-600'}`}>
                              {daysLeft <= 0 ? 'Expired' : `${daysLeft}d left`}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">â€”</span>
                          )}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setShowUserDetail(user.id)} className="w-7 h-7 rounded-lg bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center text-indigo-600 transition-colors">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {sub && daysLeft !== null && daysLeft <= 7 && (
                              <button onClick={() => setShowExtendModal(sub.id)} className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors">
                                <CalendarPlus className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============ USERS TAB ============ */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // Search is already filtered, no additional action needed
                }
              }} placeholder="Search users..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" />
            </div>
            <button onClick={() => setShowAddUser(true)} className="px-5 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 text-slate-500">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Loading users...
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Error loading users: {error}</span>
                <button onClick={loadData} className="ml-auto text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded-md transition-colors">
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                {searchQuery ? 'No users found matching your search' : 'No users found. Add your first user to get started.'}
              </p>
            </div>
          )}

          {/* Users Grid */}
          {!loading && !error && filteredUsers.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => {
                const sub = getUserSubscription(user.id);
                const pkg = getUserPackage(user.id);
                const daysLeft = sub ? getDaysLeft(sub.endDate) : null;
                const statusCfg = sub ? SUB_STATUS_CONFIG[sub.status] : null;
                return (
                  <div key={user.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                    <div className={`h-1.5 ${user.status === 'active' ? 'bg-linear-to-r from-emerald-500 to-teal-500' : user.status === 'suspended' ? 'bg-red-500' : 'bg-slate-300'}`} />
                    <div className="p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${user.status === 'active' ? 'bg-linear-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20' : 'bg-slate-400'}`}>
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 truncate">{user.name}</h4>
                          <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${user.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                          {user.role}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm mb-4">
                        {user.property && (
                          <div className="flex items-center gap-2 text-slate-500">
                            <Building2 className="w-3.5 h-3.5" />
                            <span className="truncate">{user.property}</span>
                          </div>
                        )}
                      {pkg && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-xs">Package</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${BILLING_COLORS[pkg.billing]} text-white`}>
                            {getBillingIcon(pkg.billing)}
                            {pkg.name}
                          </span>
                        </div>
                      )}
                      {statusCfg && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-xs">Status</span>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold ${statusCfg.bg} ${statusCfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                            {statusCfg.label}
                          </span>
                        </div>
                      )}
                      {daysLeft !== null && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-xs">Expires</span>
                          <span className={`text-xs font-bold ${daysLeft <= 0 ? 'text-red-600' : daysLeft <= 7 ? 'text-amber-600' : 'text-slate-600'}`}>
                            {daysLeft <= 0 ? 'Expired' : `${daysLeft} days left`}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => setShowUserDetail(user.id)} className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-all flex items-center justify-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                      {sub && daysLeft !== null && (
                        <button onClick={() => setShowExtendModal(sub.id)} className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-semibold hover:bg-indigo-100 transition-all flex items-center justify-center gap-1">
                          <CalendarPlus className="w-3.5 h-3.5" />
                          Extend
                        </button>
                      )}
                      <button onClick={() => setShowDeleteConfirm({ type: 'user', id: user.id })} className="py-2 px-3 bg-red-50 text-red-500 rounded-xl text-xs hover:bg-red-100 transition-all flex items-center justify-center">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* ============ SUBSCRIPTIONS TAB ============ */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5 text-center">
              <p className="text-3xl font-black text-emerald-700">{stats.activeSubscriptions}</p>
              <p className="text-xs text-emerald-500 font-semibold mt-1">Active</p>
            </div>
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5 text-center">
              <p className="text-3xl font-black text-amber-700">{stats.expiringSubscriptions}</p>
              <p className="text-xs text-amber-500 font-semibold mt-1">Expiring</p>
            </div>
            <div className="bg-red-50 rounded-2xl border border-red-100 p-5 text-center">
              <p className="text-3xl font-black text-red-700">{stats.expiredSubscriptions}</p>
              <p className="text-xs text-red-500 font-semibold mt-1">Expired</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['User', 'Package', 'Start Date', 'End Date', 'Days Left', 'Amount', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => {
                    const user = systemUsers.find((u) => u.id === sub.userId);
                    const pkg = packages.find((p) => p.id === sub.packageId);
                    const daysLeft = getDaysLeft(sub.endDate);
                    const statusCfg = SUB_STATUS_CONFIG[sub.status as keyof typeof SUB_STATUS_CONFIG] || {
                      label: sub.status || 'Unknown',
                      color: 'text-slate-700',
                      bg: 'bg-slate-100',
                      dot: 'bg-slate-500'
                    };
                    return (
                      <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="px-5 py-3 text-sm font-semibold text-slate-700">{user?.name || 'â€”'}</td>
                        <td className="px-5 py-3">
                          {pkg && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${BILLING_COLORS[pkg.billing]} text-white`}>
                              {pkg.name}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-500">{format(new Date(sub.startDate), 'MMM d, yyyy')}</td>
                        <td className="px-5 py-3 text-xs text-slate-500">{format(new Date(sub.endDate), 'MMM d, yyyy')}</td>
                        <td className="px-5 py-3">
                          <span className={`text-sm font-bold ${daysLeft <= 0 ? 'text-red-600' : daysLeft <= 7 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {daysLeft <= 0 ? 'Expired' : `${daysLeft}d`}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-700">{pkg?.coinCost || 0} coins</span>
                              <span className="text-xs text-slate-400">({pkg?.billing})</span>
                            </div>
                            {user && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-slate-400">Balance:</span>
                                <span className={`text-xs font-bold ${user.coinBalance >= (pkg?.coinCost || 0) ? 'text-emerald-600' : 'text-red-600'}`}>
                                  {user.coinBalance} coins
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusCfg.bg} ${statusCfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex gap-1">
                            <button onClick={() => setShowExtendModal(sub.id)} className="w-7 h-7 rounded-lg bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center text-indigo-600 transition-colors" title="Extend">
                              <CalendarPlus className="w-3.5 h-3.5" />
                            </button>
                            {sub.status !== 'suspended' && (
                              <button onClick={() => cancelSubscription(sub.id)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors" title="Suspend">
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {sub.status === 'suspended' && (
                              <button onClick={() => updateSubscription(sub.id, { status: 'active' })} className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-600 transition-colors" title="Activate">
                                <PlayCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============ PACKAGES TAB ============ */}
      {activeTab === 'packages' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Subscription Packages</h3>
              <p className="text-sm text-slate-400">{packages.filter((p) => p.isActive).length} active packages</p>
            </div>
            <button onClick={() => setShowAddPackage(true)} className="px-4 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Package
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {packages.filter((p) => p.isActive).map((pkg) => {
              const subCount = subscriptions.filter((s) => s.packageId === pkg.id && (s.status === 'active' || s.status === 'trial')).length;
              return (
                <div key={pkg.id} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden relative ${pkg.isPopular ? 'border-indigo-200 ring-2 ring-indigo-100' : 'border-slate-100'}`}>
                  {pkg.isPopular && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-full text-[10px] font-bold">
                        <Star className="w-3 h-3" />
                        Popular
                      </span>
                    </div>
                  )}
                  <div className={`h-1.5 ${BILLING_COLORS[pkg.billing]}`} />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-7 h-7 rounded-lg ${BILLING_COLORS[pkg.billing]} flex items-center justify-center text-white`}>
                        {getBillingIcon(pkg.billing)}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold uppercase">{BILLING_LABELS[pkg.billing]}</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 mb-1">{pkg.name}</h4>
                    <p className="text-2xl font-black text-indigo-600 mb-4">
                      {pkg.currency} {pkg.price.toLocaleString()}
                      <span className="text-xs text-slate-400 font-normal">/{pkg.billing}</span>
                    </p>
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Max Users</span>
                        <span className="font-bold text-slate-700">{pkg.maxUsers}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Visitors/Day</span>
                        <span className="font-bold text-slate-700">{pkg.maxVisitorsPerDay}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Subscribers</span>
                        <span className="font-bold text-indigo-600">{subCount}</span>
                      </div>
                    </div>
                    <div className="space-y-1 mb-4">
                      {pkg.features.slice(0, 4).map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          {f}
                        </div>
                      ))}
                      {pkg.features.length > 4 && (
                        <p className="text-[11px] text-slate-400 pl-4.5">+{pkg.features.length - 4} more</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingPackage(pkg.id); setPkgName(pkg.name); setPkgBilling(pkg.billing); setPkgPrice(String(pkg.price)); setPkgFeatures(pkg.features.join('\n')); setPkgIsPopular(!!pkg.isPopular); setShowAddPackage(true); }} className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-all flex items-center justify-center gap-1">
                        <Edit3 className="w-3 h-3" />
                        Edit
                      </button>
                      <button onClick={() => setShowDeleteConfirm({ type: 'package', id: pkg.id })} className="py-2 px-3 bg-red-50 text-red-500 rounded-xl text-xs hover:bg-red-100 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============ REMINDERS TAB ============ */}
      {activeTab === 'reminders' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Subscription Reminders</h3>
              <p className="text-sm text-slate-400">{unreadReminders.length} unread</p>
            </div>
            <button onClick={generateAutoReminders} className="px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl font-semibold text-sm hover:bg-indigo-100 transition-all flex items-center gap-2 border border-indigo-100">
              <RefreshCw className="w-4 h-4" />
              Generate Reminders
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {reminders.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 mb-1">No Reminders</h4>
                <p className="text-sm text-slate-400">Click "Generate Reminders" to scan for expiring subscriptions</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {reminders.map((r) => {
                  const user = systemUsers.find((u) => u.id === r.userId);
                  const typeColors: Record<string, string> = {
                    expiring_soon: 'bg-amber-500',
                    expired: 'bg-red-500',
                    payment_due: 'bg-blue-500',
                    trial_ending: 'bg-purple-500',
                  };
                  return (
                    <div key={r.id} className={`flex items-center gap-4 p-4 ${r.read ? '' : 'bg-indigo-50/30'} hover:bg-slate-50/50 transition-colors`}>
                      <div className={`w-3 h-3 rounded-full shrink-0 ${typeColors[r.type] || 'bg-slate-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${r.read ? 'text-slate-500' : 'text-slate-700 font-semibold'}`}>{r.message}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <p className="text-[11px] text-slate-400">
                            {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
                          </p>
                          {r.sentAt && (
                            <span className="text-[11px] text-emerald-500 flex items-center gap-1">
                              <Send className="w-3 h-3" />
                              Sent
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {!r.sentAt && (
                          <button onClick={() => sendReminder(r.id)} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-all flex items-center gap-1">
                            <Send className="w-3 h-3" />
                            Send
                          </button>
                        )}
                        {!r.read && (
                          <button onClick={() => markReminderRead(r.id)} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-all">
                            Read
                          </button>
                        )}
                        <button onClick={() => deleteReminder(r.id)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ PROPERTY MANAGERS TAB ============ */}
      {activeTab === 'property-managers' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Property Manager Registration</h3>
              <p className="text-sm text-slate-400">Register new property manager credentials</p>
            </div>
            <button onClick={() => setShowAddPropertyManager(true)} className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Register Property Manager
            </button>
          </div>

          {/* Property Managers List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Registered Property Managers</h3>
            </div>
            {systemUsers.filter(u => u.role === 'property_manager').length === 0 ? (
              <div className="p-12 text-center">
                <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <h4 className="font-bold text-slate-700 mb-1">No Property Managers</h4>
                <p className="text-sm text-slate-400">Register your first property manager to get started</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {systemUsers.filter(u => u.role === 'property_manager').map((pm) => (
                  <div key={pm.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{pm.name}</p>
                          <p className="text-sm text-slate-500">{pm.email}</p>
                          <p className="text-xs text-slate-400">{pm.property}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          pm.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {pm.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button onClick={() => setShowDeleteConfirm({ type: 'user', id: pm.id })} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ ADD USER MODAL ============ */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowAddUser(false); resetUserForm(); }}>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Register New User</h3>
                    <p className="text-xs text-slate-400">Create admin or security user account</p>
                  </div>
                </div>
                <button onClick={() => { setShowAddUser(false); resetUserForm(); }} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Name / Organization *</label>
                  <input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="e.g., Riverside Apartments" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Email *</label>
                  <input type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="admin@property.com" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Phone</label>
                  <input type="tel" value={newUserPhone} onChange={(e) => setNewUserPhone(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="+254 7XX XXX XXX" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Role *</label>
                  <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as UserRole)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 appearance-none">
                    <option value="admin">Admin</option>
                    {canAssignRole('security') && <option value="security">Security</option>}
                    {canAssignRole('superadmin') && <option value="superadmin">Super Admin</option>}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Company</label>
                  <input type="text" value={newUserCompany} onChange={(e) => setNewUserCompany(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="Company name" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Property Name</label>
                  <input type="text" value={newUserProperty} onChange={(e) => setNewUserProperty(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="Property or premises name" />
                </div>

                <div className="col-span-2 pt-2 border-t border-slate-100">
                  <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-500" />
                    Subscription (Optional)
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Package</label>
                  <select value={newUserPackage} onChange={(e) => setNewUserPackage(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 appearance-none">
                    <option value="">Select package...</option>
                    {packages.filter((p) => p.isActive).map((p) => (
                      <option key={p.id} value={p.id}>{p.name} - KES {p.price}/{p.billing}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">End Date</label>
                  <input 
                    type="date" 
                    value={newUserEndDate} 
                    onChange={(e) => setNewUserEndDate(e.target.value)} 
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" 
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => { setShowAddUser(false); resetUserForm(); }} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all">Cancel</button>
                <button onClick={handleAddUser} disabled={!newUserName || !newUserEmail} className="flex-2 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ ADD/EDIT PACKAGE MODAL ============ */}
      {showAddPackage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowAddPackage(false); resetPackageForm(); setEditingPackage(null); }}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{editingPackage ? 'Edit Package' : 'Create Package'}</h3>
                  <p className="text-xs text-slate-400">Define pricing and features</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Package Name *</label>
                <input type="text" value={pkgName} onChange={(e) => setPkgName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="e.g., Professional" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Billing Cycle *</label>
                  <select value={pkgBilling} onChange={(e) => setPkgBilling(e.target.value as PackageBilling)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 appearance-none">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Price (KES) *</label>
                  <input type="number" value={pkgPrice} onChange={(e) => setPkgPrice(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Features (one per line)</label>
                <textarea value={pkgFeatures} onChange={(e) => setPkgFeatures(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none" rows={4} placeholder={"Basic registration\nQR Code access\nEmail notifications"} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={pkgIsPopular} onChange={(e) => setPkgIsPopular(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-slate-700 font-medium">Mark as popular / recommended</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowAddPackage(false); resetPackageForm(); setEditingPackage(null); }} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm">Cancel</button>
                <button
                  onClick={() => {
                    if (editingPackage) {
                      updatePackage(editingPackage, {
                        name: pkgName, billing: pkgBilling, price: Number(pkgPrice),
                        coinCost: 0,
                        maxUsers: 10, maxVisitorsPerDay: 100,
                        features: pkgFeatures.split('\n').map((f) => f.trim()).filter(Boolean), isPopular: pkgIsPopular,
                      });
                      setEditingPackage(null); setShowAddPackage(false); resetPackageForm();
                    } else { handleAddPackage(); }
                  }}
                  disabled={!pkgName || !pkgPrice}
                  className="flex-2 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ EXTEND MODAL ============ */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowExtendModal(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl animate-scale-in p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <CalendarPlus className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Extend Subscription</h3>
                <p className="text-xs text-slate-400">Add more days to this subscription</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Days to Add</label>
                <input type="number" value={extendDays} onChange={(e) => setExtendDays(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="30" />
              </div>
              <div className="flex flex-wrap gap-2">
                {[7, 14, 30, 60, 90, 365].map((d) => (
                  <button key={d} onClick={() => setExtendDays(String(d))} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${extendDays === String(d) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                    {d === 365 ? '1 Year' : d === 90 ? '3 Months' : d === 60 ? '2 Months' : d === 30 ? '1 Month' : `${d} Days`}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowExtendModal(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm">Cancel</button>
                <button onClick={handleExtend} className="flex-2 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                  <CalendarPlus className="w-4 h-4" />
                  Extend by {extendDays} days
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ USER DETAIL MODAL ============ */}
      {showUserDetail && (() => {
        const user = systemUsers.find((u) => u.id === showUserDetail);
        if (!user) return null;
        const sub = getUserSubscription(user.id);
        const pkg = getUserPackage(user.id);
        const statusCfg = sub ? SUB_STATUS_CONFIG[sub.status] : null;
        const daysLeft = sub ? getDaysLeft(sub.endDate) : null;
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowUserDetail(null)}>
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scale-in max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-6 text-white rounded-t-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border border-white/30">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-indigo-200 text-sm">{user.property || user.company || user.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: user.email },
                  { icon: Phone, label: 'Phone', value: user.phone },
                  { icon: Building2, label: 'Company', value: user.company },
                  { icon: Building2, label: 'Property', value: user.property },
                  { icon: Shield, label: 'Role', value: user.role },
                  { icon: Calendar, label: 'Joined', value: format(new Date(user.createdAt), 'MMM d, yyyy') },
                  { icon: Users, label: 'Total Visitors', value: user.totalVisitors?.toLocaleString() || '0' },
                  { icon: Activity, label: 'Last Active', value: user.lastActive ? formatDistanceToNow(new Date(user.lastActive), { addSuffix: true }) : 'Never' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-700 capitalize">{item.value || 'â€”'}</p>
                      </div>
                    </div>
                  );
                })}
                {sub && pkg && (
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-indigo-500" />
                      Subscription Details
                    </p>
                    <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between"><span className="text-xs text-slate-400">Package</span><span className="text-sm font-bold text-slate-700">{pkg.name}</span></div>
                      <div className="flex justify-between"><span className="text-xs text-slate-400">Billing</span><span className="text-sm text-slate-700 capitalize">{pkg.billing}</span></div>
                      <div className="flex justify-between"><span className="text-xs text-slate-400">Amount</span><span className="text-sm font-bold text-slate-700">KES {pkg?.price?.toLocaleString() || 0}/{pkg?.billing || 'monthly'}</span></div>
                      <div className="flex justify-between"><span className="text-xs text-slate-400">Ends</span><span className="text-sm text-slate-700">{format(new Date(sub.endDate), 'MMM d, yyyy')}</span></div>
                      <div className="flex justify-between"><span className="text-xs text-slate-400">Days Left</span><span className={`text-sm font-bold ${daysLeft! <= 0 ? 'text-red-600' : daysLeft! <= 7 ? 'text-amber-600' : 'text-emerald-600'}`}>{daysLeft! <= 0 ? 'Expired' : `${daysLeft} days`}</span></div>
                      <div className="flex justify-between"><span className="text-xs text-slate-400">Status</span>
                        {statusCfg && <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${statusCfg.bg} ${statusCfg.color}`}><span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />{statusCfg.label}</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-100 flex gap-2">
                <button onClick={() => setShowUserDetail(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm">Close</button>
                {sub && (
                  <button onClick={() => { setShowUserDetail(null); setShowExtendModal(sub.id); }} className="flex-1 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5">
                    <CalendarPlus className="w-4 h-4" />
                    Extend
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ============ PROPERTY MANAGER REGISTRATION MODAL ============ */}
      {showAddPropertyManager && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowAddPropertyManager(false); }}>
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Register Property Manager</h3>
                    <p className="text-xs text-slate-400">Create new property manager credentials</p>
                  </div>
                </div>
                <button onClick={() => { setShowAddPropertyManager(false); setPmName(''); setPmEmail(''); setPmPhone(''); setPmProperty(''); setPmCompany(''); setPmPassword(''); setPmConfirmPassword(''); }} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Full Name *</label>
                  <input type="text" value={pmName} onChange={(e) => setPmName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="e.g., John Smith" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Email *</label>
                  <input type="email" value={pmEmail} onChange={(e) => setPmEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="manager@property.com" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Phone</label>
                  <input type="tel" value={pmPhone} onChange={(e) => setPmPhone(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="+254 7XX XXX XXX" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Company</label>
                  <input type="text" value={pmCompany} onChange={(e) => setPmCompany(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="Company name" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Property Name *</label>
                  <input type="text" value={pmProperty} onChange={(e) => setPmProperty(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="Property or premises name" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Password *</label>
                  <input type="password" value={pmPassword} onChange={(e) => setPmPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="Enter password" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600 mb-1.5 block">Confirm Password *</label>
                  <input type="password" value={pmConfirmPassword} onChange={(e) => setPmConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400" placeholder="Confirm password" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowAddPropertyManager(false); setPmName(''); setPmEmail(''); setPmPhone(''); setPmProperty(''); setPmCompany(''); setPmPassword(''); setPmConfirmPassword(''); }} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm">Cancel</button>
                <button
                  onClick={handleAddPropertyManager}
                  disabled={!pmName || !pmEmail || !pmPassword || !pmProperty}
                  className="flex-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Register Property Manager
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ DELETE CONFIRM ============ */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl animate-scale-in p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Delete {showDeleteConfirm.type === 'user' ? 'User' : 'Package'}?
              </h3>
              <p className="text-sm text-slate-400 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-semibold text-sm">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAdmin;
