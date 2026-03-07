import React, { useState, useEffect, useRef } from 'react';
import { useVisitors } from '../context/VistorContext';
import { CATEGORIES } from '../types';
import type { Visitor } from '../types';
import {
  Shield,
  QrCode,
  Phone,
  CreditCard,
  Search,
  LogOut,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  User,
  MapPin,
  Timer,
  Star,
  Zap,
  DoorOpen,
  FileText,
  Users,
  ShieldCheck,
  Camera,
  ScanLine,
  X,
  ChevronRight,
  PartyPopper,
  Send,
  Info,
  Key,
  Fingerprint,
  Eye,
  Lock,
  Unlock,
  Hash,
  Mail,
} from 'lucide-react';

const VisitorSmartCheckout: React.FC = () => {
  console.log('VisitorSmartCheckout component mounted');

  const { getActiveVisitors, checkoutVisitor, visitors } = useVisitors();
  
  // State management
  const [activeStep, setActiveStep] = useState<'scan' | 'verify-identity' | 'verify-tools' | 'confirm-checkout' | 'success'>('scan');
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [verificationMethod, setVerificationMethod] = useState<'phone' | 'id' | 'security-question'>('phone');
  const [verificationInput, setVerificationInput] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [toolsVerified, setToolsVerified] = useState<Record<string, boolean>>({});
  const [allToolsChecked, setAllToolsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [securityQuestion, setSecurityQuestion] = useState('');
  
  const activeVisitors = getActiveVisitors();
  const topRef = useRef<HTMLDivElement>(null);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to top on step change
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeStep]);

  // Generate security question based on visitor data
  const generateSecurityQuestion = (visitor: Visitor) => {
    const questions = [
      `What is the last 4 digits of your phone number? (${visitor.phoneNumber.slice(-4)})`,
      `What is the first letter of your name? (${visitor.fullName.charAt(0).toUpperCase()})`,
      `What is your gender? (${visitor.gender === 'male' ? 'Male' : visitor.gender === 'female' ? 'Female' : 'Other'})`,
      `What unit are you visiting? (${visitor.unitVisited.split(' ')[0]})`
    ];
    const randomIndex = Math.floor(Math.random() * questions.length);
    setSecurityQuestion(questions[randomIndex]);
  };

  // Process scanned QR code data
  const processScannedData = (data: string) => {
    try {
      // Format: securepass://visitor?id=VISITOR_ID&timestamp=TIMESTAMP
      const url = new URL(data);
      const visitorId = url.searchParams.get('id');
      
      if (!visitorId) {
        setError('Invalid QR code format');
        return;
      }
      
      // Find visitor by ID
      const visitor = activeVisitors.find(v => v.id === visitorId);
      
      if (!visitor) {
        setError('No active visitor found for this QR code. Please check in first.');
        return;
      }
      
      setScannedData(data);
      setSelectedVisitor(visitor);
      generateSecurityQuestion(visitor);
      setActiveStep('verify-identity');
    } catch (err) {
      setError('Invalid QR code data');
    }
  };

  // Simulate QR scan (in real app, this would be from camera)
  const simulateScan = () => {
    if (activeVisitors.length === 0) {
      setError('No active visitors to check out');
      return;
    }
    
    // Get a random active visitor
    const randomVisitor = activeVisitors[Math.floor(Math.random() * activeVisitors.length)];
    
    // Create QR data format
    const qrData = `securepass://visitor?id=${randomVisitor.id}&timestamp=${Date.now()}`;
    processScannedData(qrData);
  };

  // Manual search functionality
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    const query = searchQuery.toLowerCase().trim();
    const found = activeVisitors.find(v => 
      v.fullName.toLowerCase().includes(query) || 
      v.phoneNumber.includes(query) ||
      v.idNumber.toLowerCase().includes(query)
    );
    
    if (found) {
      setSelectedVisitor(found);
      generateSecurityQuestion(found);
      setActiveStep('verify-identity');
    } else {
      setError('No active visitor found matching your search');
    }
  };

  // Verify visitor identity
  const verifyIdentity = () => {
    if (!selectedVisitor) return;
    
    let isValid = false;
    
    switch (verificationMethod) {
      case 'phone':
        isValid = selectedVisitor.phoneNumber.replace(/\D/g, '') === verificationInput.replace(/\D/g, '');
        break;
      case 'id':
        isValid = selectedVisitor.idNumber.toLowerCase() === verificationInput.toLowerCase();
        break;
      case 'security-question':
        // For demo purposes, we'll accept any non-empty answer
        // In a real system, you'd validate against stored answers
        isValid = securityAnswer.trim() !== '';
        break;
    }
    
    if (isValid) {
      const allTools = [...selectedVisitor.tools, ...selectedVisitor.customTools];
      if (allTools.length > 0) {
        const verified: Record<string, boolean> = {};
        allTools.forEach(tool => verified[tool] = false);
        setToolsVerified(verified);
        setAllToolsChecked(false);
        setActiveStep('verify-tools');
      } else {
        setActiveStep('confirm-checkout');
      }
    } else {
      setError('Verification failed. Please try again.');
    }
  };

  // Tool verification handlers
  const toggleToolVerified = (tool: string) => {
    setToolsVerified(prev => {
      const updated = { ...prev, [tool]: !prev[tool] };
      setAllToolsChecked(Object.values(updated).every(Boolean));
      return updated;
    });
  };

  const toggleAllTools = () => {
    if (!selectedVisitor) return;
    
    const allTools = [...selectedVisitor.tools, ...selectedVisitor.customTools];
    if (allToolsChecked) {
      const verified: Record<string, boolean> = {};
      allTools.forEach(tool => verified[tool] = false);
      setToolsVerified(verified);
      setAllToolsChecked(false);
    } else {
      const verified: Record<string, boolean> = {};
      allTools.forEach(tool => verified[tool] = true);
      setToolsVerified(verified);
      setAllToolsChecked(true);
    }
  };

  // Complete checkout
  const handleCheckout = async () => {
    if (!selectedVisitor) return;
    
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    checkoutVisitor(selectedVisitor.id);
    setSuccessMessage(`Successfully checked out ${selectedVisitor.fullName}!`);
    setLoading(false);
    setActiveStep('success');
  };

  // Reset flow
  const resetFlow = () => {
    setActiveStep('scan');
    setScannedData(null);
    setSearchQuery('');
    setSelectedVisitor(null);
    setVerificationInput('');
    setSecurityAnswer('');
    setToolsVerified({});
    setAllToolsChecked(false);
    setError(null);
    setSuccessMessage(null);
  };

  // Helper functions
  const getVisitDuration = (timeIn: string): string => {
    const ms = currentTime.getTime() - new Date(timeIn).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return `${hrs}h ${rem}m`;
  };

  const getCatInfo = (category: string) => {
    return CATEGORIES.find(c => c.value === category) || { 
      label: category, 
      color: 'bg-gray-500', 
      icon: '👤',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700'
    };
  };

  // Render different steps
  const renderScanStep = () => (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl rotate-6 opacity-20 blur-sm" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
            <QrCode className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">
          Secure Visitor Checkout
        </h1>
        <p className="text-base text-slate-500 leading-relaxed max-w-md mx-auto">
          Scan your QR code or search manually to begin the secure checkout process
        </p>
      </div>

      {/* Security Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Fingerprint, title: 'Identity Verification', desc: 'Multiple verification methods' },
          { icon: Lock, title: 'Secure Process', desc: 'End-to-end encryption' },
          { icon: ShieldCheck, title: 'Fraud Prevention', desc: 'Anti-spoofing measures' }
        ].map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">{feature.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{feature.desc}</p>
            </div>
          );
        })}
      </div>

      {/* QR Instructions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-1">
            <Camera className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Scan Your QR Code</h3>
            <p className="text-slate-500 mb-4">
              When you checked in, you received a unique QR code. Scan it with your phone's camera to start the secure checkout process.
            </p>
            
            {/* QR Code Placeholder */}
            <div className="bg-slate-50 rounded-xl p-4 border-2 border-dashed border-slate-200 text-center">
              <div className="inline-block p-2 bg-white rounded-lg shadow-sm">
                <div className="w-24 h-24 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-400" />
                </div>
                <p className="text-xs text-slate-400 mt-2">Your Unique QR Code</p>
              </div>
              <p className="text-xs text-slate-400 mt-3">
                This QR code contains your visitor ID and is valid only for your current visit.
              </p>
            </div>
            
            <button 
              onClick={simulateScan}
              disabled={activeVisitors.length === 0}
              className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ScanLine className="w-4 h-4" />
              {activeVisitors.length === 0 ? 'No Active Visitors' : 'Simulate QR Scan'}
            </button>
          </div>
        </div>
      </div>

      {/* Manual Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 mt-1">
            <Search className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Manual Search</h3>
            <p className="text-slate-500 mb-4">
              If you don't have your QR code, you can search for your record using your name, phone number, or ID.
            </p>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter name, phone, or ID..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm"
              />
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );

  const renderVerifyIdentityStep = () => {
    if (!selectedVisitor) return null;
    
    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <Fingerprint className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Verify Your Identity</h2>
            <p className="text-xs text-slate-400">Confirm you are {selectedVisitor.fullName}</p>
          </div>
        </div>

        {/* Visitor preview */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl ${getCatInfo(selectedVisitor.category).color} flex items-center justify-center text-white text-lg`}>
            {getCatInfo(selectedVisitor.category).icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-800 truncate">{selectedVisitor.fullName}</p>
            <p className="text-xs text-slate-400">{selectedVisitor.unitVisited}</p>
          </div>
        </div>

        {/* Verification methods */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Select Verification Method</h3>
            <p className="text-xs text-slate-400 mt-1">Choose how you'd like to verify your identity</p>
          </div>
          
          <div className="divide-y divide-slate-100">
            {[
              { 
                id: 'phone', 
                title: 'Phone Number', 
                desc: 'Enter your registered phone number', 
                icon: Phone,
                placeholder: selectedVisitor.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
              },
              { 
                id: 'id', 
                title: 'ID/Passport', 
                desc: 'Enter your ID or Passport number', 
                icon: CreditCard,
                placeholder: '••••••••'
              },
              { 
                id: 'security-question', 
                title: 'Security Question', 
                desc: 'Answer the security question', 
                icon: Key,
                placeholder: 'Your answer'
              }
            ].map((method) => {
              const Icon = method.icon;
              const isActive = verificationMethod === method.id;
              
              return (
                <button
                  key={method.id}
                  onClick={() => setVerificationMethod(method.id as any)}
                  className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                    isActive ? 'bg-indigo-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-700">{method.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{method.desc}</p>
                  </div>
                  {isActive && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Verification input */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            {verificationMethod === 'phone' && <Phone className="w-4 h-4 text-slate-400" />}
            {verificationMethod === 'id' && <CreditCard className="w-4 h-4 text-slate-400" />}
            {verificationMethod === 'security-question' && <Key className="w-4 h-4 text-slate-400" />}
            <label className="text-sm font-semibold text-slate-700">
              {verificationMethod === 'phone' && 'Phone Number'}
              {verificationMethod === 'id' && 'ID/Passport Number'}
              {verificationMethod === 'security-question' && 'Security Question'}
            </label>
          </div>
          
          {verificationMethod === 'security-question' ? (
            <>
              <p className="text-sm text-slate-600 mb-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                {securityQuestion}
              </p>
              <input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm"
              />
            </>
          ) : (
            <input
              type={verificationMethod === 'phone' ? 'tel' : 'text'}
              value={verificationInput}
              onChange={(e) => setVerificationInput(e.target.value)}
              placeholder={
                verificationMethod === 'phone' 
                  ? selectedVisitor.phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3') 
                  : '••••••••'
              }
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm"
            />
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => setActiveStep('scan')}
            className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-all text-sm"
          >
            Back
          </button>
          <button
            onClick={verifyIdentity}
            disabled={
              (verificationMethod === 'security-question' && !securityAnswer.trim()) ||
              (verificationMethod !== 'security-question' && !verificationInput.trim())
            }
            className="flex-[2] py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all text-sm disabled:opacity-50"
          >
            Verify Identity
          </button>
        </div>
      </div>
    );
  };

  const renderVerifyToolsStep = () => {
    if (!selectedVisitor) return null;
    
    const allTools = [...selectedVisitor.tools, ...selectedVisitor.customTools];
    
    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Verify Your Tools</h2>
            <p className="text-xs text-slate-400">Confirm each tool before checkout</p>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4 mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 font-medium">
              All tools must be verified before you can check out. Please confirm each item is in your possession.
            </p>
          </div>
        </div>

        {/* Select all */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
          <button
            onClick={toggleAllTools}
            className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100"
          >
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              allToolsChecked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
            }`}>
              {allToolsChecked && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
            <span className="text-sm font-semibold text-slate-700">
              {allToolsChecked ? 'All tools verified' : 'Select all tools'}
            </span>
            <span className="ml-auto text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
              {Object.values(toolsVerified).filter(Boolean).length}/{allTools.length}
            </span>
          </button>

          {/* Individual tools */}
          <div className="divide-y divide-slate-50">
            {allTools.map((tool, i) => (
              <button
                key={`${tool}-${i}`}
                onClick={() => toggleToolVerified(tool)}
                className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-all text-left"
              >
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                  toolsVerified[tool] ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-slate-300'
                }`}>
                  {toolsVerified[tool] && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    toolsVerified[tool] ? 'bg-emerald-50' : 'bg-amber-50'
                  } transition-colors`}>
                    <Wrench className={`w-4 h-4 ${
                      toolsVerified[tool] ? 'text-emerald-500' : 'text-amber-500'
                    } transition-colors`} />
                  </div>
                  <span className={`text-sm font-medium transition-all ${
                    toolsVerified[tool] ? 'text-emerald-700 line-through opacity-70' : 'text-slate-700'
                  }`}>
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
            <span className="text-slate-400 font-medium">Verification Progress</span>
            <span className="font-bold text-slate-700">
              {Object.values(toolsVerified).filter(Boolean).length}/{allTools.length} verified
            </span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                allToolsChecked
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500'
              }`}
              style={{
                width: `${
                  (Object.values(toolsVerified).filter(Boolean).length / allTools.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setActiveStep('verify-identity')}
            className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-all text-sm flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={() => setActiveStep('confirm-checkout')}
            disabled={!allToolsChecked}
            className="flex-[2] py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue to Checkout
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderConfirmCheckoutStep = () => {
    if (!selectedVisitor) return null;
    
    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-md">
            <LogOut className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Confirm Checkout</h2>
            <p className="text-xs text-slate-400">Review your visit details</p>
          </div>
        </div>

        {/* Visit Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
          <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-5 text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border border-white/30">
                {selectedVisitor.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg">{selectedVisitor.fullName}</h3>
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
                icon: MapPin,
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
                value: new Date(selectedVisitor.timeIn).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }),
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
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-slate-700 break-words">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}

            {[...selectedVisitor.tools, ...selectedVisitor.customTools].length > 0 && (
              <div className="flex items-start gap-3 py-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Wrench className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-1.5">
                    Tools Verified ✓
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[...selectedVisitor.tools, ...selectedVisitor.customTools].map((tool) => (
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

        {/* Security notice */}
        <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-4 mb-6">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-indigo-800">Secure Checkout</p>
              <p className="text-xs text-indigo-600 mt-0.5">
                Your identity has been verified and all tools have been accounted for. 
                This checkout will be recorded in our secure audit log.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              const hasTools = [...selectedVisitor.tools, ...selectedVisitor.customTools].length > 0;
              setActiveStep(hasTools ? 'verify-tools' : 'verify-identity');
            }}
            className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-all text-sm flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="flex-[2] py-3.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-rose-500/20 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Send className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <DoorOpen className="w-5 h-5" />
                Complete Secure Checkout
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderSuccessStep = () => {
    if (!selectedVisitor) return null;
    
    return (
      <div className="animate-scale-in text-center py-4">
        <div className="relative w-28 h-28 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-ping opacity-20" />
          <div className="absolute inset-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-2xl shadow-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-white" />
          </div>
        </div>

        <PartyPopper className="w-8 h-8 text-amber-500 mx-auto mb-3" />
        <h2 className="text-2xl font-black text-slate-800 mb-1">Secure Checkout Complete!</h2>
        <p className="text-slate-500 text-sm mb-6">Thank you for visiting. Have a great day!</p>

        {/* Security badge */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 mb-6 max-w-xs mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-white" />
            <span className="text-xs uppercase tracking-widest text-white font-semibold">SECURE CHECKOUT</span>
          </div>
          <p className="text-white text-sm text-center">
            Your identity was verified and all tools were accounted for
          </p>
        </div>

        {/* Checkout receipt */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden max-w-xs mx-auto mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white text-center relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M15%2015v-2h-1v2h-2v1h2v2h1v-2h2v-1h-2z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Shield className="w-4 h-4 opacity-70" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70">
                  Secure Checkout Receipt
                </span>
              </div>
              <h3 className="font-bold text-lg">
                {selectedVisitor.fullName}
              </h3>
            </div>
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
                {new Date(selectedVisitor.timeIn).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
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
            {[...selectedVisitor.tools, ...selectedVisitor.customTools].length > 0 && (
              <div className="border-t border-slate-100 pt-2.5 mt-2.5">
                <p className="text-slate-400 mb-1.5 text-left">
                  Tools Returned
                </p>
                <div className="flex flex-wrap gap-1">
                  {[...selectedVisitor.tools, ...selectedVisitor.customTools].map((t) => (
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
          </div>
          <div className="bg-slate-50 px-4 py-3 text-center border-t border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Securely recorded · {currentTime.toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Goodbye message */}
        <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-4 mb-6 max-w-xs mx-auto">
          <p className="text-sm font-semibold text-indigo-800">
            Thank you for visiting! 🙏
          </p>
          <p className="text-xs text-indigo-500 mt-1">
            Your secure checkout has been recorded. We hope to see you again!
          </p>
        </div>

        <button
          onClick={resetFlow}
          className="w-full max-w-xs mx-auto py-3.5 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-semibold rounded-2xl shadow-lg shadow-slate-700/20 hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <DoorOpen className="w-4 h-4" />
          Done
        </button>
      </div>
    );
  };

  return (
    <div className="relative">
      <div ref={topRef} />
      
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-200/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-200/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-amber-100/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 sm:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-md">
              <DoorOpen className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Secure Checkout</h1>
          </div>
          
          {activeStep !== 'scan' && (
            <button 
              onClick={resetFlow}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 transition-all"
            >
              <X className="w-3 h-3" />
              Start Over
            </button>
          )}
        </div>

        {/* Step indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {['scan', 'verify-identity', 'verify-tools', 'confirm-checkout'].map((step, index) => {
              const isActive = activeStep === step;
              const isCompleted = 
                (activeStep === 'verify-identity' && step === 'scan') ||
                (activeStep === 'verify-tools' && (step === 'scan' || step === 'verify-identity')) ||
                (activeStep === 'confirm-checkout' && (step === 'scan' || step === 'verify-identity' || step === 'verify-tools')) ||
                (activeStep === 'success' && (step === 'scan' || step === 'verify-identity' || step === 'verify-tools' || step === 'confirm-checkout'));
              
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                      isCompleted 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' 
                        : isActive 
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-110' 
                          : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                    </div>
                    <span className={`text-[10px] font-semibold ${
                      isActive || isCompleted ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      {step === 'scan' ? 'Scan' : 
                       step === 'verify-identity' ? 'Verify' : 
                       step === 'verify-tools' ? 'Tools' : 'Checkout'}
                    </span>
                  </div>
                  
                  {index < 3 && (
                    <div className="flex-1 h-1 mx-3 rounded-full bg-slate-100 overflow-hidden -mt-5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          isCompleted ? 'bg-emerald-500' : 'bg-transparent'
                        }`}
                        style={{ width: isCompleted ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content based on step */}
        {activeStep === 'scan' && renderScanStep()}
        {activeStep === 'verify-identity' && renderVerifyIdentityStep()}
        {activeStep === 'verify-tools' && renderVerifyToolsStep()}
        {activeStep === 'confirm-checkout' && renderConfirmCheckoutStep()}
        {activeStep === 'success' && renderSuccessStep()}
        
        {successMessage && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorSmartCheckout;