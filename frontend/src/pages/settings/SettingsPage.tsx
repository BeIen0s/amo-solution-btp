import React from 'react';

const SettingsPage: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div className="text-6xl mb-4">⚙️</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Configuration</h2>
      <p className="text-gray-600 mb-4">
        Personnalisez votre application A.M.O Solution BTP
      </p>
      <div className="bg-purple-50 rounded-lg p-4">
        <p className="text-sm text-purple-800">
          🚧 Module en développement - Fonctionnalités à venir :
        </p>
        <ul className="text-sm text-purple-700 mt-2 text-left max-w-md mx-auto">
          <li>• Paramètres de l'entreprise</li>
          <li>• Configuration des modules</li>
          <li>• Gestion des utilisateurs</li>
          <li>• Intégrations tierces</li>
        </ul>
      </div>
    </div>
  </div>
);

export default SettingsPage;