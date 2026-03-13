import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  QrCode,
  Clock,
  MapPin,
  Wifi,
  Copy,
  Download,
  User,
  Shield,
  Eye,
  Printer,
  Home,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type {
  VisitorFormData,
  RegistrationResult,
} from '../../services/useVisitorRegistration';

interface RegistrationSuccessProps {
  formData: VisitorFormData;
  result: RegistrationResult;
  onDone: () => void;
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  formData,
  result,
  onDone,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowDetails(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveBadge = () => {
    // Create a simple text version of the badge for download
    const badgeText = `
SECUREPASS VISITOR BADGE
========================
Badge Number: ${result.badgeNumber}
Name: ${formData.firstName} ${formData.lastName}
${formData.company ? `Company: ${formData.company}` : ''}
Host: ${formData.hostName}
Location: ${formData.hostFloor}
Check-in: ${result.checkInTime}
Access Zones: ${result.accessZones.join(', ')}
WiFi Network: ${result.wifiCredentials.network}
WiFi Password: ${result.wifiCredentials.password}
    `.trim();
    
    const blob = new Blob([badgeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-badge-${result.badgeNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleViewMap = () => {
    // Navigate to a map page or show map modal
    alert('Map feature coming soon! Please ask the front desk for directions.');
  };

  const handleDone = () => {
    navigate('/visitors');
  };

  // Generate QR pattern
  const qrPattern = useMemo(() => {
    const size = 21;
    const modules: boolean[][] = [];
    for (let r = 0; r < size; r++) {
      modules[r] = [];
      for (let c = 0; c < size; c++) {
        const isFinderTL = r < 7 && c < 7;
        const isFinderTR = r < 7 && c >= size - 7;
        const isFinderBL = r >= size - 7 && c < 7;
        if (isFinderTL || isFinderTR || isFinderBL) {
          const lr = r >= size - 7 ? r - (size - 7) : r;
          const lc = c >= size - 7 ? c - (size - 7) : c;
          modules[r][c] =
            lr === 0 || lr === 6 || lc === 0 || lc === 6 ||
            (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4);
        } else {
          modules[r][c] = Math.random() > 0.45;
        }
      }
    }
    return modules;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Success Animation */}
      <div className="text-center mb-8">
        <div className="relative w-28 h-28 mx-auto mb-6">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2, 1.6], opacity: [0, 0.3, 0] }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-emerald-500 rounded-full"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.6, 1.3], opacity: [0, 0.2, 0] }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="absolute inset-0 bg-emerald-400 rounded-full"
          />
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

          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{
                x: Math.cos((i * Math.PI * 2) / 10) * 90,
                y: Math.sin((i * Math.PI * 2) / 10) * 90,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{ duration: 1.4, delay: 0.5 + i * 0.04 }}
              className={`absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full ${
                [
                  'bg-emerald-400', 'bg-teal-400', 'bg-green-400',
                  'bg-cyan-400', 'bg-emerald-300', 'bg-yellow-400',
                  'bg-teal-300', 'bg-lime-400', 'bg-green-300', 'bg-emerald-200',
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
          Registration Complete! 🎉
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-500 mt-1"
        >
          Welcome, {formData.firstName}! You're all set.
        </motion.p>
      </div>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Digital Badge Card */}
          <div className="bg-gradient-to-br from-gray-900 via-emerald-950 to-teal-950 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />

            <div className="relative p-8">
              {/* Badge header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-300 text-sm font-bold uppercase tracking-wider">
                    Visitor Badge
                  </span>
                </div>
                <span className="text-white font-mono font-bold text-lg">
                  {result.badgeNumber}
                </span>
              </div>

              {/* Visitor info + QR */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  {formData.photoUrl ? (
                    <img
                      src={formData.photoUrl}
                      alt="Visitor"
                      className="w-20 h-20 rounded-xl object-cover ring-2 ring-emerald-500/30"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-emerald-900/50 flex items-center justify-center">
                      <User className="w-8 h-8 text-emerald-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-white font-bold text-xl">
                      {formData.firstName} {formData.lastName}
                    </h3>
                    {formData.company && (
                      <p className="text-gray-400 text-sm">{formData.company}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300 text-xs">
                        {formData.hostFloor} · Visiting {formData.hostName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300 text-xs">
                        Checked in: {result.checkInTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-white rounded-xl p-2 shadow-lg">
                  <svg
                    viewBox={`0 0 ${21 * 8 + 16} ${21 * 8 + 16}`}
                    className="w-24 h-24"
                  >
                    {qrPattern.map((row, r) =>
                      row.map((cell, c) =>
                        cell ? (
                          <rect
                            key={`${r}-${c}`}
                            x={c * 8 + 8}
                            y={r * 8 + 8}
                            width="8"
                            height="8"
                            rx="1.5"
                            fill="#064e3b"
                          />
                        ) : null
                      )
                    )}
                  </svg>
                </div>
              </div>

              {/* Access zones */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-[10px] text-gray-500 uppercase font-semibold mb-2 tracking-wider">
                  Access Zones
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.accessZones.map((zone) => (
                    <span
                      key={zone}
                      className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium"
                    >
                      {zone}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* WiFi Credentials */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Wifi className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Guest WiFi</h3>
                <p className="text-xs text-gray-500">
                  Connect to our guest network
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 relative group">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">
                  Network
                </p>
                <p className="text-sm font-mono font-bold text-gray-900 mt-0.5">
                  {result.wifiCredentials.network}
                </p>
                <button
                  onClick={() =>
                    handleCopy(result.wifiCredentials.network, 'network')
                  }
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedField === 'network' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 relative group">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">
                  Password
                </p>
                <p className="text-sm font-mono font-bold text-gray-900 mt-0.5">
                  {result.wifiCredentials.password}
                </p>
                <button
                  onClick={() =>
                    handleCopy(result.wifiCredentials.password, 'password')
                  }
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedField === 'password' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <h3 className="font-bold text-emerald-800 mb-3">
              📋 What's Next?
            </h3>
            <ol className="space-y-2">
              {[
                'Collect your printed badge from the front desk',
                `Proceed to ${formData.hostFloor} — ${formData.hostName} has been notified`,
                'Keep your badge visible at all times',
                'Scan the checkout QR code when leaving',
              ].map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <span className="w-6 h-6 bg-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-emerald-800">
                    {i + 1}
                  </span>
                  <span className="text-sm text-emerald-800">{step}</span>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSaveBadge}
              className="py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-600 flex flex-col items-center space-y-1 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span className="text-xs">Save Badge</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePrint}
              className="py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-600 flex flex-col items-center space-y-1 hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-5 h-5" />
              <span className="text-xs">Print</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleViewMap}
              className="py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-600 flex flex-col items-center space-y-1 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-5 h-5" />
              <span className="text-xs">View Map</span>
            </motion.button>
          </div>

          {/* Done Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDone}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg shadow-xl transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Visitor Portal</span>
          </motion.button>

          {/* Estimated wait */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Estimated wait time:{' '}
              <span className="font-bold text-emerald-600">
                {result.estimatedWait}
              </span>
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RegistrationSuccess;