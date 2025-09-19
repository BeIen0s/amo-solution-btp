import React, { useState, useEffect } from 'react';
import { useDevisStore } from '@/store/devisStore';
import type { Devis } from '@/types/devis';

interface DevisModalProps {
  isOpen: boolean;
  onClose: () => void;
  devis: Devis | null;
  mode: 'create' | 'edit';
}

const DevisModal: React.FC<DevisModalProps> = ({
  isOpen,
  onClose,
  devis,
  mode
}) => {
  const { addDevis, updateDevis, generateDevisNumber } = useDevisStore();
  
  const [formData, setFormData] = useState({
    title: '',
    clientInfo: {
      nom: '',
      prenom: '',
      entreprise: '',
      email: '',
      telephone: '',
      adresse: ''
    },
    validiteJours: 30,
    items: [{
      description: '',
      quantite: 1,
      prixUnitaire: 0,
      tva: 20,
      remise: 0
    }],
    conditions: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialiser les données du formulaire
  useEffect(() => {
    if (devis && mode === 'edit') {
      setFormData({
        title: devis.title,
        clientInfo: devis.clientInfo,
        validiteJours: devis.validiteJours,
        items: devis.items,
        conditions: devis.conditions || '',
        notes: devis.notes || ''
      });
    } else {
      // Réinitialiser pour nouveau devis
      setFormData({
        title: '',
        clientInfo: {
          nom: '',
          prenom: '',
          entreprise: '',
          email: '',
          telephone: '',
          adresse: ''
        },
        validiteJours: 30,
        items: [{
          description: '',
          quantite: 1,
          prixUnitaire: 0,
          tva: 20,
          remise: 0
        }],
        conditions: '',
        notes: ''
      });
    }
    setErrors({});
  }, [devis, mode, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('client.')) {
      const clientField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        clientInfo: {
          ...prev.clientInfo,
          [clientField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index 
          ? { ...item, [field]: typeof value === 'string' ? (field === 'description' ? value : parseFloat(value) || 0) : value }
          : item
      )
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantite: 1,
        prixUnitaire: 0,
        tva: 20,
        remise: 0
      }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateItemTotal = (item: any) => {
    const sousTotal = item.quantite * item.prixUnitaire;
    const apresRemise = sousTotal * (1 - item.remise / 100);
    const totalTTC = apresRemise * (1 + item.tva / 100);
    return {
      sousTotal,
      apresRemise,
      totalTTC
    };
  };

  const calculateTotals = () => {
    let totalHT = 0;
    let totalTVA = 0;
    let totalRemise = 0;

    formData.items.forEach(item => {
      const sousTotal = item.quantite * item.prixUnitaire;
      const remiseAmount = sousTotal * (item.remise / 100);
      const htApresRemise = sousTotal - remiseAmount;
      const tvaAmount = htApresRemise * (item.tva / 100);

      totalHT += htApresRemise;
      totalTVA += tvaAmount;
      totalRemise += remiseAmount;
    });

    const totalTTC = totalHT + totalTVA;

    return { totalHT, totalTVA, totalTTC, totalRemise };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.clientInfo.nom.trim()) newErrors['client.nom'] = 'Le nom du client est requis';
    if (!formData.clientInfo.email.trim()) newErrors['client.email'] = 'L\'email du client est requis';
    if (formData.clientInfo.email && !/\S+@\S+\.\S+/.test(formData.clientInfo.email)) {
      newErrors['client.email'] = 'Format d\'email invalide';
    }
    if (formData.validiteJours <= 0) newErrors.validiteJours = 'La validité doit être positive';
    
    formData.items.forEach((item, index) => {
      if (!item.description.trim()) {
        newErrors[`item.${index}.description`] = 'La description est requise';
      }
      if (item.quantite <= 0) {
        newErrors[`item.${index}.quantite`] = 'La quantité doit être positive';
      }
      if (item.prixUnitaire <= 0) {
        newErrors[`item.${index}.prixUnitaire`] = 'Le prix unitaire doit être positif';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const totals = calculateTotals();
      
      const devisData = {
        ...formData,
        number: devis?.number || generateDevisNumber(),
        status: 'brouillon' as Devis['status'],
        ...totals,
        dateCreation: devis?.dateCreation || new Date().toISOString(),
        dateExpiration: new Date(Date.now() + formData.validiteJours * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: devis?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (mode === 'create') {
        await addDevis(devisData);
      } else if (devis) {
        await updateDevis(devis.id, devisData);
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ submit: 'Erreur lors de la sauvegarde' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full max-h-screen overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  📄
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {mode === 'create' ? 'Créer un devis' : 'Modifier le devis'}
                  </h3>
                  
                  {errors.submit && (
                    <div className="mt-2 bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Informations générales */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Informations générales</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Titre du devis *
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                                errors.title ? 'border-red-300' : 'border-gray-300'
                              } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                              placeholder="Ex: Proposition travaux maçonnerie"
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Validité (jours)
                            </label>
                            <input
                              type="number"
                              name="validiteJours"
                              value={formData.validiteJours}
                              onChange={handleInputChange}
                              min="1"
                              className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                                errors.validiteJours ? 'border-red-300' : 'border-gray-300'
                              } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                              placeholder="30"
                            />
                            {errors.validiteJours && <p className="mt-1 text-sm text-red-600">{errors.validiteJours}</p>}
                          </div>
                        </div>
                      </div>

                      {/* Informations client */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Informations client</h4>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Nom *
                              </label>
                              <input
                                type="text"
                                name="client.nom"
                                value={formData.clientInfo.nom}
                                onChange={handleInputChange}
                                className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                                  errors['client.nom'] ? 'border-red-300' : 'border-gray-300'
                                } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="Nom"
                              />
                              {errors['client.nom'] && <p className="mt-1 text-sm text-red-600">{errors['client.nom']}</p>}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Prénom
                              </label>
                              <input
                                type="text"
                                name="client.prenom"
                                value={formData.clientInfo.prenom}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Prénom"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Entreprise
                            </label>
                            <input
                              type="text"
                              name="client.entreprise"
                              value={formData.clientInfo.entreprise}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Nom de l'entreprise"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Email *
                            </label>
                            <input
                              type="email"
                              name="client.email"
                              value={formData.clientInfo.email}
                              onChange={handleInputChange}
                              className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                                errors['client.email'] ? 'border-red-300' : 'border-gray-300'
                              } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                              placeholder="email@exemple.com"
                            />
                            {errors['client.email'] && <p className="mt-1 text-sm text-red-600">{errors['client.email']}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Téléphone
                            </label>
                            <input
                              type="tel"
                              name="client.telephone"
                              value={formData.clientInfo.telephone}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="01 23 45 67 89"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Adresse
                            </label>
                            <textarea
                              name="client.adresse"
                              value={formData.clientInfo.adresse}
                              onChange={handleInputChange}
                              rows={2}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Adresse complète"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Conditions et notes */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">Conditions et notes</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Conditions particulières
                            </label>
                            <textarea
                              name="conditions"
                              value={formData.conditions}
                              onChange={handleInputChange}
                              rows={3}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Conditions de paiement, délais, garanties..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Notes internes
                            </label>
                            <textarea
                              name="notes"
                              value={formData.notes}
                              onChange={handleInputChange}
                              rows={2}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Notes pour usage interne..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Articles et totaux */}
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Articles</h4>
                          <button
                            type="button"
                            onClick={addItem}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            ➕ Ajouter
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {formData.items.map((item, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <div className="flex items-start justify-between mb-3">
                                <h5 className="font-medium text-gray-800">Article {index + 1}</h5>
                                {formData.items.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                  >
                                    🗑️ Supprimer
                                  </button>
                                )}
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    Description *
                                  </label>
                                  <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                    className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                                      errors[`item.${index}.description`] ? 'border-red-300' : 'border-gray-300'
                                    } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    placeholder="Description de l'article"
                                  />
                                  {errors[`item.${index}.description`] && (
                                    <p className="mt-1 text-sm text-red-600">{errors[`item.${index}.description`]}</p>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      Quantité
                                    </label>
                                    <input
                                      type="number"
                                      value={item.quantite}
                                      onChange={(e) => handleItemChange(index, 'quantite', parseFloat(e.target.value) || 0)}
                                      min="0"
                                      step="0.01"
                                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                                        errors[`item.${index}.quantite`] ? 'border-red-300' : 'border-gray-300'
                                      } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    />
                                    {errors[`item.${index}.quantite`] && (
                                      <p className="mt-1 text-sm text-red-600">{errors[`item.${index}.quantite`]}</p>
                                    )}
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      Prix unitaire (€)
                                    </label>
                                    <input
                                      type="number"
                                      value={item.prixUnitaire}
                                      onChange={(e) => handleItemChange(index, 'prixUnitaire', parseFloat(e.target.value) || 0)}
                                      min="0"
                                      step="0.01"
                                      className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                                        errors[`item.${index}.prixUnitaire`] ? 'border-red-300' : 'border-gray-300'
                                      } focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                    />
                                    {errors[`item.${index}.prixUnitaire`] && (
                                      <p className="mt-1 text-sm text-red-600">{errors[`item.${index}.prixUnitaire`]}</p>
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      TVA (%)
                                    </label>
                                    <input
                                      type="number"
                                      value={item.tva}
                                      onChange={(e) => handleItemChange(index, 'tva', parseFloat(e.target.value) || 0)}
                                      min="0"
                                      max="100"
                                      step="0.1"
                                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                      Remise (%)
                                    </label>
                                    <input
                                      type="number"
                                      value={item.remise}
                                      onChange={(e) => handleItemChange(index, 'remise', parseFloat(e.target.value) || 0)}
                                      min="0"
                                      max="100"
                                      step="0.1"
                                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                </div>

                                {/* Sous-total article */}
                                {item.quantite > 0 && item.prixUnitaire > 0 && (
                                  <div className="bg-blue-50 rounded p-2 text-sm">
                                    <div className="text-blue-800">
                                      💰 Total article: {calculateItemTotal(item).totalTTC.toFixed(2)}€ TTC
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Totaux */}
                      <div className="bg-gray-100 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Récapitulatif</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total HT:</span>
                            <span>{totals.totalHT.toFixed(2)}€</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total remises:</span>
                            <span>-{totals.totalRemise.toFixed(2)}€</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total TVA:</span>
                            <span>{totals.totalTVA.toFixed(2)}€</span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between font-bold text-base">
                              <span>Total TTC:</span>
                              <span>{totals.totalTTC.toFixed(2)}€</span>
                            </div>
                          </div>
                        </div>
                        
                        {formData.validiteJours > 0 && (
                          <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                            📅 Valide jusqu'au {new Date(Date.now() + formData.validiteJours * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                          </div>
                        )}
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
                {isSubmitting ? '💾 Enregistrement...' : (mode === 'create' ? '➕ Créer le devis' : '✏️ Modifier le devis')}
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

export default DevisModal;