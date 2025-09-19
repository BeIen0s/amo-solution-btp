import React, { useState } from 'react';
import { useClientStore } from '@/store/clientStore';

const ClientFilters: React.FC = () => {
  const { filters, setFilters, searchClients } = useClientStore();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchClients(searchTerm);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value === 'all' ? undefined : value });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      search: undefined,
      type: undefined,
      category: undefined,
      region: undefined,
      isActive: undefined
    });
  };

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, email ou entreprise..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          🔍 Rechercher
        </button>
      </form>

      {/* Filtres avancés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Type de client */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de client
          </label>
          <select
            value={filters.type || 'all'}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les types</option>
            <option value="particulier">Particulier</option>
            <option value="entreprise">Entreprise</option>
            <option value="collectivite">Collectivité</option>
          </select>
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie
          </label>
          <select
            value={filters.category || 'all'}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Toutes les catégories</option>
            <option value="prospect">Prospect</option>
            <option value="client">Client</option>
            <option value="client_premium">Client Premium</option>
          </select>
        </div>

        {/* Région */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Région
          </label>
          <select
            value={filters.region || 'all'}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Toutes les régions</option>
            <option value="Auvergne-Rhône-Alpes">Auvergne-Rhône-Alpes</option>
            <option value="Provence-Alpes-Côte d'Azur">Provence-Alpes-Côte d'Azur</option>
            <option value="Île-de-France">Île-de-France</option>
            <option value="Nouvelle-Aquitaine">Nouvelle-Aquitaine</option>
            <option value="Occitanie">Occitanie</option>
            <option value="Hauts-de-France">Hauts-de-France</option>
            <option value="Grand Est">Grand Est</option>
            <option value="Pays de la Loire">Pays de la Loire</option>
            <option value="Bretagne">Bretagne</option>
            <option value="Normandie">Normandie</option>
            <option value="Bourgogne-Franche-Comté">Bourgogne-Franche-Comté</option>
            <option value="Centre-Val de Loire">Centre-Val de Loire</option>
          </select>
        </div>

        {/* Statut actif */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Statut
          </label>
          <select
            value={filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'}
            onChange={(e) => {
              const value = e.target.value === 'all' ? undefined : e.target.value === 'active';
              handleFilterChange('isActive', value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-2">
        <div className="text-sm text-gray-600">
          {Object.keys(filters).some(key => filters[key as keyof typeof filters] !== undefined) && (
            <span>Filtres appliqués</span>
          )}
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Effacer tous les filtres
        </button>
      </div>
    </div>
  );
};

export default ClientFilters;