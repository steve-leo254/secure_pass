import React, { useState } from 'react';
import { useVisitors } from '../context/VistorContext';
import { CATEGORIES } from '../types';
import { format } from 'date-fns';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  MapPin,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Minus,
  PieChart as PieChartIcon,
  AreaChart as AreaChartIcon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line,
} from 'recharts';

const AdminAnalytics: React.FC = () => {
  const {
    getStats,
    getHourlyData,
    getDailyData,
    getCategoryData,
    getTopUnits,
    getPeakHours,
    getGenderData,
    getWeeklyComparison,
    getAverageVisitDuration,
    visitors,
    getRecentActivity,
    getTodayVisitors,
  } = useVisitors();

  const [dailyRange, setDailyRange] = useState<7 | 14 | 30>(7);

  const stats = getStats();
  const hourlyData = getHourlyData();
  const dailyData = getDailyData(dailyRange);
  const categoryData = getCategoryData();
  const topUnits = getTopUnits();
  const peakHours = getPeakHours();
  const genderData = getGenderData();
  const weeklyComparison = getWeeklyComparison();
  const avgDuration = getAverageVisitDuration();
  const recentActivity = getRecentActivity(10);
  const todayVisitors = getTodayVisitors();

  const CHART_COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-3 min-w-[140px]">
          <p className="text-xs font-semibold text-slate-800 mb-1.5">{label}</p>
          {payload.map((entry: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span className="text-slate-500 capitalize">
                  {entry.dataKey === 'checkIns' ? 'Check Ins' : entry.dataKey === 'checkOuts' ? 'Check Outs' : entry.name || entry.dataKey}
                </span>
              </div>
              <span className="font-bold text-slate-800">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-3">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: payload[0].payload.color }}
            ></span>
            <span className="text-xs font-semibold text-slate-800">
              {payload[0].name}
            </span>
          </div>
          <p className="text-lg font-black text-slate-800 mt-1">
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CHECK_IN': return 'text-emerald-600 bg-emerald-50';
      case 'CHECK_OUT': return 'text-amber-600 bg-amber-50';
      case 'DELETE': return 'text-red-600 bg-red-50';
      case 'UPDATE': return 'text-blue-600 bg-blue-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-indigo-500" />
              Analytics & Reports
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Comprehensive overview of visitor data and trends
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 animate-fade-in">
        {[
          {
            label: 'Total Today',
            value: stats.totalToday,
            icon: Users,
            gradient: 'from-blue-500 to-cyan-500',
            shadow: 'shadow-blue-500/15',
          },
          {
            label: 'Currently In',
            value: stats.currentlyIn,
            icon: Activity,
            gradient: 'from-emerald-500 to-teal-500',
            shadow: 'shadow-emerald-500/15',
          },
          {
            label: 'Checked Out',
            value: stats.checkedOut,
            icon: ArrowUpRight,
            gradient: 'from-amber-500 to-orange-500',
            shadow: 'shadow-amber-500/15',
          },
          {
            label: 'Avg Duration',
            value: avgDuration,
            icon: Clock,
            gradient: 'from-violet-500 to-purple-500',
            shadow: 'shadow-violet-500/15',
            isText: true,
          },
          {
            label: 'Weekly Change',
            value:
              weeklyComparison.change > 0
                ? `+${weeklyComparison.change.toFixed(0)}%`
                : weeklyComparison.change === 0
                  ? '0%'
                  : `${weeklyComparison.change.toFixed(0)}%`,
            icon:
              weeklyComparison.change > 0
                ? TrendingUp
                : weeklyComparison.change < 0
                  ? TrendingDown
                  : Minus,
            gradient:
              weeklyComparison.change >= 0
                ? 'from-emerald-500 to-green-500'
                : 'from-red-500 to-rose-500',
            shadow:
              weeklyComparison.change >= 0
                ? 'shadow-emerald-500/15'
                : 'shadow-red-500/15',
            isText: true,
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg ${card.shadow}`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3
                className={`${(card as any).isText ? 'text-xl' : 'text-2xl'} font-black text-slate-800 leading-none`}
              >
                {card.value}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Daily Trend - Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AreaChartIcon className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-slate-800">Daily Visitor Trend</h3>
            </div>
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              {([7, 14, 30] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDailyRange(d)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    dailyRange === d
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {d}D
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorCheckIns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCheckOuts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="checkIns"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCheckIns)"
                  dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="checkOuts"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCheckOuts)"
                  dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-3 h-0.5 bg-indigo-500 rounded-full"></span>
              Check Ins
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-3 h-0.5 bg-amber-500 rounded-full"></span>
              Check Outs
            </div>
          </div>
        </div>

        {/* Category Distribution - Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-slate-800">Category Distribution</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData.filter((d) => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {categoryData
                    .filter((d) => d.value > 0)
                    .map((entry, index) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {categoryData.filter((d) => d.value > 0).length === 0 ? (
            <p className="text-center text-sm text-slate-400 mt-2">
              No data for today yet
            </p>
          ) : (
            <div className="space-y-2 mt-4">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    ></span>
                    <span className="text-slate-600">{cat.icon} {cat.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{cat.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Hourly Distribution - Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-slate-800">
              Today's Hourly Distribution
            </h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData.filter((_, i) => i >= 6 && i <= 22)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="hour"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  interval={1}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="checkIns"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={20}
                />
                <Bar
                  dataKey="checkOuts"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution - Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-slate-800">Gender Distribution (Today)</h3>
          </div>
          <div className="flex items-center gap-8">
            <div className="h-44 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {genderData
                      .filter((d) => d.value > 0)
                      .map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {genderData.map((g) => (
                <div key={g.name} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-md"
                    style={{ backgroundColor: g.color }}
                  ></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {g.value}
                    </p>
                    <p className="text-[11px] text-slate-400">{g.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {genderData.every((d) => d.value === 0) && (
            <p className="text-center text-sm text-slate-400 mt-4">
              No data for today yet
            </p>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Visited Units */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-slate-800">Top Visited Units</h3>
          </div>
          <div className="space-y-3">
            {topUnits.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                No data yet
              </p>
            ) : (
              topUnits.slice(0, 8).map((item, i) => {
                const maxCount = topUnits[0].count;
                const pct = (item.count / maxCount) * 100;
                return (
                  <div key={item.unit}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-600 truncate max-w-[150px]">
                          {item.unit}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">
                        {item.count}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden ml-7">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-slate-800">Peak Hours (All Time)</h3>
          </div>
          <div className="space-y-3">
            {peakHours.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                No data yet
              </p>
            ) : (
              peakHours.map((item, i) => {
                const maxCount = peakHours[0].count;
                const pct = (item.count / maxCount) * 100;
                const hourLabel = `${item.hour.toString().padStart(2, '0')}:00 - ${(item.hour + 1).toString().padStart(2, '0')}:00`;
                const colors = [
                  'from-red-500 to-rose-500',
                  'from-orange-500 to-amber-500',
                  'from-yellow-500 to-amber-400',
                  'from-emerald-500 to-green-500',
                  'from-blue-500 to-cyan-500',
                ];
                return (
                  <div key={item.hour}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-md bg-gradient-to-br ${colors[i]} flex items-center justify-center text-white text-[10px] font-bold`}
                        >
                          {i + 1}
                        </div>
                        <span className="text-sm font-medium text-slate-600">
                          {hourLabel}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">
                        {item.count}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden ml-7">
                      <div
                        className={`h-full bg-gradient-to-r ${colors[i]} rounded-full transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-slate-800">Activity Timeline</h3>
          </div>
          <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                No activity yet
              </p>
            ) : (
              recentActivity.map((log, i) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0"
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${getActionColor(log.action)}`}
                    >
                      {log.action === 'CHECK_IN' ? (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      ) : log.action === 'CHECK_OUT' ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <Activity className="w-3.5 h-3.5" />
                      )}
                    </div>
                    {i < recentActivity.length - 1 && (
                      <div className="absolute top-7 left-1/2 -translate-x-1/2 w-px h-4 bg-slate-100"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-xs font-medium text-slate-700 truncate leading-tight">
                      {log.details}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {format(new Date(log.timestamp), 'HH:mm · MMM d')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Weekly Comparison Card */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.04%22%3E%3Cpath%20d%3D%22M20%2020v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-4">Weekly Performance Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-indigo-200 text-xs mb-1">This Week</p>
              <p className="text-3xl font-black">
                {weeklyComparison.thisWeek}
              </p>
              <p className="text-indigo-200 text-xs mt-1">visitors</p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-indigo-200 text-xs mb-1">Last Week</p>
              <p className="text-3xl font-black">
                {weeklyComparison.lastWeek}
              </p>
              <p className="text-indigo-200 text-xs mt-1">visitors</p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-indigo-200 text-xs mb-1">Change</p>
              <p className="text-3xl font-black flex items-center gap-1">
                {weeklyComparison.change > 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : weeklyComparison.change < 0 ? (
                  <TrendingDown className="w-5 h-5" />
                ) : (
                  <Minus className="w-5 h-5" />
                )}
                {Math.abs(weeklyComparison.change).toFixed(0)}%
              </p>
              <p className="text-indigo-200 text-xs mt-1">
                {weeklyComparison.change >= 0 ? 'increase' : 'decrease'}
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-indigo-200 text-xs mb-1">Total Records</p>
              <p className="text-3xl font-black">{visitors.length}</p>
              <p className="text-indigo-200 text-xs mt-1">all time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;