import React from 'react';
import type { Client } from '@/types/client';

interface ClientDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onEditClient?: (client: Client) => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({
  isOpen,
  onClose,
  client,
  onEditClient
}) => {
  if (!isOpen || !client) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'particulier':
        return 'bg-green-100 text-green-800';
      case 'entreprise':
        return 'bg-blue-100 text-blue-800';
      case 'collectivite':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prospect':
        return 'bg-orange-100 text-orange-800';
      case 'client':
        return 'bg-green-100 text-green-800';
      case 'client_premium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'particulier':
        return '👤';
      case 'entreprise':
        return '🏢';
      case 'collectivite':
        return '🏛️';
      default:
        return '👤';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gray-50 px-4 py-4 sm:px-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-12 w-12">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-blue-600">
                      {client.nom.charAt(0)}{client.prenom?.charAt(0) || ''}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl leading-6 font-medium text-gray-900">
                    {client.nom} {client.prenom}
                  </h3>
                  <p className="text-sm text-gray-500">{client.email}</p>
                </div>
                <div className="flex space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(client.type)}`}>
                    {getTypeIcon(client.type)} {client.type}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(client.category)}`}>
                    {client.category}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    client.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {client.isActive ? '✅ Actif' : '❌ Inactif'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {onEditClient && (
                  <button
                    onClick={() => onEditClient(client)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    ✏️ Modifier
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="bg-white text-gray-400 hover:text-gray-600 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 items-center justify-center"
                >
                  <span className="sr-only">Fermer</span>
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 py-6 sm:px-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Informations personnelles */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    📋 Informations personnelles
                  </h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Nom complet</dt>
                      <dd className="text-sm text-gray-900 mt-1">
                        {client.nom} {client.prenom}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900 mt-1">
                        <a href={`mailto:${client.email}`} className="text-blue-600 hover:text-blue-800">
                          {client.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                      <dd className="text-sm text-gray-900 mt-1">
                        <a href={`tel:${client.telephone}`} className="text-blue-600 hover:text-blue-800">
                          {client.telephone}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Date de création</dt>
                      <dd className="text-sm text-gray-900 mt-1">
                        {formatDate(client.dateCreation)}
                      </dd>
                    </div>
                    {client.dateModification && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Dernière modification</dt>
                        <dd className="text-sm text-gray-900 mt-1">
                          {formatDate(client.dateModification)}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Informations entreprise si applicable */}
                {(client.type === 'entreprise' || client.type === 'collectivite') && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      {client.type === 'entreprise' ? '🏢' : '🏛️'} 
                      {client.type === 'entreprise' ? ' Entreprise' : ' Collectivité'}
                    </h4>
                    <dl className="space-y-3">
                      {client.entreprise && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            {client.type === 'entreprise' ? 'Nom de l\'entreprise' : 'Nom de la collectivité'}
                          </dt>
                          <dd className="text-sm text-gray-900 mt-1">
                            {client.entreprise}
                          </dd>
                        </div>
                      )}
                      {client.siret && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">SIRET</dt>
                          <dd className="text-sm text-gray-900 mt-1 font-mono">
                            {client.siret}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
              </div>

              {/* Adresse et informations complémentaires */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    📍 Adresse
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <address className="text-sm text-gray-900 not-italic">
                      {client.adresse.rue}<br />
                      {client.adresse.codePostal} {client.adresse.ville}<br />
                      <span className="font-medium">{client.adresse.region}</span>
                    </address>
                    <div className="mt-3">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${client.adresse.rue}, ${client.adresse.codePostal} ${client.adresse.ville}, France`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        🗺️ Voir sur Google Maps
                      </a>
                    </div>
                  </div>
                </div>

                {client.notes && (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      📝 Notes
                    </h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {client.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Statistiques futures */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    📊 Statistiques
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-xs text-blue-600">Devis</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">0</div>
                      <div className="text-xs text-green-600">Factures</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">0 €</div>
                      <div className="text-xs text-purple-600">CA total</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">0</div>
                      <div className="text-xs text-orange-600">Projets</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Les statistiques seront disponibles avec les modules devis/factures
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;