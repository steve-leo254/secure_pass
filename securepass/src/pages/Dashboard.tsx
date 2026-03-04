import React from "react";
import { useVisitors } from "../context/VistorContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserX,
  HardHat,
  UserPlus,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Activity,
  Wrench as WrenchIcon,
  BarChart3,
} from "lucide-react";
import { CATEGORIES } from "../types";
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard: React.FC = () => {
  const { getStats, getActiveVisitors, getTodayVisitors, getDailyData } =
    useVisitors();
  const { user, userRole } = useAuth();
  const stats = getStats();
  const activeVisitors = getActiveVisitors();
  const todayVisitors = getTodayVisitors();
  const dailyData = getDailyData(7);

  const statCards = [
    {
      label: "Total Today",
      value: stats.totalToday,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/20",
    },
    {
      label: "Currently In",
      value: stats.currentlyIn,
      icon: UserCheck,
      gradient: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20",
    },
    {
      label: "Checked Out",
      value: stats.checkedOut,
      icon: UserX,
      gradient: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/20",
    },
    {
      label: "Contractors",
      value: stats.contractors,
      icon: HardHat,
      gradient: "from-violet-500 to-purple-500",
      shadow: "shadow-violet-500/20",
    },
  ];

  const categoryStats = [
    {
      label: "Visitors",
      value: stats.visitors,
      color: "bg-blue-500",
      icon: "👤",
    },
    {
      label: "Contractors",
      value: stats.contractors,
      color: "bg-orange-500",
      icon: "🔧",
    },
    {
      label: "Technicians",
      value: stats.technicians,
      color: "bg-purple-500",
      icon: "⚙️",
    },
    {
      label: "Deliveries",
      value: stats.deliveries,
      color: "bg-green-500",
      icon: "📦",
    },
    { label: "Staff", value: stats.staff, color: "bg-indigo-500", icon: "🏢" },
  ];

  const getCategoryBadge = (category: string) => {
    return (
      CATEGORIES.find((c) => c.value === category) || {
        label: category,
        color: "bg-gray-500",
        icon: "👤",
      }
    );
  };

  const ChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-3">
          <p className="text-xs font-semibold text-slate-800 mb-1">{label}</p>
          <p className="text-xs text-indigo-600 font-bold">
            {payload[0].value} visitors
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="animate-fade-in">
        <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <p className="text-indigo-200  text-center font-bold mb-1">Welcome back,</p>
              <h1 className="text-2xl lg:text-3xl   font-bold">
                {user?.name} 👋
              </h1>
              <p className="text-indigo-200 text-xs font-bold text-center mt-2">
                Here's what's happening at your premises today.
              </p>
            </div>
            <div className="flex gap-2 self-center">
              <Link
                to="/register"
                className="px-4 py-2.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-sm flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Register Visitor
              </Link>
              {(userRole === "property_manager" || userRole === "system_admin") && (
                <Link
                  to="/analytics"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-50/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 text-sm"
                >
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`animate-fade-in bg-white rounded-2xl p-5 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-xl bg-linear-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow}`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>Live</span>
                </div>
              </div>
              <h3 className="text-3xl font-black text-slate-800">
                {stat.value}
              </h3>
              <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Mini Trend Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-fade-in shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">7-Day Trend</h3>
            {(userRole === "property_manager" || userRole === "system_admin") && (
              <Link
                to="/analytics"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                Details <ArrowUpRight className="w-3 h-3" />
              </Link>
            )}
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                />
                <YAxis hide allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#miniGrad)"
                  dot={{ r: 2.5, fill: "#6366f1", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-fade-in shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Active by Category</h3>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-4">
            {categoryStats.map((cat) => {
              const total = stats.currentlyIn || 1;
              const pct = Math.round((cat.value / total) * 100) || 0;
              return (
                <div key={cat.label} className="flex items-center gap-3">
                  <span className="text-lg">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-600">
                        {cat.label}
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        {cat.value}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cat.color} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Visitors List */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-fade-in shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Currently In</h3>
            <Link
              to="/active"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {activeVisitors.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
                <Users className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-slate-400 font-medium text-sm">
                No active visitors
              </p>
              <p className="text-xs text-slate-300 mt-1">All clear</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {activeVisitors.slice(0, 6).map((visitor) => {
                const badge = getCategoryBadge(visitor.category);
                return (
                  <div
                    key={visitor.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg ${badge.color} flex items-center justify-center text-white text-sm`}
                    >
                      {badge.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-700 text-sm truncate">
                        {visitor.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {visitor.unitVisited}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        {format(new Date(visitor.timeIn), "HH:mm")}
                      </div>
                      {[...visitor.tools, ...visitor.customTools].length >
                        0 && (
                        <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-0.5">
                          <WrenchIcon className="w-3 h-3" />
                          {[...visitor.tools, ...visitor.customTools].length}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Today's Table */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-fade-in shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800">Today's Activity</h3>
          <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg font-medium">
            {todayVisitors.length} entries
          </span>
        </div>
        {todayVisitors.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">No activity recorded today</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Visitor", "Category", "Unit", "Time In", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {todayVisitors.slice(0, 10).map((visitor) => {
                  const badge = getCategoryBadge(visitor.category);
                  return (
                    <tr
                      key={visitor.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg ${badge.color} flex items-center justify-center text-white text-xs font-bold`}
                          >
                            {visitor.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-700 text-sm">
                              {visitor.fullName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {visitor.phoneNumber}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-xs font-medium text-slate-600">
                          {badge.icon} {badge.label}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-sm text-slate-600">
                        {visitor.unitVisited}
                      </td>
                      <td className="py-3 pr-4 text-sm text-slate-600">
                        {format(new Date(visitor.timeIn), "HH:mm")}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            visitor.status === "checked-in"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-slate-50 text-slate-500 border border-slate-100"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${visitor.status === "checked-in" ? "bg-emerald-500" : "bg-slate-400"}`}
                          ></span>
                          {visitor.status === "checked-in" ? "In" : "Out"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
