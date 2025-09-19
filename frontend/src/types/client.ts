export interface Client {
  id: string;
  // Informations principales
  nom: string;
  prenom?: string;
  email: string;
  telephone: string;
  
  // Type de client
  type: 'particulier' | 'entreprise' | 'collectivite';
  category: 'prospect' | 'client' | 'client_premium';
  
  // Informations entreprise (si applicable)
  entreprise?: string;
  siret?: string;
  
  // Adresse
  adresse: {
    rue: string;
    ville: string;
    codePostal: string;
    region: string;
  };
  
  // Notes et informations complémentaires
  notes?: string;
  
  // Métadonnées
  dateCreation: string;
  dateModification?: string;
  isActive: boolean;
}

export interface CreateClientData {
  // Informations de base
  nom: string;
  prenom?: string;
  email: string;
  telephone: string;
  
  // Type et catégorie
  type: 'particulier' | 'entreprise' | 'collectivite';
  category: 'prospect' | 'client' | 'client_premium';
  
  // Informations entreprise
  entreprise?: string;
  siret?: string;
  
  // Adresse principale
  adresse: {
    rue: string;
    ville: string;
    codePostal: string;
    region: string;
  };
  
  // Notes
  notes?: string;
  isActive: boolean;
}

export interface ClientFilters {
  search?: string;
  type?: 'particulier' | 'entreprise' | 'collectivite' | 'all';
  category?: 'prospect' | 'client' | 'client_premium' | 'all';
  region?: string;
  assignedTo?: string;
  tags?: string[];
  isActive?: boolean;
}

export interface ClientListResponse {
  clients: Client[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}