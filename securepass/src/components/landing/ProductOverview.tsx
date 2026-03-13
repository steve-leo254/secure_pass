import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Zap, Eye, Smartphone } from 'lucide-react';

const pillars = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    desc: 'Multi-layered security with biometric verification, watchlist screening, and real-time threat detection.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Average check-in time under 30 seconds. Pre-registered visitors breeze through in under 10.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Eye,
    title: 'Complete Visibility',
    desc: 'Know exactly who is in your building at all times with live dashboards, audit trails, and compliance reports.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    desc: 'Visitors pre-register on their phones. Hosts get instant arrival notifications. Admins manage remotely.',
    color: 'bg-amber-100 text-amber-600',
  },
];

const ProductOverview: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 lg:py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Why SecurePass
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
            The Complete Visitor Management Platform
          </h2>
          <p className="mt-5 text-gray-500 text-lg leading-relaxed">
            SecurePass replaces paper logbooks with a modern, digital solution
            that enhances security, streamlines operations, and impresses every
            visitor who walks through your doors.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
            >
              <div className="bg-white border border-gray-100 rounded-2xl p-7 h-full hover:shadow-xl hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 group">
                <div
                  className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductOverview;