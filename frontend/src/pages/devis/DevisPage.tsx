import React, { useState, useEffect } from 'react';
import { useDevisStore } from '@/store/devisStore';
import type { Devis } from '@/types/devis';

type ModalState = {
  type: 'create' | 'edit' | 'details' | 'duplicate' | null;
  devis?: Devis | null;
};

const DevisPage: React.FC = () => {
  const { 
    loadDevis, 
    deleteDevis, 
    changeDevisStatus, 
    duplicateDevis,
    filteredDevis,
    totalDevis,
    currentPage,
    totalPages,
    isLoading,
    stats
  } = useDevisStore();
  
  const [modalState, setModalState] = useState<ModalState>({ type: null });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Charger les devis au montage du composant
  useEffect(() => {
    loadDevis();
  }, [loadDevis]);

  const handleAddDevis = () => {
    setModalState({ type: 'create', devis: null });
  };

  const handleEditDevis = (devis: Devis) => {
    setModalState({ type: 'edit', devis });
  };

  const handleViewDevis = (devis: Devis) => {
    setModalState({ type: 'details', devis });
  };

  const handleDuplicateDevis = async (devis: Devis) => {
    try {
      await duplicateDevis(devis.id);
      // Optionnel: afficher une notification de succès
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
    }
  };

  const handleDeleteDevis = (devisId: string) => {
    setShowDeleteConfirm(devisId);
  };

  const confirmDeleteDevis = async () => {
    if (showDeleteConfirm) {
      await deleteDevis(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleStatusChange = async (devisId: string, newStatus: Devis['status']) => {
    await changeDevisStatus(devisId, newStatus);
  };

  const closeModal = () => {
    setModalState({ type: null });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'brouillon':
        return 'bg-gray-100 text-gray-800';
      case 'envoye':
        return 'bg-blue-100 text-blue-800';
      case 'accepte':
        return 'bg-green-100 text-green-800';
      case 'refuse':
        return 'bg-red-100 text-red-800';
      case 'expire':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'brouillon':
        return '📝';
      case 'envoye':
        return '📧';
      case 'accepte':
        return '✅';
      case 'refuse':
        return '❌';
      case 'expire':
        return '⏰';
      default:
        return '📄';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (isLoading && filteredDevis.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Devis</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos devis et propositions commerciales
          </p>
        </div>
        <button 
          onClick={handleAddDevis}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm"
        >
          ➕ Créer un devis
        </button>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total devis</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.brouillon}</div>
            <div className="text-sm text-gray-600">Brouillons</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.envoye}</div>
            <div className="text-sm text-gray-600">Envoyés</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-green-600">{stats.accepte}</div>
            <div className="text-sm text-gray-600">Acceptés</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.acceptanceRate.toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Taux acceptation</div>
          </div>
        </div>
      )}

      {/* Liste des devis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredDevis.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="text-6xl mb-4">📄</div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun devis trouvé</h3>
            <p className="text-gray-500">Commencez par créer votre premier devis.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Devis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date création
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDevis.map((devis) => (
                    <tr key={devis.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {devis.number}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {devis.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {devis.clientInfo.nom} {devis.clientInfo.prenom}
                          </div>
                          {devis.clientInfo.entreprise && (
                            <div className="text-sm text-gray-500">
                              {devis.clientInfo.entreprise}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(devis.status)}`}>
                          {getStatusIcon(devis.status)} {devis.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(devis.totalTTC)}
                          </div>
                          <div className="text-sm text-gray-500">
                            HT: {formatPrice(devis.totalHT)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(devis.dateCreation)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewDevis(devis)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Voir les détails"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => handleEditDevis(devis)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                            title="Modifier"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDuplicateDevis(devis)}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Dupliquer"
                          >
                            📋
                          </button>
                          <button
                            onClick={() => handleDeleteDevis(devis.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination simple */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} sur {totalPages} ({totalDevis} devis au total)
                  </div>
                  <div className="flex space-x-2">
                    <button
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md text-sm ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Précédent
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md text-sm ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowDeleteConfirm(null)}
            />
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    ⚠️
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Supprimer le devis
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDeleteDevis}
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

export default DevisPage;
