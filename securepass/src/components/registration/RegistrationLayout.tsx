import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  User,
  CreditCard,
  Building,
  Package,
  ClipboardCheck,
} from 'lucide-react';
import type { RegistrationStep } from '../../pages/VisitorRegistrationPage';

interface RegistrationLayoutProps {
  currentStep: RegistrationStep;
  currentStepIndex: number;
  totalSteps: number;
  children: React.ReactNode;
}

const stepsConfig = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'identification', label: 'ID', icon: CreditCard },
  { id: 'visit-details', label: 'Visit', icon: Building },
  { id: 'items', label: 'Items', icon: Package },
  { id: 'review', label: 'Review', icon: ClipboardCheck },
];

const RegistrationLayout: React.FC<RegistrationLayoutProps> = ({
  currentStep,
  currentStepIndex,
  totalSteps,
  children,
}) => {
  const progress = useMemo(() => {
    if (currentStep === 'success') return 100;
    if (currentStep === 'submitting') return 95;
    return ((currentStepIndex + 1) / totalSteps) * 100;
  }, [currentStep, currentStepIndex, totalSteps]);

  const isTerminal = currentStep === 'success' || currentStep === 'submitting';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-100/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-cyan-100/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      {/* Header */}
      <header className="relative z-20 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-black text-gray-900 tracking-tight">
                  Secure<span className="text-emerald-600">Pass</span>
                </span>
                <p className="text-[10px] text-gray-500 font-medium -mt-0.5 uppercase tracking-wider">
                  Visitor Registration
                </p>
              </div>
            </div>

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

      {/* Step Indicator */}
      {!isTerminal && (
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-2">
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
            />
          </div>

          {/* Steps */}
          <div className="flex items-center justify-between">
            {stepsConfig.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      backgroundColor: isCompleted
                        ? '#10b981'
                        : isActive
                        ? '#059669'
                        : '#f3f4f6',
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center relative"
                  >
                    {isActive && (
                      <motion.div
                        animate={{
                          scale: [1, 1.6, 1],
                          opacity: [0.4, 0, 0.4],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-emerald-500 rounded-full"
                      />
                    )}
                    {isCompleted ? (
                      <svg
                        className="w-5 h-5 text-white relative z-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <StepIcon
                        className={`w-4 h-4 relative z-10 ${
                          isActive ? 'text-white' : 'text-gray-400'
                        }`}
                      />
                    )}
                  </motion.div>
                  <span
                    className={`text-[10px] sm:text-xs mt-1.5 font-medium ${
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
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-8">
        <p className="text-xs text-gray-400">
          Need assistance? Ask our front desk staff or call{' '}
          <span className="text-emerald-600 font-semibold">ext. 100</span>
        </p>
      </footer>
    </div>
  );
};

export default RegistrationLayout;