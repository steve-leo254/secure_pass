import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, QrCode, UserCheck, ClipboardCheck, LogOut } from 'lucide-react';

interface CheckoutLayoutProps {
  currentStep: string;
  children: React.ReactNode;
}

const steps = [
  { id: 'scanning', label: 'Scan', icon: QrCode },
  { id: 'verifying', label: 'Verify', icon: UserCheck },
  { id: 'confirming', label: 'Confirm', icon: ClipboardCheck },
  { id: 'success', label: 'Done', icon: LogOut },
];

const CheckoutLayout: React.FC<CheckoutLayoutProps> = ({
  currentStep,
  children,
}) => {
  const activeStepIndex = useMemo(() => {
    const stepMap: Record<string, number> = {
      scanning: 0,
      verifying: 1,
      confirming: 2,
      processing: 2,
      success: 3,
      failed: 0,
    };
    return stepMap[currentStep] ?? 0;
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Top Header Bar */}
      <header className="relative z-20 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-black text-gray-900 tracking-tight">
                  Secure<span className="text-emerald-600">Pass</span>
                </span>
                <p className="text-[10px] text-gray-500 font-medium -mt-0.5">
                  VISITOR CHECKOUT
                </p>
              </div>
            </div>

            {/* Current time */}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">
                {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Stepper */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = index === activeStepIndex;
            const isCompleted = index < activeStepIndex;
            const StepIcon = step.icon;

            return (
              <React.Fragment key={step.id}>
                {/* Step */}
                <div className="flex flex-col items-center relative">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      backgroundColor: isCompleted
                        ? '#10b981'
                        : isActive
                        ? '#059669'
                        : '#e5e7eb',
                    }}
                    className="w-11 h-11 rounded-full flex items-center justify-center relative"
                  >
                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-emerald-500 rounded-full"
                      />
                    )}
                    <StepIcon
                      className={`w-5 h-5 relative z-10 ${
                        isActive || isCompleted ? 'text-white' : 'text-gray-400'
                      }`}
                    />
                  </motion.div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isActive
                        ? 'text-emerald-600'
                        : isCompleted
                        ? 'text-emerald-500'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 mt-[-1.25rem] rounded-full bg-gray-200 overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{
                        width: isCompleted ? '100%' : isActive ? '50%' : '0%',
                      }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6">
        <p className="text-xs text-gray-400">
          Need help? Contact security at{' '}
          <span className="text-emerald-600 font-semibold">ext. 100</span> or
          visit the front desk
        </p>
      </footer>
    </div>
  );
};

export default CheckoutLayout;