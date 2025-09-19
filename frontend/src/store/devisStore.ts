import { create } from 'zustand';
import { Devis, CreateDevisData, DevisFilters, DevisStats, DevisLine } from '@/types/devis';

// Données de démonstration
let DEMO_DEVIS: Devis[] = [
  {
    id: '1',
    number: 'DEV-2024-001',
    clientId: '1',
    clientInfo: {
      nom: 'Martin',
      prenom: 'Pierre',
      email: 'p.martin@martin-btp.fr',
      telephone: '01 23 45 67 89',
      adresse: {
        rue: '123 Rue de la Construction',
        ville: 'Lyon',
        codePostal: '69000',
        region: 'Auvergne-Rhône-Alpes'
      },
      entreprise: 'Martin BTP SARL',
      siret: '12345678901234'
    },
    title: 'Rénovation salle de bain',
    description: 'Rénovation complète d\'une salle de bain avec douche à l\'italienne',
    status: 'accepte',
    lines: [
      {
        id: '1-1',
        description: 'Démolition carrelage existant',
        quantity: 15,
        unit: 'm²',
        unitPrice: 25,
        total: 375,
        category: 'Démolition'
      },
      {
        id: '1-2',
        description: 'Pose carrelage sol et murs',
        quantity: 25,
        unit: 'm²',
        unitPrice: 65,
        total: 1625,
        category: 'Carrelage'
      },
      {
        id: '1-3',
        description: 'Installation douche italienne',
        quantity: 1,
        unit: 'u',
        unitPrice: 850,
        total: 850,
        category: 'Plomberie'
      },
      {
        id: '1-4',
        description: 'Meuble vasque et miroir',
        quantity: 1,
        unit: 'ens',
        unitPrice: 450,
        total: 450,
        category: 'Mobilier'
      }
    ],
    subtotal: 3300,
    discountAmount: 0,
    totalHT: 3300,
    vatRate: 20,
    vatAmount: 660,
    totalTTC: 3960,
    dateCreation: '2024-01-15T10:00:00Z',
    dateModification: '2024-01-20T14:30:00Z',
    dateEnvoi: '2024-01-16T09:15:00Z',
    dateValidite: '2024-02-15T23:59:59Z',
    dateAcceptation: '2024-01-18T16:45:00Z',
    validityDays: 30,
    paymentTerms: '30% à la commande, 70% à la livraison',
    deliveryTerms: 'Délai d\'exécution : 2 semaines',
    publicNotes: 'Travaux inclus : démolition, carrelage, plomberie et mobilier.',
    privateNotes: 'Client très satisfait, possibilité d\'autres travaux',
    createdBy: 'user-1',
    assignedTo: 'commercial-1',
    version: 1,
    isActive: true
  },
  {
    id: '2',
    number: 'DEV-2024-002',
    clientId: '2',
    clientInfo: {
      nom: 'Durand',
      prenom: 'Marie',
      email: 'marie.durand@email.com',
      telephone: '01 98 76 54 32',
      adresse: {
        rue: '45 Avenue des Jardins',
        ville: 'Marseille',
        codePostal: '13000',
        region: 'Provence-Alpes-Côte d\'Azur'
      }
    },
    title: 'Rénovation cuisine',
    description: 'Rénovation complète cuisine avec îlot central',
    status: 'envoye',
    lines: [
      {
        id: '2-1',
        description: 'Démolition cuisine existante',
        quantity: 1,
        unit: 'ff',
        unitPrice: 800,
        total: 800,
        category: 'Démolition'
      },
      {
        id: '2-2',
        description: 'Meubles cuisine sur mesure',
        quantity: 1,
        unit: 'ens',
        unitPrice: 4500,
        discount: 5,
        total: 4275,
        category: 'Mobilier'
      },
      {
        id: '2-3',
        description: 'Électricité (prises, éclairage)',
        quantity: 1,
        unit: 'ff',
        unitPrice: 1200,
        total: 1200,
        category: 'Électricité'
      },
      {
        id: '2-4',
        description: 'Plomberie (évier, lave-vaisselle)',
        quantity: 1,
        unit: 'ff',
        unitPrice: 650,
        total: 650,
        category: 'Plomberie'
      }
    ],
    subtotal: 6925,
    globalDiscount: 3,
    discountAmount: 207.75,
    totalHT: 6717.25,
    vatRate: 20,
    vatAmount: 1343.45,
    totalTTC: 8060.70,
    dateCreation: '2024-01-18T14:00:00Z',
    dateEnvoi: '2024-01-19T10:30:00Z',
    dateValidite: '2024-02-18T23:59:59Z',
    validityDays: 30,
    paymentTerms: '40% à la commande, 40% à mi-parcours, 20% à la réception',
    deliveryTerms: 'Délai d\'exécution : 3 semaines',
    publicNotes: 'Devis incluant la fourniture et pose de tous les éléments.',
    createdBy: 'user-1',
    assignedTo: 'commercial-2',
    version: 1,
    isActive: true
  },
  {
    id: '3',
    number: 'DEV-2024-003',
    clientId: '3',
    clientInfo: {
      nom: 'Dubois',
      prenom: 'Jean',
      email: 'j.dubois@villeurbanne.fr',
      telephone: '04 72 04 70 15',
      adresse: {
        rue: 'Place Lazare Goujon',
        ville: 'Villeurbanne',
        codePostal: '69100',
        region: 'Auvergne-Rhône-Alpes'
      },
      entreprise: 'Mairie de Villeurbanne',
      siret: '21690266500019'
    },
    title: 'Réfection façade école primaire',
    description: 'Ravalement façade et isolation thermique extérieure',
    status: 'brouillon',
    lines: [
      {
        id: '3-1',
        description: 'Échafaudage périmétrique',
        quantity: 120,
        unit: 'ml',
        unitPrice: 15,
        total: 1800,
        category: 'Préparation'
      },
      {
        id: '3-2',
        description: 'Isolation thermique extérieure',
        quantity: 450,
        unit: 'm²',
        unitPrice: 85,
        total: 38250,
        category: 'Isolation'
      },
      {
        id: '3-3',
        description: 'Enduit de finition',
        quantity: 450,
        unit: 'm²',
        unitPrice: 28,
        total: 12600,
        category: 'Façade'
      }
    ],
    subtotal: 52650,
    discountAmount: 0,
    totalHT: 52650,
    vatRate: 20,
    vatAmount: 10530,
    totalTTC: 63180,
    dateCreation: '2024-01-20T09:00:00Z',
    dateValidite: '2024-02-19T23:59:59Z',
    validityDays: 30,
    paymentTerms: 'Paiement selon procédures marchés publics',
    deliveryTerms: 'Délai d\'exécution : 6 semaines',
    publicNotes: 'Devis conforme au CCTP du marché public.',
    privateNotes: 'Marché public - respecter délais et procédures',
    createdBy: 'user-1',
    assignedTo: 'commercial-1',
    version: 1,
    isActive: true
  }
];

// Utilitaires de calcul
const calculateLineTotal = (line: Omit<DevisLine, 'id' | 'total'>): number => {
  const subtotal = line.quantity * line.unitPrice;
  const discountAmount = line.discount ? (subtotal * line.discount) / 100 : 0;
  return subtotal - discountAmount;
};

const calculateDevisTotal = (lines: DevisLine[], globalDiscount?: number, vatRate: number = 20) => {
  const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
  const discountAmount = globalDiscount ? (subtotal * globalDiscount) / 100 : 0;
  const totalHT = subtotal - discountAmount;
  const vatAmount = (totalHT * vatRate) / 100;
  const totalTTC = totalHT + vatAmount;
  
  return {
    subtotal,
    discountAmount,
    totalHT,
    vatAmount,
    totalTTC
  };
};

const generateDevisNumber = (): string => {
  const year = new Date().getFullYear();
  const existingNumbers = DEMO_DEVIS
    .map(d => d.number)
    .filter(n => n.startsWith(`DEV-${year}-`))
    .map(n => parseInt(n.split('-')[2]))
    .sort((a, b) => b - a);
  
  const nextNumber = existingNumbers.length > 0 ? existingNumbers[0] + 1 : 1;
  return `DEV-${year}-${nextNumber.toString().padStart(3, '0')}`;
};

const applyFilters = (devis: Devis[], filters: DevisFilters): Devis[] => {
  let filtered = [...devis];
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(d =>
      d.number.toLowerCase().includes(search) ||
      d.title.toLowerCase().includes(search) ||
      d.clientInfo.nom.toLowerCase().includes(search) ||
      (d.clientInfo.entreprise && d.clientInfo.entreprise.toLowerCase().includes(search))
    );
  }
  
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(d => d.status === filters.status);
  }
  
  if (filters.clientId) {
    filtered = filtered.filter(d => d.clientId === filters.clientId);
  }
  
  if (filters.assignedTo) {
    filtered = filtered.filter(d => d.assignedTo === filters.assignedTo);
  }
  
  if (filters.dateFrom) {
    filtered = filtered.filter(d => d.dateCreation >= filters.dateFrom!);
  }
  
  if (filters.dateTo) {
    filtered = filtered.filter(d => d.dateCreation <= filters.dateTo!);
  }
  
  if (filters.amountMin) {
    filtered = filtered.filter(d => d.totalTTC >= filters.amountMin!);
  }
  
  if (filters.amountMax) {
    filtered = filtered.filter(d => d.totalTTC <= filters.amountMax!);
  }
  
  if (filters.isActive !== undefined) {
    filtered = filtered.filter(d => d.isActive === filters.isActive);
  }
  
  return filtered;
};

const paginateDevis = (devis: Devis[], page: number, limit = 10) => {
  const startIndex = (page - 1) * limit;
  return devis.slice(startIndex, startIndex + limit);
};

interface DevisState {
  // État
  devis: Devis[];
  filteredDevis: Devis[];
  selectedDevis: Devis | null;
  isLoading: boolean;
  filters: DevisFilters;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalDevis: number;
  
  // Statistiques
  stats: DevisStats | null;
  
  // Actions
  loadDevis: () => Promise<void>;
  searchDevis: (search: string) => void;
  setFilters: (filters: Partial<DevisFilters>) => void;
  setCurrentPage: (page: number) => void;
  getDevisById: (id: string) => Devis | null;
  addDevis: (devisData: CreateDevisData) => Promise<Devis>;
  updateDevis: (id: string, devisData: Partial<CreateDevisData>) => Promise<void>;
  duplicateDevis: (id: string) => Promise<Devis>;
  deleteDevis: (id: string) => Promise<void>;
  changeDevisStatus: (id: string, status: Devis['status']) => Promise<void>;
  calculateStats: () => void;
}

export const useDevisStore = create<DevisState>((set, get) => ({
  // État initial
  devis: [],
  filteredDevis: [],
  selectedDevis: null,
  isLoading: false,
  filters: {},
  currentPage: 1,
  totalPages: 1,
  totalDevis: 0,
  stats: null,

  // Charger tous les devis
  loadDevis: async () => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { filters, currentPage } = get();
    const allFilteredDevis = applyFilters(DEMO_DEVIS, filters);
    const paginatedDevis = paginateDevis(allFilteredDevis, currentPage);
    
    set({
      devis: DEMO_DEVIS,
      filteredDevis: paginatedDevis,
      totalDevis: allFilteredDevis.length,
      totalPages: Math.ceil(allFilteredDevis.length / 10),
      isLoading: false
    });
    
    // Calculer les stats
    get().calculateStats();
  },

  // Recherche
  searchDevis: (search: string) => {
    const state = get();
    const newFilters = { ...state.filters, search };
    const allFilteredDevis = applyFilters(DEMO_DEVIS, newFilters);
    const paginatedDevis = paginateDevis(allFilteredDevis, 1);
    
    set({
      filters: newFilters,
      currentPage: 1,
      filteredDevis: paginatedDevis,
      totalDevis: allFilteredDevis.length,
      totalPages: Math.ceil(allFilteredDevis.length / 10)
    });
  },

  // Appliquer les filtres
  setFilters: (newFilters: Partial<DevisFilters>) => {
    const state = get();
    const updatedFilters = { ...state.filters, ...newFilters };
    const allFilteredDevis = applyFilters(DEMO_DEVIS, updatedFilters);
    const paginatedDevis = paginateDevis(allFilteredDevis, 1);
    
    set({
      filters: updatedFilters,
      currentPage: 1,
      filteredDevis: paginatedDevis,
      totalDevis: allFilteredDevis.length,
      totalPages: Math.ceil(allFilteredDevis.length / 10)
    });
  },

  // Changer de page
  setCurrentPage: (page: number) => {
    const { filters } = get();
    const allFilteredDevis = applyFilters(DEMO_DEVIS, filters);
    const paginatedDevis = paginateDevis(allFilteredDevis, page);
    
    set({
      currentPage: page,
      filteredDevis: paginatedDevis
    });
  },

  // Récupérer un devis par ID
  getDevisById: (id: string) => {
    return DEMO_DEVIS.find(d => d.id === id) || null;
  },

  // Ajouter un devis
  addDevis: async (devisData: CreateDevisData): Promise<Devis> => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Calculer les totaux des lignes
    const linesWithTotals: DevisLine[] = devisData.lines.map((line, index) => ({
      ...line,
      id: `${Date.now()}-${index}`,
      total: calculateLineTotal(line)
    }));
    
    // Calculer les totaux du devis
    const totals = calculateDevisTotal(linesWithTotals, devisData.globalDiscount, devisData.vatRate);
    
    // Récupérer les infos client (simulation)
    const clientInfo = {
      nom: 'Nouveau',
      prenom: 'Client',
      email: 'client@example.com',
      telephone: '01 00 00 00 00',
      adresse: {
        rue: 'Adresse client',
        ville: 'Ville',
        codePostal: '00000',
        region: 'Région'
      }
    };
    
    const newDevis: Devis = {
      id: Date.now().toString(),
      number: generateDevisNumber(),
      clientId: devisData.clientId,
      clientInfo,
      title: devisData.title,
      description: devisData.description,
      status: 'brouillon',
      lines: linesWithTotals,
      ...totals,
      globalDiscount: devisData.globalDiscount,
      vatRate: devisData.vatRate,
      dateCreation: new Date().toISOString(),
      dateValidite: new Date(Date.now() + devisData.validityDays * 24 * 60 * 60 * 1000).toISOString(),
      validityDays: devisData.validityDays,
      paymentTerms: devisData.paymentTerms,
      deliveryTerms: devisData.deliveryTerms,
      publicNotes: devisData.publicNotes,
      privateNotes: devisData.privateNotes,
      createdBy: 'current-user',
      assignedTo: devisData.assignedTo,
      version: 1,
      isActive: true
    };
    
    // Ajouter aux données démo
    DEMO_DEVIS.unshift(newDevis);
    
    // Recharger les données
    const { filters, currentPage } = get();
    const allFilteredDevis = applyFilters(DEMO_DEVIS, filters);
    const paginatedDevis = paginateDevis(allFilteredDevis, currentPage);
    
    set({
      devis: DEMO_DEVIS,
      filteredDevis: paginatedDevis,
      totalDevis: allFilteredDevis.length,
      totalPages: Math.ceil(allFilteredDevis.length / 10),
      isLoading: false
    });
    
    get().calculateStats();
    return newDevis;
  },

  // Mettre à jour un devis
  updateDevis: async (id: string, devisData: Partial<CreateDevisData>) => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const devisIndex = DEMO_DEVIS.findIndex(d => d.id === id);
    if (devisIndex !== -1) {
      const existingDevis = DEMO_DEVIS[devisIndex];
      
      // Recalculer les lignes si elles sont modifiées
      let updatedLines = existingDevis.lines;
      if (devisData.lines) {
        updatedLines = devisData.lines.map((line, index) => ({
          ...line,
          id: line.id || `${Date.now()}-${index}`,
          total: calculateLineTotal(line)
        })) as DevisLine[];
      }
      
      // Recalculer les totaux
      const totals = calculateDevisTotal(
        updatedLines, 
        devisData.globalDiscount ?? existingDevis.globalDiscount,
        devisData.vatRate ?? existingDevis.vatRate
      );
      
      DEMO_DEVIS[devisIndex] = {
        ...existingDevis,
        ...devisData,
        lines: updatedLines,
        ...totals,
        dateModification: new Date().toISOString(),
        version: existingDevis.version + 1
      };
    }
    
    // Recharger les données
    const { filters, currentPage } = get();
    const allFilteredDevis = applyFilters(DEMO_DEVIS, filters);
    const paginatedDevis = paginateDevis(allFilteredDevis, currentPage);
    
    set({
      devis: DEMO_DEVIS,
      filteredDevis: paginatedDevis,
      totalDevis: allFilteredDevis.length,
      totalPages: Math.ceil(allFilteredDevis.length / 10),
      isLoading: false
    });
    
    get().calculateStats();
  },

  // Dupliquer un devis
  duplicateDevis: async (id: string): Promise<Devis> => {
    const originalDevis = DEMO_DEVIS.find(d => d.id === id);
    if (!originalDevis) {
      throw new Error('Devis non trouvé');
    }
    
    const duplicatedDevis: Devis = {
      ...originalDevis,
      id: Date.now().toString(),
      number: generateDevisNumber(),
      status: 'brouillon',
      dateCreation: new Date().toISOString(),
      dateModification: undefined,
      dateEnvoi: undefined,
      dateAcceptation: undefined,
      dateValidite: new Date(Date.now() + originalDevis.validityDays * 24 * 60 * 60 * 1000).toISOString(),
      version: 1,
      parentId: originalDevis.id
    };
    
    DEMO_DEVIS.unshift(duplicatedDevis);
    await get().loadDevis();
    
    return duplicatedDevis;
  },

  // Supprimer un devis
  deleteDevis: async (id: string) => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const devisIndex = DEMO_DEVIS.findIndex(d => d.id === id);
    if (devisIndex !== -1) {
      DEMO_DEVIS.splice(devisIndex, 1);
    }
    
    // Recharger les données
    const { filters, currentPage } = get();
    const allFilteredDevis = applyFilters(DEMO_DEVIS, filters);
    const paginatedDevis = paginateDevis(allFilteredDevis, currentPage);
    
    set({
      devis: DEMO_DEVIS,
      filteredDevis: paginatedDevis,
      totalDevis: allFilteredDevis.length,
      totalPages: Math.ceil(allFilteredDevis.length / 10),
      isLoading: false
    });
    
    get().calculateStats();
  },

  // Changer le statut d'un devis
  changeDevisStatus: async (id: string, status: Devis['status']) => {
    const devisIndex = DEMO_DEVIS.findIndex(d => d.id === id);
    if (devisIndex !== -1) {
      const devis = DEMO_DEVIS[devisIndex];
      DEMO_DEVIS[devisIndex] = {
        ...devis,
        status,
        dateModification: new Date().toISOString(),
        ...(status === 'envoye' && !devis.dateEnvoi ? { dateEnvoi: new Date().toISOString() } : {}),
        ...(status === 'accepte' ? { dateAcceptation: new Date().toISOString() } : {})
      };
      
      await get().loadDevis();
    }
  },

  // Calculer les statistiques
  calculateStats: () => {
    const activeDevis = DEMO_DEVIS.filter(d => d.isActive);
    const total = activeDevis.length;
    
    const stats: DevisStats = {
      total,
      brouillon: activeDevis.filter(d => d.status === 'brouillon').length,
      envoye: activeDevis.filter(d => d.status === 'envoye').length,
      accepte: activeDevis.filter(d => d.status === 'accepte').length,
      refuse: activeDevis.filter(d => d.status === 'refuse').length,
      expire: activeDevis.filter(d => d.status === 'expire').length,
      totalValueHT: activeDevis.reduce((sum, d) => sum + d.totalHT, 0),
      totalValueTTC: activeDevis.reduce((sum, d) => sum + d.totalTTC, 0),
      acceptanceRate: total > 0 ? (activeDevis.filter(d => d.status === 'accepte').length / total) * 100 : 0,
      averageAmount: total > 0 ? activeDevis.reduce((sum, d) => sum + d.totalTTC, 0) / total : 0
    };
    
    set({ stats });
  }
}));