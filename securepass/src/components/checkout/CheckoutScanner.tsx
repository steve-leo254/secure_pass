import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  QrCode,
  Camera,
  Keyboard,
  AlertTriangle,
  ArrowRight,
  Scan,
  Wifi,
} from 'lucide-react';

interface CheckoutScannerProps {
  onQRScanned: (token: string) => void;
  isLoading: boolean;
  errorMessage?: string;
}

const CheckoutScanner: React.FC<CheckoutScannerProps> = ({
  onQRScanned,
  isLoading,
  errorMessage,
}) => {
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [badgeId, setBadgeId] = useState('');

  const handleManualSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const code = manualCode.trim() || badgeId.trim();
      if (code) {
        onQRScanned(code);
      }
    },
    [manualCode, badgeId, onQRScanned]
  );

  // Simulate QR scan for demo
  const handleDemoScan = useCallback(() => {
    onQRScanned('demo-session-' + Date.now());
  }, [onQRScanned]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="pt-6"
    >
      {/* Error Alert */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start space-x-3"
        >
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-red-800 font-semibold text-sm">
              Verification Failed
            </p>
            <p className="text-red-600 text-sm mt-0.5">{errorMessage}</p>
          </div>
        </motion.div>
      )}

      {/* Main Scanner Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {/* Scanner Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-8 text-center relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />

          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <QrCode className="w-16 h-16 text-white mx-auto mb-4 drop-shadow-lg" />
          </motion.div>
          <h2 className="text-2xl font-black text-white">Ready to Check Out?</h2>
          <p className="text-emerald-100 mt-2 text-sm">
            Scan your checkout QR code to begin the process
          </p>
        </div>

        {/* Scanner Body */}
        <div className="p-8">
          {!showManualEntry ? (
            <>
              {/* QR Scanner Simulation */}
              <div className="relative bg-gray-950 rounded-2xl overflow-hidden mb-6 aspect-square max-w-[280px] mx-auto">
                {/* Camera viewfinder corners */}
                <div className="absolute inset-4 z-10">
                  {/* Top-left */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-emerald-400 rounded-tl-lg" />
                  {/* Top-right */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-emerald-400 rounded-tr-lg" />
                  {/* Bottom-left */}
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-emerald-400 rounded-bl-lg" />
                  {/* Bottom-right */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-emerald-400 rounded-br-lg" />
                </div>

                {/* Scanning line */}
                <motion.div
                  animate={{ y: [20, 240, 20] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute left-6 right-6 h-0.5 z-20"
                >
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                  <div className="w-full h-4 bg-gradient-to-b from-emerald-400/20 to-transparent" />
                </motion.div>

                {/* Camera icon and text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <Camera className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-gray-500 text-xs text-center px-8">
                    Position QR code within the frame
                  </p>
                </div>

                {/* Ambient dots */}
                <div className="absolute inset-0 opacity-10">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        opacity: [0.2, 0.8, 0.2],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                      className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                      style={{
                        top: `${10 + Math.random() * 80}%`,
                        left: `${10 + Math.random() * 80}%`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Status indicator */}
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3 py-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Scan className="w-5 h-5 text-emerald-500" />
                  </motion.div>
                  <span className="text-emerald-600 font-medium text-sm">
                    Processing QR code...
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 py-3">
                  <Wifi className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <span className="text-gray-500 text-sm">
                    Camera active — waiting for QR code
                  </span>
                </div>
              )}

              {/* Demo Scan Button (for testing) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDemoScan}
                disabled={isLoading}
                className="w-full mt-4 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Scan className="w-5 h-5" />
                <span>Simulate QR Scan</span>
              </motion.button>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="px-4 text-xs text-gray-400 font-medium uppercase tracking-wider">
                  or enter manually
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Manual entry toggle */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowManualEntry(true)}
                className="w-full py-3.5 border-2 border-dashed border-gray-200 hover:border-emerald-300 rounded-2xl text-gray-600 hover:text-emerald-600 font-medium flex items-center justify-center space-x-2 transition-all"
              >
                <Keyboard className="w-5 h-5" />
                <span>Enter Badge Number Manually</span>
              </motion.button>
            </>
          ) : (
            /* Manual Entry Form */
            <form onSubmit={handleManualSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Badge ID Input */}
                <div className="mb-4">
                  <label
                    htmlFor="badge-id"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Badge Number
                  </label>
                  <div className="relative">
                    <input
                      id="badge-id"
                      type="text"
                      value={badgeId}
                      onChange={(e) => setBadgeId(e.target.value.toUpperCase())}
                      placeholder="e.g., VIS-2847"
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-mono text-center tracking-widest transition-all"
                      autoFocus
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <span className="text-emerald-600 text-xs font-bold">
                          ID
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* OR separator */}
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="px-3 text-xs text-gray-400">OR</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Checkout Code Input */}
                <div>
                  <label
                    htmlFor="manual-code"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Checkout Code
                  </label>
                  <input
                    id="manual-code"
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter code from your badge"
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-mono text-center tracking-wider transition-all"
                  />
                </div>
              </motion.div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualEntry(false)}
                  className="flex-1 py-3.5 border-2 border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back to Scanner
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!badgeId.trim() && !manualCode.trim()}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg disabled:opacity-40 flex items-center justify-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Help text */}
      <p className="text-center text-xs text-gray-400 mt-6 px-8">
        Look for the checkout QR code at the lobby exit, or find the code printed on the back of your visitor badge.
      </p>
    </motion.div>
  );
};

export default CheckoutScanner;