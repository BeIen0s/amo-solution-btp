import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useClientStore } from '@/store/clientStore';
import { useDevisStore } from '@/store/devisStore';
import { useFactureStore } from '@/store/factureStore';
import { useStockStore } from '@/store/stockStore';
import DevisModal from '@/components/modals/DevisModal';
import FactureModal from '@/components/modals/FactureModal';
import ClientModal from '@/pages/clients/components/ClientModal';

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
      .slice(0, 4)
      .map(d => {
        const isExpired = new Date() > new Date(d.dateExpiration);
        return {
          id: `devis-${d.id}`,
          type: 'Devis',
          title: d.title,
          client: `${d.clientInfo.prenom} ${d.clientInfo.nom}`.trim() || 'Client',
          company: d.clientInfo.entreprise,
          amount: d.totalTTC,
          status: d.status === 'brouillon' ? 'Brouillon' : 
                  d.status === 'envoye' ? (isExpired ? 'Expiré' : 'Envoyé') :
                  d.status === 'accepte' ? 'Accepté' :
                  d.status === 'refuse' ? 'Refusé' : 'Expiré',
          date: d.dateCreation,
          priority: d.status === 'envoye' && !isExpired ? 'high' : 'normal',
          icon: '📋',
          color: 'blue'
        };
      });
    
    // Ajouter les factures récentes
    const recentFactures = factures
      .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
      .slice(0, 4)
      .map(f => {
        const isOverdue = f.status !== 'payee' && new Date() > new Date(f.dateEcheance);
        return {
          id: `facture-${f.id}`,
          type: 'Facture',
          title: f.title,
          client: `${f.clientInfo.prenom} ${f.clientInfo.nom}`.trim() || 'Client',
          company: f.clientInfo.entreprise,
          amount: f.totalTTC,
          status: isOverdue ? 'En retard' :
                  f.status === 'brouillon' ? 'Brouillon' :
                  f.status === 'envoyee' ? 'Envoyée' :
                  f.status === 'payee' ? 'Payée' :
                  f.status === 'partiellement_payee' ? 'Part. payée' : 'Annulée',
          date: f.dateCreation,
          dueDate: f.dateEcheance,
          priority: isOverdue ? 'high' : f.status === 'envoyee' ? 'medium' : 'normal',
          icon: '💰',
          color: 'green'
        };
      });
    
    // Ajouter les clients récents (optionnel)
    const recentClients = clients
      .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
      .slice(0, 2)
      .map(c => ({
        id: `client-${c.id}`,
        type: 'Client',
        title: 'Nouveau client ajouté',
        client: `${c.prenom} ${c.nom}`.trim() || 'Client',
        company: c.entreprise,
        amount: 0,
        status: c.type === 'particulier' ? 'Particulier' : 
                c.type === 'entreprise' ? 'Entreprise' : 'Collectivité',
        date: c.dateCreation,
        priority: 'normal',
        icon: '👤',
        color: 'purple'
      }));
    
    activities.push(...recentDevis, ...recentFactures, ...recentClients);
    
    return activities
      .sort((a, b) => {
        // Prioriser les éléments urgents
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (b.priority === 'high' && a.priority !== 'high') return 1;
        // Ensuite trier par date
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, 8); // Afficher jusqu'à 8 activités
  };
  
  const recentActivities = getRecentActivities();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return diffMinutes <= 1 ? 'À l\'instant' : `Il y a ${diffMinutes} min`;
      }
      return diffHours === 1 ? 'Il y a 1h' : `Il y a ${diffHours}h`;
    } else if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
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
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
              {recentActivities.filter(a => a.priority === 'high').length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5"></span>
                  {recentActivities.filter(a => a.priority === 'high').length} urgent(s)
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {recentActivities.length} éléments
            </span>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {recentActivities.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <div className="text-gray-400 text-4xl mb-4">📅</div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Aucune activité récente</h3>
                <p className="text-xs text-gray-500">Les dernières activités apparaîtront ici</p>
                <div className="mt-4">
                  <button 
                    onClick={() => handleQuickAction('devis')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Créer votre premier devis →
                  </button>
                </div>
              </div>
            ) : (
              recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className={`px-6 py-4 flex items-start justify-between hover:bg-gray-50 transition-colors ${
                    activity.priority === 'high' ? 'border-l-4 border-red-400 bg-red-50/30' :
                    activity.priority === 'medium' ? 'border-l-4 border-yellow-400 bg-yellow-50/30' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                        activity.color === 'blue' ? 'bg-blue-100 border border-blue-200' :
                        activity.color === 'green' ? 'bg-green-100 border border-green-200' :
                        activity.color === 'purple' ? 'bg-purple-100 border border-purple-200' :
                        'bg-gray-100 border border-gray-200'
                      }`}>
                        <span className={`text-base ${
                          activity.color === 'blue' ? 'text-blue-600' :
                          activity.color === 'green' ? 'text-green-600' :
                          activity.color === 'purple' ? 'text-purple-600' :
                          'text-gray-600'
                        }`}>
                          {activity.icon}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Ligne principale */}
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {activity.type}
                        </p>
                        {activity.priority === 'high' && (
                          <span className="flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            ⚡ Urgent
                          </span>
                        )}
                      </div>
                      
                      {/* Titre/Description */}
                      {activity.title && (
                        <p className="text-sm text-gray-600 truncate mb-1">
                          {activity.title}
                        </p>
                      )}
                      
                      {/* Client et entreprise */}
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="font-medium text-gray-700">{activity.client}</span>
                        {activity.company && (
                          <>
                            <span>•</span>
                            <span className="truncate">{activity.company}</span>
                          </>
                        )}
                      </div>
                      
                      {/* Montant si applicable */}
                      {activity.amount > 0 && (
                        <div className="mt-1">
                          <span className="text-sm font-semibold text-gray-800">
                            {formatCurrency(activity.amount)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Statut et date */}
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                      activity.status === 'Payée' || activity.status === 'Accepté' 
                        ? 'bg-green-100 text-green-800'
                        : activity.status === 'Envoyée' || activity.status === 'Envoyé'
                        ? 'bg-blue-100 text-blue-800'
                        : activity.status === 'En retard' || activity.status === 'Expiré'
                        ? 'bg-red-100 text-red-800'
                        : activity.status === 'Part. payée'
                        ? 'bg-yellow-100 text-yellow-800'
                        : activity.status === 'Brouillon'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {activity.status}
                    </span>
                    
                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        {getTimeAgo(activity.date)}
                      </div>
                      
                      {activity.dueDate && activity.type === 'Facture' && activity.status !== 'Payée' && (
                        <div className={`text-xs mt-1 ${
                          new Date() > new Date(activity.dueDate) ? 'text-red-500 font-medium' : 'text-gray-400'
                        }`}>
                          Échéance: {new Date(activity.dueDate).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {recentActivities.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500">
                  {recentActivities.length} activité(s) récente(s)
                </span>
                {recentActivities.filter(a => a.priority === 'high').length > 0 && (
                  <span className="text-xs text-red-600 font-medium">
                    {recentActivities.filter(a => a.priority === 'high').length} élément(s) urgent(s)
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/clients')}
                  className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                >
                  Clients
                </button>
                <span className="text-gray-300">•</span>
                <button 
                  onClick={() => navigate('/devis')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Devis
                </button>
                <span className="text-gray-300">•</span>
                <button 
                  onClick={() => navigate('/factures')}
                  className="text-xs text-green-600 hover:text-green-800 font-medium"
                >
                  Factures
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
