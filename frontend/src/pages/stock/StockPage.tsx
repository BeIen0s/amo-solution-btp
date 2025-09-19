import React, { useState, useEffect } from 'react';
import { useStockStore } from '@/store/stockStore';
import type { Product, StockAlert } from '@/types/stock';

type ModalState = {
  type: 'create' | 'edit' | 'details' | 'movement' | 'alerts' | null;
  product?: Product | null;
};

const StockPage: React.FC = () => {
  const { 
    loadProducts, 
    loadAlerts,
    deleteProduct,
    filteredProducts,
    alerts,
    totalProducts,
    currentPage,
    totalPages,
    isLoading,
    stats
  } = useStockStore();
  
  const [modalState, setModalState] = useState<ModalState>({ type: null });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Charger les produits au montage du composant
  useEffect(() => {
    loadProducts();
    loadAlerts();
  }, [loadProducts, loadAlerts]);

  const handleAddProduct = () => {
    setModalState({ type: 'create', product: null });
  };

  const handleEditProduct = (product: Product) => {
    setModalState({ type: 'edit', product });
  };

  const handleViewProduct = (product: Product) => {
    setModalState({ type: 'details', product });
  };

  const handleMovement = (product: Product) => {
    setModalState({ type: 'movement', product });
  };

  const handleShowAlerts = () => {
    setModalState({ type: 'alerts', product: null });
  };

  const handleDeleteProduct = (productId: string) => {
    setShowDeleteConfirm(productId);
  };

  const confirmDeleteProduct = async () => {
    if (showDeleteConfirm) {
      await deleteProduct(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const closeModal = () => {
    setModalState({ type: null });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'materiau':
        return 'bg-blue-100 text-blue-800';
      case 'outil':
        return 'bg-green-100 text-green-800';
      case 'equipement':
        return 'bg-purple-100 text-purple-800';
      case 'consommable':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'materiau':
        return '🧩'; // Brique
      case 'outil':
        return '🔨'; // Marteau
      case 'equipement':
        return '⛑️'; // Casque
      case 'consommable':
        return '📦'; // Boîte
      default:
        return '📋';
    }
  };

  const getStockLevelColor = (product: Product) => {
    if (product.currentStock <= 0) {
      return 'text-red-600 font-medium';
    }
    const ratio = product.currentStock / product.minStock;
    if (ratio <= 0.5) {
      return 'text-red-600';
    } else if (ratio <= 1) {
      return 'text-orange-600';
    } else {
      return 'text-green-600';
    }
  };

  const getStockLevelIcon = (product: Product) => {
    if (product.currentStock <= 0) {
      return '🛑'; // Interdiction
    }
    const ratio = product.currentStock / product.minStock;
    if (ratio <= 0.5) {
      return '⚠️'; // Attention
    } else if (ratio <= 1) {
      return '🟡'; // Jaune
    } else {
      return '✅'; // Vert
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const criticalAlerts = alerts.filter(a => a.level === 'critical' && !a.isRead);

  if (isLoading && filteredProducts.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Stock</h1>
          <p className="text-gray-600 mt-1">
            Gérez votre inventaire et suivez vos approvisionnements
          </p>
        </div>
        <div className="flex gap-3">
          {criticalAlerts.length > 0 && (
            <button 
              onClick={handleShowAlerts}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 shadow-sm relative"
            >
              ⚠️ Alertes ({criticalAlerts.length})
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {criticalAlerts.length}
              </div>
            </button>
          )}
          <button 
            onClick={handleAddProduct}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm"
          >
            ➕ Ajouter un produit
          </button>
        </div>
      </div>

      {/* Statistiques de stock */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
            <div className="text-sm text-gray-600">Total produits</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-xl font-bold text-green-600">{formatPrice(stats.totalValue)}</div>
            <div className="text-sm text-gray-600">Valeur stock</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.lowStockProducts}</div>
            <div className="text-sm text-gray-600">Stock faible</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-red-600">{stats.outOfStockProducts}</div>
            <div className="text-sm text-gray-600">Ruptures</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.averageMargin.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Marge moy.</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-2xl font-bold text-indigo-600">{stats.recentMovements}</div>
            <div className="text-sm text-gray-600">Mvts 7j</div>
          </div>
        </div>
      )}

      {/* Liste des produits */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="text-6xl mb-4">📦</div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun produit trouvé</h3>
            <p className="text-gray-500">Commencez par ajouter des produits à votre inventaire.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localisation
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                              {getCategoryIcon(product.category)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.reference} {product.brand && `• ${product.brand}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(product.category)}`}>
                          {product.category}
                        </span>
                        {product.subcategory && (
                          <div className="text-xs text-gray-500 mt-1">
                            {product.subcategory}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${getStockLevelColor(product)}`}>
                          {getStockLevelIcon(product)} {product.currentStock}{product.unit}
                        </div>
                        <div className="text-xs text-gray-500">
                          Min: {product.minStock}{product.unit}
                        </div>
                        {product.reservedStock > 0 && (
                          <div className="text-xs text-orange-600">
                            Réservé: {product.reservedStock}{product.unit}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>Achat: {formatPrice(product.purchasePrice)}</div>
                        <div className="text-gray-500">Vente: {formatPrice(product.sellingPrice)}</div>
                        <div className="text-xs text-green-600">
                          Marge: {product.margin.toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.locations.slice(0, 2).map((loc, index) => (
                          <div key={loc.id} className="text-xs">
                            {loc.name}: {loc.quantity}{product.unit}
                          </div>
                        ))}
                        {product.locations.length > 2 && (
                          <div className="text-xs text-gray-400">
                            +{product.locations.length - 2} autres
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewProduct(product)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Voir les détails"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => handleMovement(product)}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Mouvement de stock"
                          >
                            🔄
                          </button>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                            title="Modifier"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
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
                    Page {currentPage} sur {totalPages} ({totalProducts} produits au total)
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
                      Supprimer le produit
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDeleteProduct}
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

export default StockPage;
