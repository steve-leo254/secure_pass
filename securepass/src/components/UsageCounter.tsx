import React, { useState } from 'react';
import { useSystemAdmin } from '../context/SystemAdminContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, TrendingUp, Calendar, RefreshCw, X } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { BILLING_LABELS } from '../types';

const UsageCounter: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    systemUsers, 
    getUserSubscription,
    getUserPackage,
  } = useSystemAdmin();

  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendDays, setExtendDays] = useState(30);

  // Get current user's subscription and package
  const currentUser = systemUsers.find(u => u.id === user?.id);
  const userSubscription = getUserSubscription(user?.id || '');
  const userPackage = getUserPackage(user?.id || '');
  
  // Calculate subscription usage
  const totalRecordsAllowed = userPackage?.maxUsers || 0;
  const recordsUsed = currentUser?.totalVisitors || 0;
  const remainingRecords = Math.max(0, totalRecordsAllowed - recordsUsed);
  const usagePercentage = totalRecordsAllowed > 0 ? (recordsUsed / totalRecordsAllowed) * 100 : 0;
  
  // Calculate days remaining
  const daysRemaining = userSubscription ? differenceInDays(new Date(userSubscription.endDate), new Date()) : 0;
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;
  
  // Status determination
  const getStatusColor = () => {
    if (!currentUser || currentUser.status === 'inactive') return 'bg-red-500';
    if (isExpired) return 'bg-red-500';
    if (isExpiringSoon) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStatusText = () => {
    if (!currentUser || currentUser.status === 'inactive') return 'Inactive';
    if (isExpired) return 'Expired';
    if (isExpiringSoon) return 'Expiring Soon';
    return 'Active';
  };

  const handleExtendSubscription = () => {
    console.log('handleExtendSubscription called');
    console.log('userSubscription:', userSubscription);
    console.log('user:', user);
    console.log('user role:', user?.role);
    console.log('systemUsers:', systemUsers);
    
    // For testing: always navigate even if no subscription
    const checkoutData = {
      packageId: userSubscription?.packageId || 'default-package',
      extensionDays: extendDays,
      billingCycle: 'monthly',
      paymentMethod: 'mpesa',
      amount: 1000,
    };
    
    console.log('Navigating to checkout with data:', checkoutData);
    console.log('Current URL before navigation:', window.location.href);
    
    // Try direct navigation
    navigate('/checkout', { state: { checkoutData } });
    
    // Also try window.location as fallback
    setTimeout(() => {
      console.log('Fallback navigation attempt');
      window.location.href = '/checkout';
    }, 1000);
  };

  const getUsageColor = () => {
    if (usagePercentage >= 90) return 'bg-red-500';
    if (usagePercentage >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getDaysColor = () => {
    if (daysRemaining <= 0) return 'text-red-600';
    if (daysRemaining <= 7) return 'text-amber-600';
    return 'text-emerald-600';
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${getStatusColor()} rounded-xl flex items-center justify-center`}>
              {isExpired || isExpiringSoon ? (
                <AlertTriangle className="w-5 h-5 text-white" />
              ) : (
                <TrendingUp className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Usage Tracker</h3>
              <p className="text-sm text-slate-500">{getStatusText()}</p>
            </div>
          </div>
          <button
            onClick={() => setShowExtendModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Extend
          </button>
        </div>

        {/* Usage Display */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Records Used</span>
            <span className="font-semibold text-slate-800">
              {recordsUsed} / {recordsUsed + remainingRecords}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div 
              className={`${getUsageColor()} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>{remainingRecords} records remaining</span>
            <span>{usagePercentage.toFixed(1)}% used</span>
          </div>
        </div>

        {/* Subscription Info */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">Subscription</span>
            </div>
            <span className="font-semibold text-slate-800">
              {userPackage?.name || 'No Package'}
            </span>
          </div>
          
          {userSubscription && (
            <>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600">Billing Cycle</span>
                <span className="font-semibold text-slate-800">
                  {BILLING_LABELS[userPackage?.billing || 'monthly']}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600">Days Remaining</span>
                <span className={`font-semibold ${getDaysColor()}`}>
                  {daysRemaining} days
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Ends on {userSubscription ? format(new Date(userSubscription.endDate), 'MMM d, yyyy') : 'N/A'}</span>
                <span>Started {userSubscription ? format(new Date(userSubscription.startDate), 'MMM d, yyyy') : 'N/A'}</span>
              </div>
            </>
          )}
        </div>

        {/* Warning */}
        {(isExpired || isExpiringSoon) && (
          <div className={`${isExpired ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'} border rounded-xl p-3`}>
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isExpired ? 'Subscription Expired' : 'Expiring Soon'}
              </span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              {isExpired 
                ? 'Your subscription has expired. Please extend it to continue using the system.'
                : `Your subscription expires in ${daysRemaining} days. Extend now to avoid interruption.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Test Button - Remove this later */}
      <div className="mb-4">
        <button
          onClick={() => {
            console.log('Test navigation to checkout');
            navigate('/checkout');
          }}
          className="w-full py-2 bg-red-500 text-white rounded-lg"
        >
          Test Navigate to Checkout
        </button>
      </div>

      {/* Extension Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-800">Extend Subscription</h3>
                <button
                  onClick={() => setShowExtendModal(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <p className="text-sm text-slate-600">Choose extension period and proceed to payment</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Extension Period
                </label>
                <select
                  value={extendDays}
                  onChange={(e) => setExtendDays(Number(e.target.value))}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={365}>1 year</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Current Package:</span>
                  <span className="font-semibold text-slate-800">
                    {userPackage?.name || 'No Package'}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Billing Cycle:</span>
                  <span className="font-semibold text-slate-800">
                    {BILLING_LABELS[userPackage?.billing || 'monthly']}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Extension Period:</span>
                  <span className="font-semibold text-slate-800">
                    {extendDays} days
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">New End Date:</span>
                  <span className="font-semibold text-slate-800">
                    {userSubscription ? format(new Date(new Date(userSubscription.endDate).getTime() + extendDays * 24 * 60 * 60 * 1000), 'MMM d, yyyy') : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200">
                  <span>Current end date:</span>
                  <span>{userSubscription ? format(new Date(userSubscription.endDate), 'MMM d, yyyy') : 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setShowExtendModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Navigate to checkout page with subscription data');
                  handleExtendSubscription();
                }}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsageCounter;
