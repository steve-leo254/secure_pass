import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';

export type PaymentMethod = 'mpesa' | 'mpesa_express' | 'card' | 'bank_transfer';

export interface PaymentDetails {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  reference?: string;
  phoneNumber?: string;
  cardLast4?: string;
  bankName?: string;
  accountNumber?: string;
  createdAt: Date;
  processedAt?: Date;
  failureReason?: string;
  metadata?: Record<string, any>;
}

interface PaymentStatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  textColor: string;
}

export const PAYMENT_STATUS_CONFIG: Record<string, PaymentStatusConfig> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: <Clock className="w-4 h-4" />,
    textColor: 'text-amber-700'
  },
  processing: {
    label: 'Processing',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: <TrendingUp className="w-4 h-4" />,
    textColor: 'text-blue-700'
  },
  completed: {
    label: 'Completed',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    icon: <CheckCircle className="w-4 h-4" />,
    textColor: 'text-emerald-700'
  },
  failed: {
    label: 'Failed',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: <AlertCircle className="w-4 h-4" />,
    textColor: 'text-red-700'
  },
  refunded: {
    label: 'Refunded',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    icon: <AlertCircle className="w-4 h-4" />,
    textColor: 'text-slate-700'
  }
};

export const PAYMENT_METHOD_CONFIG: Record<PaymentMethod, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  mpesa: {
    label: 'M-Pesa',
    icon: <Smartphone className="w-5 h-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  mpesa_express: {
    label: 'M-Pesa Express',
    icon: <Smartphone className="w-5 h-5" />,
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300'
  },
  card: {
    label: 'Card Payment',
    icon: <CreditCard className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  bank_transfer: {
    label: 'Bank Transfer',
    icon: <Building className="w-5 h-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
};

interface PaymentMethodCardProps {
  method: PaymentMethod;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ method, selected, onClick, disabled = false }) => {
  const config = PAYMENT_METHOD_CONFIG[method];
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative p-4 rounded-xl border-2 transition-all duration-200
        ${selected 
          ? `${config.borderColor} ${config.bgColor} ${config.color} border-opacity-100 shadow-lg scale-105` 
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${config.bgColor} ${config.color}`}>
          {config.icon}
        </div>
        <div className="text-left">
          <p className="font-semibold text-sm">{config.label}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {method === 'mpesa' && 'Pay via M-Pesa mobile money'}
            {method === 'mpesa_express' && 'Quick checkout with M-Pesa Express'}
            {method === 'card' && 'Credit/Debit card payment'}
            {method === 'bank_transfer' && 'Direct bank deposit'}
          </p>
        </div>
      </div>
      {selected && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </button>
  );
};

interface PaymentStatusBadgeProps {
  status: PaymentDetails['status'];
  size?: 'sm' | 'md' | 'lg';
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = PAYMENT_STATUS_CONFIG[status];
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  return (
    <div className={`
      inline-flex items-center gap-2 rounded-lg border
      ${config.bgColor} ${config.borderColor} ${config.textColor}
      ${sizeClasses[size]}
    `}>
      {config.icon}
      <span className="font-medium">{config.label}</span>
    </div>
  );
};

interface PaymentFormProps {
  method: PaymentMethod;
  amount: number;
  currency: string;
  onSubmit: (details: Partial<PaymentDetails>) => void;
  loading?: boolean;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ method, amount, currency, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    bankName: '',
    accountNumber: '',
    accountHolder: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const paymentDetails: Partial<PaymentDetails> = {
      method,
      amount,
      currency,
      createdAt: new Date()
    };

    switch (method) {
      case 'mpesa':
      case 'mpesa_express':
        paymentDetails.phoneNumber = formData.phoneNumber;
        paymentDetails.reference = `PAY-${Date.now()}`;
        break;
      case 'card':
        paymentDetails.cardLast4 = formData.cardNumber.slice(-4);
        paymentDetails.transactionId = `CARD-${Date.now()}`;
        break;
      case 'bank_transfer':
        paymentDetails.bankName = formData.bankName;
        paymentDetails.accountNumber = formData.accountNumber;
        paymentDetails.reference = `BANK-${Date.now()}`;
        break;
    }

    onSubmit(paymentDetails);
  };

  const renderForm = () => {
    switch (method) {
      case 'mpesa':
      case 'mpesa_express':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="2547XXXXXXXX"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                disabled={loading}
              />
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-700">
                <strong>Instructions:</strong> You will receive a prompt on your M-Pesa number to complete the payment.
              </p>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={formData.cvv}
                  onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                  placeholder="123"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        );

      case 'bank_transfer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                placeholder="Equity Bank, KCB, etc."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                placeholder="1234567890"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Account Holder Name
              </label>
              <input
                type="text"
                value={formData.accountHolder}
                onChange={(e) => setFormData(prev => ({ ...prev, accountHolder: e.target.value }))}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                disabled={loading}
              />
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-purple-700">
                <strong>Instructions:</strong> Make a bank transfer to the provided account details and use the reference number for tracking.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderForm()}
      
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate-600">Amount to Pay:</span>
          <span className="text-2xl font-bold text-slate-800">
            {currency} {amount.toLocaleString()}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <span>Complete Payment</span>
            <span className="text-sm opacity-75">({currency} {amount.toLocaleString()})</span>
          </>
        )}
      </button>
    </form>
  );
};
