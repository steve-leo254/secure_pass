import React, { useState } from 'react';
import { useBilling } from '../context/BillingContext';
import { CreditCard, Zap, AlertTriangle, TrendingUp, Plus, X } from 'lucide-react';

const UsageCounter: React.FC = () => {
  const { 
    billingAccount, 
    isLoading, 
    getRemainingRecords, 
    getUsagePercentage, 
    isWithinLimit,
    calculateCost,
    calculateRecordsFromAmount,
    purchaseRecords,
    getBillingStatus,
    isTrialActive,
    getTrialRemaining
  } = useBilling();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(200);
  const [paymentMethod, setPaymentMethod] = useState('M-Pesa');
  const [isProcessing, setIsProcessing] = useState(false);

  if (isLoading || !billingAccount) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-slate-200 rounded"></div>
      </div>
    );
  }

  const remainingRecords = getRemainingRecords();
  const usagePercentage = getUsagePercentage();
  const billingStatus = getBillingStatus();
  const trialRemaining = getTrialRemaining();

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const success = await purchaseRecords(paymentAmount, paymentMethod);
      if (success) {
        setShowPaymentModal(false);
        setPaymentAmount(200);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = () => {
    if (billingStatus === 'trial') return 'bg-blue-500';
    if (billingStatus === 'suspended') return 'bg-red-500';
    return 'bg-emerald-500';
  };

  const getStatusText = () => {
    if (billingStatus === 'trial') return 'Trial Mode';
    if (billingStatus === 'suspended') return 'Suspended';
    return 'Active';
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
              {billingStatus === 'trial' ? (
                <Zap className="w-5 h-5 text-white" />
              ) : billingStatus === 'suspended' ? (
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
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Purchase
          </button>
        </div>

        {/* Usage Display */}
        {isTrialActive() ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Trial Records Used</span>
              <span className="font-semibold text-slate-800">
                {billingAccount.trialRecordsUsed} / {billingAccount.totalRecordsAllowed}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">
              {trialRemaining} trial records remaining
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Records Used</span>
              <span className="font-semibold text-slate-800">
                {billingAccount.recordsUsed} / {billingAccount.totalRecordsAllowed}
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
        )}

        {/* Billing Info */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">Balance</span>
            </div>
            <span className="font-semibold text-slate-800">
              {billingAccount.balance} KSH
            </span>
          </div>
        </div>

        {/* Warning */}
        {!isWithinLimit() && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {billingStatus === 'trial' ? 'Trial limit reached' : 'Record limit reached'}
              </span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              Purchase more records to continue using the system
            </p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Purchase Records</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Amount (KSH)
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Math.max(200, parseInt(e.target.value) || 0))}
                  min={200}
                  step={50}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Amount:</span>
                  <span className="font-semibold text-slate-800">{paymentAmount} KSH</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Records Added:</span>
                  <span className="font-semibold text-slate-800">
                    {calculateRecordsFromAmount(paymentAmount)} records
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                disabled={isProcessing || paymentAmount < 200}
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
