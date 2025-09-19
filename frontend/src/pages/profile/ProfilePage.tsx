import React from 'react';

const ProfilePage: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>

    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div className="text-6xl mb-4">👤</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Profil Utilisateur</h2>
      <p className="text-gray-600 mb-4">
        Gérez vos informations personnelles et préférences
      </p>
      <div className="bg-indigo-50 rounded-lg p-4">
        <p className="text-sm text-indigo-800">
          🚧 Module en développement - Fonctionnalités à venir :
        </p>
        <ul className="text-sm text-indigo-700 mt-2 text-left max-w-md mx-auto">
          <li>• Modification des informations</li>
          <li>• Changement de mot de passe</li>
          <li>• Préférences d'affichage</li>
          <li>• Notifications</li>
        </ul>
      </div>
    </div>
  </div>
);

export default ProfilePage;