import { create } from 'zustand';
import { Client, CreateClientData, ClientFilters } from '@/types/client';

// Données de démonstration
let DEMO_CLIENTS: Client[] = [
  {
    id: '1',
    nom: 'Martin',
    prenom: 'Pierre',
    email: 'p.martin@martin-btp.fr',
    telephone: '01 23 45 67 89',
    type: 'entreprise',
    category: 'client',
    entreprise: 'Martin BTP SARL',
    siret: '12345678901234',
    adresse: {
      rue: '123 Rue de la Construction',
      ville: 'Lyon',
      codePostal: '69000',
      region: 'Auvergne-Rhône-Alpes'
    },
    notes: 'Client fidèle depuis 5 ans. Spécialisé dans la rénovation.',
    dateCreation: '2023-01-15T10:00:00Z',
    dateModification: '2024-01-15T14:30:00Z',
    isActive: true
  },
  {
    id: '2',
    nom: 'Durand',
    prenom: 'Marie',
    email: 'marie.durand@email.com',
    telephone: '01 98 76 54 32',
    type: 'particulier',
    category: 'prospect',
    adresse: {
      rue: '45 Avenue des Jardins',
      ville: 'Marseille',
      codePostal: '13000',
      region: 'Provence-Alpes-Côte d\'Azur'
    },
    notes: 'Intéressée par une rénovation de salle de bain',
    dateCreation: '2024-01-10T09:00:00Z',
    dateModification: '2024-01-12T16:45:00Z',
    isActive: true
  },
  {
    id: '3',
    nom: 'Dubois',
    prenom: 'Jean',
    email: 'j.dubois@villeurbanne.fr',
    telephone: '04 72 04 70 15',
    type: 'collectivite',
    category: 'client_premium',
    entreprise: 'Mairie de Villeurbanne',
    siret: '21690266500019',
    adresse: {
      rue: 'Place Lazare Goujon',
      ville: 'Villeurbanne',
      codePostal: '69100',
      region: 'Auvergne-Rhône-Alpes'
    },
    notes: 'Client premium - Marchés publics réguliers',
    dateCreation: '2022-06-01T08:00:00Z',
    dateModification: '2023-12-20T11:20:00Z',
    isActive: true
  },
  {
    id: '4',
    nom: 'Leclerc',
    prenom: 'Sophie',
    email: 'sophie.leclerc@email.com',
    telephone: '04 56 78 90 12',
    type: 'particulier',
    category: 'client',
    adresse: {
      rue: '78 Rue des Fleurs',
      ville: 'Nice',
      codePostal: '06000',
      region: 'Provence-Alpes-Côte d\'Azur'
    },
    notes: 'Travaux de cuisine terminés en décembre 2023',
    dateCreation: '2023-08-20T14:00:00Z',
    dateModification: '2023-12-05T09:15:00Z',
    isActive: true
  },
  {
    id: '5',
    nom: 'Rousseau',
    prenom: 'Michel',
    email: 'm.rousseau@constructions-r.com',
    telephone: '04 78 45 12 36',
    type: 'entreprise',
    category: 'prospect',
    entreprise: 'Constructions Rousseau',
    siret: '98765432109876',
    adresse: {
      rue: '15 Boulevard de l\'Industrie',
      ville: 'Grenoble',
      codePostal: '38000',
      region: 'Auvergne-Rhône-Alpes'
    },
    notes: 'Intéressé par un partenariat pour des gros chantiers',
    dateCreation: '2024-01-08T11:30:00Z',
    isActive: true
  }
];

interface ClientState {
  // État
  clients: Client[];
  filteredClients: Client[];
  selectedClient: Client | null;
  isLoading: boolean;
  filters: ClientFilters;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalClients: number;
  
  // Actions
  loadClients: () => Promise<void>;
  searchClients: (search: string) => void;
  setFilters: (filters: Partial<ClientFilters>) => void;
  setCurrentPage: (page: number) => void;
  addClient: (clientData: CreateClientData) => Promise<Client>;
  updateClient: (id: string, clientData: Partial<CreateClientData>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

const applyFilters = (clients: Client[], filters: ClientFilters): Client[] => {
  let filtered = [...clients];
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(client =>
      client.nom.toLowerCase().includes(search) ||
      client.email.toLowerCase().includes(search) ||
      (client.entreprise && client.entreprise.toLowerCase().includes(search))
    );
  }
  
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(client => client.type === filters.type);
  }
  
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(client => client.category === filters.category);
  }
  
  if (filters.region) {
    filtered = filtered.filter(client => client.adresse.region === filters.region);
  }
  
  if (filters.isActive !== undefined) {
    filtered = filtered.filter(client => client.isActive === filters.isActive);
  }
  
  return filtered;
};

const paginateClients = (clients: Client[], page: number, limit = 10) => {
  const startIndex = (page - 1) * limit;
  return clients.slice(startIndex, startIndex + limit);
};

export const useClientStore = create<ClientState>((set, get) => ({
  // État initial
  clients: [],
  filteredClients: [],
  selectedClient: null,
  isLoading: false,
  filters: {},
  currentPage: 1,
  totalPages: 1,
  totalClients: 0,

  // Charger tous les clients
  loadClients: async () => {
    set({ isLoading: true });
    
    // Simulation d'API - remplacer par vraie API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { filters, currentPage } = get();
    const allFilteredClients = applyFilters(DEMO_CLIENTS, filters);
    const paginatedClients = paginateClients(allFilteredClients, currentPage);
    
    set({
      clients: DEMO_CLIENTS,
      filteredClients: paginatedClients,
      totalClients: allFilteredClients.length,
      totalPages: Math.ceil(allFilteredClients.length / 10),
      isLoading: false
    });
  },

  // Recherche
  searchClients: (search: string) => {
    const state = get();
    const newFilters = { ...state.filters, search };
    const allFilteredClients = applyFilters(DEMO_CLIENTS, newFilters);
    const paginatedClients = paginateClients(allFilteredClients, 1);
    
    set({
      filters: newFilters,
      currentPage: 1,
      filteredClients: paginatedClients,
      totalClients: allFilteredClients.length,
      totalPages: Math.ceil(allFilteredClients.length / 10)
    });
  },

  // Appliquer les filtres
  setFilters: (newFilters: Partial<ClientFilters>) => {
    const state = get();
    const updatedFilters = { ...state.filters, ...newFilters };
    const allFilteredClients = applyFilters(DEMO_CLIENTS, updatedFilters);
    const paginatedClients = paginateClients(allFilteredClients, 1);
    
    set({
      filters: updatedFilters,
      currentPage: 1,
      filteredClients: paginatedClients,
      totalClients: allFilteredClients.length,
      totalPages: Math.ceil(allFilteredClients.length / 10)
    });
  },

  // Changer de page
  setCurrentPage: (page: number) => {
    const { filters } = get();
    const allFilteredClients = applyFilters(DEMO_CLIENTS, filters);
    const paginatedClients = paginateClients(allFilteredClients, page);
    
    set({
      currentPage: page,
      filteredClients: paginatedClients
    });
  },

  // Ajouter un client
  addClient: async (clientData: CreateClientData): Promise<Client> => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newClient: Client = {
      id: Date.now().toString(),
      ...clientData,
      dateCreation: new Date().toISOString(),
      isActive: clientData.isActive ?? true
    };
    
    // Ajouter aux données de démo
    DEMO_CLIENTS.unshift(newClient);
    
    // Recharger les données
    const { filters, currentPage } = get();
    const allFilteredClients = applyFilters(DEMO_CLIENTS, filters);
    const paginatedClients = paginateClients(allFilteredClients, currentPage);
    
    set({
      clients: DEMO_CLIENTS,
      filteredClients: paginatedClients,
      totalClients: allFilteredClients.length,
      totalPages: Math.ceil(allFilteredClients.length / 10),
      isLoading: false
    });
    
    return newClient;
  },

  // Mettre à jour un client
  updateClient: async (id: string, clientData: Partial<CreateClientData>) => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const clientIndex = DEMO_CLIENTS.findIndex(c => c.id === id);
    if (clientIndex !== -1) {
      DEMO_CLIENTS[clientIndex] = {
        ...DEMO_CLIENTS[clientIndex],
        ...clientData,
        dateModification: new Date().toISOString()
      };
    }
    
    // Recharger les données
    const { filters, currentPage } = get();
    const allFilteredClients = applyFilters(DEMO_CLIENTS, filters);
    const paginatedClients = paginateClients(allFilteredClients, currentPage);
    
    set({
      clients: DEMO_CLIENTS,
      filteredClients: paginatedClients,
      totalClients: allFilteredClients.length,
      totalPages: Math.ceil(allFilteredClients.length / 10),
      isLoading: false
    });
  },

  // Supprimer un client
  deleteClient: async (id: string) => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const clientIndex = DEMO_CLIENTS.findIndex(c => c.id === id);
    if (clientIndex !== -1) {
      DEMO_CLIENTS.splice(clientIndex, 1);
    }
    
    // Recharger les données
    const { filters, currentPage } = get();
    const allFilteredClients = applyFilters(DEMO_CLIENTS, filters);
    const paginatedClients = paginateClients(allFilteredClients, currentPage);
    
    set({
      clients: DEMO_CLIENTS,
      filteredClients: paginatedClients,
      totalClients: allFilteredClients.length,
      totalPages: Math.ceil(allFilteredClients.length / 10),
      isLoading: false
    });
  }
}));
