import React, { useState } from 'react';
import { useSystemAdmin } from '../context/SystemAdminContext';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, TrendingUp, Plus, X, Crown } from 'lucide-react';

const UsageCounter: React.FC = () => {
  const { user } = useAuth();
  const { 
    systemUsers, 
    coinPackages, 
    purchaseCoins,
    getUserCoinTransactions 
  } = useSystemAdmin();

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedCoinPackage, setSelectedCoinPackage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get current user's data
  const currentUser = systemUsers.find(u => u.id === user?.id);
  const userTransactions = getUserCoinTransactions(user?.id || '');
  
  // Conversion rate: 1 coin = 10 records
  const COINS_TO_RECORDS_RATIO = 10;
  
  // Calculate usage based on coins
  const recordsUsed = (currentUser?.totalCoinsRedeemed || 0) * COINS_TO_RECORDS_RATIO;
  const totalRecordsAllowed = (currentUser?.coinBalance || 0) * COINS_TO_RECORDS_RATIO;
  const remainingRecords = (currentUser?.coinBalance || 0) * COINS_TO_RECORDS_RATIO;
  const usagePercentage = (recordsUsed + remainingRecords) > 0 ? (recordsUsed / (recordsUsed + remainingRecords)) * 100 : 0;
  
  // Status determination
  const getStatusColor = () => {
    if (!currentUser || currentUser.status === 'inactive') return 'bg-red-500';
    if (remainingRecords <= 0) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStatusText = () => {
    if (!currentUser || currentUser.status === 'inactive') return 'Inactive';
    if (remainingRecords <= 0) return 'Low Balance';
    return 'Active';
  };

  const handlePurchase = async () => {
    if (!user || !selectedCoinPackage) return;
    
    setIsProcessing(true);
    try {
      purchaseCoins(user.id, selectedCoinPackage);
      setShowPurchaseModal(false);
      setSelectedCoinPackage('');
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getUsageColor = () => {
    if (usagePercentage >= 90) return 'bg-red-500';
    if (usagePercentage >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${getStatusColor()} rounded-xl flex items-center justify-center`}>
              {remainingRecords <= 0 ? (
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
            onClick={() => setShowPurchaseModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Purchase
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

        {/* Coin Balance Info */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">Balance</span>
            </div>
            <span className="font-semibold text-slate-800">
              {currentUser?.coinBalance || 0} coins
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
            <span>Based on {recordsUsed} registered records</span>
            <span>{currentUser?.totalCoinsRedeemed || 0} coins × {COINS_TO_RECORDS_RATIO} = {recordsUsed} records</span>
          </div>
        </div>

        {/* Warning */}
        {remainingRecords <= 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Low Balance
              </span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              Purchase more coins to continue using the system
            </p>
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Purchase Coins</h3>
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Select Coin Package
                </label>
                <select
                  value={selectedCoinPackage}
                  onChange={(e) => setSelectedCoinPackage(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Choose a package...</option>
                  {coinPackages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - KES {pkg.price.toLocaleString()} ({pkg.coins} coins + {pkg.bonusCoins || 0} bonus)
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Package:</span>
                  <span className="font-semibold text-slate-800">
                    {coinPackages.find(p => p.id === selectedCoinPackage)?.name || 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Price:</span>
                  <span className="font-semibold text-slate-800">
                    KES {coinPackages.find(p => p.id === selectedCoinPackage)?.price?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Total Coins:</span>
                  <span className="font-semibold text-slate-800">
                    {(() => {
                      const pkg = coinPackages.find(p => p.id === selectedCoinPackage);
                      return pkg ? (pkg.coins + (pkg.bonusCoins || 0)) : 0;
                    })()} coins
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Records Equivalent:</span>
                  <span className="font-semibold text-slate-800">
                    {(() => {
                      const pkg = coinPackages.find(p => p.id === selectedCoinPackage);
                      const totalCoins = pkg ? (pkg.coins + (pkg.bonusCoins || 0)) : 0;
                      return totalCoins * COINS_TO_RECORDS_RATIO;
                    })()} records
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200">
                  <span>Current balance:</span>
                  <span>{currentUser?.coinBalance || 0} coins ({(currentUser?.coinBalance || 0) * COINS_TO_RECORDS_RATIO} records)</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                disabled={isProcessing || !selectedCoinPackage}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all disabled:opacity-40"
              >
                {isProcessing ? 'Processing...' : 'Complete Purchase'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsageCounter;
