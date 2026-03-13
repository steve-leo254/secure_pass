import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const ContactSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => setSubmitted(true), 1000);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
          >
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Contact Us
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Ready to upgrade your visitor management? Our team is here to help
              you find the perfect solution for your organization.
            </p>

            <div className="space-y-5">
              {[
                { icon: Mail, label: 'Email', value: 'info@securepass.co.ke', href: 'mailto:info@securepass.co.ke' },
                { icon: Phone, label: 'Phone', value: '+254 700 123 456', href: 'tel:+254700123456' },
                { icon: MapPin, label: 'Office', value: 'Westlands, Nairobi, Kenya', href: '#' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-start space-x-4 group"
                >
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                    <item.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-gray-900 font-medium group-hover:text-emerald-600 transition-colors">
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="mt-8 bg-gray-100 rounded-2xl h-48 flex items-center justify-center">
              <p className="text-gray-400 text-sm">📍 Map — Westlands, Nairobi</p>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-emerald-800 mb-2">
                  Message Sent!
                </h3>
                <p className="text-emerald-600">
                  We'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-100 space-y-5"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Request a Demo
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-400 focus:ring-0 outline-none text-sm"
                      placeholder="Jane"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-400 focus:ring-0 outline-none text-sm"
                      placeholder="Cooper"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-400 focus:ring-0 outline-none text-sm"
                    placeholder="jane@company.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    Company
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-400 focus:ring-0 outline-none text-sm"
                    placeholder="Your organization"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-400 focus:ring-0 outline-none text-sm"
                    placeholder="+254 700 000 000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-emerald-400 focus:ring-0 outline-none text-sm resize-none"
                    placeholder="Tell us about your visitor management needs..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </motion.button>

                <p className="text-[10px] text-gray-400 text-center">
                  By submitting, you agree to our Privacy Policy. We'll never
                  share your data.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;