import { useState } from "react";
import { useData } from "../context/DataContext";
import { DEFAULT_USERS } from "../context/AuthContext";
import {
  Settings as SettingsIcon,
  Wrench,
  Users,
  ScrollText,
  Plus,
  X,
  Shield,
  CheckCircle2,
} from "lucide-react";

const TABS = [
  { id: "tools", label: "Tools Management", icon: Wrench },
  { id: "users", label: "User Management", icon: Users },
  { id: "audit", label: "Audit Logs", icon: ScrollText },
];

export default function Settings() {
    const { tools, addTool, removeTool, auditLogs } = useData();
  const [tab, setTab] = useState("tools");
  const [newTool, setNewTool] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddTool = () => {
    if (!newTool.trim()) return;
    if (tools.includes(newTool.trim())) {
      return;
    }
    addTool(newTool.trim());
    setNewTool("");
    setSuccess("Tool added successfully");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Toast */}
      {success && (
        <div className="fixed top-6 right-6 z-50 animate-slide-up">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">{success}</span>
          </div>
        </div>
      )}

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
    </div>
  );
}