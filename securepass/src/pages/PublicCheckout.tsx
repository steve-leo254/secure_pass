import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useVisitors } from '../context/VistorContext';
import { CATEGORIES } from '../types';
import type { Visitor } from '../types';
import {
  Shield,
  Search,
  LogOut,
  Clock,
  CheckCircle2,
  ArrowRight,
  User,
  Phone,
  CreditCard,
  Building2,
  Wrench,
  ChevronRight,
  AlertTriangle,
  PartyPopper,
  Star,
  X,
  Fingerprint,
  ScanLine,
  Timer,
  BadgeCheck,
  Loader2,
  ArrowLeft,
  UserCheck,
  DoorOpen,
  FileText,
} from 'lucide-react';

import VisitorNav from '../components/VisitorNav';

type SearchMode = 'phone' | 'id' | 'name';

const PublicCheckout: React.FC = () => {
  const { getActiveVisitors, checkoutVisitor, visitors } = useVisitors();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [screen, setScreen] = useState<
    'welcome' | 'search' | 'confirm' | 'tools' | 'success'
  >('welcome');
  const [searchMode, setSearchMode] = useState<SearchMode>('phone');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [toolsVerified, setToolsVerified] = useState<Record<string, boolean>>(
    {}
  );
  const [allToolsChecked, setAllToolsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<number>(0);
  const [feedbackNote, setFeedbackNote] = useState('');

  const topRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const activeVisitors = getActiveVisitors();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [screen]);

  useEffect(() => {
    if (screen === 'search' && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 300);
    }
  }, [screen]);

  const filteredVisitors = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return activeVisitors.filter((v) => {
      switch (searchMode) {
        case 'phone':
          return v.phoneNumber.replace(/\s/g, '').includes(q.replace(/\s/g, ''));
        case 'id':
          return v.idNumber.toLowerCase().includes(q);
        case 'name':
          return v.fullName.toLowerCase().includes(q);
        default:
          return false;
      }
    });
  }, [searchQuery, searchMode, activeVisitors]);

  const selectVisitor = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    const allTools = [...visitor.tools, ...visitor.customTools];
    if (allTools.length > 0) {
      const verified: Record<string, boolean> = {};
      allTools.forEach((t) => (verified[t] = false));
      setToolsVerified(verified);
      setAllToolsChecked(false);
      setScreen('tools');
    } else {
      setScreen('confirm');
    }
  };

  const toggleToolVerified = (tool: string) => {
    setToolsVerified((prev) => {
      const updated = { ...prev, [tool]: !prev[tool] };
      setAllToolsChecked(Object.values(updated).every(Boolean));
      return updated;
    });
  };

  const toggleAllTools = () => {
    const allTools = selectedVisitor
      ? [...selectedVisitor.tools, ...selectedVisitor.customTools]
      : [];
    if (allToolsChecked) {
      const verified: Record<string, boolean> = {};
      allTools.forEach((t) => (verified[t] = false));
      setToolsVerified(verified);
      setAllToolsChecked(false);
    } else {
      const verified: Record<string, boolean> = {};
      allTools.forEach((t) => (verified[t] = true));
      setToolsVerified(verified);
      setAllToolsChecked(true);
    }
  };

  const handleCheckout = async () => {
    if (!selectedVisitor) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    checkoutVisitor(selectedVisitor.id);
    setLoading(false);
    setScreen('success');
  };

  const getVisitDuration = (timeIn: string): string => {
    const ms = currentTime.getTime() - new Date(timeIn).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return `${hrs}h ${rem}m`;
  };

  const getCatInfo = (category: string) => {
    return (
      CATEGORIES.find((c) => c.value === category) || {
        label: category,
        color: 'bg-gray-500',
        icon: '👤',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
      }
    );
  };

  const resetAll = () => {
    setSearchQuery('');
    setSelectedVisitor(null);
    setToolsVerified({});
    setAllToolsChecked(false);
    setFeedback(0);
    setFeedbackNote('');
    setScreen('welcome');
  };

  const searchPlaceholders: Record<SearchMode, string> = {
    phone: 'Enter your phone number...',
    id: 'Enter your ID / Passport number...',
    name: 'Enter your full name...',
  };

  const searchIcons: Record<SearchMode, React.ReactNode> = {
    phone: <Phone className="w-5 h-5" />,
    id: <CreditCard className="w-5 h-5" />,
    name: <User className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-rose-50/30 relative">
      <div ref={topRef} />

      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-rose-200/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-200/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-amber-100/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <DoorOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-800 tracking-tight leading-none">
                SECUREPASS
              </h1>
              <p className="text-[8px] text-slate-400 uppercase tracking-[0.15em] leading-none mt-0.5">
                Visitor Checkout
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {screen !== 'welcome' && screen !== 'success' && (
              <button
                onClick={resetAll}
                className="text-xs text-slate-400 hover:text-slate-600 font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 transition-all"
              >
                <ArrowLeft className="w-3 h-3" />
                Start Over
              </button>
            )}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
              <Clock className="w-3 h-3" />
              <span className="font-mono font-medium tabular-nums">
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 relative z-10">
        {/* ============ WELCOME ============ */}
        {screen === 'welcome' && (
          <div className="animate-fade-in">
            {/* Hero */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-rose-500 via-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-rose-500/25 relative">
                <LogOut className="w-10 h-10 text-white" />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-black text-slate-800 mb-2">
                Leaving? Check Out! 👋
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                Complete your visit by checking out. It's quick, easy, and
                ensures all records are up to date.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-3 mb-8">
              {[
                {
                  icon: ScanLine,
                  title: 'Find Your Record',
                  desc: 'Search using your phone, ID, or name',
                  color: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: Wrench,
                  title: 'Verify Your Tools',
                  desc: 'Confirm all tools and equipment are with you',
                  color: 'from-amber-500 to-orange-500',
                },
                {
                  icon: BadgeCheck,
                  title: 'Quick Checkout',
                  desc: 'One tap to complete your checkout',
                  color: 'from-emerald-500 to-teal-500',
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-linear-to-br ${item.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active visitors count */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-emerald-700">
                  {activeVisitors.length} visitor
                  {activeVisitors.length !== 1 ? 's' : ''} currently on premises
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => setScreen('search')}
              disabled={activeVisitors.length === 0}
              className="w-full py-4 bg-linear-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-bold rounded-2xl shadow-xl shadow-rose-500/20 hover:shadow-2xl hover:shadow-rose-500/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-xl"
            >
              Start Checkout
              <ArrowRight className="w-5 h-5" />
            </button>

            {activeVisitors.length === 0 && (
              <p className="text-center text-xs text-slate-400 mt-3">
                No visitors are currently checked in
              </p>
            )}
          </div>
        )}

        {/* ============ SEARCH ============ */}
        {screen === 'search' && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Find Your Record
                </h2>
                <p className="text-xs text-slate-400">
                  Search by phone number, ID, or name
                </p>
              </div>
            </div>

            {/* Search mode tabs */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
              <div className="flex border-b border-slate-100">
                {(
                  [
                    { key: 'phone', label: 'Phone', icon: Phone },
                    { key: 'id', label: 'ID/Passport', icon: CreditCard },
                    { key: 'name', label: 'Name', icon: User },
                  ] as { key: SearchMode; label: string; icon: any }[]
                ).map((tab) => {
                  const Icon = tab.icon;
                  const active = searchMode === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setSearchMode(tab.key);
                        setSearchQuery('');
                      }}
                      className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                        active
                          ? 'text-indigo-700 border-indigo-500 bg-indigo-50/50'
                          : 'text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search input */}
              <div className="p-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {searchIcons[searchMode]}
                  </div>
                  <input
                    ref={searchInputRef}
                    type={searchMode === 'phone' ? 'tel' : 'text'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholders[searchMode]}
                    className="w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Results */}
            {searchQuery.trim() && (
              <div className="space-y-3 animate-fade-in">
                {filteredVisitors.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                      <Search className="w-7 h-7 text-slate-300" />
                    </div>
                    <h3 className="font-bold text-slate-700 mb-1">
                      No Results Found
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto">
                      No active visitor matches your search. Please try a
                      different {searchMode === 'phone' ? 'phone number' : searchMode === 'id' ? 'ID number' : 'name'} or search method.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-slate-400 font-medium px-1">
                      {filteredVisitors.length} result
                      {filteredVisitors.length !== 1 ? 's' : ''} found
                    </p>
                    {filteredVisitors.map((visitor, i) => {
                      const cat = getCatInfo(visitor.category);
                      const allTools = [
                        ...visitor.tools,
                        ...visitor.customTools,
                      ];
                      return (
                        <button
                          key={visitor.id}
                          onClick={() => selectVisitor(visitor)}
                          className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 overflow-hidden text-left group"
                          style={{ animationDelay: `${i * 0.05}s` }}
                        >
                          <div className={`h-1 ${cat.color}`} />
                          <div className="p-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center text-white text-xl shadow-sm shrink-0`}
                              >
                                {cat.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 truncate">
                                  {visitor.fullName}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-slate-400">
                                    {cat.label}
                                  </span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                                  <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Building2 className="w-3 h-3" />
                                    {visitor.unitVisited}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                                  <Timer className="w-3 h-3" />
                                  {getVisitDuration(visitor.timeIn)}
                                </div>
                                {allTools.length > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-amber-600">
                                    <Wrench className="w-3 h-3" />
                                    {allTools.length} tool
                                    {allTools.length > 1 ? 's' : ''}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Bottom row */}
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                              <div className="flex items-center gap-3 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {visitor.phoneNumber}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  In:{' '}
                                  {new Date(visitor.timeIn).toLocaleTimeString(
                                    'en-US',
                                    {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
                                </span>
                              </div>
                              <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                Select
                                <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            )}

            {/* Browse all active */}
            {!searchQuery.trim() && activeVisitors.length > 0 && (
              <div className="space-y-3 animate-fade-in">
                <p className="text-xs text-slate-400 font-medium px-1 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  Or browse all {activeVisitors.length} active visitor
                  {activeVisitors.length !== 1 ? 's' : ''}
                </p>
                <div className="max-h-100 overflow-y-auto space-y-2 pr-1">
                  {activeVisitors.map((visitor, i) => {
                    const cat = getCatInfo(visitor.category);
                    return (
                      <button
                        key={visitor.id}
                        onClick={() => selectVisitor(visitor)}
                        className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-sm transition-all text-left group"
                      >
                        <div
                          className={`w-9 h-9 rounded-lg ${cat.color} flex items-center justify-center text-white text-sm shrink-0`}
                        >
                          {cat.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-700 text-sm truncate">
                            {visitor.fullName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {visitor.unitVisited} ·{' '}
                            {getVisitDuration(visitor.timeIn)}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ TOOLS VERIFICATION ============ */}
        {screen === 'tools' && selectedVisitor && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Verify Your Tools
                </h2>
                <p className="text-xs text-slate-400">
                  Confirm each tool before checking out
                </p>
              </div>
            </div>

            {/* Visitor mini card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4 flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl ${getCatInfo(selectedVisitor.category).color} flex items-center justify-center text-white text-lg`}
              >
                {getCatInfo(selectedVisitor.category).icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 truncate">
                  {selectedVisitor.fullName}
                </p>
                <p className="text-xs text-slate-400">
                  {selectedVisitor.unitVisited} ·{' '}
                  {getVisitDuration(selectedVisitor.timeIn)} on premises
                </p>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-800">
                    Tool Verification Required
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                    Please confirm that each tool listed below is in your
                    possession. All tools must be accounted for before checkout.
                  </p>
                </div>
              </div>
            </div>

            {/* Select all */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
              <button
                onClick={toggleAllTools}
                className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100"
              >
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    allToolsChecked
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-slate-300'
                  }`}
                >
                  {allToolsChecked && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  {allToolsChecked ? 'All tools verified' : 'Select all tools'}
                </span>
                <span className="ml-auto text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                  {Object.values(toolsVerified).filter(Boolean).length}/
                  {Object.keys(toolsVerified).length}
                </span>
              </button>

              {/* Individual tools */}
              <div className="divide-y divide-slate-50">
                {[
                  ...selectedVisitor.tools,
                  ...selectedVisitor.customTools,
                ].map((tool, i) => (
                  <button
                    key={`${tool}-${i}`}
                    onClick={() => toggleToolVerified(tool)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-all text-left"
                  >
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        toolsVerified[tool]
                          ? 'bg-emerald-500 border-emerald-500 scale-110'
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {toolsVerified[tool] && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          toolsVerified[tool]
                            ? 'bg-emerald-50'
                            : 'bg-amber-50'
                        } transition-colors`}
                      >
                        <Wrench
                          className={`w-4 h-4 ${
                            toolsVerified[tool]
                              ? 'text-emerald-500'
                              : 'text-amber-500'
                          } transition-colors`}
                        />
                      </div>
                      <span
                        className={`text-sm font-medium transition-all ${
                          toolsVerified[tool]
                            ? 'text-emerald-700 line-through opacity-70'
                            : 'text-slate-700'
                        }`}
                      >
                        {tool}
                      </span>
                    </div>
                    {toolsVerified[tool] && (
                      <span className="ml-auto text-[11px] text-emerald-600 font-semibold">
                        Verified ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">
                  Verification Progress
                </span>
                <span className="font-bold text-slate-700">
                  {Object.values(toolsVerified).filter(Boolean).length}/
                  {Object.keys(toolsVerified).length} verified
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    allToolsChecked
                      ? 'bg-linear-to-r from-emerald-500 to-teal-500'
                      : 'bg-linear-to-r from-amber-500 to-orange-500'
                  }`}
                  style={{
                    width: `${
                      (Object.values(toolsVerified).filter(Boolean).length /
                        Object.keys(toolsVerified).length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setScreen('search')}
                className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-all text-sm flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => setScreen('confirm')}
                disabled={!allToolsChecked}
                className="flex-2 py-3.5 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to Checkout
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============ CONFIRM ============ */}
        {screen === 'confirm' && selectedVisitor && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-md">
                <LogOut className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Confirm Checkout
                </h2>
                <p className="text-xs text-slate-400">
                  Review your visit details one last time
                </p>
              </div>
            </div>

            {/* Visit Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
              <div className="bg-linear-to-r from-rose-500 via-orange-500 to-amber-500 p-5 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border border-white/30">
                    {selectedVisitor.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {selectedVisitor.fullName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md font-medium">
                        {getCatInfo(selectedVisitor.category).icon}{' '}
                        {getCatInfo(selectedVisitor.category).label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3">
                {[
                  {
                    icon: Building2,
                    label: 'Visited',
                    value: selectedVisitor.unitVisited,
                  },
                  {
                    icon: FileText,
                    label: 'Purpose',
                    value: selectedVisitor.purpose,
                  },
                  {
                    icon: Clock,
                    label: 'Checked In',
                    value: new Date(selectedVisitor.timeIn).toLocaleString(
                      'en-US',
                      {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    ),
                  },
                  {
                    icon: Timer,
                    label: 'Duration',
                    value: getVisitDuration(selectedVisitor.timeIn),
                  },
                  {
                    icon: Clock,
                    label: 'Checking Out',
                    value: currentTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold text-slate-700 wrap-break-words">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {[...selectedVisitor.tools, ...selectedVisitor.customTools]
                  .length > 0 && (
                  <div className="flex items-start gap-3 py-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Wrench className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-1.5">
                        Tools Verified ✓
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          ...selectedVisitor.tools,
                          ...selectedVisitor.customTools,
                        ].map((tool) => (
                          <span
                            key={tool}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md text-[11px] font-medium border border-emerald-100"
                          >
                            ✅ {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Optional feedback */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
              <p className="text-sm font-bold text-slate-700 mb-3">
                How was your visit?{' '}
                <span className="text-slate-400 font-normal">(optional)</span>
              </p>
              <div className="flex items-center justify-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedback(star)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-200 ${
                      feedback >= star
                        ? 'bg-amber-100 scale-110'
                        : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    {feedback >= star ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              {feedback > 0 && (
                <input
                  type="text"
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="Any comments? (optional)"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all animate-fade-in"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const allTools = [
                    ...selectedVisitor.tools,
                    ...selectedVisitor.customTools,
                  ];
                  setScreen(allTools.length > 0 ? 'tools' : 'search');
                }}
                className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-all text-sm flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="flex-[2] py-3.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-rose-500/20 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <LogOut className="w-5 h-5" />
                    Complete Checkout
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ============ SUCCESS ============ */}
        {screen === 'success' && selectedVisitor && (
          <div className="animate-scale-in text-center py-6">
            {/* Success animation */}
            <div className="relative w-28 h-28 mx-auto mb-6">
              <div className="absolute inset-0 bg-linear-to-br from-emerald-400 to-teal-500 rounded-full animate-ping opacity-20" />
              <div className="absolute inset-0 bg-linaer-to-br from-emerald-400 to-teal-500 rounded-full shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-14 h-14 text-white" />
              </div>
            </div>

            <PartyPopper className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <h2 className="text-2xl font-black text-slate-800 mb-1">
              Checked Out!
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Thank you for visiting. Have a great day!
            </p>

            {/* Checkout receipt */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden max-w-xs mx-auto mb-6">
              <div className="bg-linear-to-r from-emerald-500 to-teal-500 p-4 text-white text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-widest font-semibold opacity-80">
                    Checkout Receipt
                  </span>
                </div>
                <h3 className="font-bold text-lg">
                  {selectedVisitor.fullName}
                </h3>
              </div>
              <div className="p-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Category</span>
                  <span className="font-semibold text-slate-700">
                    {getCatInfo(selectedVisitor.category).icon}{' '}
                    {getCatInfo(selectedVisitor.category).label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Visited</span>
                  <span className="font-semibold text-slate-700">
                    {selectedVisitor.unitVisited}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time In</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(selectedVisitor.timeIn).toLocaleTimeString(
                      'en-US',
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time Out</span>
                  <span className="font-semibold text-emerald-700">
                    {currentTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2.5 mt-2.5">
                  <span className="text-slate-400">Duration</span>
                  <span className="font-bold text-slate-800">
                    {getVisitDuration(selectedVisitor.timeIn)}
                  </span>
                </div>
                {[...selectedVisitor.tools, ...selectedVisitor.customTools]
                  .length > 0 && (
                  <div className="border-t border-slate-100 pt-2.5 mt-2.5">
                    <p className="text-slate-400 mb-1.5 text-left">
                      Tools Returned
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {[
                        ...selectedVisitor.tools,
                        ...selectedVisitor.customTools,
                      ].map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[11px] font-medium"
                        >
                          ✅ {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {feedback > 0 && (
                  <div className="border-t border-slate-100 pt-2.5 mt-2.5 flex justify-between">
                    <span className="text-slate-400">Rating</span>
                    <span>
                      {'⭐'.repeat(feedback)}
                      {'☆'.repeat(5 - feedback)}
                    </span>
                  </div>
                )}
              </div>
              <div className="bg-slate-50 px-4 py-3 text-center border-t border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                  Visit recorded · {currentTime.toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Goodbye message */}
            <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-4 mb-6 max-w-xs mx-auto">
              <p className="text-sm font-semibold text-indigo-800">
                Thank you for visiting! 🙏
              </p>
              <p className="text-xs text-indigo-500 mt-1">
                Your checkout has been recorded. We hope to see you again!
              </p>
            </div>

            <button
              onClick={resetAll}
              className="w-full max-w-xs mx-auto py-3.5 bg-linear-to-r from-slate-700 to-slate-800 text-white font-semibold rounded-2xl shadow-lg shadow-slate-700/20 hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <DoorOpen className="w-4 h-4" />
              Done
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-[11px] text-slate-400">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Shield className="w-3 h-3" />
          <span className="font-semibold">SECUREPASS</span>
        </div>
        <p>Secure Visitor & Access Management System</p>
        <p className="mt-1">© {new Date().getFullYear()} All rights reserved</p>
      </footer>
    </div>
  );
};

export default PublicCheckout;

