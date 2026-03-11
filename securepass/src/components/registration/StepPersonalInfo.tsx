import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Building2,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import type { VisitorFormData } from '../../services/useVisitorRegistration';
import PhotoCapture from './PhotoCapture';

interface StepPersonalInfoProps {
  formData: VisitorFormData;
  updateFormData: (updates: Partial<VisitorFormData>) => void;
  onNext: () => void;
  direction: string;
}

const slideVariants = {
  enter: (d: string) => ({
    x: d === 'forward' ? 100 : -100,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (d: string) => ({
    x: d === 'forward' ? -100 : 100,
    opacity: 0,
  }),
};

const StepPersonalInfo: React.FC<StepPersonalInfoProps> = ({
  formData,
  updateFormData,
  onNext,
  direction,
}) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = 'First name is required';
    if (!formData.lastName.trim()) e.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      e.phone = 'Phone number is required';
    } else if (!/^(0|\+254|254)\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      e.phone = 'Invalid Kenyan phone number';
    }
    return e;
  }, [formData]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const handleNext = useCallback(() => {
    if (isValid) {
      onNext();
    } else {
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      });
    }
  }, [isValid, onNext]);

  const inputClasses = useCallback(
    (field: string) =>
      `w-full pl-11 pr-4 py-3.5 border-2 rounded-xl transition-all text-sm focus:ring-0 outline-none ${
        touched[field] && errors[field]
          ? 'border-red-300 bg-red-50/30 focus:border-red-400'
          : 'border-gray-200 focus:border-emerald-400 hover:border-gray-300'
      }`,
    [touched, errors]
  );

  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {/* Welcome message */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Sparkles className="w-8 h-8 text-emerald-600" />
        </motion.div>
        <h2 className="text-2xl font-black text-gray-900">Welcome, Visitor!</h2>
        <p className="text-gray-500 mt-1">Let's get you registered quickly</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-8 space-y-6">
          {/* Photo Capture */}
          <PhotoCapture
            value={formData.photoUrl}
            onChange={(url) => updateFormData({ photoUrl: url })}
          />

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                First Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    updateFormData({ firstName: e.target.value })
                  }
                  onBlur={() => handleBlur('firstName')}
                  placeholder="Jane"
                  className={inputClasses('firstName')}
                />
              </div>
              {touched.firstName && errors.firstName && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-1 flex items-center space-x-1"
                >
                  <Info className="w-3 h-3" />
                  <span>{errors.firstName}</span>
                </motion.p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Last Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    updateFormData({ lastName: e.target.value })
                  }
                  onBlur={() => handleBlur('lastName')}
                  placeholder="Cooper"
                  className={inputClasses('lastName')}
                />
              </div>
              {touched.lastName && errors.lastName && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-1 flex items-center space-x-1"
                >
                  <Info className="w-3 h-3" />
                  <span>{errors.lastName}</span>
                </motion.p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                onBlur={() => handleBlur('email')}
                placeholder="jane@company.com"
                className={inputClasses('email')}
              />
            </div>
            {touched.email && errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1 flex items-center space-x-1"
              >
                <Info className="w-3 h-3" />
                <span>{errors.email}</span>
              </motion.p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData({ phone: e.target.value })}
                onBlur={() => handleBlur('phone')}
                placeholder="0712 345 678"
                className={inputClasses('phone')}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 bg-gray-100 rounded-lg px-2 py-1">
                <span className="text-xs">🇰🇪</span>
                <span className="text-xs text-gray-500 font-medium">+254</span>
              </div>
            </div>
            {touched.phone && errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1 flex items-center space-x-1"
              >
                <Info className="w-3 h-3" />
                <span>{errors.phone}</span>
              </motion.p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
              Company / Organization
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.company}
                onChange={(e) => updateFormData({ company: e.target.value })}
                placeholder="Optional"
                className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-400 hover:border-gray-300 transition-all text-sm focus:ring-0 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="px-8 pb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 group"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default StepPersonalInfo;