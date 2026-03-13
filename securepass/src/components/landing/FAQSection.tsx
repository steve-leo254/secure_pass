import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  { q: 'How long does it take to set up SecurePass?', a: 'Most organizations are live within 24 hours. Cloud-only setups can be operational in under 30 minutes. Our team handles hardware configuration and staff training.' },
  { q: 'Is SecurePass compliant with data protection laws?', a: 'Yes. SecurePass complies with Kenya\'s Data Protection Act 2019, GDPR, and SOC 2. All data is encrypted at rest and in transit with 256-bit SSL.' },
  { q: 'What hardware do I need?', a: 'A basic setup only requires an iPad or Android tablet. For advanced features, we support thermal badge printers, facial recognition cameras, and turnstile integrations.' },
  { q: 'Can visitors pre-register before arriving?', a: 'Absolutely. Hosts send pre-registration links via email or SMS. Visitors fill details, upload ID, and receive a QR code for express check-in on arrival.' },
  { q: 'Does SecurePass work offline?', a: 'Yes. The kiosk app caches data locally and syncs when connectivity returns. Visitor check-ins are never interrupted by network issues.' },
  { q: 'Can I integrate with my existing access control system?', a: 'Yes. We integrate with HID, Lenel, Gallagher, and most modern access control systems via our REST API and native connectors.' },
  { q: 'Is there a free plan?', a: 'Yes. Our Starter plan is free for up to 50 visitors per month with essential features including QR check-in, email notifications, and basic analytics.' },
];

const FAQSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-3">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 divide-y divide-gray-100">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left group"
              >
                <span
                  className={`font-semibold pr-6 transition-colors ${
                    open === i ? 'text-emerald-600' : 'text-gray-900'
                  }`}
                >
                  {faq.q}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    open === i ? 'bg-emerald-100' : 'bg-gray-100'
                  }`}
                >
                  {open === i ? (
                    <Minus className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-gray-500" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;