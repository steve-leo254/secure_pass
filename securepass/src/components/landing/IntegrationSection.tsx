import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Monitor, Smartphone, Tablet, ArrowRight } from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Admin Dashboard', icon: Monitor },
  { id: 'kiosk', label: 'Lobby Kiosk', icon: Tablet },
  { id: 'mobile', label: 'Mobile App', icon: Smartphone },
];

const screenshots: Record<string, { title: string; desc: string; features: string[] }> = {
  dashboard: {
    title: 'Powerful Admin Dashboard',
    desc: 'Full control over visitor operations, security alerts, analytics, and multi-location management from one centralized console.',
    features: ['Live visitor feed', 'Analytics & reports', 'Security alerts', 'User management'],
  },
  kiosk: {
    title: 'Self-Service Lobby Kiosk',
    desc: 'Visitors check in themselves using the touch-screen kiosk. QR scan, photo capture, and badge printing — all automated.',
    features: ['QR code scanner', 'Photo capture', 'Badge printing', 'Accessibility modes'],
  },
  mobile: {
    title: 'Mobile App for Hosts',
    desc: 'Hosts receive instant notifications, approve visitors remotely, and manage their visitor schedule on the go.',
    features: ['Push notifications', 'Visitor approval', 'Schedule management', 'Remote check-out'],
  },
};

const IntegrationSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const current = screenshots[activeTab];

  return (
    <section className="py-20 lg:py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Product
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            See SecurePass in Action
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-100 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-700 shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Screenshot mockup */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <div className="absolute -inset-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl blur-xl opacity-50" />
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-gray-800 px-4 py-2.5 flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 min-h-[350px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {React.createElement(
                      tabs.find((t) => t.id === activeTab)?.icon || Monitor,
                      { className: 'w-10 h-10 text-emerald-600' }
                    )}
                  </div>
                  <p className="text-gray-600 text-sm font-medium">
                    {current.title} Preview
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Interactive demo coming soon
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            key={`desc-${activeTab}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-2xl font-black text-gray-900 mb-4">
              {current.title}
            </h3>
            <p className="text-gray-500 leading-relaxed mb-6">
              {current.desc}
            </p>
            <ul className="space-y-3 mb-8">
              {current.features.map((f) => (
                <li key={f} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3.5 h-3.5 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">{f}</span>
                </li>
              ))}
            </ul>
            <button className="flex items-center space-x-2 text-emerald-600 font-semibold text-sm hover:text-emerald-700 group">
              <span>Learn more about {tabs.find((t) => t.id === activeTab)?.label}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;