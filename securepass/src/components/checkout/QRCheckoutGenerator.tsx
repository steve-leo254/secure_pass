import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, Copy, RefreshCw, Shield, ExternalLink } from 'lucide-react';

interface QRCheckoutGeneratorProps {
  baseUrl?: string;
}

/**
 * Admin-side component to generate and display checkout QR codes.
 * Place this at lobby exit points for visitors to scan.
 */
const QRCheckoutGenerator: React.FC<QRCheckoutGeneratorProps> = ({
  baseUrl = window.location.origin,
}) => {
  const checkoutUrl = useMemo(
    () => `${baseUrl}/checkout?token=lobby-exit-${Date.now().toString(36)}`,
    [baseUrl]
  );

  // Generate a simple QR code SVG pattern (in production use a QR library like `qrcode.react`)
  const qrPattern = useMemo(() => {
    const size = 21;
    const modules: boolean[][] = [];
    for (let r = 0; r < size; r++) {
      modules[r] = [];
      for (let c = 0; c < size; c++) {
        // Finder patterns in corners
        const isFinderTopLeft =
          r < 7 && c < 7;
        const isFinderTopRight =
          r < 7 && c >= size - 7;
        const isFinderBottomLeft =
          r >= size - 7 && c < 7;

        if (isFinderTopLeft || isFinderTopRight || isFinderBottomLeft) {
          const localR =
            r >= size - 7 ? r - (size - 7) : r;
          const localC =
            c >= size - 7 ? c - (size - 7) : c;
          modules[r][c] =
            localR === 0 ||
            localR === 6 ||
            localC === 0 ||
            localC === 6 ||
            (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4);
        } else {
          modules[r][c] = Math.random() > 0.5;
        }
      }
    }
    return modules;
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-center relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/5 rounded-full" />
        <QrCode className="w-8 h-8 text-white mx-auto mb-2" />
        <h3 className="text-white font-bold text-lg">Checkout QR Code</h3>
        <p className="text-emerald-100 text-sm">
          Display at exit points for visitor checkout
        </p>
      </div>

      {/* QR Code Display */}
      <div className="p-8">
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 mx-auto w-fit shadow-inner">
          <svg
            viewBox={`0 0 ${21 * 10 + 20} ${21 * 10 + 20}`}
            className="w-48 h-48"
          >
            {qrPattern.map((row, r) =>
              row.map((cell, c) =>
                cell ? (
                  <rect
                    key={`${r}-${c}`}
                    x={c * 10 + 10}
                    y={r * 10 + 10}
                    width="10"
                    height="10"
                    rx="2"
                    fill="#064e3b"
                  />
                ) : null
              )
            )}
          </svg>
        </div>

        {/* URL display */}
        <div className="mt-4 bg-gray-50 rounded-xl p-3 flex items-center space-x-2">
          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <p className="text-xs text-gray-500 font-mono truncate flex-1">
            {checkoutUrl}
          </p>
          <button className="text-emerald-600 hover:text-emerald-700">
            <Copy className="w-4 h-4" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-semibold flex items-center justify-center space-x-2 hover:bg-gray-50 text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-semibold flex items-center justify-center space-x-2 hover:bg-gray-50 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Regenerate</span>
          </motion.button>
        </div>

        {/* Security note */}
        <div className="mt-4 flex items-center space-x-2 text-xs text-gray-400">
          <Shield className="w-3.5 h-3.5" />
          <span>QR codes rotate every 24 hours for security</span>
        </div>
      </div>
    </div>
  );
};

export default QRCheckoutGenerator;