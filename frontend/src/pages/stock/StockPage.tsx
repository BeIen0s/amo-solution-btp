import React from 'react';

const StockPage: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Gestion du Stock</h1>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        + Ajouter produit
      </button>
    </div>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div className="text-6xl mb-4">📦</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Module Stock</h2>
      <p className="text-gray-600 mb-4">
        Suivez votre inventaire et gérez vos approvisionnements
      </p>
      <div className="bg-orange-50 rounded-lg p-4">
        <p className="text-sm text-orange-800">
          🚧 Module en développement - Fonctionnalités à venir :
        </p>
        <ul className="text-sm text-orange-700 mt-2 text-left max-w-md mx-auto">
          <li>• Gestion multi-entrepôts</li>
          <li>• Alertes stock minimum</li>
          <li>• Mouvements de stock</li>
          <li>• Codes-barres et QR codes</li>
        </ul>
      </div>
    </div>
  </div>
);

export default StockPage;