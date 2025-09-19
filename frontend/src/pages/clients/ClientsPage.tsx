import React from 'react';

const ClientsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Nouveau client
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">👥</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Module Clients</h2>
        <p className="text-gray-600 mb-4">
          Gérez vos clients et prospects efficacement
        </p>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            🚧 Module en développement - Fonctionnalités à venir :
          </p>
          <ul className="text-sm text-blue-700 mt-2 text-left max-w-md mx-auto">
            <li>• Base de données clients complète</li>
            <li>• Historique des transactions</li>
            <li>• Segmentation et tags</li>
            <li>• Export et import de données</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;