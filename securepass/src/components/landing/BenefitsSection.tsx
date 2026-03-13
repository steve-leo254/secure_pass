import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  TrendingUp,
  ShieldCheck,
  Clock,
  Smile,
  Leaf,
  DollarSign,
} from 'lucide-react';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Enhanced Security',
    desc: 'Know exactly who is in your building at all times. Screen visitors against watchlists and maintain complete audit trails.',
    stat: '85%',
    statLabel: 'reduction in security incidents',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Clock,
    title: 'Time Savings',
    desc: 'Eliminate manual logbooks and reduce front desk workload by automating the entire check-in and check-out process.',
    stat: '70%',
    statLabel: 'less time on visitor processing',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Smile,
    title: 'Better Visitor Experience',
    desc: 'Create a modern, professional first impression with fast check-ins, digital badges, and pre-registration capabilities.',
    stat: '4.9★',
    statLabel: 'average visitor satisfaction',
    color: 'from-purple-500 to-pink-600',
  },
  {
    icon: TrendingUp,
    title: 'Operational Efficiency',
    desc: 'Gain data-driven insights into visitor patterns, peak hours, and resource utilization across all your locations.',
    stat: '3x',
    statLabel: 'faster visitor throughput',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Leaf,
    title: 'Go Paperless',
    desc: 'Eliminate paper visitor logs, printed forms, and manual records. Go fully digital and reduce your environmental footprint.',
    stat: '100%',
    statLabel: 'paperless operations',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: DollarSign,
    title: 'Cost Reduction',
    desc: 'Reduce staffing needs at reception, eliminate paper costs, and minimize security risks that lead to costly incidents.',
    stat: '40%',
    statLabel: 'reduction in operational costs',
    color: 'from-rose-500 to-red-600',
  },
];

const BenefitsSection: React.FC = () => {
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
            Benefits
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Why Organizations Choose SecurePass
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Measurable improvements in security, efficiency, and visitor
            satisfaction from day one.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="group bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-xl hover:border-gray-200 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${b.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <b.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-900">{b.stat}</p>
                  <p className="text-[10px] text-gray-400 font-medium max-w-[100px]">
                    {b.statLabel}
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {b.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;