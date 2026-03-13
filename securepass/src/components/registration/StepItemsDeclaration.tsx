import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  ArrowRight,
  ArrowLeft,
  Car,
  Laptop,
  Plus,
  Trash2,
  AlertTriangle,
  Accessibility,
} from 'lucide-react';
import type { VisitorFormData, DeclaredItem } from '../../services/useVisitorRegistration';

interface StepItemsDeclarationProps {
  formData: VisitorFormData;
  updateFormData: (updates: Partial<VisitorFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  direction: string;
}

const slideVariants = {
  enter: (d: string) => ({ x: d === 'forward' ? 100 : -100, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: string) => ({ x: d === 'forward' ? -100 : 100, opacity: 0 }),
};

const vehicleTypes = [
  { value: 'sedan', label: 'Sedan', icon: '🚗' },
  { value: 'suv', label: 'SUV', icon: '🚙' },
  { value: 'truck', label: 'Truck', icon: '🛻' },
  { value: 'motorcycle', label: 'Motorcycle', icon: '🏍️' },
  { value: 'bicycle', label: 'Bicycle', icon: '🚲' },
  { value: 'other', label: 'Other', icon: '🚐' },
];

const StepItemsDeclaration: React.FC<StepItemsDeclarationProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
  direction,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemSerial, setNewItemSerial] = useState('');

  // Purpose-based item templates
  const getPurposeBasedItems = () => {
    switch (formData.purpose) {
      case 'maintenance':
        return [
          'Toolbox',
          'Spare Parts',
          'Safety Equipment',
          'Repair Manual',
          'Measuring Tools',
          'Cleaning Supplies'
        ];
      case 'meeting':
        return [
          'Laptop',
          'Presentation Materials',
          'Documents',
          'Business Cards',
          'Notebook',
          'Pen'
        ];
      case 'delivery':
        return [
          'Package/Envelope',
          'Delivery Documents',
          'Scanning Device',
          'Hand Truck',
          'Dolly'
        ];
      case 'interview':
        return [
          'Resume/CV',
          'Portfolio',
          'References',
          'Certificates',
          'Work Samples',
          'Notepad'
        ];
      case 'consultation':
        return [
          'Laptop',
          'Reports',
          'Documents',
          'Calculator',
          'Measuring Tape',
          'Blueprints'
        ];
      case 'event':
        return [
          'Event Ticket',
          'Invitation',
          'Name Badge',
          'Program',
          'Gift Items',
          'Decoration Supplies'
        ];
      default:
        return [];
    }
  };

  const suggestedItems = getPurposeBasedItems();

  const addItem = useCallback(() => {
    if (!newItemName.trim()) return;

    const newItem: DeclaredItem = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      description: newItemDesc.trim(),
      serialNumber: newItemSerial.trim() || undefined,
    };

    updateFormData({
      items: [...formData.items, newItem],
    });

    setNewItemName('');
    setNewItemDesc('');
    setNewItemSerial('');
  }, [newItemName, newItemDesc, newItemSerial, formData.items, updateFormData]);

  const removeItem = useCallback(
    (itemId: string) => {
      updateFormData({
        items: formData.items.filter((i) => i.id !== itemId),
      });
    },
    [formData.items, updateFormData]
  );

  return (
    <motion.div
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">
          Items & Vehicle Declaration
        </h2>
        <p className="text-gray-500 mt-1">
          Declare any items or vehicle you're bringing in
        </p>
      </div>

      <div className="space-y-6">
        {/* Vehicle Section */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Car className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Vehicle</h3>
                  <p className="text-xs text-gray-500">
                    Are you driving to the premises?
                  </p>
                </div>
              </div>

              {/* Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  updateFormData({ hasVehicle: !formData.hasVehicle })
                }
                className={`w-14 h-8 rounded-full flex items-center px-1 transition-colors ${
                  formData.hasVehicle ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  animate={{ x: formData.hasVehicle ? 22 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                />
              </motion.button>
            </div>

            <AnimatePresence>
              {formData.hasVehicle && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Vehicle Type */}
                  <div className="grid grid-cols-3 gap-2">
                    {vehicleTypes.map((vt) => (
                      <motion.button
                        key={vt.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() =>
                          updateFormData({ vehicleType: vt.value })
                        }
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          formData.vehicleType === vt.value
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-150 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-xl block">{vt.icon}</span>
                        <span className="text-[10px] font-semibold text-gray-600">
                          {vt.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  {/* License Plate */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                      License Plate Number
                    </label>
                    <input
                      type="text"
                      value={formData.vehiclePlate}
                      onChange={(e) =>
                        updateFormData({
                          vehiclePlate: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="e.g., KDA 234X"
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-400 transition-all text-sm font-mono tracking-wider text-center text-lg focus:ring-0 outline-none"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Laptop Section */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Laptop className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Laptop</h3>
                  <p className="text-xs text-gray-500">
                    Carrying a laptop or tablet?
                  </p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  updateFormData({ hasLaptop: !formData.hasLaptop })
                }
                className={`w-14 h-8 rounded-full flex items-center px-1 transition-colors ${
                  formData.hasLaptop ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <motion.div
                  animate={{ x: formData.hasLaptop ? 22 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                />
              </motion.button>
            </div>

            <AnimatePresence>
              {formData.hasLaptop && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                    Serial Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.laptopSerial}
                    onChange={(e) =>
                      updateFormData({ laptopSerial: e.target.value })
                    }
                    placeholder="e.g., FVFXM3K2Q6LR"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-emerald-400 transition-all text-sm font-mono focus:ring-0 outline-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Other Items */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Other Items</h3>
                <p className="text-xs text-gray-500">
                  Declare any other items you're bringing in
                </p>
              </div>
            </div>

            {/* Listed items */}
            <AnimatePresence>
              {formData.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3"
                >
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-xs font-bold text-amber-600">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.name}
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-500 truncate">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeItem(item.id)}
                    className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Quick Add Section */}
            {suggestedItems.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-amber-800 mb-3">
                  Suggested Items for <span className="capitalize">{formData.purpose}</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {suggestedItems.map((item, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        const newItem: DeclaredItem = {
                          id: `item-${Date.now()}`,
                          name: item,
                          description: `Quick add: ${item}`,
                        };
                        updateFormData({
                          items: [...formData.items, newItem],
                        });
                      }}
                      className="p-3 bg-white border border-amber-300 rounded-xl hover:bg-amber-100 transition-colors text-left"
                    >
                      <span className="text-sm font-medium text-amber-800">{item}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Add item form */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 space-y-3">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Item name (e.g., Camera)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-emerald-400 focus:ring-0 outline-none"
              />
              <input
                type="text"
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
                placeholder="Description (optional)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-emerald-400 focus:ring-0 outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addItem}
                disabled={!newItemName.trim()}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm flex items-center justify-center space-x-2 disabled:opacity-40 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Special Needs */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                <Accessibility className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Special Requirements</h3>
                <p className="text-xs text-gray-500">
                  Any accessibility or special needs?
                </p>
              </div>
            </div>
            <textarea
              value={formData.specialNeeds}
              onChange={(e) =>
                updateFormData({ specialNeeds: e.target.value })
              }
              placeholder="e.g., wheelchair access, hearing assistance, dietary requirements for meeting..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-400 transition-all text-sm resize-none focus:ring-0 outline-none"
            />
          </div>
        </div>

        {/* Notice */}
        <div className="flex items-start space-x-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            All items are subject to inspection by security. Prohibited items
            include weapons, hazardous materials, and recording devices (unless
            pre-approved). Undeclared items may be confiscated.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-semibold text-gray-600 flex items-center justify-center space-x-2 hover:bg-gray-50 bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="flex-[2] py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 group"
          >
            <span>Review & Submit</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default StepItemsDeclaration;