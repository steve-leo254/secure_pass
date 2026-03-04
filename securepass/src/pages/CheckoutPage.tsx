import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSystemAdmin } from '../context/SystemAdminContext';
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Shield,
  CheckCircle2,
  Clock,
  Package,
  Users,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import type { SubscriptionStatus } from '../types';

interface CheckoutData {
  packageId: string;
  extensionDays: number;
  billingCycle: string;
  paymentMethod: 'mpesa' | 'card' | 'bank';
  amount: number;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { 
    getUserSubscription, 
    packages,
    createSubscription,
  } = useSystemAdmin();

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'success'>('details');

  useEffect(() => {
    // Parse checkout data from location state or query params
    const state = location.state as any;
    const params = new URLSearchParams(location.search);
    
    if (state?.checkoutData) {
      setCheckoutData(state.checkoutData);
    } else if (params.get('packageId')) {
      setCheckoutData({
        packageId: params.get('packageId') || '',
        extensionDays: parseInt(params.get('days') || '30'),
        billingCycle: params.get('billing') || 'monthly',
        paymentMethod: 'mpesa',
        amount: parseFloat(params.get('amount') || '0'),
      });
    } else {
      // Redirect to management if no checkout data
      navigate('/management');
      return;
    }

    setLoading(false);
  }, [location, navigate]);

  useEffect(() => {
    if (checkoutData && user) {
      const subscription = getUserSubscription(user.id);
      const pkg = packages.find(p => p.id === checkoutData.packageId);
      
      setCurrentSubscription(subscription);
      setSelectedPackage(pkg);
    }
  }, [checkoutData, user, getUserSubscription, packages]);

  const handlePaymentMethodChange = (method: 'mpesa' | 'card' | 'bank') => {
    setCheckoutData(prev => prev ? { ...prev, paymentMethod: method } : null);
  };

  const handleProceedToPayment = () => {
    setPaymentStep('payment');
  };

  const handlePayment = async () => {
    if (!checkoutData || !user) return;

    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new subscription
      const newSubscription = {
        userId: user.id,
        packageId: checkoutData.packageId,
        startDate: new Date().toISOString(),
        endDate: addDays(new Date(), checkoutData.extensionDays).toISOString(),
        status: 'active' as SubscriptionStatus,
        autoRenew: true,
        amount: checkoutData.amount,
      };

      await createSubscription(newSubscription);
      setPaymentStep('success');
      
      // Redirect to management after 3 seconds
      setTimeout(() => {
        navigate('/management', { replace: true });
      }, 3000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      setProcessing(false);
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'mpesa':
        return <Smartphone className="w-8 h-8 text-green-600" />;
      case 'card':
        return <CreditCard className="w-8 h-8 text-blue-600" />;
      case 'bank':
        return <Shield className="w-8 h-8 text-purple-600" />;
      default:
        return <CreditCard className="w-8 h-8 text-slate-400" />;
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'mpesa':
        return 'M-Pesa';
      case 'card':
        return 'Credit/Debit Card';
      case 'bank':
        return 'Bank Transfer';
      default:
        return 'Payment Method';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!checkoutData || !selectedPackage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Invalid Checkout Data</h2>
          <p className="text-slate-600 mb-6">Please restart the checkout process.</p>
          <button
            onClick={() => navigate('/management')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            Back to Management
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/management')}
              className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Checkout</h1>
              <p className="text-sm text-slate-500">Complete your subscription extension</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{selectedPackage.name}</h2>
                  <p className="text-sm text-slate-500">Subscription Extension</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Package</span>
                  </div>
                  <span className="font-semibold text-slate-800">{selectedPackage.name}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Extension Period</span>
                  </div>
                  <span className="font-semibold text-slate-800">{checkoutData.extensionDays} days</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Max Users</span>
                  </div>
                  <span className="font-semibold text-slate-800">{selectedPackage.maxUsers}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Daily Visitors</span>
                  </div>
                  <span className="font-semibold text-slate-800">{selectedPackage.maxVisitorsPerDay}</span>
                </div>

                {currentSubscription && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Current Subscription</p>
                        <p className="text-xs text-amber-600 mt-1">
                          Ends on {format(new Date(currentSubscription.endDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Selection */}
            {paymentStep === 'details' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Select Payment Method</h3>
                
                <div className="space-y-3">
                  {[
                    { id: 'mpesa', name: 'M-Pesa', description: 'Pay via M-Pesa mobile money' },
                    { id: 'card', name: 'Credit/Debit Card', description: 'Pay with Visa, Mastercard, etc.' },
                    { id: 'bank', name: 'Bank Transfer', description: 'Direct bank deposit' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentMethodChange(method.id as any)}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        checkoutData.paymentMethod === method.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {getPaymentIcon(method.id)}
                        <div className="text-left">
                          <p className="font-semibold text-slate-800">{method.name}</p>
                          <p className="text-sm text-slate-500">{method.description}</p>
                        </div>
                        {checkoutData.paymentMethod === method.id && (
                          <div className="ml-auto">
                            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleProceedToPayment}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all"
                >
                  Proceed to Payment
                </button>
              </div>
            )}

            {/* Payment Processing */}
            {paymentStep === 'payment' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Payment Details</h3>
                
                <div className="bg-slate-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    {getPaymentIcon(checkoutData.paymentMethod)}
                    <div>
                      <p className="font-semibold text-slate-800">
                        {getPaymentMethodName(checkoutData.paymentMethod)}
                      </p>
                      <p className="text-sm text-slate-500">Payment Method</p>
                    </div>
                  </div>
                  
                  {checkoutData.paymentMethod === 'mpesa' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          M-Pesa Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+254 7XX XXX XXX"
                          className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-sm text-green-800">
                          <strong>Instructions:</strong> You will receive an M-Pesa prompt to complete the payment.
                        </p>
                      </div>
                    </div>
                  )}

                  {checkoutData.paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {checkoutData.paymentMethod === 'bank' && (
                    <div className="space-y-3">
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                        <p className="text-sm text-purple-800">
                          <strong>Bank Transfer Details:</strong>
                        </p>
                        <div className="mt-3 space-y-2 text-sm">
                          <p><strong>Bank:</strong> Equity Bank Kenya</p>
                          <p><strong>Account Name:</strong> SecurePass Solutions Ltd</p>
                          <p><strong>Account Number:</strong> 00302934567890</p>
                          <p><strong>Branch:</strong> Nairobi CBD</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.98] transition-all disabled:opacity-40"
                >
                  {processing ? 'Processing Payment...' : `Pay KES ${checkoutData.amount.toLocaleString()}`}
                </button>
              </div>
            )}

            {/* Success State */}
            {paymentStep === 'success' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Payment Successful!</h3>
                  <p className="text-slate-600 mb-6">
                    Your subscription has been extended successfully. Redirecting to management...
                  </p>
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Package</span>
                <span className="font-medium text-slate-800">{selectedPackage.name}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Duration</span>
                <span className="font-medium text-slate-800">{checkoutData.extensionDays} days</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Billing Cycle</span>
                <span className="font-medium text-slate-800 capitalize">{checkoutData.billingCycle}</span>
              </div>
              
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-800">Total Amount</span>
                  <span className="text-xl font-bold text-indigo-600">
                    KES {checkoutData.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {currentSubscription && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">New End Date</p>
                    <p className="text-xs text-blue-600 mt-1">
                      {format(addDays(new Date(currentSubscription.endDate), checkoutData.extensionDays), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
