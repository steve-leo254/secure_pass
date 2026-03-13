import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building,
  ArrowRight,
  ArrowLeft,
  Search,
  Calendar,
  Clock,
  Target,
  User,
  MapPin,
  Check,
} from 'lucide-react';
import type {
  VisitorFormData,
  Host,
} from '../../services/useVisitorRegistration';
import {
  useVisitorRegistration,
} from '../../services/useVisitorRegistration';

interface StepVisitDetailsProps {
  formData: VisitorFormData;
  updateFormData: (updates: Partial<VisitorFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  direction: string;
}

const purposes = [
  { value: 'meeting', label: 'Meeting', icon: '🤝', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { value: 'interview', label: 'Interview', icon: '💼', color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { value: 'delivery', label: 'Delivery', icon: '📦', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { value: 'maintenance', label: 'Maintenance', icon: '🔧', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { value: 'consultation', label: 'Consultation', icon: '💬', color: 'bg-teal-50 border-teal-200 text-teal-700' },
  { value: 'event', label: 'Event', icon: '🎉', color: 'bg-pink-50 border-pink-200 text-pink-700' },
  { value: 'personal', label: 'Personal', icon: '👤', color: 'bg-green-50 border-green-200 text-green-700' },
  { value: 'other', label: 'Other', icon: '📋', color: 'bg-gray-50 border-gray-200 text-gray-700' },
];

const durations = [
  { value: '30-min', label: '30 min' },
  { value: '1-hour', label: '1 hour' },
  { value: '2-hours', label: '2 hours' },
  { value: 'half-day', label: 'Half day' },
  { value: 'full-day', label: 'Full day' },
  { value: 'multi-day', label: 'Multi-day' },
];

const slideVariants = {
  enter: (d: string) => ({ x: d === 'forward' ? 100 : -100, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: string) => ({ x: d === 'forward' ? -100 : 100, opacity: 0 }),
};

const StepVisitDetails: React.FC<StepVisitDetailsProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
  direction,
}) => {
  const [hostSearch, setHostSearch] = useState('');
  const [hosts, setHosts] = useState<Host[]>([]);
  const [showHostList, setShowHostList] = useState(false);
  const { fetchHosts, isLoading } = useVisitorRegistration();

  // Fetch hosts on search
  useEffect(() => {
    const timer = setTimeout(async () => {
      const results = await fetchHosts(hostSearch);
      setHosts(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [hostSearch, fetchHosts]);

  const selectHost = useCallback(
    (host: Host) => {
      updateFormData({
        hostId: host.id,
        hostName: host.name,
        hostDepartment: host.department,
        hostFloor: host.floor,
      });
      setShowHostList(false);
      setHostSearch('');
    },
    [updateFormData]
  );

  const isValid = useMemo(() => {
    return formData.hostId && formData.purpose;
  }, [formData.hostId, formData.purpose]);

  const handleNext = useCallback(() => {
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
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Visit Details</h2>
        <p className="text-gray-500 mt-1">
          Tell us who you're visiting and why
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-8 space-y-6">
          {/* Host Search */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
              Who are you visiting? *
            </label>

            {formData.hostId ? (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      hosts.find((h) => h.id === formData.hostId)?.avatar ||
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60'
                    }
                    alt={formData.hostName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {formData.hostName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formData.hostDepartment} · {formData.hostFloor}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    updateFormData({
                      hostId: '',
                      hostName: '',
                      hostDepartment: '',
                      hostFloor: '',
                    });
                    setShowHostList(true);
                  }}
                  className="text-xs text-emerald-600 font-semibold hover:underline"
                >
                  Change
                </button>
              </motion.div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={hostSearch}
                  onChange={(e) => {
                    setHostSearch(e.target.value);
                    setShowHostList(true);
                  }}
                  onFocus={() => setShowHostList(true)}
                  placeholder="Search by name or department..."
                  className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-400 transition-all text-sm focus:ring-0 outline-none"
                />

                {/* Host List Dropdown */}
                <AnimatePresence>
                  {showHostList && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-20 top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-64 overflow-y-auto"
                    >
                      {isLoading ? (
                        <div className="p-6 text-center text-gray-500 text-sm">
                          Searching...
                        </div>
                      ) : hosts.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">
                          No hosts found
                        </div>
                      ) : (
                        <div className="p-2">
                          {hosts.map((host) => (
                            <motion.button
                              key={host.id}
                              whileHover={{ x: 4 }}
                              onClick={() => selectHost(host)}
                              disabled={!host.available}
                              className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-colors ${
                                host.available
                                  ? 'hover:bg-emerald-50'
                                  : 'opacity-50 cursor-not-allowed'
                              }`}
                            >
                              <div className="relative">
                                <img
                                  src={host.avatar}
                                  alt={host.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div
                                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                    host.available
                                      ? 'bg-green-400'
                                      : 'bg-gray-400'
                                  }`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm truncate">
                                  {host.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {host.title} · {host.department}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <MapPin className="w-3 h-3" />
                                <span>{host.floor}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
              Purpose of Visit *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {purposes.map((p) => (
                <motion.button
                  key={p.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() =>
                    updateFormData({
                      purpose: p.value as VisitorFormData['purpose'],
                    })
                  }
                  className={`p-3 rounded-xl border-2 transition-all text-center relative ${
                    formData.purpose === p.value
                      ? 'border-emerald-500 bg-emerald-50 shadow-md'
                      : 'border-gray-150 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl block mb-1">{p.icon}</span>
                  <span className="text-[10px] font-semibold text-gray-700 block">
                    {p.label}
                  </span>
                  {formData.purpose === p.value && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Purpose details if "other" */}
          {formData.purpose === 'other' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Please Specify
              </label>
              <textarea
                value={formData.purposeDetails}
                onChange={(e) =>
                  updateFormData({ purposeDetails: e.target.value })
                }
                placeholder="Describe the purpose of your visit..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-400 transition-all text-sm resize-none focus:ring-0 outline-none"
              />
            </motion.div>
          )}

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
              Expected Duration
            </label>
            <div className="flex flex-wrap gap-2">
              {durations.map((d) => (
                <motion.button
                  key={d.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() =>
                    updateFormData({ expectedDuration: d.value })
                  }
                  className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                    formData.expectedDuration === d.value
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {d.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Date/Time (if pre-registering) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                <Calendar className="w-3 h-3 inline mr-1" />
                Visit Date
              </label>
              <input
                type="date"
                value={formData.visitDate}
                onChange={(e) =>
                  updateFormData({ visitDate: e.target.value })
                }
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-400 transition-all text-sm focus:ring-0 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                <Clock className="w-3 h-3 inline mr-1" />
                Arrival Time
              </label>
              <input
                type="time"
                value={formData.visitTime}
                onChange={(e) =>
                  updateFormData({ visitTime: e.target.value })
                }
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-400 transition-all text-sm focus:ring-0 outline-none"
              />
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
            onClick={handleNext}
            disabled={!isValid}
            className="flex-[2] py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 group disabled:opacity-40"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default StepVisitDetails;