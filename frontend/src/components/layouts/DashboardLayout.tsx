import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/auth/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/app', icon: '🏠', description: 'Vue d\'ensemble' },
    { name: 'Clients', href: '/app/clients', icon: '👥', description: 'Gestion clientèle' },
    { name: 'Devis', href: '/app/devis', icon: '📋', description: 'Propositions commerciales' },
    { name: 'Factures', href: '/app/factures', icon: '💰', description: 'Facturation et paiements' },
    { name: 'Stock', href: '/app/stock', icon: '📦', description: 'Inventaire et approvisionnement' },
    { name: 'Paramètres', href: '/app/settings', icon: '⚙️', description: 'Configuration système' },
  ];

  const quickActions = [
    { name: 'Profil', href: '/app/profile', icon: '👤' },
  ];

  const appVersion = '2.1.3';
  const buildDate = 'Janvier 2025';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:flex lg:flex-col`}>
        <div className="flex flex-col h-full">
          {/* Header with logo */}
          <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">A.M.O Solution</h1>
                <p className="text-xs text-blue-100">BTP Management</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-blue-100 hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          {/* User info card */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || 'Utilisateur'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'Non connecté'}
                </p>
                {user?.role && (
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'manager' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'comptable' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrateur' :
                     user.role === 'manager' ? 'Manager' :
                     user.role === 'comptable' ? 'Comptable' :
                     'Utilisateur'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                                (item.href !== '/app' && location.pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className={`flex-shrink-0 mr-4 text-lg ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    } transition-transform`}>
                      {item.icon}
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold">{item.name}</div>
                      <div className={`text-xs mt-0.5 ${
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Quick actions section */}
            <div className="pt-6">
              <div className="px-3 mb-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions rapides
                </h3>
              </div>
              <div className="space-y-1">
                {quickActions.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-3 text-base">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Footer with version and logout */}
          <div className="px-3 py-4 border-t border-gray-200 space-y-3">
            {/* Version info */}
            <div className="px-3 py-2 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-gray-900">Version {appVersion}</div>
                  <div className="text-xs text-gray-500">{buildDate}</div>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full" title="Application en ligne"></div>
              </div>
              <div className="mt-1 text-xs text-gray-400">
                © 2025 A.M.O Solution BTP
              </div>
            </div>
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group"
            >
              <span className="mr-2 group-hover:scale-110 transition-transform">🚪</span>
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <span className="text-xl">☰</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">A.M.O Solution BTP</h1>
            <div className="w-10"></div>
          </div>
        </header>

        {/* Desktop header */}
        <header className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {navigation.find(item => 
                    location.pathname === item.href || 
                    (item.href !== '/app' && location.pathname.startsWith(item.href))
                  )?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {navigation.find(item => 
                    location.pathname === item.href || 
                    (item.href !== '/app' && location.pathname.startsWith(item.href))
                  )?.description || 'Vue d\'ensemble de votre activité'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;