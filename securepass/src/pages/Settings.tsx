import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVisitors } from '../context/VistorContext';
import { format } from 'date-fns';
import SeedData from './SeedData';
import {
  User,
  Database,
  Clock,
  Trash2,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Activity,
  Sparkles,
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { visitors, auditLogs } = useVisitors();
  const [showClearModal, setShowClearModal] = useState(false);

  const clearAllData = () => {
    localStorage.removeItem('securepass_visitors');
    localStorage.removeItem('securepass_audit');
    setShowClearModal(false);
    window.location.reload();
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CHECK_IN':
        return 'text-emerald-600 bg-emerald-50';
      case 'CHECK_OUT':
        return 'text-amber-600 bg-amber-50';
      case 'DELETE':
        return 'text-red-600 bg-red-50';
      case 'UPDATE':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-xl font-bold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage system configuration and preferences
        </p>
      </div>

      {/* Demo Data Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-indigo-800">Demo Data</h3>
            <p className="text-xs text-indigo-500">
              Populate the system with sample data to explore all features
            </p>
          </div>
        </div>
        <SeedData />
      </div>

      {/* User Info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="font-bold text-slate-800">Account Information</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            ['Name', user?.name || ''],
            ['Username', user?.username || ''],
            ['Role', user?.role || ''],
            ['Email', `${user?.username}@securepass.com`],
          ].map(([label, value]) => (
            <div key={label} className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-400 font-medium mb-1">
                {label}
              </p>
              <p className="text-sm font-semibold text-slate-700 capitalize">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* System Stats */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Database className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-slate-800">System Statistics</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-2xl font-black text-slate-800">
              {visitors.length}
            </p>
            <p className="text-xs text-slate-400 mt-1">Total Records</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-2xl font-black text-slate-800">
              {visitors.filter((v) => v.status === 'checked-in').length}
            </p>
            <p className="text-xs text-slate-400 mt-1">Active Visitors</p>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-2xl font-black text-slate-800">
              {auditLogs.length}
            </p>
            <p className="text-xs text-slate-400 mt-1">Audit Entries</p>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-bold text-slate-800">Audit Logs</h3>
          <span className="ml-auto text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg font-medium">
            {auditLogs.length} entries
          </span>
        </div>
        <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
          {auditLogs.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">
              No audit entries yet
            </p>
          ) : (
            auditLogs.slice(0, 30).map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActionColor(log.action)}`}
                >
                  {log.action === 'CHECK_IN' ? (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  ) : log.action === 'CHECK_OUT' ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <Activity className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 font-medium truncate">
                    {log.details}
                  </p>
                  <p className="text-xs text-slate-400">
                    by {log.performedBy}
                  </p>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {format(new Date(log.timestamp), 'MMM d, HH:mm')}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-red-700">Danger Zone</h3>
            <p className="text-xs text-red-400">Irreversible actions</p>
          </div>
        </div>
        <button
          onClick={() => setShowClearModal(true)}
          className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all border border-red-100 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear All Data
        </button>
      </div>

      {/* Clear Data Modal */}
      {showClearModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowClearModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full shadow-2xl animate-scale-in p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Clear All Data?
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                This will permanently delete all visitor records and audit logs.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={clearAllData}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all text-sm"
                >
                  Clear Everything
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
<<<<<<< HEAD
=======

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center">
          <SettingsIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-sm text-slate-500">
            System configuration and management
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                tab === t.id
                  ? "border-blue-600 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Tools Tab */}
          {tab === "tools" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-800 mb-1">
                  Predefined Tools List
                </h3>
                <p className="text-sm text-slate-500">
                  Manage tools available for selection during visitor
                  registration
                </p>
              </div>

              {/* Add Tool */}
              <div className="flex gap-3">
                <input
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTool()}
                  placeholder="Enter tool name..."
                  className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800 placeholder-gray-400"
                />
                <button
                  onClick={handleAddTool}
                  disabled={!newTool.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all disabled:opacity-40 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Tool
                </button>
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tools.map((tool) => (
                  <div
                    key={tool}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-slate-200 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Wrench className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-700 text-sm">
                        {tool}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        removeTool(tool);
                        setSuccess("Tool removed");
                        setTimeout(() => setSuccess(""), 2000);
                      }}
                      className="p-1.5 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {tab === "users" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-800 mb-1">System Users</h3>
                <p className="text-sm text-slate-500">
                  View registered users and their roles
                </p>
              </div>
              <div className="space-y-3">
                {DEFAULT_USERS.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                        u.role === "admin"
                          ? "bg-gradient-to-br from-purple-500 to-violet-600"
                          : "bg-gradient-to-br from-blue-500 to-cyan-600"
                      }`}
                    >
                      {u.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800">{u.name}</p>
                      <p className="text-sm text-slate-500">@{u.username}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {u.role === "admin"
                          ? "Administrator"
                          : "Security Personnel"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Logs Tab */}
          {tab === "audit" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Audit Logs</h3>
                <p className="text-sm text-slate-500">
                  Complete history of all system actions ({auditLogs.length}{" "}
                  entries)
                </p>
              </div>

              {auditLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <ScrollText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No audit logs yet</p>
                  <p className="text-sm mt-1">
                    Actions will be recorded here automatically
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left px-5 py-3 font-semibold text-slate-600">
                          Action
                        </th>
                        <th className="text-left px-5 py-3 font-semibold text-slate-600">
                          Details
                        </th>
                        <th className="text-left px-5 py-3 font-semibold text-slate-600">
                          Performed By
                        </th>
                        <th className="text-left px-5 py-3 font-semibold text-slate-600">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {auditLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-50/50 transition"
                        >
                          <td className="px-5 py-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
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
                          </td>
                          <td className="px-5 py-3 text-slate-700">
                            {log.details}
                          </td>
                          <td className="px-5 py-3 text-slate-500">
                            {log.performedBy}
                          </td>
                          <td className="px-5 py-3 text-slate-400 text-xs">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
>>>>>>> 07f94bbfdb4e5fa2d368c2686c5a7d6d993d8bdc
    </div>
  );
};

export default Settings;