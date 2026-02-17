import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import {
  UserPlus,
  CheckCircle2,
  Mail,
  Phone,
  Building2,
  Briefcase,
  CreditCard,
  User,
} from "lucide-react";
import type { Gender } from "../types";

const GENDERS: Gender[] = ["male", "female", "other"];

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  department: string;
  position: string;
  company: string;
  idNumber: string;
  gender: Gender | "";
}

const INITIAL: FormData = {
  fullName: "",
  email: "",
  phoneNumber: "",
  department: "",
  position: "",
  company: "",
  idNumber: "",
  gender: "",
};

export default function MemberRegister() {
  const navigate = useNavigate();
  const { addMember } = useData();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [memberId, setMemberId] = useState("");

  const set = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Required";
    if (!form.department.trim()) e.department = "Required";
    if (!form.position.trim()) e.position = "Required";
    if (!form.company.trim()) e.company = "Required";
    if (!form.idNumber.trim()) e.idNumber = "Required";
    if (!form.gender) e.gender = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const member = addMember({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
      department: form.department.trim(),
      position: form.position.trim(),
      company: form.company.trim(),
      idNumber: form.idNumber.trim(),
      gender: form.gender as Gender,
      status: "active",
    });

    setMemberId(member.mId);
    setSuccess(true);
    setForm(INITIAL);
    setTimeout(() => {
      setSuccess(false);
      navigate("/members");
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Success Toast */}
      {success && (
        <div className="fixed top-6 right-6 z-50 animate-slide-up">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="font-bold">Member Registered!</p>
              <p className="text-sm text-emerald-100">ID: {memberId}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Member Registration
            </h1>
            <p className="text-sm text-slate-500">
              Register as a member to get a unique ID
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
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                placeholder="Enter full name"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition font-medium ${
                  errors.fullName
                    ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                    : "border-gray-300 focus:ring-green-200 focus:border-green-400 text-gray-900"
                }`}
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="Enter email"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition font-medium ${
                  errors.email
                    ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                    : "border-gray-300 focus:ring-green-200 focus:border-green-400 text-gray-900"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => set("phoneNumber", e.target.value)}
                placeholder="Enter phone number"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition font-medium ${
                  errors.phoneNumber
                    ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                    : "border-gray-300 focus:ring-green-200 focus:border-green-400 text-gray-900"
                }`}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Gender *
              </label>
              <select
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition font-medium bg-white ${
                  errors.gender
                    ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                    : "border-gray-300 focus:ring-green-200 focus:border-green-400 text-gray-900"
                } ${!form.gender ? "text-gray-400" : "text-gray-900"}`}
              >
                <option value="">Select gender</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </option>
                ))}
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>

            {/* ID Number */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                <CreditCard className="w-4 h-4 inline mr-2" />
                ID / Passport Number *
              </label>
              <input
                type="text"
                value={form.idNumber}
                onChange={(e) => set("idNumber", e.target.value)}
                placeholder="Enter ID number"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition font-medium ${
                  errors.idNumber
                    ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                    : "border-gray-300 focus:ring-green-200 focus:border-green-400 text-gray-900"
                }`}
              />
              {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Work Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Company */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                Company / Organization *
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="Enter company name"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition font-medium ${
                  errors.company
                    ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                    : "border-gray-300 focus:ring-green-200 focus:border-green-400 text-gray-900"
                }`}
              />
              {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Department *
              </label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => set("department", e.target.value)}
                placeholder="Enter department"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition font-medium ${
                  errors.department
                    ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                    : "border-gray-300 focus:ring-green-200 focus:border-green-400 text-gray-900"
                }`}
              />
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>

            {/* Position */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Position / Job Title *
              </label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => set("position", e.target.value)}
                placeholder="Enter job title"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition font-medium ${
                  errors.position
                    ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                    : "border-gray-300 focus:ring-green-200 focus:border-green-400 text-gray-900"
                }`}
              />
              {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.98] transition-all"
          >
            Register as Member
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
