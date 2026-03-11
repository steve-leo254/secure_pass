import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Shield,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false);
    setActiveDropdown(null);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const navLinks = [
    {
      label: 'Solutions',
      id: 'solutions',
      children: [
        { label: 'Visitor Management', id: 'features' },
        { label: 'Access Control', id: 'features' },
        { label: 'Badge Printing', id: 'features' },
        { label: 'Pre-Registration', id: 'features' },
      ],
    },
    { label: 'Features', id: 'features' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Industries', id: 'industries' },
    { label: 'Pricing', id: 'contact' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-emerald-900 text-white text-xs py-2 hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <a
              href="tel:+254700123456"
              className="flex items-center space-x-1 hover:text-emerald-300 transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>+254 700 123 456</span>
            </a>
            <a
              href="mailto:info@securepass.co.ke"
              className="flex items-center space-x-1 hover:text-emerald-300 transition-colors"
            >
              <Mail className="w-3 h-3" />
              <span>info@securepass.co.ke</span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span>System Online</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-lg shadow-black/5 border-b border-gray-100'
            : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-lg flex items-center justify-center shadow-md">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="text-xl font-black text-gray-900 tracking-tight block">
                  Secure<span className="text-emerald-600">Pass</span>
                </span>
                <span className="text-[9px] text-gray-500 font-medium uppercase tracking-[0.15em]">
                  Visitor Management
                </span>
              </div>
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <div
                  key={link.id}
                  className="relative"
                  onMouseEnter={() =>
                    link.children && setActiveDropdown(link.id)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => !link.children && scrollTo(link.id)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors flex items-center space-x-1 rounded-lg hover:bg-emerald-50"
                  >
                    <span>{link.label}</span>
                    {link.children && (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.children && activeDropdown === link.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[220px]"
                      >
                        {link.children.map((child) => (
                          <button
                            key={child.label}
                            onClick={() => scrollTo(child.id)}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center justify-between group"
                          >
                            <span>{child.label}</span>
                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center space-x-3">
              <button
                onClick={() => scrollTo('contact')}
                className="px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                Contact Us
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.children?.[0]?.id || link.id)}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg font-medium text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      scrollTo('contact');
                    }}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg font-semibold text-sm"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;