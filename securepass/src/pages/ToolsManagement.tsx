import React, { useState } from 'react';
import { useVisitors } from '../context/VistorContext';
import { Wrench, Plus, X, CheckCircle2, Tag, Edit2, Save } from 'lucide-react';
import type { Category } from '../types';

const ToolsManagement: React.FC = () => {
  const { tools, addTool, removeTool, categories, addCategory, updateCategory, deleteCategory } = useVisitors();
  const [newTool, setNewTool] = useState('');
  const [newCategory, setNewCategory] = useState({ name: '', value: '' });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  const handleAddTool = () => {
    if (!newTool.trim()) return;
    if (tools.includes(newTool.trim())) {
      return;
    }
    addTool(newTool.trim());
    setNewTool('');
    setSuccess('Tool added successfully');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim() || !newCategory.value.trim()) return;
    if (categories.some(c => c.value === newCategory.value.trim())) {
      return;
    }
    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name.trim(),
      value: newCategory.value.toLowerCase().replace(/\s+/g, '-'),
      color: 'bg-slate-500',
      icon: '🏷️',
      isActive: true
    };
    addCategory(category);
    setNewCategory({ name: '', value: '' });
    setSuccess('Category added successfully');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleEditCategory = (id: string, name: string) => {
    updateCategory(id, { name });
    setEditingCategory(null);
    setSuccess('Category updated successfully');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory(id);
    setSuccess('Category deleted successfully');
    setTimeout(() => setSuccess(''), 2000);
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
          <Wrench className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800"> Management</h1>
          <p className="text-sm text-slate-500">
            Manage tools available for selection during visitor registration
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {/* Tools Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-slate-600" />
            Tools Management
          </h2>
          
          {/* Add Tool */}
          <div className="mb-6">
            <div className="flex gap-3">
              <input
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTool()}
                placeholder="Enter tool name..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
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
                    setSuccess('Tool removed');
                    setTimeout(() => setSuccess(''), 2000);
                  }}
                  className="p-1.5 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {tools.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Wrench className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No tools added yet</p>
              <p className="text-sm mt-1">
                Add tools that visitors can select during registration
              </p>
            </div>
          )}
        </div>
      

        {/* Categories Section */}
        <div className="border-t border-slate-100 pt-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-slate-600" />
            Categories Management
          </h2>
          
          {/* Add Category */}
          <div className="mb-6">
            <div className="flex gap-3">
              <input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Enter category name..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
              />
              <input
                value={newCategory.value}
                onChange={(e) => setNewCategory({ ...newCategory, value: e.target.value })}
                placeholder="Enter category value..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
              />
              <button
                onClick={handleAddCategory}
                disabled={!newCategory.name.trim() || !newCategory.value.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] transition-all disabled:opacity-40 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100 group hover:border-purple-200 transition"
              >
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-purple-400" />
                  {editingCategory === category.id ? (
                    <input
                      type="text"
                      defaultValue={category.name}
                      onBlur={(e) => handleEditCategory(category.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleEditCategory(category.id, e.currentTarget.value);
                        } else if (e.key === 'Escape') {
                          setEditingCategory(null);
                        }
                      }}
                      className="font-medium text-slate-700 text-sm bg-white border border-purple-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      autoFocus
                    />
                  ) : (
                    <span className="font-medium text-slate-700 text-sm">
                      {category.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingCategory(category.id)}
                    className="p-1.5 rounded-lg text-slate-300 hover:bg-blue-50 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1.5 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Tag className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No categories added yet</p>
              <p className="text-sm mt-1">
                Add categories that visitors can select during registration
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolsManagement;
