import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useVisitors } from "../context/VistorContext";
import {
  Settings,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Users,
  Building,
  Wrench,
  Package,
  Briefcase,
} from "lucide-react";

const DEFAULT_ICONS = [
  { name: "Users", icon: "👤", component: Users },
  { name: "Building", icon: "🏢", component: Building },
  { name: "Wrench", icon: "🔧", component: Wrench },
  { name: "Package", icon: "📦", component: Package },
  { name: "Briefcase", icon: "💼", component: Briefcase },
];

const DEFAULT_COLORS = [
  "bg-blue-500",
  "bg-orange-500", 
  "bg-purple-500",
  "bg-green-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-pink-500",
];

interface Category {
  id: string;
  name: string;
  value: string;
  color: string;
  icon: string;
  isActive: boolean;
}

export default function Management() {
  const {} = useAuth();
  const { categories, addCategory, updateCategory, deleteCategory } = useVisitors();
  const [activeTab, setActiveTab] = useState("categories");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    color: DEFAULT_COLORS[0],
    icon: DEFAULT_ICONS[0].icon,
    isActive: true,
  });
  const [successMsg, setSuccessMsg] = useState("");

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleAddCategory = () => {
    if (!newCategory.name) return;
    
    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      value: newCategory.name.toLowerCase().replace(/\s+/g, "_"),
      color: newCategory.color || DEFAULT_COLORS[0],
      icon: newCategory.icon || DEFAULT_ICONS[0].icon,
      isActive: true,
    };

    addCategory(category);
    setNewCategory({
      name: "",
      color: DEFAULT_COLORS[0],
      icon: DEFAULT_ICONS[0].icon,
      isActive: true,
    });
    showSuccess("Category added successfully");
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;
    
    updateCategory(editingCategory.id, editingCategory);
    setEditingCategory(null);
    showSuccess("Category updated successfully");
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    showSuccess("Category deleted successfully");
  };

  const toggleCategoryStatus = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      updateCategory(id, { ...category, isActive: !category.isActive });
      showSuccess(`Category ${category.isActive ? 'deactivated' : 'activated'} successfully`);
    }
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
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Management</h1>
          <p className="text-sm text-slate-500">Manage categories and system settings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "categories"
                ? "bg-violet-100 text-violet-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "settings"
                ? "bg-violet-100 text-violet-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          {/* Add New Category */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Category Name
                </label>
                <input
                  value={newCategory.name || ""}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="e.g., Contractor"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {DEFAULT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewCategory({ ...newCategory, color })}
                      className={`w-full h-10 rounded-lg ${color} ${newCategory.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''} transition-all`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {DEFAULT_ICONS.map((icon) => (
                    <button
                      key={icon.name}
                      onClick={() => setNewCategory({ ...newCategory, icon: icon.icon })}
                      className={`w-10 h-10 rounded-lg border-2 ${newCategory.icon === icon.icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} flex items-center justify-center text-lg transition-all`}
                    >
                      {icon.icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategory.name}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Existing Categories</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {categories.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  No categories found
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-white text-lg`}>
                          {category.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{category.name}</h4>
                          <p className="text-sm text-slate-500">Value: {category.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCategoryStatus(category.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            category.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </button>
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
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
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">System Settings</h3>
          <div className="text-center py-12 text-slate-400">
            <Settings className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>Settings panel coming soon...</p>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Edit Category</h3>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-2 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Category Name
                </label>
                <input
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-medium text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {DEFAULT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditingCategory({ ...editingCategory, color })}
                      className={`w-full h-10 rounded-lg ${color} ${editingCategory.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''} transition-all`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {DEFAULT_ICONS.map((icon) => (
                    <button
                      key={icon.name}
                      onClick={() => setEditingCategory({ ...editingCategory, icon: icon.icon })}
                      className={`w-10 h-10 rounded-lg border-2 ${editingCategory.icon === icon.icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} flex items-center justify-center text-lg transition-all`}
                    >
                      {icon.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setEditingCategory(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCategory}
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
