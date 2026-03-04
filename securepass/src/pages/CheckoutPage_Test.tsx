import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CreditCard, Smartphone, Shield, CheckCircle2 } from 'lucide-react';

interface CheckoutData {
  packageId: string;
  extensionDays: number;
  billingCycle: string;
  paymentMethod: 'mpesa' | 'card' | 'bank';
  amount: number;
}

const CheckoutPageTest: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  console.log('CheckoutPageTest rendered - User:', user, 'Location:', location.pathname);

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'success'>('details');

  useEffect(() => {
    // Simple test version - just set loading to false
    setLoading(false);
    
    // Parse checkout data from location state
    const state = location.state as any;
    
    if (state?.checkoutData) {
      setCheckoutData(state.checkoutData);
      console.log('Received checkout data:', state.checkoutData);
    } else {
      // Set default data for testing
      setCheckoutData({
        packageId: 'test-package',
        extensionDays: 30,
        billingCycle: 'monthly',
        paymentMethod: 'mpesa',
        amount: 1000,
      });
    }
  }, [location]);

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
      
      console.log('Payment simulated:', checkoutData);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/management')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Management
          </button>
          
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-slate-900">Extend Subscription</h1>
            <p className="text-slate-600 mt-2">Complete your subscription extension</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Details */}
            {paymentStep === 'details' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Order Details</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                    <span className="font-medium text-slate-700">Package</span>
                    <span className="font-bold text-slate-900">Extension Package</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                    <span className="font-medium text-slate-700">Extension Period</span>
                    <span className="font-bold text-slate-900">{checkoutData?.extensionDays} days</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                    <span className="font-medium text-slate-700">Billing Cycle</span>
                    <span className="font-bold text-slate-900 capitalize">{checkoutData?.billingCycle}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-xl">
                    <span className="font-medium text-indigo-700">Total Amount</span>
                    <span className="text-2xl font-bold text-indigo-600">
                      KES {checkoutData?.amount?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] transition-all"
                >
                  Proceed to Payment
                </button>
              </div>
            )}

            {/* Payment */}
            {paymentStep === 'payment' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Payment Method</h2>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handlePaymentMethodChange('mpesa')}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      checkoutData?.paymentMethod === 'mpesa'
                        ? 'border-green-500 bg-green-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-6 h-6 text-green-600" />
                      <div className="text-left">
                        <p className="font-semibold text-slate-800">M-Pesa</p>
                        <p className="text-sm text-slate-600">Pay via M-Pesa</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePaymentMethodChange('card')}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      checkoutData?.paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                      <div className="text-left">
                        <p className="font-semibold text-slate-800">Credit/Debit Card</p>
                        <p className="text-sm text-slate-600">Pay with card</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePaymentMethodChange('bank')}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      checkoutData?.paymentMethod === 'bank'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-purple-600" />
                      <div className="text-left">
                        <p className="font-semibold text-slate-800">Bank Transfer</p>
                        <p className="text-sm text-slate-600">Direct bank payment</p>
                      </div>
                    </div>
                  </button>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.98] transition-all disabled:opacity-40"
                >
                  {processing ? 'Processing Payment...' : `Pay KES ${checkoutData?.amount?.toLocaleString()}`}
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

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Package</span>
                  <span className="font-medium text-slate-800">Extension Package</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Duration</span>
                  <span className="font-medium text-slate-800">{checkoutData?.extensionDays} days</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Billing Cycle</span>
                  <span className="font-medium text-slate-800 capitalize">{checkoutData?.billingCycle}</span>
                </div>
                
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-800">Total Amount</span>
                    <span className="text-xl font-bold text-indigo-600">
                      KES {checkoutData?.amount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPageTest;
