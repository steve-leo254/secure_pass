import React from 'react';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  const columns = {
    Solutions: ['Visitor Management', 'Access Control', 'Badge Printing', 'Pre-Registration', 'Analytics'],
    Company: ['About Us', 'Careers', 'Blog', 'Press', 'Partners'],
    Resources: ['Documentation', 'API Reference', 'Help Center', 'Case Studies', 'Webinars'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Data Processing', 'Security'],
  };

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-5">
              <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black text-white">
                Secure<span className="text-emerald-500">Pass</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-xs">
              Modern visitor management for the modern workplace. Secure,
              seamless, and smart.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <Mail className="w-3.5 h-3.5 text-gray-600" />
                <span>info@securepass.co.ke</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Phone className="w-3.5 h-3.5 text-gray-600" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <MapPin className="w-3.5 h-3.5 text-gray-600" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(columns).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {year} SecurePass. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            {['Twitter', 'LinkedIn', 'GitHub'].map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;