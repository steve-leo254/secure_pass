import React from 'react';
import { useVisitors } from '../context/VistorContext';
import { v4 as uuidv4 } from 'uuid';
import type { Visitor, VisitorCategory, Gender } from '../types';
import { Database, Sparkles, Trash2 } from 'lucide-react';

const NAMES = [
  'James Mwangi', 'Grace Wanjiku', 'Peter Ochieng', 'Faith Njeri',
  'David Kamau', 'Sarah Achieng', 'John Mutua', 'Mary Wambui',
  'Charles Kipchoge', 'Anne Chebet', 'Michael Otieno', 'Esther Nyambura',
  'Robert Kimani', 'Jane Akinyi', 'William Kiplagat', 'Lucy Moraa',
  'Joseph Wekesa', 'Helen Atieno', 'Daniel Nderitu', 'Catherine Wangari',
];

const UNITS = [
  'Unit 1A', 'Unit 2B', 'Unit 3C', 'Shop 4', 'Office 5',
  'House 12', 'Apt 7B', 'Unit 8A', 'Shop 9', 'Office 10',
  'House 15', 'Unit 6D', 'Block A-3', 'Suite 201', 'Ground Floor',
];

const PURPOSES = [
  'Plumbing repairs', 'Electrical maintenance', 'Package delivery',
  'Client meeting', 'Regular work shift', 'AC installation',
  'Painting work', 'Internet setup', 'Security check', 'Cleaning service',
  'Furniture delivery', 'HVAC maintenance', 'Visiting family', 'Consultation',
];

const CATEGORIES: VisitorCategory[] = ['contractor', 'technician', 'delivery', 'staff', 'visitor'];
const GENDERS: Gender[] = ['male', 'female', 'other'];
const TOOLS_OPTIONS = ['Hammer', 'Screwdriver', 'Drill Machine', 'Spanner Set', 'Ladder', 'Pliers'];

export const generateDemoVisitors = (): Visitor[] => {
  const visitors: Visitor[] = [];
  const now = new Date();

  for (let day = 6; day >= 0; day--) {
    const count = Math.floor(Math.random() * 8) + 3;
    for (let j = 0; j < count; j++) {
      const date = new Date(now);
      date.setDate(date.getDate() - day);
      const hour = Math.floor(Math.random() * 12) + 7;
      const min = Math.floor(Math.random() * 60);
      date.setHours(hour, min, 0, 0);

      const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const isCheckedOut = day > 0 || Math.random() > 0.5;
      const tools =
        cat === 'contractor' || cat === 'technician'
          ? TOOLS_OPTIONS.filter(() => Math.random() > 0.6)
          : [];

      const timeOut = isCheckedOut
        ? new Date(date.getTime() + (Math.floor(Math.random() * 180) + 30) * 60000).toISOString()
        : null;

      visitors.push({
        id: uuidv4(),
        fullName: NAMES[Math.floor(Math.random() * NAMES.length)],
        phoneNumber: `07${Math.floor(10000000 + Math.random() * 90000000)}`,
        idNumber: `${Math.floor(10000000 + Math.random() * 90000000)}`,
        category: cat,
        purpose: PURPOSES[Math.floor(Math.random() * PURPOSES.length)],
        gender: GENDERS[Math.floor(Math.random() * GENDERS.length)],
        unitVisited: UNITS[Math.floor(Math.random() * UNITS.length)],
        tools,
        customTools: [],
        timeIn: date.toISOString(),
        timeOut,
        status: isCheckedOut ? 'checked-out' : 'checked-in',
        registeredBy: 'John Security',
        checkedOutBy: isCheckedOut ? 'John Security' : null,
      });
    }
  }

  return visitors.sort(
    (a, b) => new Date(b.timeIn).getTime() - new Date(a.timeIn).getTime()
  );
};

const SeedData: React.FC = () => {
  const handleSeed = () => {
    const demo = generateDemoVisitors();
    localStorage.setItem('securepass_visitors', JSON.stringify(demo));
    // Generate audit logs too
    const logs = demo.map((v) => ({
      id: uuidv4(),
      action: v.status === 'checked-out' ? 'CHECK_OUT' : 'CHECK_IN',
      performedBy: v.registeredBy,
      timestamp: v.timeIn,
      details: `${v.fullName} ${v.status === 'checked-out' ? 'checked out from' : 'checked in to'} ${v.unitVisited}`,
      category: v.category,
    }));
    localStorage.setItem('securepass_audit', JSON.stringify(logs));
    window.location.reload();
  };

  const handleClear = () => {
    localStorage.removeItem('securepass_visitors');
    localStorage.removeItem('securepass_audit');
    window.location.reload();
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleSeed}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
      >
        <Sparkles className="w-4 h-4" />
        Load Demo Data
      </button>
      <button
        onClick={handleClear}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all border border-red-100"
      >
        <Trash2 className="w-4 h-4" />
        Clear All
      </button>
    </div>
  );
};

export default SeedData;