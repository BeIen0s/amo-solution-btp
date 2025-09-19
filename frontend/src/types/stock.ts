export interface Product {
  id: string;
  // Informations de base
  name: string;
  description?: string;
  reference: string; // Référence interne
  ean?: string; // Code-barres EAN
  
  // Classification
  category: 'materiau' | 'outil' | 'equipement' | 'consommable';
  subcategory?: string; // Béton, Acier, Électricité, etc.
  brand?: string; // Marque
  model?: string; // Modèle
  
  // Unités et mesures
  unit: 'm' | 'm²' | 'm³' | 'kg' | 't' | 'l' | 'u' | 'ml' | 'cm' | 'paquet' | 'sac' | 'palette';
  unitPackaging?: string; // Conditionnement (ex: sac de 25kg)
  
  // Prix et coûts
  purchasePrice: number; // Prix d'achat HT
  sellingPrice: number; // Prix de vente HT
  margin: number; // Marge en %
  
  // Stock
  currentStock: number; // Quantité actuelle
  minStock: number; // Stock minimum (alerte)
  maxStock?: number; // Stock maximum
  reservedStock: number; // Stock réservé (commandes en cours)
  availableStock: number; // Stock disponible (current - reserved)
  
  // Localisations
  locations: StockLocation[];
  
  // Informations fournisseur
  suppliers: ProductSupplier[];
  
  // Métadonnées
  isActive: boolean;
  isManaged: boolean; // Gestion de stock activée
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  
  // Images et documents
  images?: string[];
  documents?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

export interface StockLocation {
  id: string;
  name: string; // Entrepôt A, Zone B, Étagère C3, etc.
  type: 'entrepot' | 'chantier' | 'camion' | 'magasin';
  quantity: number;
  address?: string;
  notes?: string;
}

export interface ProductSupplier {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierReference?: string; // Référence fournisseur
  purchasePrice: number;
  deliveryTime: number; // Délai de livraison en jours
  minOrderQuantity?: number;
  isPreferred: boolean; // Fournisseur préféré
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  productReference: string;
  
  // Mouvement
  type: 'entree' | 'sortie' | 'transfert' | 'inventaire' | 'perte';
  quantity: number;
  previousStock: number;
  newStock: number;
  
  // Raison du mouvement
  reason: 'achat' | 'vente' | 'production' | 'retour' | 'casse' | 'vol' | 'correction' | 'transfert_chantier';
  reference?: string; // Numéro de commande, facture, etc.
  
  // Localisation
  locationFrom?: string; // Localisation source (pour transferts)
  locationTo?: string; // Localisation destination
  
  // Coûts
  unitCost?: number; // Coût unitaire du mouvement
  totalCost?: number; // Coût total
  
  // Informations
  notes?: string;
  documentUrl?: string; // Lien vers document justificatif
  
  // Métadonnées
  createdAt: string;
  createdBy: string;
  validatedBy?: string; // Qui a validé le mouvement
  validatedAt?: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  productReference: string;
  type: 'stock_minimum' | 'stock_negatif' | 'stock_maximum' | 'expiration';
  level: 'info' | 'warning' | 'critical';
  currentValue: number;
  thresholdValue: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface StockInventory {
  id: string;
  name: string;
  description?: string;
  status: 'en_cours' | 'termine' | 'valide' | 'annule';
  
  // Périmètre
  locationIds?: string[]; // Localisations concernées
  categoryIds?: string[]; // Catégories concernées
  productIds?: string[]; // Produits spécifiques
  
  // Dates
  startDate: string;
  endDate?: string;
  validationDate?: string;
  
  // Résultats
  items: InventoryItem[];
  totalItems: number;
  itemsWithDifference: number;
  totalValueDifference: number;
  
  // Métadonnées
  createdAt: string;
  createdBy: string;
  validatedBy?: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  productReference: string;
  locationId: string;
  locationName: string;
  
  // Quantités
  expectedQuantity: number; // Quantité théorique
  countedQuantity?: number; // Quantité comptée
  difference: number; // Écart
  
  // Valeurs
  unitCost: number;
  expectedValue: number;
  countedValue?: number;
  valueDifference: number;
  
  // Statut
  status: 'non_compte' | 'compte' | 'verifie';
  notes?: string;
  countedBy?: string;
  countedAt?: string;
}

export interface ProductFilters {
  search?: string;
  category?: 'materiau' | 'outil' | 'equipement' | 'consommable' | 'all';
  subcategory?: string;
  brand?: string;
  supplier?: string;
  location?: string;
  stockLevel?: 'tous' | 'normal' | 'faible' | 'critique' | 'rupture';
  isActive?: boolean;
  isManaged?: boolean;
}

export interface StockStats {
  totalProducts: number;
  activeProducts: number;
  totalValue: number; // Valeur totale du stock
  totalValueAtSellingPrice: number; // Valeur de revente
  lowStockProducts: number; // Produits en stock faible
  outOfStockProducts: number; // Produits en rupture
  averageMargin: number; // Marge moyenne
  
  // Par catégorie
  categoryStats: {
    category: string;
    count: number;
    value: number;
    percentage: number;
  }[];
  
  // Mouvements récents
  recentMovements: number;
  totalMovementsValue: number;
  
  // Alertes
  totalAlerts: number;
  criticalAlerts: number;
}

export interface CreateProductData {
  name: string;
  description?: string;
  reference: string;
  ean?: string;
  category: 'materiau' | 'outil' | 'equipement' | 'consommable';
  subcategory?: string;
  brand?: string;
  model?: string;
  unit: 'm' | 'm²' | 'm³' | 'kg' | 't' | 'l' | 'u' | 'ml' | 'cm' | 'paquet' | 'sac' | 'palette';
  unitPackaging?: string;
  purchasePrice: number;
  sellingPrice: number;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  locations: Omit<StockLocation, 'id'>[];
  suppliers: Omit<ProductSupplier, 'id'>[];
  isManaged: boolean;
}

export interface CreateMovementData {
  productId: string;
  type: 'entree' | 'sortie' | 'transfert' | 'inventaire' | 'perte';
  quantity: number;
  reason: 'achat' | 'vente' | 'production' | 'retour' | 'casse' | 'vol' | 'correction' | 'transfert_chantier';
  reference?: string;
  locationFrom?: string;
  locationTo?: string;
  unitCost?: number;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  contact?: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
  isActive: boolean;
  createdAt: string;
}