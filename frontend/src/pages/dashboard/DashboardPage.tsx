import React from 'react';
import { useAuthStore } from '@/store/authStore';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const stats = [
    { name: 'Clients actifs', value: '24', change: '+4.75%', changeType: 'positive' },
    { name: 'Devis en cours', value: '12', change: '+54.02%', changeType: 'positive' },
    { name: 'Factures ce mois', value: '€45,231', change: '-1.39%', changeType: 'negative' },
    { name: 'Chiffre d\'affaires', value: '€89,400', change: '+4.75%', changeType: 'positive' },
  ];

  const recentActivities = [
    { id: 1, type: 'Devis', client: 'Entreprise Martin', amount: '€12,500', status: 'En attente' },
    { id: 2, type: 'Facture', client: 'SAS Durand', amount: '€8,750', status: 'Payée' },
    { id: 3, type: 'Commande', client: 'SARL Rousseau', amount: '€15,200', status: 'En cours' },
    { id: 4, type: 'Devis', client: 'Maçonnerie Petit', amount: '€6,300', status: 'Accepté' },
  ];

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
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                stat.changeType === 'positive' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <span className="text-2xl mb-2">📄</span>
            <span className="text-sm font-medium text-gray-900">Nouveau devis</span>
          </button>
          <button className="flex flex-col items-center p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <span className="text-2xl mb-2">💰</span>
            <span className="text-sm font-medium text-gray-900">Créer facture</span>
          </button>
          <button className="flex flex-col items-center p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <span className="text-2xl mb-2">👥</span>
            <span className="text-sm font-medium text-gray-900">Ajouter client</span>
          </button>
          <button className="flex flex-col items-center p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <span className="text-2xl mb-2">📦</span>
            <span className="text-sm font-medium text-gray-900">Gérer stock</span>
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">
                      {activity.type.charAt(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.type} - {activity.client}
                  </p>
                  <p className="text-sm text-gray-500">{activity.amount}</p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                activity.status === 'Payée' 
                  ? 'bg-green-100 text-green-800'
                  : activity.status === 'En cours'
                  ? 'bg-blue-100 text-blue-800'
                  : activity.status === 'Accepté'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;