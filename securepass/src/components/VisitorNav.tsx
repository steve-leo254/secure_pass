import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserPlus, LogOut, Shield } from 'lucide-react';

const VisitorNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: '/visitor-register',
      label: 'Visitor Register',
      icon: UserPlus,
    },
    {
      path: '/visitor-checkout',
      label: 'Visitor Checkout', 
      icon: LogOut,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200/60 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-800 tracking-tight leading-none">
                SECUREPASS
              </h1>
              <p className="text-[8px] text-slate-400 uppercase tracking-[0.15em] leading-none mt-0.5">
                Visitor Portal
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${active
                      ? 'bg-gradient-to-r from-rose-500/15 to-orange-500/10 text-rose-700 border border-rose-100/50'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default VisitorNav;
