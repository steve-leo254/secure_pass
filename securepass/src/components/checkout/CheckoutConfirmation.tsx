import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardCheck,
  Clock,
  MapPin,
  User,
  Building,
  Star,
  MessageSquare,
  LogOut,
  Loader2,
  Car,
  Briefcase,
} from 'lucide-react';
import type { VisitorSession } from '../../services/useCheckout';

interface CheckoutConfirmationProps {
  session: VisitorSession;
  onConfirm: (feedback?: { rating: number; comment: string }) => void;
  isProcessing: boolean;
}

const CheckoutConfirmation: React.FC<CheckoutConfirmationProps> = ({
  session,
  onConfirm,
  isProcessing,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const quickComments = [
    'Great experience!',
    'Very professional',
    'Easy check-in process',
    'Friendly staff',
    'Clean facility',
    'Could be better',
  ];

  const handleConfirm = useCallback(() => {
    const feedback =
      rating > 0 ? { rating, comment } : undefined;
    onConfirm(feedback);
  }, [rating, comment, onConfirm]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="pt-6 space-y-6"
    >
      {/* Visit Summary Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Visit Summary
              </h2>
              <p className="text-xs text-gray-500">
                Please review before checking out
              </p>
            </div>
          </div>
        </div>

        {/* Visitor Profile */}
        <div className="px-8 pb-4">
          <div className="flex items-center space-x-4 bg-gradient-to-br from-gray-50 to-emerald-50/30 rounded-2xl p-5">
            <img
              src={session.photoUrl}
              alt={session.visitorName}
              className="w-16 h-16 rounded-xl object-cover ring-3 ring-white shadow-md"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">
                {session.visitorName}
              </h3>
              <p className="text-sm text-gray-500">{session.company}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                  {session.badgeNumber}
                </span>
                <span className="text-xs text-gray-400">
                  {session.idType}: {session.idNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visit Details Grid */}
        <div className="px-8 pb-6">
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon: User,
                label: 'Host',
                value: session.hostName,
                subValue: session.hostDepartment,
              },
              {
                icon: Clock,
                label: 'Checked In',
                value: session.checkInTime,
                subValue: session.checkInDate,
              },
              {
                icon: Building,
                label: 'Location',
                value: session.building,
                subValue: session.floor,
              },
              {
                icon: MapPin,
                label: 'Purpose',
                value: session.purpose,
                subValue: null,
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-gray-50 rounded-xl p-4"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <item.icon className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500 font-medium">
                    {item.label}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {item.value}
                </p>
                {item.subValue && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.subValue}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Additional items */}
          {(session.vehiclePlate || session.itemsCarried?.length) && (
            <div className="mt-3 flex flex-wrap gap-3">
              {session.vehiclePlate && (
                <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 rounded-lg px-3 py-2">
                  <Car className="w-4 h-4" />
                  <span className="text-xs font-semibold">
                    {session.vehiclePlate}
                  </span>
                </div>
              )}
              {session.itemsCarried?.map((item) => (
                <div
                  key={item}
                  className="flex items-center space-x-2 bg-purple-50 text-purple-700 rounded-lg px-3 py-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span className="text-xs font-semibold">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Section (collapsible) */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <button
          onClick={() => setShowFeedback(!showFeedback)}
          className="w-full px-8 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900">Rate Your Visit</h3>
              <p className="text-xs text-gray-500">Optional — helps us improve</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: showFeedback ? 180 : 0 }}
            className="text-gray-400"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.div>
        </button>

        {showFeedback && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-8 pb-6"
          >
            {/* Star Rating */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1"
                >
                  <Star
                    className={`w-10 h-10 transition-all ${
                      star <= (hoveredRating || rating)
                        ? 'text-amber-400 fill-current drop-shadow-md'
                        : 'text-gray-200'
                    }`}
                  />
                </motion.button>
              ))}
            </div>

            {rating > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm font-medium text-amber-600 mb-4"
              >
                {
                  ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][
                    rating
                  ]
                }
              </motion.p>
            )}

            {/* Quick comment chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {quickComments.map((qc) => (
                <motion.button
                  key={qc}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setComment((prev) =>
                      prev.includes(qc) ? prev.replace(qc, '').trim() : `${prev} ${qc}`.trim()
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    comment.includes(qc)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {qc}
                </motion.button>
              ))}
            </div>

            {/* Comment box */}
            <div className="relative">
              <MessageSquare className="absolute top-3.5 left-4 w-4 h-4 text-gray-400" />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Any additional comments..."
                rows={3}
                maxLength={300}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-sm transition-all"
              />
              <span className="absolute bottom-3 right-4 text-[10px] text-gray-400">
                {comment.length}/300
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Checkout Button */}
      <motion.button
        whileHover={!isProcessing ? { scale: 1.02 } : {}}
        whileTap={!isProcessing ? { scale: 0.98 } : {}}
        onClick={handleConfirm}
        disabled={isProcessing}
        className="w-full py-5 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-red-500/25 flex items-center justify-center space-x-3 disabled:opacity-70 relative overflow-hidden group"
      >
        {/* Shimmer effect */}
        {!isProcessing && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}

        {isProcessing ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Processing Checkout...</span>
          </>
        ) : (
          <>
            <LogOut className="w-6 h-6" />
            <span>Confirm Check Out</span>
          </>
        )}
      </motion.button>

      <p className="text-center text-xs text-gray-400">
        By checking out, your visitor badge will be deactivated and access
        revoked.
      </p>
    </motion.div>
  );
};

export default CheckoutConfirmation;