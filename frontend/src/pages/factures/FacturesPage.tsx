import React from 'react';

const FacturesPage: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Gestion des Factures</h1>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        + Nouvelle facture
      </button>
    </div>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div className="text-6xl mb-4">💰</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Module Factures</h2>
      <p className="text-gray-600 mb-4">
        Gérez votre facturation et suivez vos paiements
      </p>
      <div className="bg-green-50 rounded-lg p-4">
        <p className="text-sm text-green-800">
          🚧 Module en développement - Fonctionnalités à venir :
        </p>
        <ul className="text-sm text-green-700 mt-2 text-left max-w-md mx-auto">
          <li>• Création automatique depuis devis</li>
          <li>• Suivi des paiements</li>
          <li>• Relances automatiques</li>
          <li>• Export comptable</li>
        </ul>
      </div>
    </div>
  </div>
);

export default FacturesPage;