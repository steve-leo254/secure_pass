import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Camera,
  ShieldCheck,
  Info,
  Check,
} from 'lucide-react';
import type { VisitorFormData } from '../../services/useVisitorRegistration';

interface StepIdentificationProps {
  formData: VisitorFormData;
  updateFormData: (updates: Partial<VisitorFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  direction: string;
}

const idTypes = [
  { value: 'national-id', label: 'National ID', icon: '🪪', example: 'e.g., 28456789' },
  { value: 'passport', label: 'Passport', icon: '📕', example: 'e.g., AB1234567' },
  { value: 'drivers-license', label: "Driver's License", icon: '🚗', example: 'e.g., DL123456' },
  { value: 'military-id', label: 'Military ID', icon: '🎖️', example: 'e.g., MIL78901' },
  { value: 'student-id', label: 'Student ID', icon: '🎓', example: 'e.g., STU2024001' },
];

const slideVariants = {
  enter: (d: string) => ({ x: d === 'forward' ? 100 : -100, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: string) => ({ x: d === 'forward' ? -100 : 100, opacity: 0 }),
};

const StepIdentification: React.FC<StepIdentificationProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
  direction,
}) => {
  const [touched, setTouched] = useState(false);
  const [idFrontCaptured, setIdFrontCaptured] = useState(!!formData.idPhotoFront);
  const [idBackCaptured, setIdBackCaptured] = useState(!!formData.idPhotoBack);

  const selectedIdType = useMemo(
    () => idTypes.find((t) => t.value === formData.idType),
    [formData.idType]
  );

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!formData.idNumber.trim()) {
      e.idNumber = 'ID number is required';
    } else {
      switch (formData.idType) {
        case 'national-id':
          if (!/^\d{7,8}$/.test(formData.idNumber.trim()))
            e.idNumber = 'National ID should be 7-8 digits';
          break;
        case 'passport':
          if (!/^[A-Za-z]{1,2}\d{6,7}$/.test(formData.idNumber.trim()))
            e.idNumber = 'Invalid passport format';
          break;
        default:
          if (formData.idNumber.trim().length < 4)
            e.idNumber = 'ID number too short';
      }
    }
    return e;
  }, [formData.idNumber, formData.idType]);

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const handleCaptureId = useCallback(
    (side: 'front' | 'back') => {
      setTimeout(() => {
        if (side === 'front') {
          updateFormData({
            idPhotoFront: 'captured-front-' + Date.now(),
          });
          setIdFrontCaptured(true);
        } else {
          updateFormData({
            idPhotoBack: 'captured-back-' + Date.now(),
          });
          setIdBackCaptured(true);
        }
      }, 1000);
    },
    [updateFormData]
  );

  const handleNext = useCallback(() => {
    setTouched(true);
    if (isValid) onNext();
  }, [isValid, onNext]);

  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {/* Section header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">
          Identity Verification
        </h2>
        <p className="text-gray-500 mt-1">
          We need to verify your identity for security
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-8 space-y-6">
          {/* ID Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
              ID Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {idTypes.map((type) => (
                <motion.button
                  key={type.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() =>
                    updateFormData({
                      idType: type.value as VisitorFormData['idType'],
                    })
                  }
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    formData.idType === type.value
                      ? 'border-emerald-500 bg-emerald-50 shadow-md'
                      : 'border-gray-150 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl mb-1 block">{type.icon}</span>
                  <span
                    className={`text-xs font-semibold block ${
                      formData.idType === type.value
                        ? 'text-emerald-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {type.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* ID Number */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
              {selectedIdType?.label} Number *
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) =>
                  updateFormData({
                    idNumber: e.target.value.toUpperCase(),
                  })
                }
                onBlur={() => setTouched(true)}
                placeholder={selectedIdType?.example}
                className={`w-full pl-11 pr-4 py-3.5 border-2 rounded-xl transition-all text-sm focus:ring-0 outline-none font-mono tracking-wider ${
                  touched && errors.idNumber
                    ? 'border-red-300 bg-red-50/30 focus:border-red-400'
                    : 'border-gray-200 focus:border-emerald-400'
                }`}
              />
            </div>
            {touched && errors.idNumber && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs mt-1 flex items-center space-x-1"
              >
                <Info className="w-3 h-3" />
                <span>{errors.idNumber}</span>
              </motion.p>
            )}
          </div>

          {/* ID Photo Capture */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
              Scan Your ID (Optional)
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Front */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleCaptureId('front')}
                className={`relative p-6 rounded-2xl border-2 border-dashed transition-all ${
                  idFrontCaptured
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30'
                }`}
              >
                {idFrontCaptured ? (
                  <div className="text-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-xs font-semibold text-emerald-700">
                      Front captured
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-500">
                      Front Side
                    </p>
                  </div>
                )}
              </motion.button>

              {/* Back */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => handleCaptureId('back')}
                className={`relative p-6 rounded-2xl border-2 border-dashed transition-all ${
                  idBackCaptured
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30'
                }`}
              >
                {idBackCaptured ? (
                  <div className="text-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Check className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-xs font-semibold text-emerald-700">
                      Back captured
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-500">
                      Back Side
                    </p>
                  </div>
                )}
              </motion.button>
            </div>
          </div>

          {/* Security notice */}
          <div className="flex items-start space-x-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed">
              Your ID information is encrypted and stored securely. It will only
              be used for identity verification during your visit and will be
              automatically deleted after 30 days.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-8 pb-8 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-semibold text-gray-600 flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="flex-[2] py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 group"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default StepIdentification;