import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  { name: 'Safaricom', abbr: 'S' },
  { name: 'KCB Bank', abbr: 'KCB' },
  { name: 'Equity Bank', abbr: 'EQ' },
  { name: 'KPMG', abbr: 'KPMG' },
  { name: 'Deloitte', abbr: 'DT' },
  { name: 'UN Habitat', abbr: 'UN' },
  { name: 'ICEA Lion', abbr: 'IL' },
  { name: 'Britam', abbr: 'BT' },
];

const TrustedBy: React.FC = () => (
  <section className="py-12 bg-white border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-[0.2em] mb-8">
        Trusted by leading organizations across East Africa
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-14">
        {logos.map((logo, i) => (
          <motion.div
            key={logo.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center space-x-2 opacity-40 hover:opacity-70 transition-opacity cursor-default"
          >
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-[10px] font-black text-gray-500">
                {logo.abbr}
              </span>
            </div>
            <span className="text-sm font-bold text-gray-400 hidden sm:block">
              {logo.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustedBy;