import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useVisitors } from "../context/VistorContext";
import type { Visitor, VisitorCategory, Gender } from "../types";
import {
  Search,
  Download,
  FileText,
  Edit3,
  Trash2,
  X,
  ChevronDown,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const CAT_BADGE: Record<string, string> = {
  Contractor: "bg-orange-100 text-orange-700",
  Technician: "bg-blue-100 text-blue-700",
  "Delivery Personnel": "bg-purple-100 text-purple-700",
  Staff: "bg-emerald-100 text-emerald-700",
  "Customer / Visitor": "bg-indigo-100 text-indigo-700",
};

export default function AllRecords() {
  const { user } = useAuth();
  const { visitors, editVisitor, deleteVisitor, categories } = useVisitors();
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [catF, setCatF] = useState("all");
  const [editModal, setEditModal] = useState<Visitor | null>(null);
  const [deleteModal, setDeleteModal] = useState<Visitor | null>(null);
  const [editData, setEditData] = useState<Partial<Visitor>>({});
  const [successMsg, setSuccessMsg] = useState("");

  const filtered = visitors.filter((v) => {
    const s = search.toLowerCase();
    const matchSearch =
      !search ||
      v.fullName.toLowerCase().includes(s) ||
      v.idNumber.includes(search) ||
      v.phoneNumber.includes(search) ||
      v.unitVisited.toLowerCase().includes(s);
    const matchStatus = statusF === "all" || v.status === statusF;
    const matchCat = catF === "all" || v.category === catF;
    return matchSearch && matchStatus && matchCat;
  });

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleEdit = () => {
    if (!editModal) return;
    editVisitor(editModal.id, editData, user?.name || "Admin");
    setEditModal(null);
    setEditData({});
    showSuccess("Record updated successfully");
  };

  const handleDelete = () => {
    if (!deleteModal) return;
    deleteVisitor(deleteModal.id, user?.name || "Admin");
    setDeleteModal(null);
    showSuccess("Record deleted successfully");
  };

  const exportCSV = () => {
    const headers = [
      "Full Name",
      "Phone",
      "ID Number",
      "Category",
      "Purpose",
      "Gender",
      "Unit",
      "Tools",
      "Time In",
      "Time Out",
      "Status",
    ];
    const rows = filtered.map((v) => [
      v.fullName,
      v.phoneNumber,
      v.idNumber,
      v.category,
      v.purpose,
      v.gender,
      v.unitVisited,
      v.tools.join("; "),
      new Date(v.timeIn).toLocaleString(),
      v.timeOut ? new Date(v.timeOut).toLocaleString() : "Still Inside",
      v.status,
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => r.map((c) => `"${c}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `securepass-records-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 animate-slide-up">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">All Records</h1>
            <p className="text-sm text-slate-500">
              {visitors.length} total records
            </p>
          </div>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records..."
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            />
          </div>
          <div className="flex gap-3 items-center">
            <Filter className="w-4 h-4 text-slate-400 hidden lg:block" />
            <div className="relative">
              <select
                value={statusF}
                onChange={(e) => setStatusF(e.target.value)}
                className="appearance-none border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              >
                <option value="all">All Status</option>
                <option value="checked-in">Checked In</option>
                <option value="checked-out">Checked Out</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={catF}
                onChange={(e) => setCatF(e.target.value)}
                className="appearance-none border border-slate-200 rounded-xl px-4 py-3 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Visitor
                </th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600">
                  Category
                </th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600 hidden lg:table-cell">
                  ID Number
                </th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600 hidden md:table-cell">
                  Unit
                </th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600 hidden xl:table-cell">
                  Tools
                </th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600">
                  Time In
                </th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600 hidden md:table-cell">
                  Time Out
                </th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600">
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
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    No records found
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {v.fullName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {v.phoneNumber}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          CAT_BADGE[v.category] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {v.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600 hidden lg:table-cell">
                      {v.idNumber}
                    </td>
                    <td className="px-4 py-4 text-slate-600 hidden md:table-cell">
                      {v.unitVisited}
                    </td>
                    <td className="px-4 py-4 hidden xl:table-cell">
                      {v.tools.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {v.tools.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="bg-amber-50 text-amber-700 text-[10px] font-medium px-2 py-0.5 rounded"
                            >
                              {t}
                            </span>
                          ))}
                          {v.tools.length > 2 && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              +{v.tools.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs">
                          {new Date(v.timeIn).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(v.timeIn).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600 hidden md:table-cell">
                      {v.timeOut ? (
                        <>
                          <span className="text-xs">
                            {new Date(v.timeOut).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <br />
                          <span className="text-[10px] text-slate-400">
                            {new Date(v.timeOut).toLocaleDateString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          v.status === "checked-in"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {v.status === "checked-in" ? "● In" : "Out"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditModal(v);
                            setEditData({
                              fullName: v.fullName,
                              phoneNumber: v.phoneNumber,
                              idNumber: v.idNumber,
                              category: v.category,
                              purpose: v.purpose,
                              gender: v.gender,
                              unitVisited: v.unitVisited,
                            });
                          }}
                          className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal(v)}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-400">
            Showing {filtered.length} of {visitors.length} records
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  Edit Record
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
              {[
                { key: "fullName", label: "Full Name", type: "text" },
                { key: "phoneNumber", label: "Phone Number", type: "text" },
                { key: "idNumber", label: "ID / Passport", type: "text" },
                { key: "unitVisited", label: "Unit Visited", type: "text" },
                {
                  key: "purpose",
                  label: "Purpose of Visit",
                  type: "textarea",
                },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={
                        (editData[field.key as keyof Visitor] as string) || ""
                      }
                      onChange={(e) =>
                        setEditData((p) => ({
                          ...p,
                          [field.key]: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none font-medium text-gray-800"
                    />
                  ) : (
                    <input
                      value={
                        (editData[field.key as keyof Visitor] as string) || ""
                      }
                      onChange={(e) =>
                        setEditData((p) => ({
                          ...p,
                          [field.key]: e.target.value,
                        }))
                      }
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
                    />
                  )}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={editData.category || ""}
                      onChange={(e) =>
                        setEditData((p) => ({
                          ...p,
                          category: e.target.value as VisitorCategory,
                        }))
                      }
                      className="w-full appearance-none border-2 border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      value={editData.gender || ""}
                      onChange={(e) =>
                        setEditData((p) => ({
                          ...p,
                          gender: e.target.value as Gender,
                        }))
                      }
                      className="w-full appearance-none border-2 border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
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
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Delete Record?
              </h3>
              <p className="text-sm text-slate-500">
                Are you sure you want to delete the record for{" "}
                <span className="font-semibold text-slate-700">
                  {deleteModal.fullName}
                </span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.98] transition-all"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
