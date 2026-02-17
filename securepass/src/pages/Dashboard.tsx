<<<<<<< HEAD
import React from 'react';
import { useVisitors } from '../context/VistorContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { CATEGORIES } from '../types';
import { format } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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
      label: 'Total Today',
      value: stats.totalToday,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/20',
    },
    {
      label: 'Currently In',
      value: stats.currentlyIn,
      icon: UserCheck,
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/20',
    },
    {
      label: 'Checked Out',
      value: stats.checkedOut,
      icon: UserX,
      gradient: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-500/20',
    },
    {
      label: 'Contractors',
      value: stats.contractors,
      icon: HardHat,
      gradient: 'from-violet-500 to-purple-500',
      shadow: 'shadow-violet-500/20',
    },
  ];

  const categoryStats = [
    { label: 'Visitors', value: stats.visitors, color: 'bg-blue-500', icon: '👤' },
    { label: 'Contractors', value: stats.contractors, color: 'bg-orange-500', icon: '🔧' },
    { label: 'Technicians', value: stats.technicians, color: 'bg-purple-500', icon: '⚙️' },
    { label: 'Deliveries', value: stats.deliveries, color: 'bg-green-500', icon: '📦' },
    { label: 'Staff', value: stats.staff, color: 'bg-indigo-500', icon: '🏢' },
  ];

  const getCategoryBadge = (category: string) => {
    return (
      CATEGORIES.find((c) => c.value === category) || {
        label: category,
        color: 'bg-gray-500',
        icon: '👤',
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
    <div className="space-y-6">
      {/* Welcome */}
      <div className="animate-fade-in">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <p className="text-indigo-200 text-sm mb-1">Welcome back,</p>
              <h1 className="text-2xl lg:text-3xl font-bold">
                {user?.name} 👋
              </h1>
              <p className="text-indigo-200 text-sm mt-2">
                Here's what's happening at your premises today.
              </p>
            </div>
            <div className="flex gap-3 self-start">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-200 shadow-lg text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Register Visitor
              </Link>
              {userRole === 'admin' && (
                <Link
                  to="/analytics"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200 text-sm"
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
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow}`}
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
            {userRole === 'admin' && (
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
                  tick={{ fontSize: 9, fill: '#94a3b8' }}
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
                  dot={{ r: 2.5, fill: '#6366f1', strokeWidth: 0 }}
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
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        {format(new Date(visitor.timeIn), 'HH:mm')}
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
                  {['Visitor', 'Category', 'Unit', 'Time In', 'Status'].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4"
                      >
                        {h}
                      </th>
                    )
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
                        {format(new Date(visitor.timeIn), 'HH:mm')}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            visitor.status === 'checked-in'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-slate-50 text-slate-500 border border-slate-100'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${visitor.status === 'checked-in' ? 'bg-emerald-500' : 'bg-slate-400'}`}
                          ></span>
                          {visitor.status === 'checked-in' ? 'In' : 'Out'}
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
=======
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { UserPlus, IdCard, Users as UsersIcon, FileText, Settings as SettingsIcon } from "lucide-react";

<<<<<<< HEAD
/* ─────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────── */

const CATEGORIES = [
  "Contractor",
  "Technician",
  "Delivery Personnel",
  "Staff",
  "Customer / Visitor",
];

const CATEGORY_COLORS = ["#60a5fa", "#7c3aed", "#f59e0b", "#34d399", "#ef4444"];

// Simple SVG Line Chart component
function LineChartSVG({ labels, values, height = 80 }: { labels: string[]; values: number[]; height?: number; }) {
  const max = Math.max(...values, 1);
  const w = 320;
  const h = height;
  const gap = w / Math.max(labels.length - 1, 1);
  const points = values.map((v, i) => `${i * gap},${h - (v / max) * (h - 10)}`);
  const poly = points.join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="rounded">
      <defs>
        <linearGradient id="lg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={poly} fill="none" stroke="#2563eb" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={`${poly} ${w},${h} 0,${h}`} fill="url(#lg)" stroke="none" />
      {points.map((p, idx) => {
        const [x, y] = p.split(",").map(Number);
        return <circle key={idx} cx={x} cy={y} r={2.5} fill="#1e40af" />;
      })}
    </svg>
  );
}

// Simple SVG Bar Chart component
function BarChartSVG({ labels, values, height = 100, colors = [] }: { labels: string[]; values: number[]; height?: number; colors?: string[] }) {
  const max = Math.max(...values, 1);
  const w = 320;
  const colW = w / Math.max(labels.length, 1);
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      {values.map((v, i) => {
        const barH = (v / max) * (height - 20);
        const x = i * colW + colW * 0.15;
        const bw = colW * 0.7;
        const y = height - barH;
        const fill = colors[i] || "#7c3aed";
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={barH} rx={4} fill={fill} />
            <text x={x + bw / 2} y={height - 4} fontSize={10} textAnchor="middle" fill="#475569">
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Simple SVG Pie Chart component
function PieChartSVG({ values, colors = [], size = 120 }: { values: number[]; colors?: string[]; size?: number }) {
  const total = values.reduce((s, v) => s + v, 0) || 1;
  let acc = 0;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {values.map((v, i) => {
        const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
        acc += v;
        const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
        const x1 = cx + r * Math.cos(start);
        const y1 = cy + r * Math.sin(start);
        const x2 = cx + r * Math.cos(end);
        const y2 = cy + r * Math.sin(end);
        const large = end - start > Math.PI ? 1 : 0;
        const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
        const fill = colors[i] || [`#60a5fa`, `#34d399`, `#f59e0b`, `#a78bfa`, `#ef4444`][i % 5];
        return <path key={i} d={path} fill={fill} stroke="#fff" strokeWidth={1} />;
      })}
    </svg>
  );
}
const MOCK_VISITORS = [
  { id:1, fullName:"Marcus Obi", category:"Staff", status:"active", timeIn:new Date().setHours(7,12), tools:[] },
  { id:2, fullName:"Lena Hoffman", category:"Contractor", status:"active", timeIn:new Date().setHours(7,45), tools:["Drill"] },
  { id:3, fullName:"James Patel", category:"Technician", status:"checked-out", timeIn:new Date().setHours(8,3), tools:["Laptop"] },
  { id:4, fullName:"Aisha Koroma", category:"Delivery Personnel", status:"checked-out", timeIn:new Date().setHours(8,30), tools:[] },
  { id:5, fullName:"David Chukwu", category:"Customer / Visitor", status:"active", timeIn:new Date().setHours(9,10), tools:[] },
  { id:6, fullName:"Sofia Brandt", category:"Staff", status:"active", timeIn:new Date().setHours(9,22), tools:[] },
];

const HOURLY_DATA = [
  { hour:"06:00", ins:2, outs:0 },
  { hour:"07:00", ins:8, outs:1 },
  { hour:"08:00", ins:15, outs:4 },
  { hour:"09:00", ins:22, outs:7 },
  { hour:"10:00", ins:18, outs:11 },
  { hour:"11:00", ins:12, outs:9 },
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

const initials = (name: string): string =>
  name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();



/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
=======
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
>>>>>>> refs/remotes/origin/main

export default function Dashboard() {
  const { user } = useAuth();
  const { members = [] } = useData();
  const visitors = MOCK_VISITORS;
  const activeVisitors = visitors.filter(v=>v.status==="active");

  const today = new Date().toDateString();
  const todayAll = visitors.filter(v=>new Date(v.timeIn).toDateString()===today);
  const todayOut = todayAll.filter(v=>v.status==="checked-out");
  const totalTools = activeVisitors.reduce((s,v)=>s+v.tools.length,0);

  const [tab,setTab] = useState("area");

  

  

  return (
    <>
      <style>{`
        body { margin:0; font-family:Inter, sans-serif; }
        .root {
          min-height:100vh;
          padding:24px;
          background:linear-gradient(to bottom right,#f1f5f9,#e2e8f0);
        }
        .header {
          display:flex;
          justify-content:space-between;
          flex-wrap:wrap;
          gap:16px;
          margin-bottom:24px;
        }
        .stats {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:16px;
          margin-bottom:24px;
        }
        .charts {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
          gap:16px;
          margin-bottom:24px;
        }
        .bottom {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
          gap:16px;
        }
        .card {
          background:#fff;
          border-radius:16px;
          padding:20px;
          box-shadow:0 6px 20px rgba(15, 15, 15, 0.05);
          transition: transform 0.14s ease, box-shadow 0.14s ease;
          display:block;
        }
        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 34px rgba(2,6,23,0.08);
        }
        .nav-icon { width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border-radius:8px; background:#f1f5f9; margin-right:10px }
        .nav-count { margin-left:auto; background:#eef2ff; color:#1e3a8a; padding:6px 8px; border-radius:999px; font-weight:700; font-size:12px }
        .stat-value {
          font-size:28px;
          font-weight:800;
          margin-top:6px;
        }
        .visitor-row {
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:10px 0;
          border-bottom:1px solid #0a0e11;
        }
        .visitor-row:last-child { border-bottom:none; }
        button.tab {
          padding:6px 12px;
          border-radius:8px;
          border:none;
          cursor:pointer;
          font-size:12px;
          font-weight:600;
        }
      `}</style>

      <div className="root">

        {/* HEADER */}
        <div className="header">
          <div>
            <h1 style={{margin:0,fontSize:26,fontWeight:800}}>Control Centre</h1>
            <p style={{marginTop:4,color:"#64748b"}}>
              {new Date().toDateString()}
            </p>
          </div>
        </div>

        {/* NAV LINKS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,marginBottom:16}}>
          <Link to="/register" className="card" style={{display:'flex',alignItems:'center',gap:12,padding:14}}>
            <span className="nav-icon"><UserPlus size={16} /></span>
            <div style={{display:'flex',flexDirection:'column'}}>
              <strong>Register Visitor</strong>
              <span style={{fontSize:12,color:'#64748b'}}>Quickly add a new visitor</span>
            </div>
            <span className="nav-count">{todayAll.length}</span>
          </Link>

          <Link to="/member-register" className="card" style={{display:'flex',alignItems:'center',gap:12,padding:14}}>
            <span className="nav-icon"><IdCard size={16} /></span>
            <div style={{display:'flex',flexDirection:'column'}}>
              <strong>Register Member</strong>
              <span style={{fontSize:12,color:'#64748b'}}>Self-service member registration</span>
            </div>
            <span className="nav-count">{members?.length ?? 0}</span>
          </Link>

          <Link to="/active" className="card" style={{display:'flex',alignItems:'center',gap:12,padding:14}}>
            <span className="nav-icon"><UsersIcon size={16} /></span>
            <div style={{display:'flex',flexDirection:'column'}}>
              <strong>Active Visitors</strong>
              <span style={{fontSize:12,color:'#64748b'}}>View currently inside</span>
            </div>
            <span className="nav-count">{activeVisitors.length}</span>
          </Link>

          {user?.role === 'admin' && (
            <Link to="/records" className="card" style={{display:'flex',alignItems:'center',gap:12,padding:14}}>
              <span className="nav-icon"><FileText size={16} /></span>
              <div style={{display:'flex',flexDirection:'column'}}>
                <strong>All Records</strong>
                <span style={{fontSize:12,color:'#64748b'}}>Audit and reporting</span>
              </div>
              <span className="nav-count">{visitors.length}</span>
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link to="/members" className="card" style={{display:'flex',alignItems:'center',gap:12,padding:14}}>
              <span className="nav-icon"><UsersIcon size={16} /></span>
              <div style={{display:'flex',flexDirection:'column'}}>
                <strong>Members</strong>
                <span style={{fontSize:12,color:'#64748b'}}>Manage registered members</span>
              </div>
              <span className="nav-count">{members?.length ?? 0}</span>
            </Link>
          )}

          <Link to="/settings" className="card" style={{display:'flex',alignItems:'center',gap:12,padding:14}}>
            <span className="nav-icon"><SettingsIcon size={16} /></span>
            <div style={{display:'flex',flexDirection:'column'}}>
              <strong>Settings</strong>
              <span style={{fontSize:12,color:'#64748b'}}>Configure app options</span>
            </div>
          </Link>
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="card">
            Visitors Today
            <div className="stat-value">{todayAll.length}</div>
          </div>
          <div className="card">
            Currently Inside
            <div className="stat-value">{activeVisitors.length}</div>
          </div>
          <div className="card">
            Checked Out
            <div className="stat-value">{todayOut.length}</div>
          </div>
          <div className="card">
            Tools On Site
            <div className="stat-value">{totalTools}</div>
          </div>
        </div>

        {/* CHARTS: lightweight SVG visualizations */}
        <div className="charts">
          <div className="card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
              <h3 style={{margin:0}}>Visitor Traffic (hourly)</h3>
              <div>
                <button className="tab" onClick={()=>setTab("line")} style={{background:tab==="line"?"#f1f6fa":"transparent"}}>Line</button>
                <button className="tab" onClick={()=>setTab("bar")} style={{background:tab==="bar"?"#f2f4f7":"transparent"}}>Bar</button>
              </div>
            </div>
            <div style={{marginTop:12}}>
              {tab === "bar" ? (
                <BarChartSVG labels={HOURLY_DATA.map(d=>d.hour)} values={HOURLY_DATA.map(d=>d.ins)} height={140} />
              ) : (
                <LineChartSVG labels={HOURLY_DATA.map(d=>d.hour)} values={HOURLY_DATA.map(d=>d.ins)} height={140} />
              )}
            </div>
          </div>

          <div className="card">
            <h3 style={{margin:0}}>Status Split</h3>
            <div style={{display:"flex",alignItems:"center",gap:12,marginTop:12}}>
              <PieChartSVG values={[activeVisitors.length, todayOut.length]} colors={["#10b981","#94a3b8"]} size={120} />
              <div>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}><span style={{width:10,height:10,background:"#10b981",borderRadius:2}}/> Active: <strong style={{marginLeft:6}}>{activeVisitors.length}</strong></div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{width:10,height:10,background:"#94a3b8",borderRadius:2}}/> Checked Out: <strong style={{marginLeft:6}}>{todayOut.length}</strong></div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{margin:0}}>Visitors by Category</h3>
            <div style={{marginTop:12}}>
              <BarChartSVG labels={CATEGORIES.map(c=>c.split(" ")[0])} values={CATEGORIES.map(c=>visitors.filter(v=>v.category===c).length)} height={140} colors={CATEGORY_COLORS} />
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="bottom">

          <div className="card">
            <h3>Visitors by Category</h3>
            <div style={{marginTop:12}}>
              <BarChartSVG
                labels={CATEGORIES.map(c => c.split(" ")[0])}
                values={CATEGORIES.map(c => visitors.filter(v => v.category === c).length)}
                height={160}
                colors={CATEGORY_COLORS}
              />
            </div>
          </div>

          <div className="card">
            <h3>Recent Visitors</h3>
            {todayAll.map(v=>(
              <div key={v.id} className="visitor-row">
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{
                    width:36,height:36,
                    borderRadius:8,
                    background:"#e2e8f0",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontWeight:700
                  }}>
                    {initials(v.fullName)}
                  </div>
                  <div>
                    <div style={{fontWeight:600}}>{v.fullName}</div>
                    <div style={{fontSize:12,color:"#64748b"}}>{v.category}</div>
                  </div>
                </div>
                <div style={{
                  width:8,height:8,
                  borderRadius:"50%",
                  background:v.status==="active"?"#10b981":"#cbd5e1"
                }}/>
              </div>
            ))}
          </div>

        </div>

      </div>
    </>
  );
}
>>>>>>> 07f94bbfdb4e5fa2d368c2686c5a7d6d993d8bdc
