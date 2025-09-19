export interface DevisLine {
  id: string;
  description: string;
  quantity: number;
  unit: string; // m², ml, u, etc.
  unitPrice: number;
  discount?: number; // pourcentage de remise
  total: number; // quantity * unitPrice - discount
  category?: string; // Maçonnerie, Électricité, etc.
}

export interface Devis {
  id: string;
  // Numérotation
  number: string; // DEV-2024-001
  
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
  
  // Informations du devis
  title: string; // Titre du projet
  description?: string; // Description générale
  status: 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'expire';
  
  // Lignes du devis
  lines: DevisLine[];
  
  // Calculs
  subtotal: number; // Total HT avant remise globale
  globalDiscount?: number; // Remise globale en pourcentage
  discountAmount: number; // Montant de la remise
  totalHT: number; // Total HT après remise
  vatRate: number; // Taux TVA (généralement 20%)
  vatAmount: number; // Montant TVA
  totalTTC: number; // Total TTC
  
  // Dates
  dateCreation: string;
  dateModification?: string;
  dateEnvoi?: string; // Date d'envoi au client
  dateValidite: string; // Date limite de validité
  dateAcceptation?: string;
  
  // Conditions
  validityDays: number; // Durée de validité en jours (default: 30)
  paymentTerms: string; // Conditions de paiement
  deliveryTerms?: string; // Conditions de livraison
  
  // Notes
  publicNotes?: string; // Notes visibles par le client
  privateNotes?: string; // Notes internes
  
  // Métadonnées
  createdBy: string;
  assignedTo?: string; // Commercial responsable
  version: number; // Version du devis (pour historique)
  parentId?: string; // Si c'est une révision d'un devis existant
  
  // Fichiers joints
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: string;
  }[];
  
  isActive: boolean;
}

export interface CreateDevisData {
  clientId: string;
  title: string;
  description?: string;
  lines: Omit<DevisLine, 'id' | 'total'>[];
  globalDiscount?: number;
  vatRate: number;
  validityDays: number;
  paymentTerms: string;
  deliveryTerms?: string;
  publicNotes?: string;
  privateNotes?: string;
  assignedTo?: string;
}

export interface DevisFilters {
  search?: string;
  status?: 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'expire' | 'all';
  clientId?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  isActive?: boolean;
}

export interface DevisStats {
  total: number;
  brouillon: number;
  envoye: number;
  accepte: number;
  refuse: number;
  expire: number;
  totalValueHT: number;
  totalValueTTC: number;
  acceptanceRate: number; // Taux d'acceptation en %
  averageAmount: number;
}

export interface DevisPDFOptions {
  includeSignature?: boolean;
  includeLogo?: boolean;
  template?: 'standard' | 'modern' | 'minimal';
  language?: 'fr' | 'en';
}

// Types pour les templates de lignes prédéfinies
export interface DevisLineTemplate {
  id: string;
  category: string;
  description: string;
  unit: string;
  defaultUnitPrice: number;
  isActive: boolean;
}

export interface DevisTemplate {
  id: string;
  name: string;
  description?: string;
  lines: DevisLineTemplate[];
  validityDays: number;
  paymentTerms: string;
  deliveryTerms?: string;
  publicNotes?: string;
  createdBy: string;
  dateCreation: string;
  isActive: boolean;
}