import React, { useState, useEffect, useRef } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import { SAMPLE_AUDIT_LOGS } from '../data/initialData';

import { SAMPLE_VISITORS } from '../data/initialData';

import type { DashboardStats, AuditLog } from '../types';

import UsageCounter from './UsageCounter';

import {

  Users,

  Settings,

  LogOut,

  Menu,

  X,

  Shield,

  ChevronRight,

  Bell,

  Search,

  ChevronDown,

  BarChart3,

  Clock,

  Home,

  PanelLeftClose,

  PanelLeft,

  ArrowUpRight,

  ArrowDownRight,

  User,

  Activity,

  CreditCard,

  Package,

  Building2,

} from 'lucide-react';

import { format } from 'date-fns';



interface LayoutProps {

  children: React.ReactNode;

}



const Layout: React.FC<LayoutProps> = ({ children }) => {

  const { user, logout, isAdmin, userRole } = useAuth();

  const location = useLocation();

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [notifOpen, setNotifOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [stats, setStats] = useState<DashboardStats>({

    totalToday: 0,

    currentlyIn: 0,

    checkedOut: 0,

    contractors: 0,

    visitors: 0,

    deliveries: 0,

    staff: 0,

    technicians: 0,

  });

  const [recentActivity, setRecentActivity] = useState<AuditLog[]>([]);

  const notifRef = useRef<HTMLDivElement>(null);

  const profileRef = useRef<HTMLDivElement>(null);



  useEffect(() => {

    const handleClick = (e: MouseEvent) => {

      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {

        setNotifOpen(false);

      }

      if (

        profileRef.current &&

        !profileRef.current.contains(e.target as Node)

      ) {

        setProfileOpen(false);

      }

    };

    document.addEventListener('mousedown', handleClick);

    return () => document.removeEventListener('mousedown', handleClick);

  }, []);



  useEffect(() => {

    // Calculate stats from sample visitors

    const today = new Date();

    const todayVisitors = SAMPLE_VISITORS.filter(visitor => {

      const visitorDate = new Date(visitor.timeIn);

      return visitorDate.toDateString() === today.toDateString();

    });

    const checkedIn = todayVisitors.filter(v => v.status === 'checked-in');

    const checkedOut = todayVisitors.filter(v => v.status === 'checked-out');

    

    const newStats: DashboardStats = {

      totalToday: todayVisitors.length,

      currentlyIn: checkedIn.length,

      checkedOut: checkedOut.length,

      contractors: checkedIn.filter(v => v.category === 'contractor').length,

      visitors: checkedIn.filter(v => v.category === 'visitor').length,

      deliveries: checkedIn.filter(v => v.category === 'delivery').length,

      staff: checkedIn.filter(v => v.category === 'staff').length,

      technicians: checkedIn.filter(v => v.category === 'technician').length,

    };

    

    setStats(newStats);

    setRecentActivity(SAMPLE_AUDIT_LOGS.slice(0, 5)); // Show last 5 activities

  }, []);



  const handleLogout = () => {

    logout();

    navigate('/login');

  };



  const mainNav = [];



const systemAdminTabsNav = [

    {

      path: '/system-admin',

      label: 'Overview',

      icon: Activity,

      badge: null,

    },

    {

      path: '/system-admin/users',

      label: 'Users',

      icon: Users,

      badge: null,

    },

    {

      path: '/system-admin/subscriptions',

      label: 'Subscriptions',

      icon: CreditCard,

      badge: null,

    },

    {

      path: '/system-admin/packages',

      label: 'Packages',

      icon: Package,

      badge: null,

    },

    {

      path: '/system-admin/property-managers',

      label: 'Property Managers',

      icon: Building2,

      badge: null,

    },

    {

      path: '/system-admin/reminders',

      label: 'Reminders',

      icon: Bell,

      badge: null,

    },

  ];



const propertyManagerNav = [

    { path: '/records', label: 'All Records', icon: Users, badge: null },

    { path: '/management', label: 'Management', icon: Settings, badge: null },

    {

      path: '/analytics',

      label: 'Analytics',

      icon: BarChart3,

      badge: null,

    },

  ];



  const adminNav = userRole === 'system_admin'

    ? systemAdminTabsNav

    : userRole === 'property_manager'

    ? propertyManagerNav

    : [];



  const utilityNav = [

    { path: '/profile', label: 'My Profile', icon: User, badge: null },

  ];



  const isActive = (path: string) => location.pathname === path;



  const allNav = [...mainNav, ...adminNav, ...utilityNav];

  const currentPage =

    allNav.find((n) => isActive(n.path))?.label || 'Active Visitors';



  const breadcrumbs = [

    { label: 'Home', path: '/active' },

    ...(location.pathname !== '/active'

      ? [{ label: currentPage, path: location.pathname }]

      : []),

  ];



  const getActionColor = (action: string) => {

    switch (action) {

      case 'CHECK_IN':

        return 'bg-emerald-500';

      case 'CHECK_OUT':

        return 'bg-amber-500';

      case 'DELETE':

        return 'bg-red-500';

      case 'UPDATE':

        return 'bg-blue-500';

      default:

        return 'bg-slate-400';

    }

  };



  const getActionIcon = (action: string) => {

    switch (action) {

      case 'CHECK_IN':

        return <ArrowDownRight className="w-3 h-3" />;

      case 'CHECK_OUT':

        return <ArrowUpRight className="w-3 h-3" />;

      default:

        return <Clock className="w-3 h-3" />;

    }

  };



  const renderNavItem = (

    item: (typeof mainNav)[0],

    collapsed: boolean

  ) => {

    const Icon = item.icon;

    const active = isActive(item.path);



    return (

      <Link

        key={item.path}

        to={item.path}

        onClick={() => setSidebarOpen(false)}

        title={collapsed ? item.label : undefined}

        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group

          ${

            active

              ? 'bg-linear-to-r from-emerald-500/15 to-green-500/10 text-emerald-700 dark:text-white shadow-sm border border-emerald-100/50'

              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'

          }

          ${collapsed ? 'justify-center px-2' : ''}`}

      >

        <div

          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200

            ${

              active

                ? 'bg-linear-to-br from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/25'

                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'

            }`}

        >

          <Icon className="w-4 h-4" />

        </div>

        {!collapsed && (

          <>

            <span className="flex-1 truncate">{item.label}</span>

            {item.badge && (

              <span className="min-w-[20px] h-5 px-1.5 bg-emerald-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">

                {item.badge}

              </span>

            )}

            {active && <ChevronRight className="w-4 h-4 text-emerald-400" />}

          </>

        )}

        {collapsed && item.badge && (

          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">

            {item.badge}

          </span>

        )}

      </Link>

    );

  };



  return (

    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/20 flex">

      {/* Mobile overlay */}

      {sidebarOpen && (

        <div

          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"

          onClick={() => setSidebarOpen(false)}

        />

      )}



      {/* Sidebar */}

      <aside

        className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-all duration-300 ease-out

          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0

          ${sidebarCollapsed ? 'w-18' : 'w-65'}`}

      >

        <div className="h-full flex flex-col bg-white border-r border-slate-200/80 shadow-sm">

          {/* Logo */}

          <div

            className={`flex items-center border-b border-slate-100 h-16 shrink-0 ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'}`}

          >

            <div className="flex items-center gap-2.5">

              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">

                <Shield className="w-4.5 text-white" />

              </div>

              {!sidebarCollapsed && (

                <div className="overflow-hidden">

                  <h1 className="text-[15px] font-extrabold text-slate-800 tracking-tight leading-none">

                    SECUREPASS

                  </h1>

                  <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] leading-none mt-0.5">

                    Access Management

                  </p>

                </div>

              )}

            </div>

            {!sidebarCollapsed && (

              <button

                onClick={() => setSidebarOpen(false)}

                className="lg:hidden text-slate-400 hover:text-slate-600 transition-colors"

              >

                <X className="w-5 h-5" />

              </button>

            )}

          </div>



          {/* Quick Stats - only when expanded */}

          {!sidebarCollapsed && (

            <div className="px-4 py-3 border-b border-slate-100">

              <div className="grid grid-cols-3 gap-2">

                <div className="text-center p-2 rounded-lg bg-emerald-50">

                  <p className="text-lg font-black text-emerald-700 leading-none">

                    {stats.currentlyIn}

                  </p>

                  <p className="text-[9px] text-emerald-500 mt-0.5 font-semibold">

                    IN

                  </p>

                </div>

                <div className="text-center p-2 rounded-lg bg-amber-50">

                  <p className="text-lg font-black text-amber-700 leading-none">

                    {stats.checkedOut}

                  </p>

                  <p className="text-[9px] text-amber-500 mt-0.5 font-semibold">

                    OUT

                  </p>

                </div>

                <div className="text-center p-2 rounded-lg bg-blue-50">

                  <p className="text-lg font-black text-blue-700 leading-none">

                    {stats.totalToday}

                  </p>

                  <p className="text-[9px] text-blue-500 mt-0.5 font-semibold">

                    TODAY

                  </p>

                </div>

              </div>

            </div>

          )}



          {/* Navigation */}

          <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-6">

            {/* Main */}

            <div>

              {!sidebarCollapsed && (

                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold px-3 mb-2">

                  Main

                </p>

              )}

              <div className="space-y-0.5">

                {mainNav.map((item) =>

                  renderNavItem(item, sidebarCollapsed)

                )}

              </div>

            </div>



            {/* Admin */}

            {adminNav.length > 0 && (

              <div>

                {!sidebarCollapsed && (

                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold px-3 mb-2">

                    {userRole === 'system_admin' ? 'System Administration' : 'Property Management'}

                  </p>

                )}

                <div className="space-y-0.5">

                  {adminNav.map((item) =>

                    renderNavItem(item, sidebarCollapsed)

                  )}

                </div>

              </div>

            )}



            {/* Utility */}

            <div>

              {!sidebarCollapsed && (

                <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold px-3 mb-2">

                  Utility

                </p>

              )}

              <div className="space-y-0.5">

                {utilityNav.map((item) =>

                  renderNavItem(item, sidebarCollapsed)

                )}

              </div>

            </div>



            {/* Usage Counter - Property Manager Only (not for system admin) */}

            {isAdmin && user?.role !== 'system_admin' && !sidebarCollapsed && (

              <div className="px-3">

                <UsageCounter />

              </div>

            )}

          </nav>



          {/* Collapse toggle (desktop only) */}

          <div className="hidden lg:flex border-t border-slate-100 p-3">

            <button

              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}

              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all ${sidebarCollapsed ? 'justify-center' : ''}`}

            >

              {sidebarCollapsed ? (

                <PanelLeft className="w-4 h-4" />

              ) : (

                <>

                  <PanelLeftClose className="w-4 h-4" />

                  <span>Collapse</span>

                </>

              )}

            </button>

          </div>



          {/* User profile */}

          <div

            className={`border-t border-slate-100 p-3 shrink-0 ${sidebarCollapsed ? 'flex justify-center' : ''}`}

          >

            {sidebarCollapsed ? (

              <button

                onClick={handleLogout}

                className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-md"

                title={user?.name}

              >

                {user?.name?.charAt(0) || 'U'}

              </button>

            ) : (

              <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">

                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">

                  {user?.name?.charAt(0) || 'U'}

                </div>

                <div className="flex-1 min-w-0">

                  <p className="text-sm font-semibold text-slate-700 truncate">

                    {user?.name}

                  </p>

                  <p className="text-[11px] text-slate-400 capitalize">

                    {user?.role}

                  </p>

                </div>

                <button

                  onClick={handleLogout}

                  className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-300 hover:text-red-500 transition-all"

                  title="Logout"

                >

                  <LogOut className="w-3.5 h-3.5" />

                </button>

              </div>

            )}

          </div>

        </div>

      </aside>



      {/* Main Content */}

      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* Header */}

        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 h-16 shrink-0">

          <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">

            {/* Left side */}

            <div className="flex items-center gap-3 min-w-0">

              <button

                onClick={() => setSidebarOpen(true)}

                className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0"

              >

                <Menu className="w-4.5 text-slate-600" />

              </button>



              {/* Breadcrumbs */}

              <nav className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">

                {breadcrumbs.map((crumb, i) => (

                  <React.Fragment key={crumb.path}>

                    {i > 0 && (

                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

                    )}

                    <Link

                      to={crumb.path}

                      className={`truncate ${

                        i === breadcrumbs.length - 1

                          ? 'font-semibold text-slate-800'

                          : 'text-slate-400 hover:text-slate-600'

                      }`}

                    >

                      {i === 0 ? (

                        <Home className="w-3.5 h-3.5" />

                      ) : (

                        crumb.label

                      )}

                    </Link>

                  </React.Fragment>

                ))}

              </nav>



              {/* Mobile page title */}

              <h2 className="sm:hidden text-base font-bold text-slate-800 truncate">

                {currentPage}

              </h2>

            </div>



            {/* Right side */}

            <div className="flex items-center gap-2">

              {/* Search */}

              <div className="relative hidden md:block">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input

                  type="text"

                  value={searchQuery}

                  onChange={(e) => setSearchQuery(e.target.value)}

                  placeholder="Search..."

                  className="w-48 lg:w-56 pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/10 focus:w-72 transition-all duration-300"

                />

              </div>



              <button

                className="md:hidden w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors"

                onClick={() => setSearchOpen(!searchOpen)}

              >

                <Search className="w-4 h-4 text-slate-500" />

              </button>



              {/* Notifications */}

              <div className="relative" ref={notifRef}>

                <button

                  onClick={() => {

                    setNotifOpen(!notifOpen);

                    setProfileOpen(false);

                  }}

                  className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors relative"

                >

                  <Bell className="w-4 h-4 text-slate-500" />

                  {recentActivity.length > 0 && (

                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>

                  )}

                </button>



                {/* Notifications dropdown */}

                {notifOpen && (

                  <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-scale-in z-50">

                    <div className="p-4 border-b border-slate-100">

                      <div className="flex items-center justify-between">

                        <h4 className="font-bold text-slate-800 text-sm">

                          Activity Feed

                        </h4>

                        <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md font-medium">

                          {recentActivity.length} recent

                        </span>

                      </div>

                    </div>

                    <div className="max-h-72 overflow-y-auto">

                      {recentActivity.length === 0 ? (

                        <div className="p-6 text-center">

                          <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />

                          <p className="text-sm text-slate-400">

                            No recent activity

                          </p>

                        </div>

                      ) : (

                        recentActivity.map((log) => (

                          <div

                            key={log.id}

                            className="flex items-start gap-3 p-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"

                          >

                            <div

                              className={`w-7 h-7 rounded-lg ${getActionColor(log.action)} bg-opacity-10 flex items-center justify-center shrink-0 mt-0.5`}

                            >

                              <span

                                className={`${getActionColor(log.action).replace('bg-', 'text-')}`}

                              >

                                {getActionIcon(log.action)}

                              </span>

                            </div>

                            <div className="flex-1 min-w-0">

                              <p className="text-xs font-medium text-slate-700 truncate">

                                {log.details}

                              </p>

                              <p className="text-[11px] text-slate-400 mt-0.5">

                                {format(

                                  new Date(log.timestamp),

                                  'HH:mm · MMM d'

                                )}

                              </p>

                            </div>

                          </div>

                        ))

                      )}

                    </div>

                    {recentActivity.length > 0 && (

                      <div className="p-3 border-t border-slate-100">

                        <div className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center justify-center gap-1">

                          View all activity{' '}

                          <ArrowUpRight className="w-3 h-3" />

                        </div>

                      </div>

                    )}

                  </div>

                )}

              </div>



              {/* Profile */}

              <div className="relative" ref={profileRef}>

                <button

                  onClick={() => {

                    setProfileOpen(!profileOpen);

                    setNotifOpen(false);

                  }}

                  className="flex items-center gap-2 py-1.5 pl-1.5 pr-3 rounded-xl hover:bg-slate-50 transition-colors"

                >

                  <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm shrink-0">

                    {user?.avatar ? (

                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />

                    ) : (

                      <div className="w-full h-full bg-linear-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-xs">

                        {user?.name?.charAt(0) || 'U'}

                      </div>

                    )}

                  </div>

                  <div className="hidden sm:block text-left">

                    <p className="text-xs font-semibold text-slate-700 leading-none">

                      {user?.name}

                    </p>

                    <p className="text-[10px] text-slate-400 capitalize leading-none mt-0.5">

                      {user?.role}

                    </p>

                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />

                </button>



                {profileOpen && (

                  <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-scale-in z-50">

                    <div className="p-4 border-b border-slate-100">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-md">

                          {user?.name?.charAt(0) || 'U'}

                        </div>

                        <div>

                          <p className="text-sm font-bold text-slate-800">

                            {user?.name}

                          </p>

                          <p className="text-xs text-slate-400">

                            {user?.username}@securepass.com

                          </p>

                        </div>

                      </div>

                    </div>

                    <div className="p-2">

                      <Link

                        to="/profile"

                        onClick={() => setProfileOpen(false)}

                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"

                      >

                        <User className="w-4 h-4" />

                        Profile

                      </Link>

                    </div>

                    <div className="p-2 border-t border-slate-100">

                      <button

                        onClick={handleLogout}

                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full"

                      >

                        <LogOut className="w-4 h-4" />

                        Sign out

                      </button>

                    </div>

                  </div>

                )}

              </div>

            </div>

          </div>



          {/* Mobile search bar */}

          {searchOpen && (

            <div className="md:hidden px-4 py-2 border-t border-slate-100 bg-white animate-fade-in">

              <div className="relative">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input

                  type="text"

                  placeholder="Search..."

                  autoFocus

                  className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"

                />

                <button

                  onClick={() => setSearchOpen(false)}

                  className="absolute right-3 top-1/2 -translate-y-1/2"

                >

                  <X className="w-4 h-4 text-slate-400" />

                </button>

              </div>

            </div>

          )}

        </header>



        {/* Page Content */}

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">{children}</main>



        {/* Footer */}

        <footer className="border-t border-slate-100 bg-white/50 backdrop-blur-sm px-4 lg:px-6 py-3">

          <div className="flex items-center justify-between text-[11px] text-slate-400">

            <p>

              © {new Date().getFullYear()} SECUREPASS. All rights reserved.

            </p>

            <div className="flex items-center gap-3">

              <span className="flex items-center gap-1">

                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>

                System Online

              </span>

              <span>v1.0.0</span>

            </div>

          </div>

        </footer>

      </div>

    </div>

  );

};



export default Layout;

