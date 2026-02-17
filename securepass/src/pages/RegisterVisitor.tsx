import { useState, useCallback, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import type { VisitorCategory, Gender } from "../types";
import {
  UserPlus,
  User,
  Phone,
  CreditCard,
  MapPin,
  FileText,
  Wrench,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

const GENDERS: Gender[] = ["male", "female", "other"];

interface FormData {
  fullName: string;
  phoneNumber: string;
  nationalId: string;
  category: VisitorCategory | "";
  purposeOfVisit: string;
  gender: Gender | "";
  unitVisited: string;
  tools: string[];
  customTool: string;
}

const INITIAL: FormData = {
  fullName: "",
  phoneNumber: "",
  nationalId: "",
  category: "",
  purposeOfVisit: "",
  gender: "",
  unitVisited: "",
  tools: [],
  customTool: "",
};

const InputWrapper = ({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon: typeof User;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
      <Icon className="w-4 h-4 text-slate-400" />
      {label}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <span className="w-3 h-3 text-red-400">⚠</span>
        {error}
      </p>
    )}
  </div>
);

export default function RegisterVisitor() {
  const { user } = useAuth();
  const { addVisitor, tools: toolsList, categories } = useData();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const set = useCallback((field: keyof FormData, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const toggleTool = useCallback((tool: string) => {
    setForm((prev) => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter((t) => t !== tool)
        : [...prev.tools, tool],
    }));
  }, []);

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Required";
    if (!form.nationalId.trim()) e.nationalId = "Required";
    if (!form.category) e.category = "Required";
    if (!form.purposeOfVisit.trim()) e.purposeOfVisit = "Required";
    if (!form.gender) e.gender = "Required";
    if (!form.unitVisited.trim()) e.unitVisited = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const allTools = [...form.tools];
    const customToolsList = form.customTool.trim() ? [form.customTool.trim()] : [];

    addVisitor({
      fullName: form.fullName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      idNumber: form.nationalId.trim(),
      category: form.category as VisitorCategory,
      purpose: form.purposeOfVisit.trim(),
      gender: form.gender as Gender,
      unitVisited: form.unitVisited.trim(),
      tools: allTools,
      customTools: customToolsList,
      registeredBy: user?.name || "Unknown",
      checkedOutBy: null,
    });

    setSuccess(true);
    setForm(INITIAL);
    setTimeout(() => setSuccess(false), 3000);
  }, [form, validate, addVisitor, user?.name]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Success Toast */}
      {success && (
        <div className="fixed top-6 right-6 z-50 animate-slide-up">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="font-bold">Visitor Registered!</p>
              <p className="text-sm text-emerald-100">
                Successfully checked in
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Register Visitor
            </h1>
            <p className="text-sm text-slate-500">
              Enter visitor details for check-in
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Personal Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputWrapper label="Full Name" icon={User} error={errors.fullName}>
              <input
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                placeholder="Enter full name"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${
                  errors.fullName
                    ? "border-red-300 focus:ring-red-200"
                    : "border-slate-200 focus:ring-blue-200 focus:border-blue-400"
                }`}
              />
            </InputWrapper>

            <InputWrapper
              label="Phone Number"
              icon={Phone}
              error={errors.phoneNumber}
            >
              <input
                value={form.phoneNumber}
                onChange={(e) => set("phoneNumber", e.target.value)}
                placeholder="+254 7XX XXX XXX"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${
                  errors.phoneNumber
                    ? "border-red-300 focus:ring-red-200"
                    : "border-slate-200 focus:ring-blue-200 focus:border-blue-400"
                }`}
              />
            </InputWrapper>

            <InputWrapper
              label="National ID / Passport"
              icon={CreditCard}
              error={errors.nationalId}
            >
              <input
                value={form.nationalId}
                onChange={(e) => set("nationalId", e.target.value)}
                placeholder="Enter ID or Passport number"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${
                  errors.nationalId
                    ? "border-red-300 focus:ring-red-200"
                    : "border-slate-200 focus:ring-blue-200 focus:border-blue-400"
                }`}
              />
            </InputWrapper>

            <InputWrapper label="Gender" icon={User} error={errors.gender}>
              <div className="relative">
                <select
                  value={form.gender}
                  onChange={(e) => set("gender", e.target.value)}
                  className={`w-full appearance-none border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition bg-white ${
                    errors.gender
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-200 focus:ring-blue-200 focus:border-blue-400"
                  } ${!form.gender ? "text-slate-400" : "text-slate-800"}`}
                >
                  <option value="">Select gender</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </InputWrapper>
          </div>
        </div>

        {/* Visit Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Visit Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputWrapper
              label="Registration Category"
              icon={FileText}
              error={errors.category}
            >
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className={`w-full appearance-none border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition bg-white ${
                    errors.category
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-200 focus:ring-blue-200 focus:border-blue-400"
                  } ${!form.category ? "text-slate-400" : "text-slate-800"}`}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </InputWrapper>

            <InputWrapper
              label="Unit / Space Visited"
              icon={MapPin}
              error={errors.unitVisited}
            >
              <input
                value={form.unitVisited}
                onChange={(e) => set("unitVisited", e.target.value)}
                placeholder="e.g., Unit 4B, Office Floor 3"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition ${
                  errors.unitVisited
                    ? "border-red-300 focus:ring-red-200"
                    : "border-slate-200 focus:ring-blue-200 focus:border-blue-400"
                }`}
              />
            </InputWrapper>

            <div className="md:col-span-2">
              <InputWrapper
                label="Purpose of Visit"
                icon={FileText}
                error={errors.purposeOfVisit}
              >
                <textarea
                  value={form.purposeOfVisit}
                  onChange={(e) => set("purposeOfVisit", e.target.value)}
                  placeholder="Describe the purpose of the visit..."
                  rows={3}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition resize-none ${
                    errors.purposeOfVisit
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-200 focus:ring-blue-200 focus:border-blue-400"
                  }`}
                />
              </InputWrapper>
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-slate-400" />
              Tools & Equipment
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any tools being brought into the premises
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {toolsList.map((tool) => (
                <button
                  key={tool}
                  type="button"
                  onClick={() => toggleTool(tool)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                    form.tools.includes(tool)
                      ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {form.tools.includes(tool) && (
                    <span className="mr-1.5">✓</span>
                  )}
                  {tool}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-slate-600 mb-2 block">
                Other tool (manual entry)
              </label>
              <input
                value={form.customTool}
                onChange={(e) => set("customTool", e.target.value)}
                placeholder="Enter custom tool name"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
              />
            </div>

            {form.tools.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                <p className="text-xs font-semibold text-blue-700 mb-2">
                  Selected Tools ({form.tools.length}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {form.tools.map((t) => (
                    <span
                      key={t}
                      className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-lg"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setForm(INITIAL)}
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Register & Check In
          </button>
        </div>
      </form>
    </div>
  );
}
