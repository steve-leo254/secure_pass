import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import {
  Users,
  UserCheck,
  UserX,
  Wrench,
  UserPlus,
  ClipboardCheck,
  QrCode,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";

const CAT_COLORS: Record<string, string> = {
  Contractor: "bg-orange-500",
  Technician: "bg-blue-500",
  "Delivery Personnel": "bg-purple-500",
  Staff: "bg-emerald-500",
  };

const CAT_BADGE: Record<string, string> = {
  Contractor: "bg-orange-100 text-orange-700",
  Technician: "bg-blue-100 text-blue-700",
  "Delivery Personnel": "bg-purple-100 text-purple-700",
  Staff: "bg-emerald-100 text-emerald-700",
  };

export default function Dashboard() {
  const { user } = useAuth();
  const { visitors, activeVisitors, auditLogs } = useData();

  const today = new Date().toDateString();
  const todayAll = visitors.filter(
    (v) => new Date(v.timeIn).toDateString() === today
  );
  const todayOut = todayAll.filter((v) => v.status === "checked-out");
  const totalTools = activeVisitors.reduce(
    (sum, v) => sum + v.tools.length,
    0
  );

  const stats = [
    {
      label: "Visitors Today",
      value: todayAll.length,
      icon: Users,
      grad: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      iconBg: "bg-blue-500",
    },
    {
      label: "Currently Inside",
      value: activeVisitors.length,
      icon: UserCheck,
      grad: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      iconBg: "bg-emerald-500",
    },
    {
      label: "Checked Out",
      value: todayOut.length,
      icon: UserX,
      grad: "from-amber-500 to-amber-600",
      bg: "bg-amber-50",
      iconBg: "bg-amber-500",
    },
    {
      label: "Tools On Site",
      value: totalTools,
      icon: Wrench,
      grad: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      iconBg: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time overview of visitor activity
          </p>
        </div>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all"
        >
          <UserPlus className="w-4 h-4" />
          New Visitor
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{s.label}</p>
                <p className="text-3xl font-extrabold text-slate-800 mt-2 tracking-tight">
                  {s.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${s.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <s.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Today's data</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Visitors */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Recent Visitors
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Latest check-ins and check-outs
              </p>
            </div>
            <Link
              to="/active"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {todayAll.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No visitors today</p>
                <p className="text-sm mt-1">
                  Visitors will appear here once registered
                </p>
              </div>
            ) : (
              todayAll.slice(0, 6).map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/80 transition"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      CAT_COLORS[v.category] || "bg-slate-500"
                    }`}
                  >
                    {v.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm">
                      {v.fullName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {v.category} · {v.unitVisited}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        v.status === "checked-in"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {v.status === "checked-in" ? "● Inside" : "Exited"}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(v.timeIn).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2.5">
              <Link
                to="/register"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all group"
              >
                <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-sm text-slate-700">
                  Register Visitor
                </span>
              </Link>
              <Link
                to="/active"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all group"
              >
                <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ClipboardCheck className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-sm text-slate-700">
                  Security Desk
                </span>
              </Link>
              <Link
                to="/qr"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-all group"
              >
                <div className="w-9 h-9 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <QrCode className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-sm text-slate-700">
                  QR Code Access
                </span>
              </Link>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Active by Category
            </h3>
            <div className="space-y-3">
              {Object.keys(CAT_COLORS).map((cat) => {
                const count = activeVisitors.filter(
                  (v) => v.category === cat
                ).length;
                const total = activeVisitors.length || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-600">
                        {cat}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {count}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${CAT_COLORS[cat]} transition-all duration-700`}
                        style={{ width: `${count > 0 ? Math.max(pct, 8) : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs (Admin) */}
      {user?.role === "admin" && auditLogs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">
              Recent Activity
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              System audit log
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {auditLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{log.details}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(log.timestamp).toLocaleString()} ·{" "}
                      {log.performedBy}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      log.action === "REGISTER"
                        ? "bg-blue-50 text-blue-600"
                        : log.action === "CHECKOUT"
                        ? "bg-emerald-50 text-emerald-600"
                        : log.action === "DELETE"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {log.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}