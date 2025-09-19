export interface FactureLine {
  id: string;
  description: string;
  quantity: number;
  unit: string; // m², ml, u, etc.
  unitPrice: number;
  discount?: number; // pourcentage de remise
  total: number; // quantity * unitPrice - discount
  category?: string; // Maçonnerie, Électricité, etc.
}

export interface Facture {
  id: string;
  // Numérotation
  number: string; // FAC-2024-001
  
  // Lien avec devis (optionnel)
  devisId?: string;
  devisNumber?: string;
  
  // Client
  clientId: string;
  clientInfo: {
    nom: string;
    prenom?: string;
    email: string;
    telephone: string;
    adresse: {
      rue: string;
      ville: string;
      codePostal: string;
      region: string;
    };
    entreprise?: string;
    siret?: string;
  };
  
  // Informations de la facture
  title: string; // Titre du projet/facture
  description?: string; // Description générale
  status: 'brouillon' | 'envoyee' | 'payee' | 'partiellement_payee' | 'en_retard' | 'annulee';
  
  // Lignes de la facture
  lines: FactureLine[];
  
  // Calculs
  subtotal: number; // Total HT avant remise globale
  globalDiscount?: number; // Remise globale en pourcentage
  discountAmount: number; // Montant de la remise
  totalHT: number; // Total HT après remise
  vatRate: number; // Taux TVA (généralement 20%)
  vatAmount: number; // Montant TVA
  totalTTC: number; // Total TTC
  
  // Paiement
  amountPaid: number; // Montant déjà payé
  remainingAmount: number; // Montant restant à payer
  
  // Dates
  dateCreation: string;
  dateModification?: string;
  dateEmission: string; // Date d'émission de la facture
  dateEcheance: string; // Date d'échéance
  datePaiementComplete?: string; // Date de paiement complet
  
  // Conditions
  paymentTerms: string; // Conditions de paiement
  paymentMethod?: string; // Mode de paiement
  penaltyRate?: number; // Taux de pénalité de retard
  
  // Notes
  publicNotes?: string; // Notes visibles par le client
  privateNotes?: string; // Notes internes
  
  // Métadonnées
  createdBy: string;
  assignedTo?: string; // Commercial responsable
  
  // Fichiers joints
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: string;
  }[];
  
  // Paiements
  payments?: Payment[];
  
  isActive: boolean;
}

export interface Payment {
  id: string;
  factureId: string;
  amount: number;
  date: string;
  method: 'especes' | 'cheque' | 'virement' | 'carte_bancaire' | 'autre';
  reference?: string; // Numéro de chèque, référence virement, etc.
  notes?: string;
  createdBy: string;
  dateCreation: string;
}

export interface CreateFactureData {
  clientId: string;
  devisId?: string; // Si créée depuis un devis
  title: string;
  description?: string;
  lines: Omit<FactureLine, 'id' | 'total'>[];
  globalDiscount?: number;
  vatRate: number;
  dateEmission: string;
  dateEcheance: string;
  paymentTerms: string;
  paymentMethod?: string;
  penaltyRate?: number;
  publicNotes?: string;
  privateNotes?: string;
  assignedTo?: string;
}

export interface FactureFilters {
  search?: string;
  status?: 'brouillon' | 'envoyee' | 'payee' | 'partiellement_payee' | 'en_retard' | 'annulee' | 'all';
  clientId?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  echeanceFrom?: string; // Filtrer par date d'échéance
  echeanceTo?: string;
  amountMin?: number;
  amountMax?: number;
  isOverdue?: boolean; // Factures en retard
  isActive?: boolean;
}

export interface FactureStats {
  total: number;
  brouillon: number;
  envoyee: number;
  payee: number;
  partiellement_payee: number;
  en_retard: number;
  annulee: number;
  totalValueHT: number;
  totalValueTTC: number;
  totalAmountPaid: number;
  totalRemainingAmount: number;
  averageAmount: number;
  averagePaymentDelay: number; // Délai moyen de paiement en jours
}

export interface FacturePDFOptions {
  includeSignature?: boolean;
  includeLogo?: boolean;
  template?: 'standard' | 'modern' | 'minimal';
  language?: 'fr' | 'en';
  showPaymentDetails?: boolean;
}

// Types pour les templates de lignes prédéfinies (réutilisation du devis)
export interface FactureLineTemplate {
  id: string;
  category: string;
  description: string;
  unit: string;
  defaultUnitPrice: number;
  isActive: boolean;
}

// Types pour l'analyse financière
export interface FactureAnalysis {
  monthlyRevenue: {
    month: string;
    revenue: number;
    facturesCount: number;
  }[];
  topClients: {
    clientId: string;
    clientName: string;
    totalAmount: number;
    facturesCount: number;
  }[];
  paymentMethods: {
    method: string;
    count: number;
    totalAmount: number;
  }[];
  overdueAnalysis: {
    totalOverdue: number;
    overdueCount: number;
    averageOverdueDays: number;
    oldestOverdueDate: string;
  };
}

// Types pour les rappels de paiement
export interface PaymentReminder {
  id: string;
  factureId: string;
  type: 'rappel_1' | 'rappel_2' | 'mise_en_demeure';
  dateSent: string;
  method: 'email' | 'courrier' | 'telephone';
  notes?: string;
  createdBy: string;
}

// Types pour les échéanciers
export interface PaymentSchedule {
  id: string;
  factureId: string;
  installments: {
    id: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'paid' | 'overdue';
    paidDate?: string;
    paidAmount?: number;
  }[];
  createdBy: string;
  dateCreation: string;
}