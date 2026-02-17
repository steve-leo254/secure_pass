import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, UserPlus, Users, FileText, Settings, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { visitors, activeVisitors, members } = useData();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (navOpen) document.body.classList.add('overflow-hidden');
    else document.body.classList.remove('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [navOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-xl font-semibold text-gray-900">
                SecurePass
              </Link>
              <nav className="hidden md:flex items-center gap-2">
                <button onClick={() => navigate('/register')} className="px-3 py-2 rounded hover:bg-slate-50 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">Register Visitor</span>
                </button>
                <button onClick={() => navigate('/member-register')} className="px-3 py-2 rounded hover:bg-slate-50 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-violet-600" />
                  <span className="text-sm">Register Member</span>
                </button>
                <button onClick={() => navigate('/active')} className="px-3 py-2 rounded hover:bg-slate-50 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Active Visitors</span>
                </button>
                <button onClick={() => navigate('/records')} className="px-3 py-2 rounded hover:bg-slate-50 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span className="text-sm">All Records</span>
                </button>
                <button onClick={() => navigate('/members')} className="px-3 py-2 rounded hover:bg-slate-50 flex items-center gap-2">
                  <Users className="w-4 h-4 text-pink-600" />
                  <span className="text-sm">Members</span>
                </button>
                <button onClick={() => navigate('/settings')} className="px-3 py-2 rounded hover:bg-slate-50 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-slate-600" />
                  <span className="text-sm">Settings</span>
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setNavOpen((s) => !s)}
                aria-label="Open navigation"
                className="md:hidden w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center"
              >
                <Shield className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
