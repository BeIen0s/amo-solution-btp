import React, { useState, useEffect } from 'react';
import { useFactureStore } from '@/store/factureStore';
import type { Facture, Payment } from '@/types/facture';

type ModalState = {
  type: 'create' | 'edit' | 'details' | 'payment' | null;
  facture?: Facture | null;
};

const FacturesPage: React.FC = () => {
  const { 
    loadFactures, 
    deleteFacture, 
    changeFactureStatus, 
    addPayment,
    filteredFactures,
    totalFactures,
    currentPage,
    totalPages,
    isLoading,
    stats
  } = useFactureStore();
  
  const [modalState, setModalState] = useState<ModalState>({ type: null });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Charger les factures au montage du composant
  useEffect(() => {
    loadFactures();
  }, [loadFactures]);

  const handleAddFacture = () => {
    setModalState({ type: 'create', facture: null });
  };

  const handleEditFacture = (facture: Facture) => {
    setModalState({ type: 'edit', facture });
  };

  const handleViewFacture = (facture: Facture) => {
    setModalState({ type: 'details', facture });
  };

  const handleAddPayment = (facture: Facture) => {
    setModalState({ type: 'payment', facture });
  };

  const handleDeleteFacture = (factureId: string) => {
    setShowDeleteConfirm(factureId);
  };

  const confirmDeleteFacture = async () => {
    if (showDeleteConfirm) {
      await deleteFacture(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleStatusChange = async (factureId: string, newStatus: Facture['status']) => {
    await changeFactureStatus(factureId, newStatus);
  };

  const closeModal = () => {
    setModalState({ type: null });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'brouillon':
        return 'bg-gray-100 text-gray-800';
      case 'envoyee':
        return 'bg-blue-100 text-blue-800';
      case 'payee':
        return 'bg-green-100 text-green-800';
      case 'partiellement_payee':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_retard':
        return 'bg-red-100 text-red-800';
      case 'annulee':
        return 'bg-gray-100 text-gray-500';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'brouillon':
        return '📝';
      case 'envoyee':
        return '📧';
      case 'payee':
        return '✅';
      case 'partiellement_payee':
        return '⚡';
      case 'en_retard':
        return '⚠️';
      case 'annulee':
        return '❌';
      default:
        return '💰';
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

  const isOverdue = (facture: Facture): boolean => {
    const now = new Date();
    const echeance = new Date(facture.dateEcheance);
    return now > echeance && facture.remainingAmount > 0;
  };

  if (isLoading && filteredFactures.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Factures</h1>
          <p className="text-gray-600 mt-1">
            Gérez votre facturation et suivez vos paiements
          </p>
        </div>
        <button 
          onClick={handleAddFacture}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm"
        >
          ➕ Créer une facture
        </button>
      </div>

      {/* Statistiques financières */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total factures</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-green-600">{stats.payee}</div>
            <div className="text-sm text-gray-600">Payées</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.partiellement_payee}</div>
            <div className="text-sm text-gray-600">Part. payées</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-red-600">{stats.en_retard}</div>
            <div className="text-sm text-gray-600">En retard</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-xl font-bold text-green-600">{formatPrice(stats.totalAmountPaid)}</div>
            <div className="text-sm text-gray-600">Encaissé</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-xl font-bold text-orange-600">{formatPrice(stats.totalRemainingAmount)}</div>
            <div className="text-sm text-gray-600">À encaisser</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.averagePaymentDelay.toFixed(0)}j</div>
            <div className="text-sm text-gray-600">Délai moyen</div>
          </div>
        </div>
      )}

      {/* Liste des factures */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredFactures.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="text-6xl mb-4">💰</div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune facture trouvée</h3>
            <p className="text-gray-500">Commencez par créer votre première facture.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Facture
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
                      Échéance
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFactures.map((facture) => (
                    <tr key={facture.id} className={`hover:bg-gray-50 ${
                      isOverdue(facture) ? 'bg-red-50' : ''
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {facture.number}
                            {facture.devisNumber && (
                              <span className="ml-2 text-xs text-gray-500">
                                ({facture.devisNumber})
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {facture.title}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {facture.clientInfo.nom} {facture.clientInfo.prenom}
                          </div>
                          {facture.clientInfo.entreprise && (
                            <div className="text-sm text-gray-500">
                              {facture.clientInfo.entreprise}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(facture.status)}`}>
                          {getStatusIcon(facture.status)} {facture.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(facture.totalTTC)}
                          </div>
                          {facture.amountPaid > 0 && (
                            <div className="text-sm text-green-600">
                              Payé: {formatPrice(facture.amountPaid)}
                            </div>
                          )}
                          {facture.remainingAmount > 0 && (
                            <div className="text-sm text-orange-600">
                              Reste: {formatPrice(facture.remainingAmount)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${
                          isOverdue(facture) ? 'text-red-600 font-medium' : 'text-gray-500'
                        }`}>
                          {formatDate(facture.dateEcheance)}
                          {isOverdue(facture) && (
                            <div className="text-xs text-red-500">En retard</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewFacture(facture)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Voir les détails"
                          >
                            👁️
                          </button>
                          {facture.remainingAmount > 0 && (
                            <button
                              onClick={() => handleAddPayment(facture)}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title="Ajouter un paiement"
                            >
                              💳
                            </button>
                          )}
                          <button
                            onClick={() => handleEditFacture(facture)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                            title="Modifier"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteFacture(facture.id)}
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
                    Page {currentPage} sur {totalPages} ({totalFactures} factures au total)
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
                      Supprimer la facture
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDeleteFacture}
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

export default FacturesPage;
