import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            A.M.O Solution BTP
          </h1>
          <p className="text-blue-100">
            Plateforme de gestion pour le secteur BTP
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-8">
          <Outlet />
        </div>
        
        <div className="text-center mt-6">
          <p className="text-blue-100 text-sm">
            © 2024 A.M.O Solution BTP. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;