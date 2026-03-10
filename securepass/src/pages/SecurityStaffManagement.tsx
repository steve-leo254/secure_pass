import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import {
  Shield,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Users,
  Mail,
  Phone,
  Clock,
} from "lucide-react";

interface SecurityStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  shift: string;
  username: string;
  status: string;
  property_id: string;
  created_at: string;
}

interface SecurityStaffCreate {
  name: string;
  email: string;
  phone: string;
  department: string;
  shift: string;
  username: string;
  property_id: string;
}

const DEPARTMENTS = [
  "Security",
  "Access Control",
  "Patrol",
  "Surveillance",
  "Emergency Response",
];

const SHIFTS = [
  { value: "day", label: "Day Shift (6AM - 6PM)" },
  { value: "night", label: "Night Shift (6PM - 6AM)" },
  { value: "mixed", label: "Mixed Shift" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active", color: "bg-emerald-100 text-emerald-700" },
  { value: "inactive", label: "Inactive", color: "bg-slate-100 text-slate-500" },
  { value: "suspended", label: "Suspended", color: "bg-red-100 text-red-700" },
];

export default function SecurityStaffManagement() {
  const [activeTab, setActiveTab] = useState("staff");
  const [securityStaff, setSecurityStaff] = useState<SecurityStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [editingStaff, setEditingStaff] = useState<SecurityStaff | null>(null);
  
  // Form state for new staff
  const [newStaff, setNewStaff] = useState<SecurityStaffCreate>({
    name: "",
    email: "",
    phone: "",
    department: "",
    shift: "day",
    username: "",
    property_id: "sys-98f9b0cb", // Use a valid system user ID
  });

  // Generate automatic employee ID
  const generateEmployeeId = () => {
    const prefix = "EMP";
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${randomNum}`;
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Fetch security staff
  const fetchSecurityStaff = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSecurityStaffByProperty("sys-98f9b0cb");
      setSecurityStaff(data);
    } catch (error) {
      console.error("Error fetching security staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityStaff();
  }, []);

  const handleAddStaff = async () => {
    if (!newStaff.name || !newStaff.email || !newStaff.username) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const staffWithAutoId = {
        ...newStaff,
        employee_id: generateEmployeeId()
      };
      const response = await apiService.createSecurityStaff(staffWithAutoId);
      
      // Show success message based on email status
      if (response.email_sent) {
        showSuccess(`Security staff registered successfully! Welcome email sent to ${newStaff.email}`);
      } else {
        showSuccess(`Security staff registered successfully! Temporary password: ${response.temp_password}`);
      }
      
      setNewStaff({
        name: "",
        email: "",
        phone: "",
        department: "",
        shift: "day",
        username: "",
        property_id: "sys-98f9b0cb",
      });
      fetchSecurityStaff();
    } catch (error) {
      console.error("Error registering security staff:", error);
      alert("Failed to register security staff");
    }
  };

  const handleUpdateStaff = async () => {
    if (!editingStaff) return;

    try {
      await apiService.updateSecurityStaff(editingStaff.id, editingStaff);
      showSuccess("Security staff updated successfully");
      setEditingStaff(null);
      fetchSecurityStaff();
    } catch (error) {
      console.error("Error updating security staff:", error);
      alert("Failed to update security staff");
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Are you sure you want to delete this security staff member?")) {
      return;
    }

    try {
      await apiService.deleteSecurityStaff(id);
      showSuccess("Security staff deleted successfully");
      fetchSecurityStaff();
    } catch (error) {
      console.error("Error deleting security staff:", error);
      alert("Failed to delete security staff");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    return statusOption || STATUS_OPTIONS[0];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 animate-slide-up">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
            <Save className="w-5 h-5" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Security Staff Management</h1>
          <p className="text-sm text-slate-500">Register and manage your security personnel</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("staff")}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "staff"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Security Staff
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "register"
                ? "bg-blue-100 text-blue-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Register New Staff
          </button>
        </div>
      </div>

      {/* Security Staff List Tab */}
      {activeTab === "staff" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Security Personnel</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <Shield className="w-10 h-10 mx-auto mb-2 opacity-40 animate-pulse" />
                Loading security staff...
              </div>
            ) : securityStaff.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                No security staff registered yet
              </div>
            ) : (
              securityStaff.map((staff) => (
                <div key={staff.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{staff.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {staff.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {staff.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {staff.shift}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                            {staff.department}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-lg ${getStatusBadge(staff.status).color}`}>
                            {getStatusBadge(staff.status).label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingStaff(staff)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Register New Staff Tab */}
      {activeTab === "register" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Register New Security Staff</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                placeholder="John Doe"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                placeholder="+254 712 345678"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Username *
              </label>
              <input
                type="text"
                value={newStaff.username}
                onChange={(e) => setNewStaff({ ...newStaff, username: e.target.value })}
                placeholder="johndoe"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Department *
              </label>
              <select
                value={newStaff.department}
                onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Shift *
              </label>
              <select
                value={newStaff.shift}
                onChange={(e) => setNewStaff({ ...newStaff, shift: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
              >
                {SHIFTS.map((shift) => (
                  <option key={shift.value} value={shift.value}>
                    {shift.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleAddStaff}
              disabled={!newStaff.name || !newStaff.email || !newStaff.username || !newStaff.department}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Register Security Staff
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Edit Security Staff</h3>
              </div>
              <button
                onClick={() => setEditingStaff(null)}
                className="p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editingStaff.name}
                    onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editingStaff.email}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editingStaff.phone}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Department
                  </label>
                  <select
                    value={editingStaff.department}
                    onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Shift
                  </label>
                  <select
                    value={editingStaff.shift}
                    onChange={(e) => setEditingStaff({ ...editingStaff, shift: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
                  >
                    {SHIFTS.map((shift) => (
                      <option key={shift.value} value={shift.value}>
                        {shift.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Status
                  </label>
                  <select
                    value={editingStaff.status}
                    onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setEditingStaff(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStaff}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all"
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
