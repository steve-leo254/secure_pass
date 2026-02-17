// src/components/shared/Header.tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { userRole, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">SecurePass</h1>
            <span className="ml-4 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {userRole === 'admin' ? 'Administrator' : 'Security Desk'}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {userRole === 'admin' ? 'Admin Panel' : 'Security Dashboard'}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
