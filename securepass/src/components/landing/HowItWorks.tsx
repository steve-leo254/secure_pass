import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { UserPlus, QrCode, ShieldCheck, BadgeCheck } from 'lucide-react';

const steps = [
  { num: '01', icon: UserPlus, title: 'Pre-Register', desc: 'Visitors receive a link to register online. They fill details, upload ID, and get a unique QR code.' },
  { num: '02', icon: QrCode, title: 'Scan & Check In', desc: 'On arrival, visitors scan their QR at the lobby kiosk. Photo is captured and badge prints automatically.' },
  { num: '03', icon: ShieldCheck, title: 'Verified & Notified', desc: 'Identity is verified against records. Host receives instant notification — visitor proceeds without waiting.' },
  { num: '04', icon: BadgeCheck, title: 'Check Out', desc: 'On leaving, visitor scans the exit QR. Badge deactivates, access revokes, and a full audit log is saved.' },
];

const HowItWorks: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Simple 4-Step Process
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            From registration to checkout — the entire visitor journey takes
            under 2 minutes.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-emerald-200 via-blue-200 to-emerald-200" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="relative z-10 w-20 h-20 mx-auto mb-6">
                  <div className="w-20 h-20 bg-white border-2 border-emerald-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <step.icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-md">
                    {step.num}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;