import { create } from 'zustand';
import { Facture, CreateFactureData, FactureFilters, FactureStats, FactureLine, Payment } from '@/types/facture';

// Données de démonstration
let DEMO_FACTURES: Facture[] = [
  {
    id: '1',
    number: 'FAC-2024-001',
    devisId: '1',
    devisNumber: 'DEV-2024-001',
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
    title: 'Rénovation salle de bain - Travaux terminés',
    description: 'Facture pour les travaux de rénovation complète de la salle de bain',
    status: 'payee',
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
    amountPaid: 3960,
    remainingAmount: 0,
    dateCreation: '2024-01-20T10:00:00Z',
    dateEmission: '2024-01-20T10:00:00Z',
    dateEcheance: '2024-02-19T23:59:59Z',
    datePaiementComplete: '2024-02-15T14:30:00Z',
    paymentTerms: '30 jours fin de mois',
    paymentMethod: 'virement',
    publicNotes: 'Merci de votre confiance. Travaux garantis 2 ans.',
    privateNotes: 'Client très satisfait, à recontacter pour autres travaux',
    createdBy: 'user-1',
    assignedTo: 'commercial-1',
    payments: [
      {
        id: 'pay-1',
        factureId: '1',
        amount: 1188, // 30%
        date: '2024-01-21T10:00:00Z',
        method: 'virement',
        reference: 'VIR-240121-001',
        notes: 'Acompte à la commande',
        createdBy: 'user-1',
        dateCreation: '2024-01-21T10:00:00Z'
      },
      {
        id: 'pay-2',
        factureId: '1',
        amount: 2772, // 70%
        date: '2024-02-15T14:30:00Z',
        method: 'virement',
        reference: 'VIR-240215-002',
        notes: 'Solde à la livraison',
        createdBy: 'user-1',
        dateCreation: '2024-02-15T14:30:00Z'
      }
    ],
    isActive: true
  },
  {
    id: '2',
    number: 'FAC-2024-002',
    clientId: '4',
    clientInfo: {
      nom: 'Leclerc',
      prenom: 'Sophie',
      email: 'sophie.leclerc@email.com',
      telephone: '04 56 78 90 12',
      adresse: {
        rue: '78 Rue des Fleurs',
        ville: 'Nice',
        codePostal: '06000',
        region: 'Provence-Alpes-Côte d\'Azur'
      }
    },
    title: 'Rénovation cuisine - Acompte',
    description: 'Facture d\'acompte pour travaux de cuisine',
    status: 'partiellement_payee',
    lines: [
      {
        id: '2-1',
        description: 'Acompte travaux cuisine (40%)',
        quantity: 1,
        unit: 'ff',
        unitPrice: 2400,
        total: 2400,
        category: 'Acompte'
      }
    ],
    subtotal: 2400,
    discountAmount: 0,
    totalHT: 2400,
    vatRate: 20,
    vatAmount: 480,
    totalTTC: 2880,
    amountPaid: 2880,
    remainingAmount: 0,
    dateCreation: '2024-01-25T09:00:00Z',
    dateEmission: '2024-01-25T09:00:00Z',
    dateEcheance: '2024-02-24T23:59:59Z',
    datePaiementComplete: '2024-01-26T16:20:00Z',
    paymentTerms: '30 jours net',
    paymentMethod: 'virement',
    publicNotes: 'Acompte pour travaux de cuisine - Total projet 6000€ HT',
    privateNotes: 'Reste à facturer : 3600€ HT en fin de travaux',
    createdBy: 'user-1',
    assignedTo: 'commercial-2',
    payments: [
      {
        id: 'pay-3',
        factureId: '2',
        amount: 2880,
        date: '2024-01-26T16:20:00Z',
        method: 'virement',
        reference: 'VIR-240126-003',
        notes: 'Acompte reçu rapidement',
        createdBy: 'user-1',
        dateCreation: '2024-01-26T16:20:00Z'
      }
    ],
    isActive: true
  },
  {
    id: '3',
    number: 'FAC-2024-003',
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
    title: 'Étude préparatoire - École primaire',
    description: 'Facture d\'étude pour le projet de ravalement de façade',
    status: 'envoyee',
    lines: [
      {
        id: '3-1',
        description: 'Étude technique et préparatoire',
        quantity: 1,
        unit: 'ff',
        unitPrice: 2500,
        total: 2500,
        category: 'Étude'
      },
      {
        id: '3-2',
        description: 'Diagnostics et relevés',
        quantity: 1,
        unit: 'ff',
        unitPrice: 800,
        total: 800,
        category: 'Diagnostic'
      }
    ],
    subtotal: 3300,
    discountAmount: 0,
    totalHT: 3300,
    vatRate: 20,
    vatAmount: 660,
    totalTTC: 3960,
    amountPaid: 0,
    remainingAmount: 3960,
    dateCreation: '2024-01-28T11:00:00Z',
    dateEmission: '2024-01-28T11:00:00Z',
    dateEcheance: '2024-03-28T23:59:59Z',
    paymentTerms: 'Paiement selon procédures marchés publics - 60 jours',
    paymentMethod: 'virement',
    publicNotes: 'Facture conforme au marché public n°2024-001',
    privateNotes: 'Marché public - délai de paiement 60 jours',
    createdBy: 'user-1',
    assignedTo: 'commercial-1',
    isActive: true
  },
  {
    id: '4',
    number: 'FAC-2024-004',
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
    title: 'Réparation urgente plomberie',
    description: 'Intervention d\'urgence suite à fuite d\'eau',
    status: 'en_retard',
    lines: [
      {
        id: '4-1',
        description: 'Intervention urgence plomberie',
        quantity: 1,
        unit: 'ff',
        unitPrice: 180,
        total: 180,
        category: 'Plomberie'
      },
      {
        id: '4-2',
        description: 'Remplacement joint défectueux',
        quantity: 2,
        unit: 'u',
        unitPrice: 25,
        total: 50,
        category: 'Fourniture'
      },
      {
        id: '4-3',
        description: 'Déplacement urgence',
        quantity: 1,
        unit: 'ff',
        unitPrice: 40,
        total: 40,
        category: 'Déplacement'
      }
    ],
    subtotal: 270,
    discountAmount: 0,
    totalHT: 270,
    vatRate: 20,
    vatAmount: 54,
    totalTTC: 324,
    amountPaid: 0,
    remainingAmount: 324,
    dateCreation: '2024-01-10T16:30:00Z',
    dateEmission: '2024-01-10T16:30:00Z',
    dateEcheance: '2024-01-25T23:59:59Z',
    paymentTerms: '15 jours net',
    paymentMethod: 'especes',
    penaltyRate: 3,
    publicNotes: 'Intervention d\'urgence - Merci de régler dans les plus brefs délais',
    privateNotes: 'Client en retard - envoyer rappel',
    createdBy: 'user-1',
    assignedTo: 'commercial-2',
    isActive: true
  },
  {
    id: '5',
    number: 'FAC-2024-005',
    clientId: '5',
    clientInfo: {
      nom: 'Rousseau',
      prenom: 'Michel',
      email: 'm.rousseau@constructions-r.com',
      telephone: '04 78 45 12 36',
      adresse: {
        rue: '15 Boulevard de l\'Industrie',
        ville: 'Grenoble',
        codePostal: '38000',
        region: 'Auvergne-Rhône-Alpes'
      },
      entreprise: 'Constructions Rousseau',
      siret: '98765432109876'
    },
    title: 'Fourniture matériaux - Commande 001',
    description: 'Livraison matériaux pour chantier Grenoble',
    status: 'brouillon',
    lines: [
      {
        id: '5-1',
        description: 'Béton prêt à l\'emploi C25/30',
        quantity: 12,
        unit: 'm³',
        unitPrice: 95,
        total: 1140,
        category: 'Béton'
      },
      {
        id: '5-2',
        description: 'Acier HA12 - Barres 6m',
        quantity: 2.5,
        unit: 't',
        unitPrice: 850,
        total: 2125,
        category: 'Acier'
      }
    ],
    subtotal: 3265,
    discountAmount: 0,
    totalHT: 3265,
    vatRate: 20,
    vatAmount: 653,
    totalTTC: 3918,
    amountPaid: 0,
    remainingAmount: 3918,
    dateCreation: '2024-01-30T14:15:00Z',
    dateEmission: '2024-01-30T14:15:00Z',
    dateEcheance: '2024-03-01T23:59:59Z',
    paymentTerms: '30 jours fin de mois',
    paymentMethod: 'virement',
    publicNotes: 'Matériaux livrés selon planning convenu',
    privateNotes: 'Nouveau client - surveiller paiement',
    createdBy: 'user-1',
    assignedTo: 'commercial-1',
    isActive: true
  }
];

// Utilitaires de calcul
const calculateLineTotal = (line: Omit<FactureLine, 'id' | 'total'>): number => {
  const subtotal = line.quantity * line.unitPrice;
  const discountAmount = line.discount ? (subtotal * line.discount) / 100 : 0;
  return subtotal - discountAmount;
};

const calculateFactureTotal = (lines: FactureLine[], globalDiscount?: number, vatRate: number = 20) => {
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

const generateFactureNumber = (): string => {
  const year = new Date().getFullYear();
  const existingNumbers = DEMO_FACTURES
    .map(f => f.number)
    .filter(n => n.startsWith(`FAC-${year}-`))
    .map(n => parseInt(n.split('-')[2]))
    .sort((a, b) => b - a);
  
  const nextNumber = existingNumbers.length > 0 ? existingNumbers[0] + 1 : 1;
  return `FAC-${year}-${nextNumber.toString().padStart(3, '0')}`;
};

const updateFactureStatus = (facture: Facture): Facture => {
  const now = new Date();
  const echeance = new Date(facture.dateEcheance);
  
  // Si complètement payée
  if (facture.amountPaid >= facture.totalTTC) {
    return {
      ...facture,
      status: 'payee',
      remainingAmount: 0,
      datePaiementComplete: facture.datePaiementComplete || new Date().toISOString()
    };
  }
  
  // Si partiellement payée
  if (facture.amountPaid > 0) {
    return {
      ...facture,
      status: 'partiellement_payee',
      remainingAmount: facture.totalTTC - facture.amountPaid
    };
  }
  
  // Si en retard
  if (now > echeance && facture.status !== 'brouillon' && facture.status !== 'annulee') {
    return {
      ...facture,
      status: 'en_retard',
      remainingAmount: facture.totalTTC
    };
  }
  
  // Sinon, garder le statut actuel
  return {
    ...facture,
    remainingAmount: facture.totalTTC - facture.amountPaid
  };
};

const applyFilters = (factures: Facture[], filters: FactureFilters): Facture[] => {
  let filtered = [...factures];
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(f =>
      f.number.toLowerCase().includes(search) ||
      f.title.toLowerCase().includes(search) ||
      f.clientInfo.nom.toLowerCase().includes(search) ||
      (f.clientInfo.entreprise && f.clientInfo.entreprise.toLowerCase().includes(search))
    );
  }
  
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(f => f.status === filters.status);
  }
  
  if (filters.clientId) {
    filtered = filtered.filter(f => f.clientId === filters.clientId);
  }
  
  if (filters.assignedTo) {
    filtered = filtered.filter(f => f.assignedTo === filters.assignedTo);
  }
  
  if (filters.dateFrom) {
    filtered = filtered.filter(f => f.dateEmission >= filters.dateFrom!);
  }
  
  if (filters.dateTo) {
    filtered = filtered.filter(f => f.dateEmission <= filters.dateTo!);
  }
  
  if (filters.echeanceFrom) {
    filtered = filtered.filter(f => f.dateEcheance >= filters.echeanceFrom!);
  }
  
  if (filters.echeanceTo) {
    filtered = filtered.filter(f => f.dateEcheance <= filters.echeanceTo!);
  }
  
  if (filters.amountMin) {
    filtered = filtered.filter(f => f.totalTTC >= filters.amountMin!);
  }
  
  if (filters.amountMax) {
    filtered = filtered.filter(f => f.totalTTC <= filters.amountMax!);
  }
  
  if (filters.isOverdue) {
    const now = new Date();
    filtered = filtered.filter(f => {
      const echeance = new Date(f.dateEcheance);
      return now > echeance && f.remainingAmount > 0;
    });
  }
  
  if (filters.isActive !== undefined) {
    filtered = filtered.filter(f => f.isActive === filters.isActive);
  }
  
  return filtered;
};

const paginateFactures = (factures: Facture[], page: number, limit = 10) => {
  const startIndex = (page - 1) * limit;
  return factures.slice(startIndex, startIndex + limit);
};

interface FactureState {
  // État
  factures: Facture[];
  filteredFactures: Facture[];
  selectedFacture: Facture | null;
  isLoading: boolean;
  filters: FactureFilters;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalFactures: number;
  
  // Statistiques
  stats: FactureStats | null;
  
  // Actions
  loadFactures: () => Promise<void>;
  searchFactures: (search: string) => void;
  setFilters: (filters: Partial<FactureFilters>) => void;
  setCurrentPage: (page: number) => void;
  getFactureById: (id: string) => Facture | null;
  addFacture: (factureData: CreateFactureData) => Promise<Facture>;
  updateFacture: (id: string, factureData: Partial<CreateFactureData>) => Promise<void>;
  deleteFacture: (id: string) => Promise<void>;
  addPayment: (factureId: string, payment: Omit<Payment, 'id' | 'factureId' | 'createdBy' | 'dateCreation'>) => Promise<void>;
  changeFactureStatus: (id: string, status: Facture['status']) => Promise<void>;
  createFactureFromDevis: (devisId: string) => Promise<Facture>;
  calculateStats: () => void;
}

export const useFactureStore = create<FactureState>((set, get) => ({
  // État initial
  factures: [],
  filteredFactures: [],
  selectedFacture: null,
  isLoading: false,
  filters: {},
  currentPage: 1,
  totalPages: 1,
  totalFactures: 0,
  stats: null,

  // Charger toutes les factures
  loadFactures: async () => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mettre à jour les statuts en fonction des dates
    const updatedFactures = DEMO_FACTURES.map(updateFactureStatus);
    DEMO_FACTURES = updatedFactures;
    
    const { filters, currentPage } = get();
    const allFilteredFactures = applyFilters(DEMO_FACTURES, filters);
    const paginatedFactures = paginateFactures(allFilteredFactures, currentPage);
    
    set({
      factures: DEMO_FACTURES,
      filteredFactures: paginatedFactures,
      totalFactures: allFilteredFactures.length,
      totalPages: Math.ceil(allFilteredFactures.length / 10),
      isLoading: false
    });
    
    // Calculer les stats
    get().calculateStats();
  },

  // Recherche
  searchFactures: (search: string) => {
    const state = get();
    const newFilters = { ...state.filters, search };
    const allFilteredFactures = applyFilters(DEMO_FACTURES, newFilters);
    const paginatedFactures = paginateFactures(allFilteredFactures, 1);
    
    set({
      filters: newFilters,
      currentPage: 1,
      filteredFactures: paginatedFactures,
      totalFactures: allFilteredFactures.length,
      totalPages: Math.ceil(allFilteredFactures.length / 10)
    });
  },

  // Appliquer les filtres
  setFilters: (newFilters: Partial<FactureFilters>) => {
    const state = get();
    const updatedFilters = { ...state.filters, ...newFilters };
    const allFilteredFactures = applyFilters(DEMO_FACTURES, updatedFilters);
    const paginatedFactures = paginateFactures(allFilteredFactures, 1);
    
    set({
      filters: updatedFilters,
      currentPage: 1,
      filteredFactures: paginatedFactures,
      totalFactures: allFilteredFactures.length,
      totalPages: Math.ceil(allFilteredFactures.length / 10)
    });
  },

  // Changer de page
  setCurrentPage: (page: number) => {
    const { filters } = get();
    const allFilteredFactures = applyFilters(DEMO_FACTURES, filters);
    const paginatedFactures = paginateFactures(allFilteredFactures, page);
    
    set({
      currentPage: page,
      filteredFactures: paginatedFactures
    });
  },

  // Récupérer une facture par ID
  getFactureById: (id: string) => {
    return DEMO_FACTURES.find(f => f.id === id) || null;
  },

  // Ajouter une facture
  addFacture: async (factureData: CreateFactureData): Promise<Facture> => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Calculer les totaux des lignes
    const linesWithTotals: FactureLine[] = factureData.lines.map((line, index) => ({
      ...line,
      id: `${Date.now()}-${index}`,
      total: calculateLineTotal(line)
    }));
    
    // Calculer les totaux de la facture
    const totals = calculateFactureTotal(linesWithTotals, factureData.globalDiscount, factureData.vatRate);
    
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
    
    const newFacture: Facture = {
      id: Date.now().toString(),
      number: generateFactureNumber(),
      devisId: factureData.devisId,
      clientId: factureData.clientId,
      clientInfo,
      title: factureData.title,
      description: factureData.description,
      status: 'brouillon',
      lines: linesWithTotals,
      ...totals,
      globalDiscount: factureData.globalDiscount,
      vatRate: factureData.vatRate,
      amountPaid: 0,
      remainingAmount: totals.totalTTC,
      dateCreation: new Date().toISOString(),
      dateEmission: factureData.dateEmission,
      dateEcheance: factureData.dateEcheance,
      paymentTerms: factureData.paymentTerms,
      paymentMethod: factureData.paymentMethod,
      penaltyRate: factureData.penaltyRate,
      publicNotes: factureData.publicNotes,
      privateNotes: factureData.privateNotes,
      createdBy: 'current-user',
      assignedTo: factureData.assignedTo,
      isActive: true
    };
    
    // Ajouter aux données démo
    DEMO_FACTURES.unshift(newFacture);
    
    await get().loadFactures();
    return newFacture;
  },

  // Mettre à jour une facture
  updateFacture: async (id: string, factureData: Partial<CreateFactureData>) => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const factureIndex = DEMO_FACTURES.findIndex(f => f.id === id);
    if (factureIndex !== -1) {
      const existingFacture = DEMO_FACTURES[factureIndex];
      
      // Recalculer les lignes si elles sont modifiées
      let updatedLines = existingFacture.lines;
      if (factureData.lines) {
        updatedLines = factureData.lines.map((line, index) => ({
          ...line,
          id: line.id || `${Date.now()}-${index}`,
          total: calculateLineTotal(line)
        })) as FactureLine[];
      }
      
      // Recalculer les totaux
      const totals = calculateFactureTotal(
        updatedLines, 
        factureData.globalDiscount ?? existingFacture.globalDiscount,
        factureData.vatRate ?? existingFacture.vatRate
      );
      
      DEMO_FACTURES[factureIndex] = {
        ...existingFacture,
        ...factureData,
        lines: updatedLines,
        ...totals,
        remainingAmount: totals.totalTTC - existingFacture.amountPaid,
        dateModification: new Date().toISOString()
      };
    }
    
    await get().loadFactures();
  },

  // Supprimer une facture
  deleteFacture: async (id: string) => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const factureIndex = DEMO_FACTURES.findIndex(f => f.id === id);
    if (factureIndex !== -1) {
      DEMO_FACTURES.splice(factureIndex, 1);
    }
    
    await get().loadFactures();
  },

  // Ajouter un paiement
  addPayment: async (factureId: string, paymentData: Omit<Payment, 'id' | 'factureId' | 'createdBy' | 'dateCreation'>) => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const factureIndex = DEMO_FACTURES.findIndex(f => f.id === factureId);
    if (factureIndex !== -1) {
      const facture = DEMO_FACTURES[factureIndex];
      
      const newPayment: Payment = {
        ...paymentData,
        id: `pay-${Date.now()}`,
        factureId,
        createdBy: 'current-user',
        dateCreation: new Date().toISOString()
      };
      
      const updatedPayments = [...(facture.payments || []), newPayment];
      const totalAmountPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
      
      DEMO_FACTURES[factureIndex] = updateFactureStatus({
        ...facture,
        payments: updatedPayments,
        amountPaid: totalAmountPaid,
        dateModification: new Date().toISOString()
      });
    }
    
    await get().loadFactures();
  },

  // Changer le statut d'une facture
  changeFactureStatus: async (id: string, status: Facture['status']) => {
    const factureIndex = DEMO_FACTURES.findIndex(f => f.id === id);
    if (factureIndex !== -1) {
      DEMO_FACTURES[factureIndex] = {
        ...DEMO_FACTURES[factureIndex],
        status,
        dateModification: new Date().toISOString()
      };
      
      await get().loadFactures();
    }
  },

  // Créer une facture depuis un devis
  createFactureFromDevis: async (devisId: string): Promise<Facture> => {
    // Simulation : récupérer les données du devis
    const devisData = {
      clientId: '1',
      title: 'Facture générée depuis devis',
      lines: [],
      vatRate: 20,
      dateEmission: new Date().toISOString(),
      dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paymentTerms: '30 jours net'
    };
    
    return await get().addFacture({
      ...devisData,
      devisId
    });
  },

  // Calculer les statistiques
  calculateStats: () => {
    const activeFactures = DEMO_FACTURES.filter(f => f.isActive);
    const total = activeFactures.length;
    
    const totalAmountPaid = activeFactures.reduce((sum, f) => sum + f.amountPaid, 0);
    const totalRemainingAmount = activeFactures.reduce((sum, f) => sum + f.remainingAmount, 0);
    
    // Calculer le délai moyen de paiement
    const paidFactures = activeFactures.filter(f => f.datePaiementComplete);
    const averagePaymentDelay = paidFactures.length > 0 
      ? paidFactures.reduce((sum, f) => {
          const emission = new Date(f.dateEmission);
          const paiement = new Date(f.datePaiementComplete!);
          return sum + Math.floor((paiement.getTime() - emission.getTime()) / (1000 * 60 * 60 * 24));
        }, 0) / paidFactures.length
      : 0;
    
    const stats: FactureStats = {
      total,
      brouillon: activeFactures.filter(f => f.status === 'brouillon').length,
      envoyee: activeFactures.filter(f => f.status === 'envoyee').length,
      payee: activeFactures.filter(f => f.status === 'payee').length,
      partiellement_payee: activeFactures.filter(f => f.status === 'partiellement_payee').length,
      en_retard: activeFactures.filter(f => f.status === 'en_retard').length,
      annulee: activeFactures.filter(f => f.status === 'annulee').length,
      totalValueHT: activeFactures.reduce((sum, f) => sum + f.totalHT, 0),
      totalValueTTC: activeFactures.reduce((sum, f) => sum + f.totalTTC, 0),
      totalAmountPaid,
      totalRemainingAmount,
      averageAmount: total > 0 ? activeFactures.reduce((sum, f) => sum + f.totalTTC, 0) / total : 0,
      averagePaymentDelay
    };
    
    set({ stats });
  }
}));