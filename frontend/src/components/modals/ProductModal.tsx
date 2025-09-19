import React, { useState, useEffect } from 'react';
import { useStockStore } from '@/store/stockStore';
import type { Product } from '@/types/stock';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  mode: 'create' | 'edit';
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  mode
}) => {
  const { addProduct, updateProduct } = useStockStore();
  
  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    category: 'materiau' as Product['category'],
    subcategory: '',
    brand: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 100,
    unit: 'unité',
    purchasePrice: 0,
    sellingPrice: 0,
    supplier: '',
    description: '',
    barcode: '',
    location: 'Entrepôt Principal'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialiser les données du formulaire
  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name,
        reference: product.reference,
        category: product.category,
        subcategory: product.subcategory || '',
        brand: product.brand || '',
        currentStock: product.currentStock,
        minStock: product.minStock,
        maxStock: product.maxStock || 100,
        unit: product.unit,
        purchasePrice: product.purchasePrice,
        sellingPrice: product.sellingPrice,
        supplier: product.supplier || '',
        description: product.description || '',
        barcode: product.barcode || '',
        location: product.locations[0]?.name || 'Entrepôt Principal'
      });
    } else {
      // Réinitialiser pour nouveau produit
      setFormData({
        name: '',
        reference: '',
        category: 'materiau',
        subcategory: '',
        brand: '',
        currentStock: 0,
        minStock: 0,
        maxStock: 100,
        unit: 'unité',
        purchasePrice: 0,
        sellingPrice: 0,
        supplier: '',
        description: '',
        barcode: '',
        location: 'Entrepôt Principal'
      });
    }
    setErrors({});
  }, [product, mode, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.reference.trim()) newErrors.reference = 'La référence est requise';
    if (formData.currentStock < 0) newErrors.currentStock = 'Le stock ne peut pas être négatif';
    if (formData.minStock < 0) newErrors.minStock = 'Le stock minimum ne peut pas être négatif';
    if (formData.purchasePrice < 0) newErrors.purchasePrice = 'Le prix d\'achat ne peut pas être négatif';
    if (formData.sellingPrice < 0) newErrors.sellingPrice = 'Le prix de vente ne peut pas être négatif';
    if (formData.sellingPrice <= formData.purchasePrice) {
      newErrors.sellingPrice = 'Le prix de vente doit être supérieur au prix d\'achat';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const productData = {
        ...formData,
        margin: ((formData.sellingPrice - formData.purchasePrice) / formData.purchasePrice * 100),
        locations: [{
          id: '1',
          name: formData.location,
          quantity: formData.currentStock
        }],
        reservedStock: 0,
        lastMovement: new Date().toISOString(),
        createdAt: product?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (mode === 'create') {
        await addProduct(productData);
      } else if (product) {
        await updateProduct(product.id, productData);
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ submit: 'Erreur lors de la sauvegarde' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'materiau', label: 'Matériau', icon: '🧩' },
    { value: 'outil', label: 'Outil', icon: '🔨' },
    { value: 'equipement', label: 'Équipement', icon: '⛑️' },
    { value: 'consommable', label: 'Consommable', icon: '📦' }
  ];

  const units = [
    'unité', 'kg', 'm', 'm²', 'm³', 'litre', 'boîte', 'paquet', 'rouleau', 'sac'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  📦
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {mode === 'create' ? 'Ajouter un produit' : 'Modifier le produit'}
                  </h3>
                  
                  {errors.submit && (
                    <div className="mt-2 bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informations générales */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Informations générales</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nom du produit *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                            errors.name ? 'border-red-300' : 'border-gray-300'
                          } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Ex: Ciment Portland"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Référence *
                        </label>
                        <input
                          type="text"
                          name="reference"
                          value={formData.reference}
                          onChange={handleInputChange}
                          className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                            errors.reference ? 'border-red-300' : 'border-gray-300'
                          } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Ex: CIM-001"
                        />
                        {errors.reference && <p className="mt-1 text-sm text-red-600">{errors.reference}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Catégorie
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.icon} {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Sous-catégorie
                        </label>
                        <input
                          type="text"
                          name="subcategory"
                          value={formData.subcategory}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ex: Ciments"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Marque
                        </label>
                        <input
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ex: Lafarge"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Description du produit..."
                        />
                      </div>
                    </div>

                    {/* Stock et Prix */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Stock et Prix</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Stock actuel
                          </label>
                          <input
                            type="number"
                            name="currentStock"
                            value={formData.currentStock}
                            onChange={handleInputChange}
                            min="0"
                            className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                              errors.currentStock ? 'border-red-300' : 'border-gray-300'
                            } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          />
                          {errors.currentStock && <p className="mt-1 text-sm text-red-600">{errors.currentStock}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Unité
                          </label>
                          <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            {units.map(unit => (
                              <option key={unit} value={unit}>{unit}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Stock minimum
                          </label>
                          <input
                            type="number"
                            name="minStock"
                            value={formData.minStock}
                            onChange={handleInputChange}
                            min="0"
                            className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                              errors.minStock ? 'border-red-300' : 'border-gray-300'
                            } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          />
                          {errors.minStock && <p className="mt-1 text-sm text-red-600">{errors.minStock}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Stock maximum
                          </label>
                          <input
                            type="number"
                            name="maxStock"
                            value={formData.maxStock}
                            onChange={handleInputChange}
                            min="0"
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Prix d'achat (€)
                          </label>
                          <input
                            type="number"
                            name="purchasePrice"
                            value={formData.purchasePrice}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                              errors.purchasePrice ? 'border-red-300' : 'border-gray-300'
                            } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          />
                          {errors.purchasePrice && <p className="mt-1 text-sm text-red-600">{errors.purchasePrice}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Prix de vente (€)
                          </label>
                          <input
                            type="number"
                            name="sellingPrice"
                            value={formData.sellingPrice}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                              errors.sellingPrice ? 'border-red-300' : 'border-gray-300'
                            } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                          />
                          {errors.sellingPrice && <p className="mt-1 text-sm text-red-600">{errors.sellingPrice}</p>}
                        </div>
                      </div>

                      {formData.purchasePrice > 0 && formData.sellingPrice > 0 && (
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-sm text-green-700">
                            💰 Marge: {((formData.sellingPrice - formData.purchasePrice) / formData.purchasePrice * 100).toFixed(1)}%
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Fournisseur
                        </label>
                        <input
                          type="text"
                          name="supplier"
                          value={formData.supplier}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ex: Fournisseur BTP"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Localisation
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ex: Entrepôt Principal"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Code-barres
                        </label>
                        <input
                          type="text"
                          name="barcode"
                          value={formData.barcode}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ex: 1234567890123"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? '💾 Enregistrement...' : (mode === 'create' ? '➕ Ajouter' : '✏️ Modifier')}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                ❌ Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;