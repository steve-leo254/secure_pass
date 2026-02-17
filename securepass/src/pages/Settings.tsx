import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVisitors } from '../context/VistorContext';
import { format } from 'date-fns';
import type { Visitor } from '../types/index';
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
            ['Email', `${user?.username || ''}@securepass.com`],
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
              {visitors.filter((v: Visitor) => v.status === 'checked-in').length}
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
    </div>
  );
};

export default Settings;