import React from 'react';
import { CalendarPlus, Ban, PlayCircle } from 'lucide-react';
import { useSystemAdmin } from '../context/SystemAdminContext';
import { SUB_STATUS_CONFIG, BILLING_COLORS } from '../types';

const SubscriptionsTab: React.FC = () => {
  const { 
    subscriptions, 
    systemUsers, 
    packages, 
    getSystemStats,
    cancelSubscription,
    updateSubscription,
    extendSubscription
  } = useSystemAdmin();

  // Helper function to calculate days left
  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = getSystemStats();

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
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

      {/* Subscriptions Table */}
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
                    <td className="px-5 py-3 text-sm font-semibold text-slate-700">{user?.name || '—'}</td>
                    <td className="px-5 py-3">
                      {pkg && (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${BILLING_COLORS[pkg.billing]} text-white`}>
                          {pkg.name}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">{new Date(sub.startDate).toLocaleDateString()}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{new Date(sub.endDate).toLocaleDateString()}</td>
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
                        <button 
                          onClick={() => extendSubscription(sub.id, 30)} 
                          className="w-7 h-7 rounded-lg bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center text-indigo-600 transition-colors" 
                          title="Extend"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" />
                        </button>
                        {sub.status !== 'suspended' && (
                          <button 
                            onClick={() => cancelSubscription(sub.id)} 
                            className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors" 
                            title="Suspend"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {sub.status === 'suspended' && (
                          <button 
                            onClick={() => updateSubscription(sub.id, { status: 'active' })} 
                            className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-600 transition-colors" 
                            title="Activate"
                          >
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
  );
};

export default SubscriptionsTab;
