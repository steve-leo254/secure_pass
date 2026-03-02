import React from 'react';
import { CreditCard, TrendingUp, Building2, Package } from 'lucide-react';
import { useSystemAdmin } from '../context/SystemAdminContext';

interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCard> = ({ title, value, change, icon, color }) => (
  <div className="bg-white rounded-xl border border-slate-100 p-6 hover:shadow-lg transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-2 ${change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
            {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const OverviewTab: React.FC = () => {
  const { getSystemStats, systemUsers, subscriptions, packages } = useSystemAdmin();
  const stats = getSystemStats();

  const statCards: StatCard[] = [
    {
      title: 'Total Organizations',
      value: stats.totalUsers,
      change: '+12% from last month',
      icon: <Building2 className="w-6 h-6 text-white" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      change: '+8% from last month',
      icon: <CreditCard className="w-6 h-6 text-white" />,
      color: 'bg-emerald-500'
    },
    {
      title: 'Monthly Revenue',
      value: `KES ${stats.monthlyRevenue.toLocaleString()}`,
      change: '+15% from last month',
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Packages',
      value: stats.totalPackages,
      icon: <Package className="w-6 h-6 text-white" />,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>
      
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
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Subscriptions</h3>
          <div className="space-y-3">
            {subscriptions.slice(0, 5).map((sub) => {
              const user = systemUsers.find(u => u.id === sub.userId);
              const pkg = packages.find(p => p.id === sub.packageId);
              return (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{user?.name || 'Unknown'}</p>
                    <p className="text-sm text-slate-600">{pkg?.name || 'Unknown Package'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    sub.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {sub.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
