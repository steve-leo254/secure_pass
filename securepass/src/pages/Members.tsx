import { useState } from "react";
import { useData } from "../context/DataContext";
import {
  Search,
  Users,
  Download,
  Eye,
  EyeOff,
  X,
  Edit3,
} from "lucide-react";
import type { Member } from "../types";

export default function Members() {
  const { members, deleteMember, updateMember } = useData();
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<"all" | "active" | "inactive">("all");
  const [editModal, setEditModal] = useState<Member | null>(null);
  const [editData, setEditData] = useState<Partial<Member>>({});
  const [successMsg, setSuccessMsg] = useState("");

  const filtered = members.filter((m) => {
    const s = search.toLowerCase();
    const matchSearch =
      !search ||
      m.fullName.toLowerCase().includes(s) ||
      m.mId.toLowerCase().includes(s) ||
      m.email.toLowerCase().includes(s) ||
      m.phoneNumber.includes(search) ||
      m.company.toLowerCase().includes(s);
    const matchStatus = statusF === "all" || m.status === statusF;
    return matchSearch && matchStatus;
  });

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleEdit = () => {
    if (!editModal) return;
    updateMember(editModal.id, editData);
    setEditModal(null);
    setEditData({});
    showSuccess("Member updated successfully");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      deleteMember(id);
      showSuccess("Member deleted successfully");
    }
  };

  const exportCSV = () => {
    const headers = [
      "Member ID",
      "Full Name",
      "Email",
      "Phone",
      "Company",
      "Department",
      "Position",
      "Status",
      "Registered",
    ];
    const rows = filtered.map((m) => [
      m.mId,
      m.fullName,
      m.email,
      m.phoneNumber,
      m.company,
      m.department,
      m.position,
      m.status,
      new Date(m.dateRegistered).toLocaleDateString(),
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((c: string | number) => `"${c}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `members-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Message */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm">
          {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Registered Members
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage and filter registered members
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusF}
            onChange={(e) => setStatusF(e.target.value as "all" | "active" | "inactive")}
            className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Count */}
          <div className="px-4 py-2.5 bg-slate-50 rounded-lg text-sm text-slate-700 font-medium">
            {filtered.length} member{filtered.length !== 1 ? "s" : ""} found
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-slate-50 to-white border-b border-slate-100">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Member ID
                </th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Name
                </th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600 hidden md:table-cell">
                  Email
                </th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600 hidden lg:table-cell">
                  Company
                </th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Status
                </th>
                <th className="text-right px-6 py-4 font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    No members found
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-blue-600 text-sm">
                        {m.mId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {m.fullName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {m.position}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 hidden md:table-cell">
                      {m.email}
                    </td>
                    <td className="px-6 py-4 text-slate-600 hidden lg:table-cell">
                      {m.company}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          m.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {m.status === "active" ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setEditModal(m);
                            setEditData({ status: m.status });
                          }}
                          className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  Edit Member
                </h3>
              </div>
              <button
                onClick={() => setEditModal(null)}
                className="p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Member ID
                </label>
                <input
                  type="text"
                  value={editModal.mId}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Status
                </label>
                <select
                  value={editData.status || editModal.status}
                  onChange={(e) =>
                    setEditData((p) => ({
                      ...p,
                      status: e.target.value as "active" | "inactive",
                    }))
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition font-medium text-gray-900 bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setEditModal(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="flex-1 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
