import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Stores
import { useAuthStore } from '@/store/authStore';

// Components
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PublicRoute from '@/components/auth/PublicRoute';

// Layouts
import AuthLayout from '@/components/layouts/AuthLayout';
import DashboardLayout from '@/components/layouts/DashboardLayout';

// Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ClientsPage from '@/pages/clients/ClientsPage';
import DevisPage from '@/pages/devis/DevisPage';
import FacturesPage from '@/pages/factures/FacturesPage';
import StockPage from '@/pages/stock/StockPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';

// Hooks
import { useInitializeAuth } from '@/hooks/useAuth';

function App() {
  const { isLoading } = useAuthStore();
  const { isInitialized } = useInitializeAuth();

  // Afficher le loader pendant l'initialisation
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Chargement de l'application...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet defaultTitle="A.M.O Solution BTP">
        <meta name="description" content="Plateforme SaaS modulaire pour la gestion d'entreprises du secteur BTP" />
      </Helmet>

      <Routes>
        {/* Routes publiques (authentification) */}
        <Route path="/auth/*" element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route index element={<Navigate to="/auth/login" replace />} />
        </Route>

        {/* Routes protégées (application) */}
        <Route path="/app/*" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          {/* Dashboard principal */}
          <Route index element={<DashboardPage />} />
          
          {/* Gestion commerciale */}
          <Route path="clients/*" element={<ClientsPage />} />
          <Route path="devis/*" element={<DevisPage />} />
          <Route path="factures/*" element={<FacturesPage />} />
          
          {/* Gestion du stock */}
          <Route path="stock/*" element={<StockPage />} />
          
          {/* Paramètres et profil */}
          <Route path="settings/*" element={<SettingsPage />} />
          <Route path="profile/*" element={<ProfilePage />} />
        </Route>

        {/* Redirection par défaut */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        
        {/* Page 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;