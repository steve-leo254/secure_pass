import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  CheckCircle,
  Shield,
  Users,
  Scan,
} from 'lucide-react';

const HeroBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-emerald-600/8 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-teal-600/6 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">
                #1 Visitor Management Solution in East Africa
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight"
            >
              Intelligent{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Visitor Management
              </span>{' '}
              System
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-6 text-lg text-gray-400 leading-relaxed max-w-lg"
            >
              Automate visitor registration, enhance premises security, and
              deliver a world-class reception experience. From pre-registration
              to badge printing — all in one platform.
            </motion.p>

            {/* Key bullets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-8 space-y-3"
            >
              {[
                'Contactless QR code & biometric check-in',
                'Real-time visitor tracking & notifications',
                'Instant badge printing with photo capture',
                'Pre-registration portal for expected visitors',
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-base font-bold shadow-xl shadow-emerald-600/25 flex items-center space-x-2 transition-colors group"
              >
                <span>Register as Visitor</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  document
                    .getElementById('contact')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="px-8 py-4 bg-white/5 border border-white/15 text-white rounded-lg text-base font-semibold flex items-center space-x-3 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                </div>
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Right: Product visual */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="relative hidden lg:block"
          >
            {/* Main dashboard mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-emerald-500/10 rounded-3xl blur-2xl" />

              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50">
                {/* Browser bar */}
                <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2 border-b border-gray-200">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 font-mono ml-2">
                    securepass.co.ke/dashboard
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-6 bg-gray-50">
                  {/* Top stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Today\'s Visitors', value: '247', change: '+12%', color: 'text-emerald-600' },
                      { label: 'Checked In', value: '189', change: 'Active', color: 'text-blue-600' },
                      { label: 'Avg. Wait Time', value: '1.2m', change: '-23%', color: 'text-purple-600' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                      >
                        <p className="text-[10px] text-gray-500 uppercase font-semibold">
                          {stat.label}
                        </p>
                        <p className={`text-2xl font-black ${stat.color} mt-1`}>
                          {stat.value}
                        </p>
                        <p className="text-[10px] text-emerald-500 font-medium">
                          {stat.change}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Recent visitors list */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700 uppercase">
                        Recent Check-ins
                      </span>
                      <span className="text-[10px] text-emerald-500 font-semibold">
                        Live
                      </span>
                    </div>
                    {[
                      { name: 'Jane Cooper', time: '9:32 AM', badge: 'VIS-2847', status: 'In' },
                      { name: 'Michael Kamau', time: '9:28 AM', badge: 'VIS-2846', status: 'In' },
                      { name: 'Sarah Njeri', time: '9:15 AM', badge: 'VIS-2845', status: 'Out' },
                    ].map((v, i) => (
                      <div
                        key={i}
                        className="px-4 py-3 flex items-center justify-between border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-900">
                              {v.name}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {v.badge} · {v.time}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            v.status === 'In'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {v.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating card: Scan notification */}
              <motion.div
                initial={{ opacity: 0, x: 30, y: -20 }}
                animate={{ opacity: 1, x: 20, y: -15 }}
                transition={{ delay: 1.2, type: 'spring' }}
                className="absolute -top-6 -right-6 bg-white rounded-xl p-3 shadow-xl border border-gray-100 z-10"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Scan className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-900">
                      New Check-in
                    </p>
                    <p className="text-[9px] text-gray-500">
                      Badge VIS-2848 issued
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating card: Security alert */}
              <motion.div
                initial={{ opacity: 0, x: -30, y: 20 }}
                animate={{ opacity: 1, x: -15, y: 15 }}
                transition={{ delay: 1.5, type: 'spring' }}
                className="absolute -bottom-4 -left-6 bg-white rounded-xl p-3 shadow-xl border border-gray-100 z-10"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-900">
                      All Clear
                    </p>
                    <p className="text-[9px] text-gray-500">
                      0 security alerts today
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16">
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroBanner;