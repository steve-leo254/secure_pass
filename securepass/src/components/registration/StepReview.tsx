import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Edit,
  User,
  Building,
  Calendar,
  Clock,
  MapPin,
  Package,
  Car,
  Laptop,
  FileText,
} from 'lucide-react';
import type { VisitorFormData } from '../../services/useVisitorRegistration';
import type { RegistrationStep } from '../../pages/VisitorRegistrationPage';

interface StepReviewProps {
  formData: VisitorFormData;
  onSubmit: () => Promise<void>;
  onBack: () => void;
  onEditStep: (step: RegistrationStep) => void;
  isSubmitting: boolean;
  direction: string;
}

const slideVariants = {
  enter: (d: string) => ({ x: d === 'forward' ? 100 : -100, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: string) => ({ x: d === 'forward' ? -100 : 100, opacity: 0 }),
};

const StepReview: React.FC<StepReviewProps> = ({
  formData,
  onSubmit,
  onBack,
  onEditStep,
  isSubmitting,
  direction,
}) => {
  const handleSubmit = async () => {
    await onSubmit();
  };

  const formatPurpose = (purpose: string) => {
    const purposes: Record<string, string> = {
      meeting: 'Meeting',
      interview: 'Interview',
      delivery: 'Delivery',
      maintenance: 'Maintenance',
      consultation: 'Consultation',
      event: 'Event',
      personal: 'Personal',
      other: 'Other',
    };
    return purposes[purpose] || purpose;
  };

  const formatIdType = (idType: string) => {
    const types: Record<string, string> = {
      'national-id': 'National ID',
      'passport': 'Passport',
      'drivers-license': "Driver's License",
      'military-id': 'Military ID',
      'student-id': 'Student ID',
    };
    return types[idType] || idType;
  };

  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Review Your Information</h2>
        <p className="text-gray-500 mt-1">
          Please review your details before submitting
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-8 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Personal Information</h3>
              <button
                onClick={() => onEditStep('identification')}
                className="text-xs text-purple-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{formData.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-700">{formData.company}</p>
              </div>
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-700">{formatIdType(formData.idType)}</p>
                  <p className="text-xs text-gray-500">{formData.idNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visit Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Visit Details</h3>
              <button
                onClick={() => onEditStep('visit-details')}
                className="text-xs text-purple-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{formData.hostName}</p>
                  <p className="text-xs text-gray-500">
                    {formData.hostDepartment} · {formData.hostFloor}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-700">{formatPurpose(formData.purpose)}</p>
                  {formData.purpose === 'other' && formData.purposeDetails && (
                    <p className="text-xs text-gray-500">{formData.purposeDetails}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-700">{formData.expectedDuration}</p>
                  <p className="text-xs text-gray-500">
                    {formData.visitDate} at {formData.visitTime}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Declaration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Items Declaration</h3>
              <button
                onClick={() => onEditStep('items')}
                className="text-xs text-purple-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              {formData.hasVehicle && (
                <div className="flex items-center space-x-3">
                  <Car className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-700">{formData.vehicleType}</p>
                    <p className="text-xs text-gray-500">Plate: {formData.vehiclePlate}</p>
                  </div>
                </div>
              )}
              {formData.hasLaptop && (
                <div className="flex items-center space-x-3">
                  <Laptop className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-700">Laptop</p>
                    <p className="text-xs text-gray-500">S/N: {formData.laptopSerial}</p>
                  </div>
                </div>
              )}
              {formData.items.length > 0 && (
                <div className="flex items-start space-x-3">
                  <Package className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">Additional Items</p>
                    <div className="mt-1 space-y-1">
                      {formData.items.map((item) => (
                        <p key={item.id} className="text-xs text-gray-500">
                          • {item.name} - {item.description}
                          {item.serialNumber && ` (S/N: ${item.serialNumber})`}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {formData.specialNeeds && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-700">Special Needs: {formData.specialNeeds}</p>
                </div>
              )}
            </div>
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
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-[2] py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 group disabled:opacity-40"
          >
            <span>{isSubmitting ? 'Submitting...' : 'Submit Registration'}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default StepReview;