import React, { useState } from 'react';
import type { PaymentDetails, PaymentMethod } from './PaymentSystem';
import { PaymentStatusBadge, PaymentMethodCard, PaymentForm } from './PaymentSystem';
import { ArrowLeft, RefreshCw, Download, Eye, Search, TrendingUp, DollarSign, CreditCard, Smartphone, Building } from 'lucide-react';

interface PaymentManagementProps {
  payments: PaymentDetails[];
  onProcessPayment: (payment: Partial<PaymentDetails>) => Promise<void>;
  onRefreshPayments: () => Promise<void>;
  loading?: boolean;
}

export const PaymentManagement: React.FC<PaymentManagementProps> = ({
  payments,
  onProcessPayment,
  onRefreshPayments,
  loading = false
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mpesa');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  // Calculate payment statistics
  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    totalAmount: payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0)
  };

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.transactionId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.phoneNumber?.includes(searchQuery) ||
      payment.cardLast4?.includes(searchQuery) ||
      payment.bankName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handlePaymentSubmit = async (paymentDetails: Partial<PaymentDetails>) => {
    try {
      await onProcessPayment(paymentDetails);
      setShowPaymentForm(false);
      setSelectedMethod('mpesa');
      setPaymentAmount(0);
    } catch (error) {
      console.error('Payment processing failed:', error);
    }
  };

  const getStatusIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'mpesa':
      case 'mpesa_express':
        return <Smartphone className="w-4 h-4" />;
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'bank_transfer':
        return <Building className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Payments</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-500 font-medium">Completed</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-500 font-medium">Pending</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-500 font-medium">Failed</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.failed}</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl border border-indigo-200 shadow-sm p-6 text-white">
          <div>
            <p className="text-sm text-indigo-100 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold mt-1">
              KES {stats.totalAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Form Section */}
      {!showPaymentForm ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Quick Payment</h3>
            <button
              onClick={() => setShowPaymentForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              New Payment
            </button>
          </div>

          {/* Payment Method Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {(['mpesa', 'mpesa_express', 'card', 'bank_transfer'] as PaymentMethod[]).map((method) => (
              <PaymentMethodCard
                key={method}
                method={method}
                selected={selectedMethod === method}
                onClick={() => setSelectedMethod(method)}
              />
            ))}
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payment Amount (KES)
            </label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              placeholder="Enter amount"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Selected Payment Method Display */}
          {selectedMethod && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                {getStatusIcon(selectedMethod)}
                <div>
                  <p className="font-semibold text-indigo-700">
                    {selectedMethod === 'mpesa' && 'M-Pesa Payment'}
                    {selectedMethod === 'mpesa_express' && 'M-Pesa Express'}
                    {selectedMethod === 'card' && 'Card Payment'}
                    {selectedMethod === 'bank_transfer' && 'Bank Transfer'}
                  </p>
                  <p className="text-sm text-indigo-600">
                    {selectedMethod === 'mpesa' && 'Pay via M-Pesa mobile money'}
                    {selectedMethod === 'mpesa_express' && 'Quick checkout with M-Pesa Express'}
                    {selectedMethod === 'card' && 'Secure card payment processing'}
                    {selectedMethod === 'bank_transfer' && 'Direct bank deposit transfer'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <PaymentForm
          method={selectedMethod}
          amount={paymentAmount}
          currency="KES"
          onSubmit={handlePaymentSubmit}
          loading={loading}
        />
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search payments..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          >
            <option value="all">All Methods</option>
            <option value="mpesa">M-Pesa</option>
            <option value="mpesa_express">M-Pesa Express</option>
            <option value="card">Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>

          <button
            onClick={onRefreshPayments}
            disabled={loading}
            className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Transaction ID</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Method</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Amount</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Date</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <DollarSign className="w-12 h-12 text-slate-300" />
                      <p className="text-slate-500 text-sm">
                        {searchQuery || statusFilter !== 'all' || methodFilter !== 'all' 
                          ? 'No payments found matching your criteria' 
                          : 'No payments recorded yet'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-mono text-slate-700">{payment.transactionId || payment.reference}</span>
                        {payment.phoneNumber && (
                          <span className="text-xs text-slate-400">{payment.phoneNumber}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.method)}
                        <span className="text-sm text-slate-700 capitalize">
                          {payment.method.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-semibold text-slate-800">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <PaymentStatusBadge status={payment.status} size="sm" />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-700">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(payment.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {payment.status === 'completed' && (
                          <button
                            className="w-7 h-7 rounded-lg bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center text-emerald-600 transition-colors"
                            title="Download Receipt"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">Payment Details</h3>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Transaction ID</p>
                      <p className="text-sm font-mono text-slate-700">{selectedPayment.transactionId || selectedPayment.reference}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Status</p>
                      <PaymentStatusBadge status={selectedPayment.status} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Amount</p>
                      <p className="text-lg font-bold text-slate-800">
                        {selectedPayment.currency} {selectedPayment.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Method</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(selectedPayment.method)}
                        <span className="text-sm text-slate-700 capitalize">
                          {selectedPayment.method.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedPayment.failureReason && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm font-medium text-red-700">Failure Reason:</p>
                    <p className="text-sm text-red-600">{selectedPayment.failureReason}</p>
                  </div>
                )}

                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Created</p>
                      <p className="text-sm text-slate-700">
                        {new Date(selectedPayment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {selectedPayment.processedAt && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Processed</p>
                        <p className="text-sm text-slate-700">
                          {new Date(selectedPayment.processedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
