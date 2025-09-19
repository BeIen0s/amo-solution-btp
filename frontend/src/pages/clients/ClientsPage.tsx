import React, { useState, useEffect } from 'react';
import { useClientStore } from '@/store/clientStore';
import ClientFilters from './components/ClientFilters';
import ClientList from './components/ClientList';
import ClientModal from './components/ClientModal';
import ClientDetails from './components/ClientDetails';
import type { Client } from '@/types/client';

type ModalState = {
  type: 'create' | 'edit' | 'details' | null;
  client?: Client | null;
};

const ClientsPage: React.FC = () => {
  const { loadClients, deleteClient } = useClientStore();
  const [modalState, setModalState] = useState<ModalState>({ type: null });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Charger les clients au montage du composant
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleAddClient = () => {
    setModalState({ type: 'create', client: null });
  };

  const handleEditClient = (client: Client) => {
    setModalState({ type: 'edit', client });
  };

  const handleViewClient = (client: Client) => {
    setModalState({ type: 'details', client });
  };

  const handleDeleteClient = (clientId: string) => {
    setShowDeleteConfirm(clientId);
  };

  const confirmDeleteClient = async () => {
    if (showDeleteConfirm) {
      await deleteClient(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const closeModal = () => {
    setModalState({ type: null });
  };

  const handleEditFromDetails = (client: Client) => {
    setModalState({ type: 'edit', client });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos clients, prospects et collectivités
          </p>
        </div>
        <button 
          onClick={handleAddClient}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm"
        >
          ➕ Ajouter un client
        </button>
      </div>
      
      {/* Contenu principal */}
      <div className="space-y-6">
        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ClientFilters />
        </div>
        
        {/* Liste des clients */}
        <div>
          <ClientList 
            onEditClient={handleEditClient}
            onViewClient={handleViewClient}
            onDeleteClient={handleDeleteClient}
          />
        </div>
      </div>

      {/* Modal d'ajout/édition */}
      {(modalState.type === 'create' || modalState.type === 'edit') && (
        <ClientModal
          isOpen={true}
          onClose={closeModal}
          client={modalState.client}
          mode={modalState.type}
        />
      )}

      {/* Modal de détails */}
      {modalState.type === 'details' && (
        <ClientDetails
          isOpen={true}
          onClose={closeModal}
          client={modalState.client}
          onEditClient={handleEditFromDetails}
        />
      )}

      {/* Confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowDeleteConfirm(null)}
            />

            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    ⚠️
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Supprimer le client
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDeleteClient}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Supprimer
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
