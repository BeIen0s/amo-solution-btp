import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/auth/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/app', icon: '📊' },
    { name: 'Clients', href: '/app/clients', icon: '👥' },
    { name: 'Devis', href: '/app/devis', icon: '📄' },
    { name: 'Factures', href: '/app/factures', icon: '💰' },
    { name: 'Stock', href: '/app/stock', icon: '📦' },
    { name: 'Paramètres', href: '/app/settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">
              A.M.O Solution BTP
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                              (item.href !== '/app' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User menu */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Utilisateur'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'Non connecté'}</p>
                {user?.role && (
                  <p className="text-xs text-blue-600 font-medium">
                    {user.role === 'admin' ? 'Administrateur' 
                      : user.role === 'manager' ? 'Manager'
                      : user.role === 'comptable' ? 'Comptable'
                      : 'Utilisateur'}
                  </p>
                )}
              </div>
              <button 
                onClick={handleLogout}
                className="ml-3 p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Déconnexion"
              >
                <span>⏻</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              Tableau de bord
            </h1>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;