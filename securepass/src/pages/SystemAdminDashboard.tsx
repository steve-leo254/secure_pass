import React, { useState, useEffect } from 'react';
import { useSystemAdmin } from '../context/SystemAdminContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BILLING_LABELS,
  BILLING_COLORS,
  SUB_STATUS_CONFIG,
} from '../types';
import type {
  PackageBilling,
  SystemUserRole,
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
  Settings,
} from 'lucide-react';

type Tab = 'overview' | 'users' | 'subscriptions' | 'packages' | 'reminders';

const SystemAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  // Add User Form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<SystemUserRole>('admin');
  const [newUserCompany, setNewUserCompany] = useState('');
  const [newUserProperty, setNewUserProperty] = useState('');
  const [newUserPackage, setNewUserPackage] = useState('');
  const [newUserEndDate, setNewUserEndDate] = useState('');

  // Add Package Form
  const [pkgName, setPkgName] = useState('');
  const [pkgBilling, setPkgBilling] = useState<PackageBilling>('monthly');
  const [pkgPrice, setPkgPrice] = useState('');
  const [pkgMaxUsers, setPkgMaxUsers] = useState('');
  const [pkgMaxVisitors, setPkgMaxVisitors] = useState('');
  const [pkgFeatures, setPkgFeatures] = useState('');
  const [pkgIsPopular, setPkgIsPopular] = useState(false);
  const [pkgCoinCost, setPkgCoinCost] = useState('');

  // Extend
  const [extendDays, setExtendDays] = useState('30');

  const stats = getSystemStats();
  const expiringList = getExpiringSubscriptions(7);
  const unreadReminders = getUnreadReminders();

  // Check if current user can assign specific roles
  const canAssignRole = (role: SystemUserRole): boolean => {
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
    setPkgMaxUsers('');
    setPkgMaxVisitors('');
    setPkgFeatures('');
    setPkgIsPopular(false);
    setPkgCoinCost('');
  };

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter functions
  const filteredUsers = systemUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubscriptions = subscriptions.filter((s) => {
    const user = systemUsers.find((u) => u.id === s.userId);
    const pkg = packages.find((p) => p.id === s.packageId);
    return (
      user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const filteredPackages = packages.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReminders = reminders.filter((r) => {
    const user = systemUsers.find((u) => u.id === r.userId);
    return (
      user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading System Admin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading data</p>
          <button
            onClick={() => loadData()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">System Admin</h1>
                <p className="text-sm text-slate-500">Platform Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">System Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {(['overview', 'users', 'subscriptions', 'packages', 'reminders'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-600">+12%</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{stats.totalUsers}</h3>
                <p className="text-sm text-slate-500">Total Organizations</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-emerald-600">+8%</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{stats.activeSubscriptions}</h3>
                <p className="text-sm text-slate-500">Active Subscriptions</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-purple-600">+15%</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">KES {stats.monthlyRevenue.toLocaleString()}</h3>
                <p className="text-sm text-slate-500">Monthly Revenue</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{stats.totalPackages}</h3>
                <p className="text-sm text-slate-500">Total Packages</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Organizations</h3>
                <div className="space-y-3">
                  {systemUsers.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-600">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Expiring Soon</h3>
                <div className="space-y-3">
                  {expiringList.slice(0, 5).map((sub) => {
                    const user = systemUsers.find((u) => u.id === sub.userId);
                    const pkg = packages.find((p) => p.id === sub.packageId);
                    return (
                      <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">{user?.name || 'Unknown'}</p>
                          <p className="text-sm text-slate-600">{pkg?.name || 'Unknown Package'}</p>
                        </div>
                        <span className="text-sm font-medium text-amber-600">
                          {getDaysLeft(sub.endDate)} days
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">System Users</h2>
              <button
                onClick={() => setShowAddUser(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add User
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">User</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Contact</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Role</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900">{user.name}</div>
                              <div className="text-sm text-slate-500">{user.company || 'No company'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-900">{user.email}</div>
                          <div className="text-sm text-slate-500">{user.phone || 'No phone'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            user.role === 'security' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {user.role === 'admin' && <Crown className="w-3 h-3" />}
                            {user.role === 'security' && <Shield className="w-3 h-3" />}
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'
                            }`} />
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setShowUserDetail(user.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm({ type: 'user', id: user.id })}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-700">{stats.activeSubscriptions}</p>
                <p className="text-sm text-emerald-600">Active</p>
              </div>
              <div className="bg-amber-50 rounded-xl border border-amber-100 p-4 text-center">
                <p className="text-2xl font-bold text-amber-700">{stats.expiringSubscriptions}</p>
                <p className="text-sm text-amber-600">Expiring</p>
              </div>
              <div className="bg-red-50 rounded-xl border border-red-100 p-4 text-center">
                <p className="text-2xl font-bold text-red-700">{stats.expiredSubscriptions}</p>
                <p className="text-sm text-red-600">Expired</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">User</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Package</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Period</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscriptions.map((sub) => {
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
                        <tr key={sub.id} className="border-b border-slate-50 hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900">{user?.name || '—'}</div>
                            <div className="text-sm text-slate-500">{user?.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            {pkg && (
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${BILLING_COLORS[pkg.billing]} text-white`}>
                                {pkg.name}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900">
                              {format(new Date(sub.startDate), 'MMM d, yyyy')} - {format(new Date(sub.endDate), 'MMM d, yyyy')}
                            </div>
                            <div className={`text-sm font-medium ${daysLeft <= 0 ? 'text-red-600' : daysLeft <= 7 ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {daysLeft <= 0 ? 'Expired' : `${daysLeft} days left`}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${statusCfg.bg} ${statusCfg.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                              {statusCfg.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setShowExtendModal(sub.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Extend"
                              >
                                <CalendarPlus className="w-4 h-4" />
                              </button>
                              {sub.status !== 'suspended' && (
                                <button
                                  onClick={() => cancelSubscription(sub.id)}
                                  className="text-red-500 hover:text-red-700"
                                  title="Suspend"
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                              )}
                              {sub.status === 'suspended' && (
                                <button
                                  onClick={() => updateSubscription(sub.id, { status: 'active' })}
                                  className="text-emerald-600 hover:text-emerald-700"
                                  title="Activate"
                                >
                                  <PlayCircle className="w-4 h-4" />
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

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">Subscription Packages</h2>
              <button
                onClick={() => setShowAddPackage(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Package
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className={`bg-white rounded-xl border ${pkg.isPopular ? 'border-indigo-200 ring-2 ring-indigo-100' : 'border-slate-100'} overflow-hidden`}>
                  {pkg.isPopular && (
                    <div className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 text-center">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{pkg.name}</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-bold text-slate-900">KES {pkg.price.toLocaleString()}</span>
                      <span className="text-slate-500 ml-2">/{pkg.billing}</span>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Max Users</span>
                        <span className="font-medium text-slate-900">{pkg.maxUsers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Daily Visitors</span>
                        <span className="font-medium text-slate-900">{pkg.maxVisitorsPerDay}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Coin Cost</span>
                        <span className="font-medium text-slate-900">{pkg.coinCost} coins</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPackage(pkg.id)}
                        className="flex-1 px-3 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm({ type: 'package', id: pkg.id })}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reminders Tab */}
        {activeTab === 'reminders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900">Subscription Reminders</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={generateAutoReminders}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Generate Auto Reminders
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">User</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Message</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Type</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
                      <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReminders.map((reminder) => {
                      const user = systemUsers.find((u) => u.id === reminder.userId);
                      return (
                        <tr key={reminder.id} className="border-b border-slate-50 hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900">{user?.name || 'Unknown'}</div>
                            <div className="text-sm text-slate-500">{user?.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900 max-w-xs truncate">{reminder.message}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                              reminder.type === 'expiring_soon' ? 'bg-amber-100 text-amber-700' :
                              reminder.type === 'expired' ? 'bg-red-100 text-red-700' :
                              reminder.type === 'payment_due' ? 'bg-blue-100 text-blue-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {reminder.type.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                reminder.read ? 'bg-slate-100 text-slate-700' : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${reminder.read ? 'bg-slate-500' : 'bg-emerald-500'}`} />
                                {reminder.read ? 'Read' : 'Unread'}
                              </span>
                              {reminder.sentAt && (
                                <span className="text-xs text-slate-500">
                                  {formatDistanceToNow(new Date(reminder.sentAt), { addSuffix: true })}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {!reminder.read && (
                                <button
                                  onClick={() => markReminderRead(reminder.id)}
                                  className="text-emerald-600 hover:text-emerald-700"
                                  title="Mark as read"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => sendReminder(reminder.id)}
                                className="text-blue-600 hover:text-blue-700"
                                title="Send reminder"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteReminder(reminder.id)}
                                className="text-red-500 hover:text-red-700"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Add System User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as SystemUserRole)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="admin">Admin</option>
                  <option value="security">Security</option>
                  {canAssignRole('superadmin') && <option value="superadmin">Super Admin</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  value={newUserCompany}
                  onChange={(e) => setNewUserCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddUser(false);
                  resetUserForm();
                }}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  addSystemUser({
                    name: newUserName,
                    email: newUserEmail,
                    phone: newUserPhone,
                    role: newUserRole,
                    company: newUserCompany,
                    property: newUserProperty,
                    status: 'active',
                    coinBalance: 0,
                    totalCoinsRedeemed: 0,
                  });
                  setShowAddUser(false);
                  resetUserForm();
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Package Modal */}
      {showAddPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Create Package</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Package Name</label>
                <input
                  type="text"
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Billing</label>
                <select
                  value={pkgBilling}
                  onChange={(e) => setPkgBilling(e.target.value as PackageBilling)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="lifetime">Lifetime</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (KES)</label>
                <input
                  type="number"
                  value={pkgPrice}
                  onChange={(e) => setPkgPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Users</label>
                <input
                  type="number"
                  value={pkgMaxUsers}
                  onChange={(e) => setPkgMaxUsers(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Max Visitors/Day</label>
                <input
                  type="number"
                  value={pkgMaxVisitors}
                  onChange={(e) => setPkgMaxVisitors(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Features (comma-separated)</label>
                <textarea
                  value={pkgFeatures}
                  onChange={(e) => setPkgFeatures(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Coin Cost</label>
                <input
                  type="number"
                  value={pkgCoinCost}
                  onChange={(e) => setPkgCoinCost(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="popular"
                  checked={pkgIsPopular}
                  onChange={(e) => setPkgIsPopular(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="popular" className="text-sm text-slate-700">Mark as Popular</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddPackage(false);
                  resetPackageForm();
                }}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  addPackage({
                    name: pkgName,
                    billing: pkgBilling,
                    price: parseFloat(pkgPrice),
                    maxUsers: parseInt(pkgMaxUsers),
                    maxVisitorsPerDay: parseInt(pkgMaxVisitors),
                    features: pkgFeatures.split(',').map(f => f.trim()).filter(f => f),
                    isPopular: pkgIsPopular,
                    coinCost: parseInt(pkgCoinCost),
                    isActive: true,
                  });
                  setShowAddPackage(false);
                  resetPackageForm();
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extend Subscription Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Extend Subscription</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Days to Extend</label>
                <input
                  type="number"
                  value={extendDays}
                  onChange={(e) => setExtendDays(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowExtendModal(null)}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  extendSubscription(showExtendModal, parseInt(extendDays));
                  setShowExtendModal(null);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Extend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Confirm Delete</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this {showDeleteConfirm.type}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showDeleteConfirm.type === 'user') {
                    deleteSystemUser(showDeleteConfirm.id);
                  } else {
                    deletePackage(showDeleteConfirm.id);
                  }
                  setShowDeleteConfirm(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAdminDashboard;
