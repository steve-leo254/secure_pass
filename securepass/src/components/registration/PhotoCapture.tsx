import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RotateCcw, Check, User, Upload } from 'lucide-react';

interface PhotoCaptureProps {
  value: string;
  onChange: (photoUrl: string) => void;
  label?: string;
  circular?: boolean;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  value,
  onChange,
  label = 'Your Photo',
  circular = true,
}) => {
  const [isCapturing, setIsCapturing] = useState(false);

  // Simulate photo capture
  const handleCapture = useCallback(() => {
    setIsCapturing(true);
    setTimeout(() => {
      // Use a placeholder photo
      onChange(
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
      );
      setIsCapturing(false);
    }, 1500);
  }, [onChange]);

  const handleRemove = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm font-medium text-gray-700 mb-3">{label}</p>

      <div className="relative">
        <AnimatePresence mode="wait">
          {value ? (
            <motion.div
              key="photo"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative group"
            >
              <img
                src={value}
                alt="Captured"
                className={`w-32 h-32 object-cover ${
                  circular ? 'rounded-full' : 'rounded-2xl'
                } ring-4 ring-emerald-100 shadow-xl`}
              />
              <div
                className={`absolute inset-0 bg-black/40 ${
                  circular ? 'rounded-full' : 'rounded-2xl'
                } opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2`}
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCapture}
                  className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"
                >
                  <RotateCcw className="w-4 h-4 text-gray-700" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRemove}
                  className="w-10 h-10 bg-red-500/90 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-lg">×</span>
                </motion.button>
              </div>
              {/* Verified badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                <Check className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCapture}
                disabled={isCapturing}
                className={`w-32 h-32 ${
                  circular ? 'rounded-full' : 'rounded-2xl'
                } border-3 border-dashed border-gray-300 hover:border-emerald-400 bg-gray-50 hover:bg-emerald-50/50 flex flex-col items-center justify-center transition-all`}
              >
                {isCapturing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Camera className="w-8 h-8 text-emerald-500" />
                  </motion.div>
                ) : (
                  <>
                    <User className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-[10px] text-gray-500 font-medium">
                      Tap to capture
                    </span>
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!value && !isCapturing && (
        <button className="mt-3 flex items-center space-x-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium">
          <Upload className="w-3 h-3" />
          <span>Or upload a file</span>
        </button>
      )}
    </div>
  );
};

export default PhotoCapture;