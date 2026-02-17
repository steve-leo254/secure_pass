// src/components/shared/RoleSelector.tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const RoleSelector: React.FC = () => {
  const { loginAs } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SecurePass</h1>
          <p className="text-gray-600">Select your role to continue</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => loginAs('security')}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Security Desk
          </button>
          
          <button
            onClick={() => loginAs('admin')}
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
          >
            Administrator
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Demo Credentials: security/security123 or admin/admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
