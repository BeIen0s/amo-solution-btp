import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useClientStore } from '@/store/clientStore';
import { useDevisStore } from '@/store/devisStore';
import { useFactureStore } from '@/store/factureStore';
import { useStockStore } from '@/store/stockStore';
import DevisModal from '@/components/modals/DevisModal';
import FactureModal from '@/components/modals/FactureModal';
import { ClientModal } from '@/pages/clients/components/ClientModal';

type ModalState = {
  type: 'devis' | 'facture' | 'client' | null;
};

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // Stores
  const { clients, loadClients, stats: clientStats } = useClientStore();
  const { devis, loadDevis, stats: devisStats } = useDevisStore();
  const { factures, loadFactures, stats: factureStats } = useFactureStore();
  const { loadProducts, alerts } = useStockStore();
  
  const [modalState, setModalState] = useState<ModalState>({ type: null });
  
  // Charger les données au montage
  useEffect(() => {
    loadClients();
    loadDevis();
    loadFactures();
    loadProducts();
  }, [loadClients, loadDevis, loadFactures, loadProducts]);
  
  // Calculer les statistiques dynamiques
  const getDashboardStats = () => {
    // Clients actifs (clients avec activité récente)
    const activeClients = clients.filter(client => {
      const lastActivity = new Date(client.lastContact || client.dateCreation);
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - 3);
      return lastActivity > monthsAgo;
    }).length;
    
    // Devis en cours (brouillon + envoyé)
    const pendingQuotes = devis.filter(d => d.status === 'brouillon' || d.status === 'envoye').length;
    
    // Factures du mois
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyInvoices = factures.filter(f => {
      const invoiceDate = new Date(f.dateCreation);
      return invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear;
    });
    const monthlyRevenue = monthlyInvoices.reduce((sum, f) => sum + f.totalTTC, 0);
    
    // Chiffre d'affaires total (factures payées)
    const totalRevenue = factureStats?.totalAmountPaid || 0;
    
    return {
      activeClients,
      pendingQuotes,
      monthlyInvoicesCount: monthlyInvoices.length,
      monthlyRevenue,
      totalRevenue
    };
  };
  
  const stats = getDashboardStats();
  
  // Activités récentes (combinaison de devis et factures récents)
  const getRecentActivities = () => {
    const activities: any[] = [];
    
    // Ajouter les devis récents
    const recentDevis = devis
      .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
      .slice(0, 3)
      .map(d => ({
        id: `devis-${d.id}`,
        type: 'Devis',
        client: `${d.clientInfo.prenom} ${d.clientInfo.nom}`,
        company: d.clientInfo.entreprise,
        amount: d.totalTTC,
        status: d.status === 'brouillon' ? 'Brouillon' : 
                d.status === 'envoye' ? 'Envoyé' :
                d.status === 'accepte' ? 'Accepté' :
                d.status === 'refuse' ? 'Refusé' : 'Expiré',
        date: d.dateCreation
      }));
    
    // Ajouter les factures récentes
    const recentFactures = factures
      .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
      .slice(0, 3)
      .map(f => ({
        id: `facture-${f.id}`,
        type: 'Facture',
        client: `${f.clientInfo.prenom} ${f.clientInfo.nom}`,
        company: f.clientInfo.entreprise,
        amount: f.totalTTC,
        status: f.status === 'brouillon' ? 'Brouillon' :
                f.status === 'envoyee' ? 'Envoyée' :
                f.status === 'payee' ? 'Payée' :
                f.status === 'partiellement_payee' ? 'Part. payée' :
                f.status === 'en_retard' ? 'En retard' : 'Annulée',
        date: f.dateCreation
      }));
    
    activities.push(...recentDevis, ...recentFactures);
    
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  };
  
  const recentActivities = getRecentActivities();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  const formatPercentage = (current: number, previous: number) => {
    if (previous === 0) return '+100%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };
  
  const getChangeType = (current: number, previous: number) => {
    return current >= previous ? 'positive' : 'negative';
  };
  
  // Actions rapides
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'devis':
        setModalState({ type: 'devis' });
        break;
      case 'facture':
        setModalState({ type: 'facture' });
        break;
      case 'client':
        setModalState({ type: 'client' });
        break;
      case 'stock':
        navigate('/stock');
        break;
      default:
        break;
    }
  };
  
  const closeModal = () => {
    setModalState({ type: null });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold">Bonjour {user?.name} ! 👋</h1>
        <div className="mt-2 flex items-center gap-3">
          <p className="text-blue-100">
            Voici un aperçu de votre activité aujourd'hui
          </p>
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
            user?.role === 'admin' 
              ? 'bg-red-100 text-red-800'
              : user?.role === 'manager'
              ? 'bg-purple-100 text-purple-800' 
              : user?.role === 'comptable'
              ? 'bg-orange-100 text-orange-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {user?.role === 'admin' ? 'Administrateur' 
              : user?.role === 'manager' ? 'Manager'
              : user?.role === 'comptable' ? 'Comptable'
              : 'Utilisateur'}
          </span>
        </div>
        {user?.company && (
          <p className="text-blue-200 text-sm mt-1">
            {user.company}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Clients actifs */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clients actifs</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeClients}</p>
              <p className="text-xs text-gray-500 mt-1">Dernière activité 3 mois</p>
            </div>
            <div className="text-blue-500">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        {/* Devis en cours */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Devis en cours</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingQuotes}</p>
              <p className="text-xs text-gray-500 mt-1">Brouillon + envoyés</p>
            </div>
            <div className="text-orange-500">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        {/* Factures ce mois */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Factures ce mois</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.monthlyInvoicesCount} facture(s)</p>
            </div>
            <div className="text-green-500">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        {/* Chiffre d'affaires */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-xs text-gray-500 mt-1">Encaissé total</p>
            </div>
            <div className="text-purple-500">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes de stock si nécessaire */}
      {alerts.filter(a => a.level === 'critical' && !a.isRead).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-400 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Alertes de stock critiques
              </h3>
              <p className="text-sm text-red-700">
                {alerts.filter(a => a.level === 'critical' && !a.isRead).length} produit(s) en rupture ou stock critique
              </p>
            </div>
            <button 
              onClick={() => navigate('/stock')}
              className="ml-auto bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
            >
              Voir les alertes
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => handleQuickAction('devis')}
            className="flex flex-col items-center p-4 text-center rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all group"
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📋</span>
            <span className="text-sm font-medium text-gray-900 group-hover:text-blue-700">Nouveau devis</span>
            <span className="text-xs text-gray-500 mt-1">Créer une proposition</span>
          </button>
          <button 
            onClick={() => handleQuickAction('facture')}
            className="flex flex-col items-center p-4 text-center rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all group"
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💰</span>
            <span className="text-sm font-medium text-gray-900 group-hover:text-green-700">Créer facture</span>
            <span className="text-xs text-gray-500 mt-1">Facturer un client</span>
          </button>
          <button 
            onClick={() => handleQuickAction('client')}
            className="flex flex-col items-center p-4 text-center rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-all group"
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</span>
            <span className="text-sm font-medium text-gray-900 group-hover:text-purple-700">Ajouter client</span>
            <span className="text-xs text-gray-500 mt-1">Nouveau contact</span>
          </button>
          <button 
            onClick={() => handleQuickAction('stock')}
            className="flex flex-col items-center p-4 text-center rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-all group"
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📦</span>
            <span className="text-sm font-medium text-gray-900 group-hover:text-orange-700">Gérer stock</span>
            <span className="text-xs text-gray-500 mt-1">Inventaire produits</span>
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
            <span className="text-xs text-gray-500">
              {recentActivities.length} éléments
            </span>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivities.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">📅</div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Aucune activité récente</h3>
              <p className="text-xs text-gray-500">Les dernières activités apparaîtront ici</p>
            </div>
          ) : (
            recentActivities.map((activity) => (
              <div key={activity.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'Devis' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      <span className={`text-sm font-medium ${
                        activity.type === 'Devis' ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {activity.type === 'Devis' ? '📋' : '💰'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type}
                      </p>
                      <span className="text-gray-400">•</span>
                      <p className="text-sm text-gray-600">
                        {activity.client}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-sm font-semibold text-gray-700">
                        {formatCurrency(activity.amount)}
                      </p>
                      {activity.company && (
                        <>
                          <span className="text-gray-400">•</span>
                          <p className="text-xs text-gray-500">{activity.company}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    activity.status === 'Payée' || activity.status === 'Accepté' 
                      ? 'bg-green-100 text-green-800'
                      : activity.status === 'Envoyée' || activity.status === 'Envoyé'
                      ? 'bg-blue-100 text-blue-800'
                      : activity.status === 'En retard'
                      ? 'bg-red-100 text-red-800'
                      : activity.status === 'Part. payée'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(activity.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        
        {recentActivities.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Dernières activités
              </span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => navigate('/devis')}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Tous les devis
                </button>
                <span className="text-gray-300">•</span>
                <button 
                  onClick={() => navigate('/factures')}
                  className="text-xs text-green-600 hover:text-green-800"
                >
                  Toutes les factures
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals pour les actions rapides */}
      {modalState.type === 'devis' && (
        <DevisModal
          isOpen={true}
          onClose={closeModal}
          devis={null}
          mode="create"
        />
      )}

      {modalState.type === 'facture' && (
        <FactureModal
          isOpen={true}
          onClose={closeModal}
          facture={null}
          mode="create"
        />
      )}

      {modalState.type === 'client' && (
        <ClientModal
          isOpen={true}
          onClose={closeModal}
          client={null}
          mode="create"
        />
      )}
    </div>
  );
};

export default DashboardPage;
