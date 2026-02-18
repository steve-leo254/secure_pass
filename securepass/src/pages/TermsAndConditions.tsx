import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  FileText,
  Lock,
  Eye,
  Users,
  Database,
  AlertTriangle,
  Scale,
  Globe,
  Clock,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Printer,
  Share2,
  BookOpen,
  Gavel,
  ShieldCheck,
  Fingerprint,
  Camera,
  Wrench,
  DoorOpen,
  Building2,
} from 'lucide-react';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['introduction'])
  );
  const [readProgress, setReadProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setReadProgress(Math.min(progress, 100));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setActiveSection(id);
  };

  const expandAll = () => {
    setExpandedSections(new Set(sections.map((s) => s.id)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  const lastUpdated = 'January 15, 2025';

  const sections: Section[] = [
    {
      id: 'introduction',
      title: 'Introduction & Acceptance',
      icon: <BookOpen className="w-4 h-4" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            Welcome to <strong>SECUREPASS</strong>  Access Management System
            ("the System") operated for the purposes of managing and recording the entry and
            exit of individuals at these premises.
          </p>
          <p>
            By using this System — whether through the web application, QR code registration,
            or any other access method — you acknowledge that you have read, understood, and
            agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to
            these Terms, please do not use the System and notify security personnel.
          </p>
          <p>
            These Terms constitute a legally binding agreement between you ("the Visitor,"
            "User," or "Registrant") and the premises management ("we," "us," or "the
            Property"). They apply to all visitors, contractors, technicians, delivery
            personnel, staff, and any other individual registering through SECUREPASS.
          </p>
        </div>
      ),
    },
    {
      id: 'data-collection',
      title: 'Data Collection & Registration',
      icon: <Database className="w-4 h-4" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            During the registration process, SECUREPASS collects the following personal
            information:
          </p>
          <ul className="list-none space-y-2 pl-0">
            {[
              'Full legal name',
              'Phone number',
              'National ID or Passport number',
              'Gender',
              'Purpose of visit',
              'Unit, house, or office being visited',
              'Category of visit (visitor, contractor, technician, delivery, staff)',
              'Tools and equipment carried onto the premises',
              'Time of entry and exit',
              'Name of the registering security officer',
              'Optional: additional notes',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            This data is collected solely for the purpose of premises security, visitor
            tracking, and access management. All data fields marked as required must be
            completed before registration can be finalized.
          </p>
        </div>
      ),
    },
    {
      id: 'purpose',
      title: 'Purpose of Data Processing',
      icon: <Eye className="w-4 h-4" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>Your personal data is processed for the following legitimate purposes:</p>
          <div className="grid gap-2">
            {[
              {
                title: 'Security & Safety',
                desc: 'To maintain a secure environment by recording all persons entering and exiting the premises',
              },
              {
                title: 'Access Control',
                desc: 'To verify the identity and purpose of each visitor before granting access',
              },
              {
                title: 'Accountability',
                desc: 'To track tools and equipment brought onto the premises to prevent loss or unauthorized removal',
              },
              {
                title: 'Emergency Response',
                desc: 'To have an accurate record of all individuals on the premises in case of an emergency',
              },
              {
                title: 'Audit & Compliance',
                desc: 'To maintain auditable records for property management and regulatory compliance',
              },
              {
                title: 'Communication',
                desc: 'To contact you if necessary regarding your visit or any issues related to your entry',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'privacy',
      title: 'Privacy & Data Protection',
      icon: <Lock className="w-4 h-4" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            We take the protection of your personal data seriously. The following measures
            are in place:
          </p>
          <ul className="space-y-2">
            {[
              'All data is stored in encrypted databases with industry-standard security protocols',
              'Access to visitor records is restricted through role-based access control (RBAC)',
              'Security personnel can register visitors but cannot edit or delete existing records',
              'Only authorized administrators can view, modify, export, or delete records',
              'All system actions are logged in a comprehensive audit trail',
              'Data is transmitted over secure HTTPS connections',
              'Regular security reviews and updates are performed',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            We do not sell, trade, or share your personal information with third parties for
            marketing purposes. Your data may be disclosed to law enforcement authorities if
            required by law or in the interest of safety.
          </p>
        </div>
      ),
    },
    {
      id: 'data-retention',
      title: 'Data Retention Policy',
      icon: <Clock className="w-4 h-4" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            Visitor records are retained for a period consistent with the property's security
            requirements and applicable local regulations. The typical retention periods are:
          </p>
          <div className="grid gap-2">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="font-semibold text-blue-800 text-sm">
                Active Records
              </p>
              <p className="text-xs text-blue-600 mt-0.5">
                Records of currently checked-in visitors are maintained in real-time
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <p className="font-semibold text-amber-800 text-sm">
                Historical Records
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Completed visit records are retained for up to 12 months for security and
                audit purposes
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="font-semibold text-slate-700 text-sm">
                Audit Logs
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                System audit logs are retained for up to 24 months
              </p>
            </div>
          </div>
          <p>
            After the retention period, records may be permanently deleted or anonymized.
            You may request early deletion of your records by contacting the property
            management, subject to any legal obligations requiring retention.
          </p>
        </div>
      ),
    },
    {
      id: 'tools',
      title: 'Tools & Equipment Policy',
      icon: <Wrench className="w-4 h-4" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            If you are a contractor, technician, or worker bringing tools and equipment onto
            the premises, you agree to the following:
          </p>
          <ul className="space-y-2">
            {[
              'All tools and equipment must be declared during the check-in process',
              'Tools must be selected from the predefined list or entered as custom items',
              'You are solely responsible for the safety and custody of your tools while on the premises',
              'During checkout, all declared tools must be verified before you are cleared to exit',
              'Failure to account for all tools may result in delayed exit and investigation',
              'The premises management is not liable for any loss or damage to your tools',
              'Unauthorized tools or prohibited items may be confiscated by security',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Wrench className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: 'visitor-obligations',
      title: 'Visitor Obligations & Conduct',
      icon: <Users className="w-4 h-4" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>By entering the premises, you agree to:</p>
          <ul className="space-y-2">
            {[
              'Provide accurate and truthful information during registration',
              'Present a valid identification document upon request',
              'Follow all instructions from security personnel',
              'Complete the checkout process before leaving the premises',
              'Restrict your visit to the stated purpose and designated areas',
              'Not engage in any illegal, disruptive, or unsafe activities',
              'Report any security concerns or suspicious activities to security personnel',
              'Comply with all posted rules, regulations, and safety procedures of the premises',
              'Not tamper with, damage, or attempt to bypass any security systems',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="p-3 bg-red-50 rounded-xl border border-red-100 mt-3">
            <p className="text-sm font-semibold text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Important Notice
            </p>
            <p className="text-xs text-red-600 mt-1">
              Providing false information, refusing to cooperate with security, or violating
              these terms may result in denial of entry, removal from the premises, or
              reporting to law enforcement.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'qr-code',
      title: 'QR Code & Self-Registration',
      icon: <Fingerprint className="w-4 h-4" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            SECUREPASS provides QR code functionality for contactless registration and
            checkout. By using the QR code system:
          </p>
          <ul className="space-y-2">
            {[
              'You consent to being redirected to the SECUREPASS registration or checkout page',
              'Self-registration submissions are subject to verification by security personnel',
              'Security personnel may request additional verification or documentation',
              'QR code scans may be logged for system optimization and security purposes',
              'Self-checkout requires verification of all tools and equipment before completion',
              'False or incomplete self-registrations may be rejected or flagged for review',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Fingerprint className="w-3.5 h-3.5 text-purple-500 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: 'checkout',
      title: 'Checkout Requirements',
      icon: <DoorOpen className="w-4 h-4" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            All visitors are required to complete the checkout process before leaving the
            premises. The checkout process includes:
          </p>
          <ul className="space-y-2">
            {[
              'Verification of your identity by security or through the self-checkout system',
              'Confirmation that all registered tools and equipment are accounted for',
              'Recording of the exact exit time for accurate visit records',
              'Acknowledgment of any materials, passes, or items that need to be returned',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <DoorOpen className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            Failure to properly check out will result in your record showing as still on
            premises, which may affect future visits and trigger security alerts.
          </p>
        </div>
      ),
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: <Scale className="w-4 h-4" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            While SECUREPASS and the premises management take reasonable measures to ensure
            the security and safety of visitors:
          </p>
          <ul className="space-y-2">
            {[
              'The premises management is not liable for any personal injury, theft, or property damage occurring on the premises, except where caused by gross negligence',
              'SECUREPASS is provided "as is" without warranties of any kind, express or implied',
              'We do not guarantee uninterrupted or error-free operation of the System',
              'The premises management is not responsible for technical issues, data loss due to system failures, or unauthorized access beyond our reasonable control',
              'Visitors enter the premises at their own risk and are advised to take reasonable precautions',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Scale className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: 'your-rights',
      title: 'Your Rights',
      icon: <Gavel className="w-4 h-4" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>Under applicable data protection laws, you have the right to:</p>
          <div className="grid gap-2">
            {[
              { right: 'Access', desc: 'Request a copy of your personal data held in the system' },
              { right: 'Correction', desc: 'Request correction of inaccurate or incomplete data' },
              { right: 'Deletion', desc: 'Request deletion of your data (subject to legal retention requirements)' },
              { right: 'Restriction', desc: 'Request restriction of processing in certain circumstances' },
              { right: 'Objection', desc: 'Object to the processing of your data for certain purposes' },
              { right: 'Complaint', desc: 'Lodge a complaint with the relevant data protection authority' },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="font-semibold text-emerald-800 text-sm">
                  Right to {item.right}
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
          <p>
            To exercise any of these rights, please contact the property management office
            using the details provided below.
          </p>
        </div>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to These Terms',
      icon: <FileText className="w-4 h-4" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            We reserve the right to modify these Terms at any time. Changes will be effective
            immediately upon posting to the SECUREPASS system. Your continued use of the
            System after changes are posted constitutes acceptance of the modified Terms.
          </p>
          <p>
            Material changes will be communicated through notices displayed at the security
            desk or on the registration page. We encourage you to review these Terms
            periodically.
          </p>
          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-sm font-semibold text-indigo-700">
              Last Updated: {lastUpdated}
            </p>
            <p className="text-xs text-indigo-500 mt-0.5">Version 1.0</p>
          </div>
        </div>
      ),
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: <Mail className="w-4 h-4" />,
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            For questions, concerns, or requests regarding these Terms or your personal data,
            please contact:
          </p>
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800">
                  SECUREPASS Property Management
                </p>
                <p className="text-xs text-slate-400">Data Controller</p>
              </div>
            </div>
            <div className="space-y-2 pl-52px">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-sm">privacy@securepass.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-sm">+254 700 000 000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-sm">
                  Property Management Office, Ground Floor
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/20">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-200">
        <div
          className="h-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-1 z-40 bg-white/80 backdrop-blur-2xl border-b border-slate-200/50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-extrabold text-slate-800">
                SECUREPASS
              </span>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-indigo-500/20">
            <Gavel className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">
            Terms & Conditions
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Please read these terms carefully before using the SECUREPASS
            Visitor & Access Management System
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Last updated: {lastUpdated}
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="w-3 h-3" />
              {sections.length} sections
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all border border-indigo-100"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
            >
              Collapse All
            </button>
          </div>
          <span className="text-xs text-slate-400">
            {Math.round(readProgress)}% read
          </span>
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section, i) => {
            const isExpanded = expandedSections.has(section.id);
            return (
              <div
                key={section.id}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? 'border-indigo-200 shadow-md shadow-indigo-100/50'
                    : 'border-slate-100 shadow-sm hover:border-slate-200'
                }`}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50/50 transition-colors"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isExpanded
                        ? 'bg-linear-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {section.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-slate-400 font-medium">
                      Section {i + 1}
                    </span>
                    <h3
                      className={`font-bold text-sm ${
                        isExpanded ? 'text-indigo-700' : 'text-slate-700'
                      }`}
                    >
                      {section.title}
                    </h3>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      isExpanded
                        ? 'bg-indigo-100 text-indigo-600 rotate-180'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-5 pt-1 pl-60 animate-fade-in">
                    {section.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Acceptance Banner */}
        <div className="mt-8 bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.04%22%3E%3Cpath%20d%3D%22M20%2020v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
          <div className="relative z-10 text-center">
            <ShieldCheck className="w-10 h-10 text-white/80 mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">
              Your Privacy & Security Matter
            </h3>
            <p className="text-sm text-indigo-200 max-w-md mx-auto mb-4">
              By using SECUREPASS, you agree to these Terms and Conditions. We are
              committed to protecting your data and ensuring a safe environment.
            </p>
            <Link
              to="/visitor-register"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all shadow-lg text-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Proceed to Registration
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-[11px] text-slate-400">
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

export default TermsAndConditions;