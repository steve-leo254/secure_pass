// src/components/registration/VisitorForm.tsx
import React, { useState } from 'react';
import type { Visitor, VisitorCategory, Gender } from '../../types';
import { CATEGORY_LABELS } from '../../types';
import { DEFAULT_TOOLS } from '../../data/initialData';

interface VisitorFormProps {
  onSubmit: (data: Omit<Visitor, 'id' | 'timeIn' | 'timeOut'>) => void;
  onCancel: () => void;
}

const VisitorForm: React.FC<VisitorFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    idNumber: '',
    category: 'visitor' as VisitorCategory,
    purpose: '',
    gender: 'male' as Gender,
    unitVisited: '',
    tools: [] as string[],
    customTools: [] as string[],
    status: 'checked-in' as const,
    registeredBy: 'Security Staff',
    checkedOutBy: null,
  });

  const [otherTool, setOtherTool] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleToolToggle = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter(t => t !== tool)
        : [...prev.tools, tool]
    }));
  };

  const addOtherTool = () => {
    if (otherTool.trim() && !formData.tools.includes(otherTool.trim())) {
      setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, otherTool.trim()]
      }));
      setOtherTool('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Register New Visitor</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              ID Number *
            </label>
            <input
              type="text"
              required
              value={formData.idNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as VisitorCategory }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800 bg-white"
            >
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Gender *
            </label>
            <select
              required
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as Gender }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800 bg-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Unit/Location Visited *
            </label>
            <input
              type="text"
              required
              value={formData.unitVisited}
              onChange={(e) => setFormData(prev => ({ ...prev, unitVisited: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Purpose of Visit *
          </label>
          <textarea
            required
            rows={3}
            value={formData.purpose}
            onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800 placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Tools (if applicable)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
            {DEFAULT_TOOLS.map((tool) => (
              <label key={tool} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.tools.includes(tool)}
                  onChange={() => handleToolToggle(tool)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{tool}</span>
              </label>
            ))}
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom tool"
              value={otherTool}
              onChange={(e) => setOtherTool(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-800 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={addOtherTool}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Add
            </button>
          </div>
          
          {formData.tools.length > 0 && (
            <div className="mt-2">
              <span className="text-sm text-gray-600">Selected: {formData.tools.join(', ')}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Register Visitor
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default VisitorForm;
