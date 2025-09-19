import React, { useEffect, useState } from 'react';
import { useClientStore } from '@/store/clientStore';
import { Client } from '@/types/client';
import toast from 'react-hot-toast';

// Composants
import ClientList from './components/ClientList';
import ClientFilters from './components/ClientFilters';
import ClientModal from './components/ClientModal';
import ClientDetails from './components/ClientDetails';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ClientsPageComplete: React.FC = () => {
  const {
    clients,
    selectedClient,
    isLoading,
    currentPage,
    totalPages,
    totalClients,
    fetchClients,
    selectClient,
    deleteClient
  } = useClientStore();

  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Charger les clients au montage
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Handlers
  const handleAddClient = () => {
    setEditingClient(null);
    setShowModal(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowModal(true);
  };

  const handleViewClient = (client: Client) => {
    selectClient(client);
    setShowDetails(true);
  };

  const handleDeleteClient = async (client: Client) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le client "${client.name}" ?`)) {
      try {
        await deleteClient(client.id);
        toast.success('Client supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingClient(null);
  };

  const handleDetailsClose = () => {
    setShowDetails(false);
    selectClient(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
          <p className="text-gray-600">
            {totalClients} client{totalClients > 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          onClick={handleAddClient}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>+</span>
          Nouveau client
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4">
          <ClientFilters />
        </div>
      </div>

      {/* Liste des clients */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {isLoading && clients.length === 0 ? (
          <div className="p-8 text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Chargement des clients...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun client trouvé</h3>
            <p className="text-gray-600 mb-4">
              Commencez par ajouter votre premier client
            </p>
            <button
              onClick={handleAddClient}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Ajouter un client
            </button>
          </div>
        ) : (
          <ClientList
            clients={clients}
            onEdit={handleEditClient}
            onView={handleViewClient}
            onDelete={handleDeleteClient}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchClients(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Précédent
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => fetchClients(page)}
                  disabled={isLoading}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => fetchClients(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Modal d'ajout/édition */}
      {showModal && (
        <ClientModal
          client={editingClient}
          onClose={handleModalClose}
          onSave={() => {
            handleModalClose();
            fetchClients();
          }}
        />
      )}

      {/* Modal de détails */}
      {showDetails && selectedClient && (
        <ClientDetails
          client={selectedClient}
          onClose={handleDetailsClose}
          onEdit={() => {
            handleDetailsClose();
            handleEditClient(selectedClient);
          }}
        />
      )}
    </div>
  );
};

export default ClientsPageComplete;