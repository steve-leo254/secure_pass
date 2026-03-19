import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  Clock,
  UserPlus,
  LogOut,
  FileText,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Globe,
  Heart,
  ExternalLink,
  ArrowUpRight,
  DoorOpen,
  QrCode,
  HelpCircle,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  CheckCircle2,
  Sparkles,
  Sun,
  Moon,
  Home,
  BookOpen,
  AlertCircle,
  Headphones,
  Send,
  Star,
  ChevronUp,
  Building2,
  Users,
  Fingerprint,
} from 'lucide-react';

interface VisitorLayoutProps {
  children?: React.ReactNode;
}

const VisitorLayout: React.FC<VisitorLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setShowContactForm(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 2500);
  };

  const navItems = [
    {
      path: '/visitor-register',
      label: 'Check In',
      icon: UserPlus,
      description: 'Register your visit',
      gradient: 'from-indigo-500 to-purple-600',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      path: '/smart-checkout',
      label: 'Check Out',
      icon: DoorOpen,
      description: 'Complete your visit',
      gradient: 'from-rose-500 to-orange-500',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      path: '/terms-and-conditions',
      label: 'Terms',
      icon: FileText,
      description: 'Terms & Conditions',
      gradient: 'from-slate-500 to-slate-700',
      color: 'text-slate-600',
      bg: 'bg-slate-50',
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const currentPage = navItems.find((n) => isActive(n.path));

  const quickLinks = [
    { label: 'Check In', path: '/visitor-register', icon: UserPlus },
    { label: 'Check Out', path: '/smart-checkout', icon: DoorOpen },
    { label: 'Terms & Conditions', path: '/terms-and-conditions', icon: FileText },
    // { label: 'Staff Login', path: '/', icon: ExternalLink },
  ];

  const features = [
    'Digital Visitor Registration',
    'QR Code Access',
    'Real-time Monitoring',
    'Tools & Equipment Tracking',
    'Role-based Access Control',
    'Secure Data Storage',
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/20 flex flex-col">
      {/* ============ HEADER ============ */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-2xl shadow-lg shadow-slate-200/20 border-b border-slate-200/50'
            : 'bg-white/60 backdrop-blur-xl border-b border-transparent'
        }`}
      >
        {/* Top Bar - only on desktop */}
        <div className="hidden lg:block bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700">
          <div className="max-w-6xl mx-auto px-6 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-4 text-[11px] text-indigo-200">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3" />
                +254 700 000 000
              </span>
              <span className="w-px h-3 bg-indigo-400/30" />
              <span className="flex items-center gap-1.5">
                <Mail className="w-3 h-3" />
                info@securepass.com
              </span>
              <span className="w-px h-3 bg-indigo-400/30" />
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                Nairobi, Kenya
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-indigo-200">
              <Link
                to="/login"
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                Staff Portal <ExternalLink className="w-3 h-3" />
              </Link>
              <span className="w-px h-3 bg-indigo-400/30" />
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                System Online
              </span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <Link
              to="/visitor-register"
              className="flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all group-hover:scale-105">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-extrabold text-slate-800 tracking-tight leading-none">
                  SECUREPASS
                </h1>
                <p className="text-[8px] text-slate-400 uppercase tracking-[0.2em] leading-none mt-0.5">
                  Visitor Portal
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      active
                        ? `${item.bg} ${item.color} shadow-sm`
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    {active && (
                      <span
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-linear-to-r ${item.gradient}`}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Live Clock */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-semibold tabular-nums">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>

              {/* Help Button */}
              <button
                onClick={() => setShowContactForm(true)}
                className="hidden sm:flex w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 items-center justify-center text-slate-400 hover:text-slate-600 transition-all border border-slate-100"
                title="Need Help?"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* CTA Button - Desktop */}
              <Link
                to={
                  location.pathname === '/smart-checkout'
                    ? '/visitor-register'
                    : '/smart-checkout'
                }
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg ${
                  location.pathname === '/smart-checkout'
                    ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/20 hover:shadow-indigo-500/30'
                    : 'bg-linear-to-r from-rose-500 to-orange-500 text-white shadow-rose-500/20 hover:shadow-rose-500/30'
                }`}
              >
                {location.pathname === '/smart-checkout' ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Check In
                  </>
                ) : (
                  <>
                    <DoorOpen className="w-4 h-4" />
                    Check Out
                  </>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors border border-slate-100"
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4 text-slate-600" />
                ) : (
                  <Menu className="w-4 h-4 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 animate-fade-in">
            <div className="max-w-6xl mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      active
                        ? `${item.bg} ${item.color}`
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-linear-to-br ${item.gradient} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-[11px] text-slate-400">
                        {item.description}
                      </p>
                    </div>
                    {active && (
                      <ChevronRight className="w-4 h-4 ml-auto text-slate-400" />
                    )}
                  </Link>
                );
              })}

              {/* Mobile extras */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowContactForm(true);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all w-full"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">Need Help?</p>
                    <p className="text-[11px] text-slate-400">
                      Contact support
                    </p>
                  </div>
                </button>

                <Link
                  to="/login"
                  className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Staff Portal</p>
                    <p className="text-[11px] text-slate-400">
                      Login for staff
                    </p>
                  </div>
                </Link>
              </div>

              {/* Mobile clock */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                <span className="font-mono font-semibold tabular-nums">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="mx-1">•</span>
                <span>
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ============ BREADCRUMB ============ */}
      {currentPage && location.pathname !== '/visitor-register' && (
        <div className="bg-white/50 border-b border-slate-100/50">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-2">
            <nav className="flex items-center gap-1.5 text-xs">
              <Link
                to="/visitor-register"
                className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
              >
                <Home className="w-3 h-3" />
                Home
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className={`font-semibold ${currentPage.color}`}>
                {currentPage.label}
              </span>
            </nav>
          </div>
        </div>
      )}

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1">
        {children || (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                Choose Your Access Type
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Staff can log in to manage visitors, while visitors can check in/out and manage their access.
              </p>
            </div>

            {/* Access Options */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Staff/Admin Access */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Staff Access</h3>
                    <p className="text-sm text-slate-500">For administrators and security</p>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">
                  Manage visitors, view records, generate reports, and control access to the premises.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Visitor registration & management</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Real-time visitor tracking</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Analytics & reporting</span>
                  </div>
                </div>

                

                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 font-medium mb-2">Demo Credentials:</p>
                </div>
              </div>

              {/* Visitor Access */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Visitor Access</h3>
                    <p className="text-sm text-slate-500">For guests and contractors</p>
                  </div>
                </div>

                <p className="text-slate-600 mb-6">
                  Check in/out, download visitor passes, manage your information, and access visitor services.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Quick check-in & check-out</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Digital visitor pass</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Download visitor information</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    to="/visitor-registration"
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
                  >
                    <DoorOpen className="w-5 h-5" />
                    Check In
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                  <p className="text-xs text-emerald-700 font-medium">
                    💡 No login required! Just click Check In or Check Out to get started.
                  </p>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-bold text-slate-800 mb-8">Key Features</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                    <Fingerprint className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Secure Access</h4>
                  <p className="text-sm text-slate-600">
                    Advanced security with role-based access control and visitor verification.
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">Smart Management</h4>
                  <p className="text-sm text-slate-600">
                    Efficient visitor flow management with digital passes and real-time tracking.
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-2">24/7 Availability</h4>
                  <p className="text-sm text-slate-600">
                    Round-the-clock access for visitors and staff with automated check-in/out.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ============ PRE-FOOTER CTA ============ */}
      {/* <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.04%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 lg:px-6 py-12 text-center">
          <Sparkles className="w-8 h-8 text-indigo-300 mx-auto mb-4" />
          <h2 className="text-2xl lg:text-3xl font-black text-white mb-3">
            Secure. Digital. Efficient.
          </h2>
          <p className="text-indigo-200 max-w-md mx-auto mb-6 text-sm">
            SECUREPASS replaces manual visitor logbooks with a secure,
            digital, and auditable system for your premises.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/visitor-register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-xl hover:bg-indigo-50 transition-all text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Register Your Visit
            </Link>
            <Link
              to="/smart-checkout"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm"
            >
              <DoorOpen className="w-4 h-4" />
              Check Out
            </Link>
          </div>
        </div>
      </section> */}

      {/* ============ FOOTER ============ */}
      <footer className="bg-slate-900 text-slate-300">
        {/* Main Footer */}
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white tracking-tight">
                    SECUREPASS
                  </h3>
                  <p className="text-[8px] text-slate-500 uppercase tracking-[0.2em]">
                    Access Management
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-xs">
                A web-based Visitor & Access Management System designed for
                residential and commercial properties. Secure, digital, and
                auditable.
              </p>
              <div className="flex gap-2">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-all"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors group"
                      >
                        <Icon className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Features</h4>
              <ul className="space-y-2.5">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-xs text-slate-400"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">
                Contact Us
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                  <span>
                    Property Management Office
                    <br />
                    Ground Floor, Main Entrance
                  </span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  +254 700 000 000
                </li>
                <li className="flex items-center gap-2.5 text-xs text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  info@securepass.com
                </li>
                <li className="flex items-center gap-2.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  24/7 Operations
                </li>
              </ul>
              <button
                onClick={() => setShowContactForm(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-semibold hover:bg-indigo-500/20 transition-all border border-indigo-500/20"
              >
                <MessageCircle className="w-3 h-3" />
                Send Message
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500 text-center sm:text-left">
              © {new Date().getFullYear()} SECUREPASS. All rights reserved.
              Built with{' '}
              <Heart className="w-3 h-3 inline text-red-500 mx-0.5" /> for
              security.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <Link
                to="/terms-and-conditions"
                className="hover:text-slate-300 transition-colors"
              >
                Terms & Conditions
              </Link>
              <span className="w-px h-3 bg-slate-700" />
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                System Online
              </span>
              <span className="w-px h-3 bg-slate-700" />
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ============ BACK TO TOP ============ */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-11 h-11 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center justify-center z-40 animate-scale-in hover:-translate-y-0.5 transition-all"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* ============ CONTACT MODAL ============ */}
      {showContactForm && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => !contactSent && setShowContactForm(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar for mobile */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>

            {contactSent ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bz-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Message Sent!
                </h3>
                <p className="text-sm text-slate-400">
                  We'll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          Contact Us
                        </h3>
                        <p className="text-xs text-slate-400">
                          We're here to help
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowContactForm(false)}
                      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                      Message
                    </label>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>

                {/* Quick contact */}
                <div className="px-6 pb-6">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-xs text-slate-400 mb-2 font-medium">
                      Or reach us directly:
                    </p>
                    <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        +254 700 000 000
                      </span>
                      <span className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        support@securepass.com
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorLayout;