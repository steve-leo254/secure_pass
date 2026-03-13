import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  Timer,
  Receipt,
  LogOut,
  Star,
  Shield,
  Download,
  Share2,
} from 'lucide-react';
import type { VisitorSession } from '../../services/useCheckout';

interface CheckoutSuccessProps {
  session: VisitorSession;
  checkoutTime: string;
  duration: string;
  receiptId: string;
  onDone: () => void;
}

const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({
  session,
  checkoutTime,
  duration,
  receiptId,
  onDone,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="pt-6"
    >
      {/* Success Animation */}
      <div className="text-center mb-8">
        <div className="relative w-28 h-28 mx-auto mb-6">
          {/* Outer rings */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.8, 1.5], opacity: [0, 0.3, 0] }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-emerald-500 rounded-full"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1.3], opacity: [0, 0.2, 0] }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="absolute inset-0 bg-emerald-400 rounded-full"
          />

          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
            className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.6 }}
            >
              <CheckCircle className="w-14 h-14 text-white" />
            </motion.div>
          </motion.div>

          {/* Confetti particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{
                x: Math.cos((i * Math.PI * 2) / 8) * 80,
                y: Math.sin((i * Math.PI * 2) / 8) * 80,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{ duration: 1.2, delay: 0.5 + i * 0.05 }}
              className={`absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full ${
                [
                  'bg-emerald-400',
                  'bg-teal-400',
                  'bg-green-400',
                  'bg-cyan-400',
                  'bg-emerald-300',
                  'bg-yellow-400',
                  'bg-teal-300',
                  'bg-lime-400',
                ][i]
              }`}
            />
          ))}
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-2xl font-black text-gray-900"
        >
          Checked Out Successfully!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-500 mt-1"
        >
          Thank you for visiting, {session.visitorName.split(' ')[0]}!
        </motion.p>
      </div>

      {/* Receipt Card */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            {/* Receipt header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-5 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/5 rounded-full" />
              <div className="flex items-center justify-between relative">
                <div className="flex items-center space-x-3">
                  <Receipt className="w-5 h-5 text-emerald-200" />
                  <span className="text-white font-bold">
                    Checkout Receipt
                  </span>
                </div>
                <span className="text-emerald-100 text-xs font-mono">
                  {receiptId}
                </span>
              </div>
            </div>

            {/* Receipt body */}
            <div className="p-8 space-y-4">
              {/* Visitor info row */}
              <div className="flex items-center space-x-4 pb-4 border-b border-dashed border-gray-200">
                <img
                  src={session.photoUrl}
                  alt={session.visitorName}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <p className="font-bold text-gray-900">
                    {session.visitorName}
                  </p>
                  <p className="text-xs text-gray-500">{session.company}</p>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-mono font-bold text-gray-600">
                    {session.badgeNumber}
                  </span>
                </div>
              </div>

              {/* Time details */}
              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-500">Check In</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {session.checkInTime}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <LogOut className="w-5 h-5 text-red-500" />
                  </div>
                  <p className="text-xs text-gray-500">Check Out</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {checkoutTime}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Timer className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-bold text-gray-900 text-sm">{duration}</p>
                </div>
              </div>

              {/* Visit details */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
                {[
                  { label: 'Host', value: session.hostName },
                  { label: 'Department', value: session.hostDepartment },
                  { label: 'Purpose', value: session.purpose },
                  { label: 'Building', value: `${session.building} · ${session.floor}` },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-800">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Badge deactivated notice */}
              <div className="flex items-center space-x-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-xs text-amber-800">
                  Your badge <strong>{session.badgeNumber}</strong> has been
                  deactivated. Please return it at the front desk.
                </p>
              </div>
            </div>

            {/* Receipt footer */}
            <div className="px-8 pb-6">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-semibold flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Download</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-semibold flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </motion.button>
              </div>
            </div>

            {/* Zigzag tear effect at bottom */}
            <div className="relative h-4 -mb-1">
              <svg
                className="absolute bottom-0 w-full"
                viewBox="0 0 400 16"
                preserveAspectRatio="none"
              >
                <path
                  d={`M0,0 ${Array.from(
                    { length: 40 },
                    (_, i) =>
                      `L${i * 10 + 5},${i % 2 === 0 ? 16 : 0} L${
                        (i + 1) * 10
                      },0`
                  ).join(' ')}`}
                  fill="white"
                  stroke="none"
                />
              </svg>
            </div>
          </div>

          {/* Come again message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 mb-4"
          >
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-full px-5 py-2">
              <Star className="w-4 h-4 text-emerald-500 fill-current" />
              <span className="text-sm font-medium text-emerald-700">
                We hope you had a great visit!
              </span>
            </div>
          </motion.div>

          {/* Done Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDone}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center space-x-2 mt-4 hover:bg-gray-800 transition-colors"
          >
            <span>Done</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CheckoutSuccess;
