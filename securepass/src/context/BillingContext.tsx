import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import type { BillingAccount, Payment, BillingStatus } from '../types';

// Billing constants
const RECORDS_PER_UNIT = 50;
const COST_PER_UNIT = 50; // KSH
const MINIMUM_PURCHASE = 200; // KSH
const TRIAL_RECORDS_LIMIT = 50; // Free trial records for system

interface BillingContextType {
  billingAccount: BillingAccount | null;
  isLoading: boolean;
  // Billing calculations
  calculateCost: (records: number) => number;
  calculateRecordsFromAmount: (amount: number) => number;
  // Usage tracking
  getRemainingRecords: () => number;
  getUsagePercentage: () => number;
  isWithinLimit: () => boolean;
  // Payment operations
  purchaseRecords: (amount: number, paymentMethod: string) => Promise<boolean>;
  // Account management
  updateSystemUsage: (totalRecords: number) => void;
  getBillingStatus: () => BillingStatus;
  // Trial management
  startTrial: () => void;
  isTrialActive: () => boolean;
  getTrialRemaining: () => number;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const useBilling = () => {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [billingAccount, setBillingAccount] = useState<BillingAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load billing account from localStorage
  useEffect(() => {
    const loadBillingAccount = () => {
      try {
        const stored = localStorage.getItem('billingAccount');
        if (stored) {
          const account = JSON.parse(stored);
          setBillingAccount(account);
        } else {
          // Initialize with trial account
          initializeTrialAccount();
        }
      } catch (error) {
        console.error('Error loading billing account:', error);
        initializeTrialAccount();
      } finally {
        setIsLoading(false);
      }
    };

    loadBillingAccount();
  }, []);

  const saveBillingAccount = useCallback((account: BillingAccount) => {
    localStorage.setItem('billingAccount', JSON.stringify(account));
    setBillingAccount(account);
  }, []);

  const initializeTrialAccount = () => {
    const trialAccount: BillingAccount = {
      id: 'billing-' + Date.now(),
      totalRecordsAllowed: TRIAL_RECORDS_LIMIT,
      recordsUsed: 0,
      balance: 0,
      status: 'trial',
      trialRecordsUsed: 0,
      createdAt: new Date().toISOString(),
      payments: []
    };
    saveBillingAccount(trialAccount);
  };

  const calculateCost = useCallback((records: number): number => {
    const units = Math.ceil(records / RECORDS_PER_UNIT);
    return units * COST_PER_UNIT;
  }, []);

  const calculateRecordsFromAmount = useCallback((amount: number): number => {
    if (amount < MINIMUM_PURCHASE) return 0;
    const units = Math.floor(amount / COST_PER_UNIT);
    return units * RECORDS_PER_UNIT;
  }, []);

  const getRemainingRecords = useCallback((): number => {
    if (!billingAccount) return 0;
    return Math.max(0, billingAccount.totalRecordsAllowed - billingAccount.recordsUsed);
  }, [billingAccount]);

  const getUsagePercentage = useCallback((): number => {
    if (!billingAccount || billingAccount.totalRecordsAllowed === 0) return 0;
    return (billingAccount.recordsUsed / billingAccount.totalRecordsAllowed) * 100;
  }, [billingAccount]);

  const isWithinLimit = useCallback((): boolean => {
    return getRemainingRecords() > 0;
  }, [getRemainingRecords]);

  const purchaseRecords = useCallback(async (amount: number, paymentMethod: string): Promise<boolean> => {
    if (amount < MINIMUM_PURCHASE) {
      throw new Error(`Minimum purchase amount is ${MINIMUM_PURCHASE} KSH`);
    }

    if (!billingAccount) return false;

    try {
      const recordsAdded = calculateRecordsFromAmount(amount);
      if (recordsAdded === 0) {
        throw new Error('Invalid amount');
      }

      const newPayment: Payment = {
        id: 'payment-' + Date.now(),
        amount,
        recordsAdded,
        paymentMethod,
        createdAt: new Date().toISOString(),
        status: 'completed'
      };

      const updatedAccount: BillingAccount = {
        ...billingAccount,
        totalRecordsAllowed: billingAccount.totalRecordsAllowed + recordsAdded,
        balance: billingAccount.balance + amount,
        status: 'active',
        lastPaymentAt: new Date().toISOString(),
        payments: [...billingAccount.payments, newPayment]
      };

      saveBillingAccount(updatedAccount);
      return true;
    } catch (error) {
      console.error('Payment failed:', error);
      return false;
    }
  }, [billingAccount, calculateRecordsFromAmount, saveBillingAccount]);

  const updateSystemUsage = useCallback((totalRecords: number) => {
    if (!billingAccount) return;

    const updatedAccount: BillingAccount = {
      ...billingAccount,
      recordsUsed: totalRecords,
      trialRecordsUsed: billingAccount.status === 'trial' ? Math.min(totalRecords, TRIAL_RECORDS_LIMIT) : billingAccount.trialRecordsUsed
    };

    // Check if trial limit is reached
    if (billingAccount.status === 'trial' && totalRecords >= TRIAL_RECORDS_LIMIT) {
      updatedAccount.status = 'suspended';
    }

    saveBillingAccount(updatedAccount);
  }, [billingAccount, saveBillingAccount]);

  const getBillingStatus = useCallback((): BillingStatus => {
    return billingAccount?.status || 'trial';
  }, [billingAccount]);

  const isTrialActive = useCallback((): boolean => {
    return billingAccount?.status === 'trial' && billingAccount.trialRecordsUsed < TRIAL_RECORDS_LIMIT;
  }, [billingAccount]);

  const getTrialRemaining = useCallback((): number => {
    if (!isTrialActive()) return 0;
    return Math.max(0, TRIAL_RECORDS_LIMIT - (billingAccount?.trialRecordsUsed || 0));
  }, [billingAccount, isTrialActive]);

  const startTrial = useCallback(() => {
    if (billingAccount?.status !== 'trial') return;
    // Trial is already initialized on first load
  }, [billingAccount]);

  const value: BillingContextType = {
    billingAccount,
    isLoading,
    calculateCost,
    calculateRecordsFromAmount,
    getRemainingRecords,
    getUsagePercentage,
    isWithinLimit,
    purchaseRecords,
    updateSystemUsage,
    getBillingStatus,
    startTrial,
    isTrialActive,
    getTrialRemaining
  };

  return (
    <BillingContext.Provider value={value}>
      {children}
    </BillingContext.Provider>
  );
};
