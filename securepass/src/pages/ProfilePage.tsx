import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useVisitors } from '../context/VistorContext';
import { format } from 'date-fns';
import {
  User,
  Camera,
  Mail,
  Phone,
  Shield,
  Building2,
  Hash,
  Calendar,
  Clock,
  Edit3,
  Save,
  X,
  Upload,
  Trash2,
  CheckCircle2,
  Award,
  BarChart3,
  Users,
  Activity,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Briefcase,
  Star,
  TrendingUp,
  LogOut as LogOutIcon,
  ArrowUpRight,
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  ChevronRight,
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, updateAvatar, removeAvatar, logout } = useAuth();
  const { visitors, getActiveVisitors, getTodayVisitors } = useVisitors();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Edit form
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editDepartment, setEditDepartment] = useState(user?.department || '');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeVisitors = getActiveVisitors();
  const todayVisitors = getTodayVisitors();

  // Stats for this user
  const myRegistrations = visitors.filter((v) => v.registeredBy === user?.name);
  const myTodayRegistrations = todayVisitors.filter((v) => v.registeredBy === user?.name);

  const startEditing = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setEditPhone(user?.phone || '');
    setEditBio(user?.bio || '');
    setEditDepartment(user?.department || '');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveProfile = () => {
    updateProfile({
      name: editName,
      email: editEmail,
      phone: editPhone,
      bio: editBio,
      department: editDepartment,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const confirmAvatar = () => {
    if (imagePreview) {
      updateAvatar(imagePreview);
      setImagePreview(null);
      setShowAvatarModal(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleRemoveAvatar = () => {
    removeAvatar();
    setImagePreview(null);
    setShowAvatarModal(false);
  };

  const handlePasswordChange = () => {
    setPasswordError('');
    if (currentPassword !== user?.password) {
      setPasswordError('Current password is incorrect');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    updateProfile({ password: newPassword });
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Banner */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-sm font-semibold text-emerald-700">
            Profile updated successfully!
          </p>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
        {/* Cover */}
        <div className="h-36 bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-white/20 to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 relative">
          {/* Avatar */}
          <div className="absolute -top-14 left-6">
            <div className="relative group">
              <div className="w-28 h-28 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-linear-to-br from-emerald-400 to-cyan-500">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-black text-3xl">
                    {getInitials(user?.name || 'U')}
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowAvatarModal(true)}
                className="absolute bottom-1 right-1 w-8 h-8 rounded-lg bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-all opacity-0 group-hover:opacity-100"
              >
                <Camera className="w-4 h-4" />
              </button>
              {/* Online indicator */}
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-3 gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={cancelEditing}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  className="px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Photo
                </button>
                <button
                  onClick={startEditing}
                  className="px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              </>
            )}
          </div>

          {/* Name & Role */}
          <div className="mt-6">
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-2xl font-black text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            ) : (
              <h1 className="text-2xl font-black text-slate-800">
                {user?.name}
              </h1>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-100 capitalize">
                <Shield className="w-3 h-3" />
                {user?.role}
              </span>
              {user?.employeeId && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold border border-slate-100">
                  <Hash className="w-3 h-3" />
                  {user.employeeId}
                </span>
              )}
              {user?.department && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold border border-slate-100">
                  <Building2 className="w-3 h-3" />
                  {user.department}
                </span>
              )}
            </div>
            {isEditing ? (
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Write a short bio..."
                className="mt-3 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none"
                rows={2}
              />
            ) : (
              user?.bio && (
                <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-xl">
                  {user.bio}
                </p>
              )
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        {[
          {
            label: 'Total Registrations',
            value: myRegistrations.length,
            icon: Users,
            gradient: 'from-blue-500 to-cyan-500',
            shadow: 'shadow-blue-500/15',
          },
          {
            label: "Today's Entries",
            value: myTodayRegistrations.length,
            icon: Activity,
            gradient: 'from-emerald-500 to-teal-500',
            shadow: 'shadow-emerald-500/15',
          },
          {
            label: 'Active Now',
            value: activeVisitors.length,
            icon: TrendingUp,
            gradient: 'from-violet-500 to-purple-500',
            shadow: 'shadow-violet-500/15',
          },
          {
            label: 'Days Active',
            value: user?.joinedDate
              ? Math.floor(
                  (new Date().getTime() - new Date(user.joinedDate).getTime()) /
                    86400000
                )
              : 0,
            icon: Calendar,
            gradient: 'from-amber-500 to-orange-500',
            shadow: 'shadow-amber-500/15',
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-linear-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow} mb-3`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">
                {stat.value}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contact & Details */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
              Personal Information
            </h3>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                  Email Address
                </p>
                {isEditing ? (
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700">
                    {user?.email || '—'}
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                  Phone Number
                </p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700">
                    {user?.phone || '—'}
                  </p>
                )}
              </div>
            </div>

            {/* Department */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                  Department
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-700">
                    {user?.department || '—'}
                  </p>
                )}
              </div>
            </div>

            {/* Employee ID */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                <Hash className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                  Employee ID
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {user?.employeeId || '—'}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                  System Role
                </p>
                <p className="text-sm font-semibold text-slate-700 capitalize">
                  {user?.role === 'property_manager'
                    ? '🏢 Property Manager'
                    : '🛡️ Security Personnel'}
                </p>
              </div>
            </div>

            {/* Joined */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                  Member Since
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {user?.joinedDate
                    ? format(new Date(user.joinedDate), 'MMMM d, yyyy')
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Recent Activity */}
        <div className="space-y-6">
          {/* Security Settings */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-fade-in">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                <Lock className="w-4 h-4 text-rose-600" />
              </div>
              Security
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">
                    Change Password
                  </p>
                  <p className="text-xs text-slate-400">
                    Update your account password
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </button>

              <button
                onClick={() => setShowAvatarModal(true)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">
                    Profile Photo
                  </p>
                  <p className="text-xs text-slate-400">
                    Upload or change your photo
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </button>
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-fade-in">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-emerald-600" />
              </div>
              My Recent Registrations
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {myRegistrations.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">
                  No registrations yet
                </p>
              ) : (
                myRegistrations.slice(0, 8).map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg ${
                        CATEGORIES_MAP[v.category]?.color || 'bg-slate-500'
                      } flex items-center justify-center text-white text-xs`}
                    >
                      {CATEGORIES_MAP[v.category]?.icon || '👤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">
                        {v.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {v.unitVisited}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-slate-400">
                        {format(new Date(v.timeIn), 'MMM d')}
                      </p>
                      <span
                        className={`text-[10px] font-semibold ${
                          v.status === 'checked-in'
                            ? 'text-emerald-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {v.status === 'checked-in' ? '● IN' : '○ OUT'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============ AVATAR MODAL ============ */}
      {showAvatarModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowAvatarModal(false);
            setImagePreview(null);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scale-in overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Profile Photo
                    </h3>
                    <p className="text-xs text-slate-400">
                      Upload a new profile image
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAvatarModal(false);
                    setImagePreview(null);
                  }}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Current / Preview */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl border-4 border-slate-100 shadow-lg overflow-hidden bg-linear-to-br from-emerald-400 to-cyan-500">
                    {imagePreview || user?.avatar ? (
                      <img
                        src={imagePreview || user?.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-black text-4xl">
                        {getInitials(user?.name || 'U')}
                      </div>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Drop zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer ${
                  dragActive
                    ? 'border-indigo-400 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                    dragActive ? 'bg-indigo-100' : 'bg-slate-100'
                  }`}
                >
                  <Upload
                    className={`w-6 h-6 ${
                      dragActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                  />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {dragActive
                    ? 'Drop your image here'
                    : 'Click or drag image here'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  JPG, PNG or GIF • Max 5MB
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                {user?.avatar && !imagePreview && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-1.5 border border-red-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove Photo
                  </button>
                )}
                {imagePreview && (
                  <>
                    <button
                      onClick={() => setImagePreview(null)}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmAvatar}
                      className="flex-2 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Save Photo
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ PASSWORD MODAL ============ */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowPasswordModal(false);
            setPasswordError('');
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Change Password
                  </h3>
                  <p className="text-xs text-slate-400">
                    Enter your current and new password
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-2 animate-scale-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {passwordError}
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPwd ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showCurrentPwd ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 pr-10"
                    placeholder="Enter new password (min 6 chars)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showNewPwd ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600 mb-1.5 block">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError('');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="flex-2 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper map
const CATEGORIES_MAP: Record<string, { color: string; icon: string }> = {
  visitor: { color: 'bg-blue-500', icon: '👤' },
  contractor: { color: 'bg-orange-500', icon: '🔧' },
  technician: { color: 'bg-purple-500', icon: '⚙️' },
  delivery: { color: 'bg-green-500', icon: '📦' },
  staff: { color: 'bg-indigo-500', icon: '🏢' },
};

export default ProfilePage;