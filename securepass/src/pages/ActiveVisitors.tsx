import { useState } from "react";
import { useVisitors } from "../context/VistorContext";
import { useAuth } from "../context/AuthContext";
import type { Visitor } from "../types";
import {
  Search,
  Users,
  LogOut as LogOutIcon,
  MapPin,
  Clock,
  Wrench,
  Phone,
  CreditCard,
  X,
  AlertTriangle,
  CheckCircle2,
  Shield,
} from "lucide-react";

const CAT_COLORS: Record<string, string> = {
  Contractor: "bg-orange-500",
  Technician: "bg-blue-500",
  "Delivery Personnel": "bg-purple-500",
  Staff: "bg-emerald-500",
  "Customer / Visitor": "bg-indigo-500",
};

const CAT_BADGE: Record<string, string> = {
  Contractor: "bg-orange-100 text-orange-700",
  Technician: "bg-blue-100 text-blue-700",
  "Delivery Personnel": "bg-purple-100 text-purple-700",
  Staff: "bg-emerald-100 text-emerald-700",
  "Customer / Visitor": "bg-indigo-100 text-indigo-700",
};

export default function ActiveVisitors() {
  const { getActiveVisitors, checkoutVisitor } = useVisitors();
  const { user } = useAuth();
  const activeVisitors = getActiveVisitors();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [modal, setModal] = useState<Visitor | null>(null);
  const [toolsVerified, setToolsVerified] = useState(false);

  const isPropertyManager = user?.role === 'property_manager';
  const isSecurity = user?.role === 'security';

  const filtered = activeVisitors.filter((v) => {
    const matchSearch =
      v.fullName.toLowerCase().includes(search.toLowerCase()) ||
      v.idNumber.includes(search) ||
      v.unitVisited.toLowerCase().includes(search.toLowerCase()) ||
      v.phoneNumber.includes(search);
    const matchCat = catFilter === "all" || v.category === catFilter;
    return matchSearch && matchCat;
  });

  const handleCheckout = () => {
    if (!modal) return;
    checkoutVisitor(modal.id);
    setModal(null);
    setToolsVerified(false);
  };

  const elapsed = (timeIn: string) => {
    const ms = Date.now() - new Date(timeIn).getTime();
    const hrs = Math.floor(ms / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const allCats = ["all", ...Object.keys(CAT_COLORS)];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isPropertyManager 
              ? 'bg-linear-to-br from-blue-500 to-indigo-600' 
              : 'bg-linear-to-br from-emerald-500 to-teal-600'
          }`}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {isPropertyManager ? 'Property Overview' : 'Security Desk'}
            </h1>
            <p className="text-sm text-slate-500">
              {activeVisitors.length} individual
              {activeVisitors.length !== 1 ? "s" : ""} currently inside
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            isPropertyManager ? 'bg-blue-500' : 'bg-emerald-500'
          }`} />
          <span className={`text-sm font-semibold ${
            isPropertyManager ? 'text-blue-700' : 'text-emerald-700'
          }`}>
            {isPropertyManager ? 'Live Status' : 'Live Monitoring'}
          </span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // Search is already filtered, no additional action needed
                }
              }}
              placeholder="Search by name, ID, phone, or unit..."
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {allCats.map((cat) => (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  catFilter === cat
                    ? "bg-slate-800 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat === "all" ? "All" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visitor Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-400">
            No Active Visitors
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {search || catFilter !== "all"
              ? "No results match your filters"
              : "No one is currently checked in"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                        CAT_COLORS[v.category] || "bg-slate-500"
                      }`}
                    >
                      {v.fullName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">
                        {v.fullName}
                      </h3>
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold mt-0.5 ${
                          CAT_BADGE[v.category] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {v.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[11px] font-semibold">IN</span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{v.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <span>{v.idNumber}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{v.unitVisited}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>
                      {new Date(v.timeIn).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      · {elapsed(v.timeIn)} ago
                    </span>
                  </div>
                </div>

                {/* Tools */}
                {v.tools.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Wrench className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Tools ({v.tools.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {v.tools.map((t: string) => (
                        <span
                          key={t}
                          className="bg-amber-50 text-amber-700 text-[11px] font-medium px-2 py-1 rounded-lg border border-amber-200/50"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => {
                    setModal(v);
                    setToolsVerified(v.tools.length === 0);
                  }}
                  className="w-full py-2.5 bg-linear-to-r from-red-500 to-rose-600 text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.98] transition-all flex items-end justify-center gap-2"
                >
                  <LogOutIcon className="w-4 h-4" />
                  Check Out
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Checkout Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <LogOutIcon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Confirm Checkout
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verify details before checking out
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setModal(null);
                  setToolsVerified(false);
                }}
                className="p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Visitor info */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                    CAT_COLORS[modal.category] || "bg-slate-500"
                  }`}
                >
                  {modal.fullName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">
                    {modal.fullName}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {modal.category} · {modal.unitVisited}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Checked in at{" "}
                    {new Date(modal.timeIn).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    ({elapsed(modal.timeIn)})
                  </p>
                </div>
              </div>

              {/* Tools verification */}
              {modal.tools.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <h4 className="font-bold text-slate-800">
                      Tools Verification Required
                    </h4>
                  </div>
                  <p className="text-sm text-slate-500">
                    Verify that all tools are accounted for before checkout:
                  </p>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200/50">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {modal.tools.map((t: string) => (
                        <span
                          key={t}
                          className="bg-white text-amber-700 text-sm font-medium px-3 py-1.5 rounded-lg border border-amber-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={toolsVerified}
                        onChange={(e) => setToolsVerified(e.target.checked)}
                        className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-200"
                      />
                      <span className="text-sm font-semibold text-amber-800">
                        I confirm all {modal.tools.length} tool(s) have been
                        verified and accounted for
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => {
                  setModal(null);
                  setToolsVerified(false);
                }}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={modal.tools.length > 0 && !toolsVerified}
                className="flex-1 py-3 bg-linear-to-r from-red-500 to-rose-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
