import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  QrCode,
  Fingerprint,
  Bell,
  Printer,
  BarChart3,
  Clock,
  Globe,
  ShieldCheck,
  UserPlus,
  Camera,
  Wifi,
  FileText,
} from 'lucide-react';

const features = [
  { icon: QrCode, title: 'QR Code Check-in', desc: 'Contactless entry with unique QR codes for every visitor.' },
  { icon: Fingerprint, title: 'Biometric Verification', desc: 'Facial recognition and fingerprint scanning for secure access.' },
  { icon: UserPlus, title: 'Pre-Registration', desc: 'Visitors register online before arrival for express check-in.' },
  { icon: Printer, title: 'Badge Printing', desc: 'Auto-print visitor badges with photos and access zones.' },
  { icon: Bell, title: 'Host Notifications', desc: 'Instant SMS, email, and app alerts when visitors arrive.' },
  { icon: Camera, title: 'Photo Capture', desc: 'Automatic visitor photo for badge and security records.' },
  { icon: BarChart3, title: 'Analytics & Reports', desc: 'Track visitor patterns, peak hours, and generate compliance reports.' },
  { icon: ShieldCheck, title: 'Watchlist Screening', desc: 'Screen visitors against custom watchlists and blocklists.' },
  { icon: Clock, title: 'Time Tracking', desc: 'Automatic check-in/out timestamps with visit duration logs.' },
  { icon: Globe, title: 'Multi-Location', desc: 'Manage all buildings and branches from one centralized dashboard.' },
  { icon: Wifi, title: 'Guest WiFi', desc: 'Automatically provide WiFi credentials upon successful check-in.' },
  { icon: FileText, title: 'NDA & Compliance', desc: 'Digital NDA signing and document collection during registration.' },
];

const KeyFeatures: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" className="py-20 lg:py-28 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Everything You Need to Manage Visitors
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Comprehensive tools for every aspect of the visitor journey — from
            first contact to final checkout.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:border-emerald-100 hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                <f.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5 text-sm">
                {f.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;