import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTABanner: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="relative bg-gradient-to-br from-gray-900 via-emerald-950 to-teal-950 rounded-3xl px-8 py-14 lg:px-16 lg:py-20 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }} />

          <div className="relative text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
              Ready to Modernize Your Visitor Management?
            </h2>
            <p className="mt-5 text-gray-400 text-lg">
              Join 500+ organizations using SecurePass. Set up in minutes, see
              results from day one.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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
                className="px-8 py-4 bg-white/5 border border-white/15 text-white rounded-lg text-base font-semibold flex items-center space-x-2 hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Schedule a Call</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;