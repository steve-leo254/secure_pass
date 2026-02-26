import React, { useState, useEffect, useRef } from 'react';
import { useVisitors } from '../context/VistorContext';
import { CATEGORIES, TOOLS_LIST } from '../types';
import type { VisitorCategory, Gender } from '../types';
import { format } from 'date-fns';

import {
  Shield,
  User,
  Phone,
  CreditCard,
  Building2,
  FileText,
  Wrench,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  UserPlus,
  Clock,
  ArrowRight,
  Fingerprint,
  BadgeCheck,
  CircleDot,
  Loader2,
  PartyPopper,
  CalendarCheck,
  ShieldCheck,
  Star,
  DoorOpen,
  Download,
} from 'lucide-react';

const PublicRegister: React.FC = () => {
  const { addVisitor } = useVisitors();

  const [step, setStep] = useState(0); // 0 = welcome, 1-3 = form steps, 4 = success
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Form
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [category, setCategory] = useState<VisitorCategory>('visitor');
  const [purpose, setPurpose] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [unitVisited, setUnitVisited] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [customTool, setCustomTool] = useState('');
  const [customTools, setCustomTools] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [step]);

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const addCustomTool = () => {
    const trimmed = customTool.trim();
    if (trimmed && !customTools.includes(trimmed)) {
      setCustomTools((prev) => [...prev, trimmed]);
      setCustomTool('');
    }
  };

  const removeCustomTool = (tool: string) => {
    setCustomTools((prev) => prev.filter((t) => t !== tool));
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!phoneNumber.trim()) errs.phoneNumber = 'Phone number is required';
    else if (phoneNumber.replace(/\D/g, '').length < 10)
      errs.phoneNumber = 'Enter a valid phone number';
    if (!idNumber.trim()) errs.idNumber = 'ID or Passport number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!purpose.trim()) errs.purpose = 'Purpose of visit is required';
    if (!unitVisited.trim())
      errs.unitVisited = 'Please specify the unit you are visiting';
    else if (!validateUnit(unitVisited))
      errs.unitVisited = 'Invalid unit. Please enter a valid unit, shop, house, or office number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setErrors({});
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!agreedToTerms) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));

    addVisitor({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      idNumber: idNumber.trim(),
      category,
      purpose: purpose.trim(),
      gender,
      unitVisited: unitVisited.trim(),
      tools: selectedTools,
      customTools,
      registeredBy: 'Self-Registration (QR)',
      checkedOutBy: null,
      notes: notes.trim(),
    });

    setLoading(false);
    setStep(4);
  };

  const resetForm = () => {
    setFullName('');
    setPhoneNumber('');
    setIdNumber('');
    setCategory('visitor');
    setPurpose('');
    setGender('male');
    setUnitVisited('');
    setSelectedTools([]);
    setCustomTool('');
    setCustomTools([]);
    setNotes('');
    setAgreedToTerms(false);
    setErrors({});
    setStep(0);
  };

  const validateUnit = (unit: string) => {
    const validUnits = [
      'Unit 1A', 'Unit 1B', 'Unit 2A', 'Unit 2B', 'Unit 3A', 'Unit 3B',
      'Unit 4A', 'Unit 4B', 'Unit 5A', 'Unit 5B', 'Shop 1', 'Shop 2',
      'Shop 3', 'Shop 4', 'Shop 5', 'House 1', 'House 2', 'House 3',
      'Office 1', 'Office 2', 'Office 3', 'Reception', 'Admin Office'
    ];
    return validUnits.some(validUnit => 
      unit.toLowerCase().includes(validUnit.toLowerCase()) || 
      validUnit.toLowerCase().includes(unit.toLowerCase())
    );
  };

  const downloadVisitorInfo = () => {
    // Create PDF content
    const pdfContent = `
VISITOR PASS INFORMATION
=====================

Personal Details:
----------------
Full Name: ${fullName}
Phone Number: ${phoneNumber}
ID/Passport: ${idNumber}
Gender: ${gender}

Visit Information:
------------------
Category: ${category}
Purpose of Visit: ${purpose}
Unit/Office Visited: ${unitVisited}
Check-in Time: ${format(currentTime, 'yyyy-MM-dd HH:mm:ss')}
Status: Checked In

${selectedTools.length > 0 ? `
Tools/Equipment:
-----------------
${selectedTools.join('\n')}
` : ''}

Important Notes:
--------------
Please proceed to security desk for verification.
Don't forget to check out when you leave.
This pass must be visible at all times during your visit.
    `;

    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(pdfContent);
    const exportFileDefaultName = `visitor-pass-${fullName.replace(/\s+/g, '-')}-${format(currentTime, 'yyyy-MM-dd-HHmm')}.txt`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const stepLabels = [
    { num: 1, label: 'Personal' },
    { num: 2, label: 'Visit Info' },
    { num: 3, label: 'Review' },
  ];

  const showToolsSection =
    category === 'contractor' ||
    category === 'technician' ||
    category === 'staff';

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/40 relative"
    >
      <div ref={topRef} />

      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-100/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      

      <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="animate-fade-in">
            {/* Hero */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-indigo-500/30 relative">
                <Shield className="w-10 h-10 text-white" />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-black text-slate-800 mb-2">
                Welcome, Visitor! 👋
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                Please register your visit for a safe and secure entry.
                This process takes less than 2 minutes.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-3 mb-8">
              {[
                {
                  icon: Fingerprint,
                  title: 'Quick & Simple',
                  desc: 'Fill in your details in 3 easy steps',
                  color: 'from-blue-500 to-cyan-500',
                  bg: 'bg-blue-50',
                },
                {
                  icon: ShieldCheck,
                  title: 'Safe & Secure',
                  desc: 'Your data is encrypted and protected',
                  color: 'from-emerald-500 to-teal-500',
                  bg: 'bg-emerald-50',
                },
                {
                  icon: CalendarCheck,
                  title: 'Digital Record',
                  desc: 'Your visit is recorded automatically',
                  color: 'from-violet-500 to-purple-500',
                  bg: 'bg-violet-50',
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
                      className={`w-12 h-12 rounded-xl bg-linear-to-br ${item.color} flex items-center justify-center shadow-lg shrink-0`}
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

            {/* Current Date */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
                <CalendarCheck className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-semibold text-indigo-700">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => setStep(1)}
              className="w-full py-4 bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-base"
            >
              Start Registration
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-center text-[11px] text-slate-400 mt-4">
              By continuing, you agree to the premises visitor policy
            </p>
          </div>
        )}

        {/* Steps 1-3: Form */}
        {step >= 1 && step <= 3 && (
          <div className="animate-fade-in">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                {stepLabels.map((s, i) => (
                  <React.Fragment key={s.num}>
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-500 ${step > s.num
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                            : step === s.num
                              ? 'bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-110'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                      >
                        {step > s.num ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          s.num
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-semibold ${step >= s.num ? 'text-slate-700' : 'text-slate-400'
                          }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < stepLabels.length - 1 && (
                      <div className="flex-1 h-1 mx-3 rounded-full bg-slate-100 overflow-hidden -mt-5">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${step > s.num
                              ? 'bg-emerald-500 w-full'
                              : 'bg-indigo-500 w-0'
                            }`}
                          style={{
                            width: step > s.num ? '100%' : '0%',
                          }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4 animate-slide-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Personal Details
                    </h2>
                    <p className="text-xs text-slate-400">
                      Tell us about yourself
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Full Name
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm ${errors.fullName
                          ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                          : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                        }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <CircleDot className="w-3 h-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Phone Number
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm ${errors.phoneNumber
                          ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                          : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                        }`}
                      placeholder="e.g. 0712 345 678"
                    />
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <CircleDot className="w-3 h-3" />
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  {/* ID Number */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      National ID / Passport
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm ${errors.idNumber
                          ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                          : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                        }`}
                      placeholder="Enter ID or Passport number"
                    />
                    {errors.idNumber && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <CircleDot className="w-3 h-3" />
                        {errors.idNumber}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Gender <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { val: 'male', emoji: '👨', label: 'Male' },
                          { val: 'female', emoji: '👩', label: 'Female' },
                          { val: 'other', emoji: '🧑', label: 'Other' },
                        ] as { val: Gender; emoji: string; label: string }[]
                      ).map((g) => (
                        <button
                          key={g.val}
                          type="button"
                          onClick={() => setGender(g.val)}
                          className={`py-3 rounded-xl text-sm font-semibold transition-all duration-200 border flex flex-col items-center gap-1 ${gender === g.val
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm ring-2 ring-indigo-200/50'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                        >
                          <span className="text-xl">{g.emoji}</span>
                          <span className="text-[11px]">{g.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Visit Details */}
            {step === 2 && (
              <div className="space-y-4 animate-slide-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Visit Information
                    </h2>
                    <p className="text-xs text-slate-400">
                      Where are you going and why?
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                  {/* Category */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      I am a... <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setCategory(cat.value)}
                          className={`p-3 rounded-xl text-left transition-all duration-200 border flex items-center gap-3 ${category === cat.value
                              ? 'bg-indigo-50 border-indigo-300 shadow-sm ring-2 ring-indigo-200/50'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                        >
                          <span className="text-2xl">{cat.icon}</span>
                          <div>
                            <span
                              className={`text-xs font-semibold block ${category === cat.value
                                  ? 'text-indigo-700'
                                  : 'text-slate-600'
                                }`}
                            >
                              {cat.label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Purpose */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      Purpose of Visit
                      <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm resize-none ${errors.purpose
                          ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                          : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                        }`}
                      rows={3}
                      placeholder="Briefly describe why you are visiting..."
                    />
                    {errors.purpose && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <CircleDot className="w-3 h-3" />
                        {errors.purpose}
                      </p>
                    )}
                  </div>

                  {/* Unit Visited */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      Unit / House / Office
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={unitVisited}
                      onChange={(e) => setUnitVisited(e.target.value)}
                      className={`w-full px-4 py-3.5 bg-slate-50 border rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm ${errors.unitVisited
                          ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                          : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-400'
                        }`}
                      placeholder="e.g., Unit 5A, Shop 12, House 23"
                    />
                    {errors.unitVisited && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        <CircleDot className="w-3 h-3" />
                        {errors.unitVisited}
                      </p>
                    )}
                  </div>

                  {/* Tools - conditional */}
                  {showToolsSection && (
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-2">
                        <Wrench className="w-3.5 h-3.5 text-slate-400" />
                        Tools / Equipment Carried
                      </label>
                      <p className="text-xs text-slate-400 mb-3">
                        Select any tools you are bringing in
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {TOOLS_LIST.map((tool) => (
                          <button
                            key={tool}
                            type="button"
                            onClick={() => toggleTool(tool)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${selectedTools.includes(tool)
                                ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm ring-1 ring-amber-200/50'
                                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                              }`}
                          >
                            {selectedTools.includes(tool)
                              ? '✅'
                              : '🔧'}{' '}
                            {tool}
                          </button>
                        ))}
                      </div>

                      {/* Custom tool */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customTool}
                          onChange={(e) => setCustomTool(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addCustomTool();
                            }
                          }}
                          className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                          placeholder="Other tool..."
                        />
                        <button
                          type="button"
                          onClick={addCustomTool}
                          className="px-3 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-semibold text-sm hover:bg-indigo-100 transition-all border border-indigo-100 flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {customTools.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {customTools.map((tool) => (
                            <span
                              key={tool}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-100"
                            >
                              {tool}
                              <button onClick={() => removeCustomTool(tool)}>
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Additional Notes{' '}
                      <span className="text-slate-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm"
                      placeholder="Any additional information..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <div className="space-y-4 animate-slide-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                    <BadgeCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Review & Confirm
                    </h2>
                    <p className="text-xs text-slate-400">
                      Please verify your details before submitting
                    </p>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  {/* Visitor header */}
                  <div className="bg-linear-to-r from-indigo-500 to-purple-600 p-5 text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border border-white/30">
                        {fullName.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{fullName || '—'}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md font-medium capitalize">
                            {
                              CATEGORIES.find((c) => c.value === category)
                                ?.icon
                            }{' '}
                            {
                              CATEGORIES.find((c) => c.value === category)
                                ?.label
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-3">
                    {[
                      {
                        icon: Phone,
                        label: 'Phone',
                        value: phoneNumber,
                      },
                      {
                        icon: CreditCard,
                        label: 'ID/Passport',
                        value: idNumber,
                      },
                      {
                        icon: User,
                        label: 'Gender',
                        value: gender,
                      },
                      {
                        icon: Building2,
                        label: 'Visiting',
                        value: unitVisited,
                      },
                      {
                        icon: FileText,
                        label: 'Purpose',
                        value: purpose,
                      },
                      {
                        icon: Clock,
                        label: 'Time',
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
                            <p className="text-sm font-semibold text-slate-700 capitalize wrap-break-words">
                              {item.value || '—'}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Tools */}
                    {[...selectedTools, ...customTools].length > 0 && (
                      <div className="flex items-start gap-3 py-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Wrench className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-1.5">
                            Tools / Equipment
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {[...selectedTools, ...customTools].map(
                              (tool) => (
                                <span
                                  key={tool}
                                  className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-[11px] font-medium border border-amber-100"
                                >
                                  🔧 {tool}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {notes && (
                      <div className="flex items-start gap-3 py-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                            Notes
                          </p>
                          <p className="text-sm text-slate-600">{notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms */}
                <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-700">
                        I confirm the above information is correct
                      </span>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        I agree to follow the{' '}
                        <button
                          type="button"
                          onClick={() => window.open('/terms-and-conditions', '_blank')}
                          className="text-indigo-600 hover:text-indigo-700 underline font-medium"
                        >
                          premises safety and visitor policies
                        </button>
                        . I understand my visit is being recorded for
                        security purposes.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={prevStep}
                className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  className="flex-2 py-3.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!agreedToTerms || loading}
                  className="flex-2 py-3.5 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Complete Check-In
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="animate-scale-in text-center py-8">
            {/* Animated success */}
            <div className="relative w-28 h-28 mx-auto mb-6">
              <div className="absolute inset-0 bg-linear-to-br from-emerald-400 to-teal-500 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 bg-linear-to-br from-emerald-400 to-teal-500 rounded-full shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-14 h-14 text-white" />
              </div>
            </div>

            <div className="space-y-1 mb-2">
              <PartyPopper className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <h2 className="text-2xl font-black text-slate-800">
                You're All Set!
              </h2>
              <p className="text-slate-500 text-sm">
                Registration completed successfully
              </p>
            </div>

            {/* Visitor Pass Card */}
            <div className="my-6 bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden max-w-md mx-auto">
              <div className="bg-linear-to-r from-indigo-500 to-purple-600 p-4 text-white text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Shield className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-widest font-semibold opacity-80">
                    Visitor Pass
                  </span>
                </div>
                <h3 className="font-bold text-lg">{fullName}</h3>
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Category</span>
                  <span className="font-semibold text-slate-700">
                    {CATEGORIES.find((c) => c.value === category)?.icon}{' '}
                    {CATEGORIES.find((c) => c.value === category)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Visiting</span>
                  <span className="font-semibold text-slate-700">
                    {unitVisited}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time In</span>
                  <span className="font-semibold text-slate-700">
                    {currentTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date</span>
                  <span className="font-semibold text-slate-700">
                    {currentTime.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {[...selectedTools, ...customTools].length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-slate-400 mb-1">Tools Registered</p>
                    <div className="flex flex-wrap gap-1">
                      {[...selectedTools, ...customTools].map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-[11px] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-slate-50 px-4 py-3 text-center border-t border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                  Please proceed to the security desk
                </p>
              </div>
            </div>

            {/* Important notice */}
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4 mb-6 max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Star className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-amber-800">
                    Important
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                    Please proceed to the security desk for verification. Don't
                    forget to check out when you leave.
                  </p>
                </div>
              </div>
            </div>

            {/* Download visitor info button */}
            <button
              onClick={downloadVisitorInfo}
              className="w-full max-w-xs mx-auto py-3.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 mb-3"
            >
              <Download className="w-4 h-4" />
              Download My Info
            </button>
            
            <button
              onClick={resetForm}
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
        {/* <p>Secure Visitor & Access Management System</p> */}
        {/* <p className="mt-1">© {new Date().getFullYear()} All rights reserved</p> */}
      </footer>
    </div>
  );
};

export default PublicRegister;
