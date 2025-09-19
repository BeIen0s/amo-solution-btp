import React, { useState, useEffect } from 'react';
import { useClientStore } from '@/store/clientStore';
import type { Client, CreateClientData } from '@/types/client';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  mode: 'create' | 'edit';
}

const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  client,
  mode
}) => {
  const { addClient, updateClient } = useClientStore();
  
  const [formData, setFormData] = useState<CreateClientData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    type: 'particulier',
    category: 'prospect',
    entreprise: '',
    siret: '',
    adresse: {
      rue: '',
      ville: '',
      codePostal: '',
      region: 'Auvergne-Rhône-Alpes'
    },
    notes: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Liste des régions françaises
  const regions = [
    'Auvergne-Rhône-Alpes',
    'Provence-Alpes-Côte d\'Azur',
    'Île-de-France',
    'Nouvelle-Aquitaine',
    'Occitanie',
    'Hauts-de-France',
    'Grand Est',
    'Pays de la Loire',
    'Bretagne',
    'Normandie',
    'Bourgogne-Franche-Comté',
    'Centre-Val de Loire'
  ];

  // Initialiser le formulaire avec les données du client en mode édition
  useEffect(() => {
    if (mode === 'edit' && client) {
      setFormData({
        nom: client.nom,
        prenom: client.prenom || '',
        email: client.email,
        telephone: client.telephone,
        type: client.type,
        category: client.category,
        entreprise: client.entreprise || '',
        siret: client.siret || '',
        adresse: {
          rue: client.adresse.rue,
          ville: client.adresse.ville,
          codePostal: client.adresse.codePostal,
          region: client.adresse.region
        },
        notes: client.notes || '',
        isActive: client.isActive
      });
    } else if (mode === 'create') {
      // Réinitialiser le formulaire pour la création
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        type: 'particulier',
        category: 'prospect',
        entreprise: '',
        siret: '',
        adresse: {
          rue: '',
          ville: '',
          codePostal: '',
          region: 'Auvergne-Rhône-Alpes'
        },
        notes: '',
        isActive: true
      });
    }
    setErrors({});
  }, [mode, client, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith('adresse.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        adresse: {
          ...prev.adresse,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validation des champs obligatoires
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est obligatoire';
    } else if (!/^[0-9+\-\s()]{10,}$/.test(formData.telephone)) {
      newErrors.telephone = 'Format de téléphone invalide';
    }

    if (!formData.adresse.rue.trim()) {
      newErrors['adresse.rue'] = 'L\'adresse est obligatoire';
    }

    if (!formData.adresse.ville.trim()) {
      newErrors['adresse.ville'] = 'La ville est obligatoire';
    }

    if (!formData.adresse.codePostal.trim()) {
      newErrors['adresse.codePostal'] = 'Le code postal est obligatoire';
    } else if (!/^[0-9]{5}$/.test(formData.adresse.codePostal)) {
      newErrors['adresse.codePostal'] = 'Code postal invalide (5 chiffres)';
    }

    // Validation spécifique aux entreprises
    if (formData.type === 'entreprise' || formData.type === 'collectivite') {
      if (!formData.entreprise?.trim()) {
        newErrors.entreprise = 'Le nom de l\'entreprise est obligatoire';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        await addClient(formData);
      } else if (mode === 'edit' && client) {
        await updateClient(client.id, formData);
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      // Ici, vous pourriez afficher une notification d'erreur
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

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
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-b">
              <div className="flex items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {mode === 'create' ? 'Ajouter un client' : 'Modifier le client'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-600 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
              >
                <span className="sr-only">Fermer</span>
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-4 py-6 sm:px-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations personnelles */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Informations personnelles</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.nom ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.telephone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="particulier">Particulier</option>
                        <option value="entreprise">Entreprise</option>
                        <option value="collectivite">Collectivité</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="prospect">Prospect</option>
                        <option value="client">Client</option>
                        <option value="client_premium">Client Premium</option>
                      </select>
                    </div>
                  </div>

                  {(formData.type === 'entreprise' || formData.type === 'collectivite') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {formData.type === 'entreprise' ? 'Nom de l\'entreprise *' : 'Nom de la collectivité *'}
                        </label>
                        <input
                          type="text"
                          name="entreprise"
                          value={formData.entreprise}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.entreprise ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors.entreprise && <p className="text-red-500 text-xs mt-1">{errors.entreprise}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          SIRET
                        </label>
                        <input
                          type="text"
                          name="siret"
                          value={formData.siret}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Adresse */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">Adresse</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rue *
                    </label>
                    <input
                      type="text"
                      name="adresse.rue"
                      value={formData.adresse.rue}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors['adresse.rue'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors['adresse.rue'] && <p className="text-red-500 text-xs mt-1">{errors['adresse.rue']}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Code postal *
                      </label>
                      <input
                        type="text"
                        name="adresse.codePostal"
                        value={formData.adresse.codePostal}
                        onChange={handleInputChange}
                        maxLength={5}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors['adresse.codePostal'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors['adresse.codePostal'] && <p className="text-red-500 text-xs mt-1">{errors['adresse.codePostal']}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ville *
                      </label>
                      <input
                        type="text"
                        name="adresse.ville"
                        value={formData.adresse.ville}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors['adresse.ville'] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors['adresse.ville'] && <p className="text-red-500 text-xs mt-1">{errors['adresse.ville']}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Région
                    </label>
                    <select
                      name="adresse.region"
                      value={formData.adresse.region}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Informations complémentaires sur le client..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Client actif
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? 'Sauvegarde...' : mode === 'create' ? 'Ajouter' : 'Modifier'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;