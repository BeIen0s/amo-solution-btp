import { create } from 'zustand';
import { Product, CreateProductData, ProductFilters, StockStats, StockMovement, CreateMovementData, StockAlert } from '@/types/stock';

// Données de démonstration
let DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Béton prêt à l\'emploi C25/30',
    description: 'Béton prêt à l\'emploi classe de résistance C25/30 pour fondations et dalles',
    reference: 'BET-C25-001',
    ean: '3456789012345',
    category: 'materiau',
    subcategory: 'Béton',
    brand: 'Lafarge',
    unit: 'm³',
    unitPackaging: 'Livraison par camion toupie',
    purchasePrice: 85,
    sellingPrice: 110,
    margin: 29.4,
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    reservedStock: 12,
    availableStock: 33,
    locations: [
      { id: 'loc-1', name: 'Entrepôt Principal', type: 'entrepot', quantity: 30, address: 'Zone A' },
      { id: 'loc-2', name: 'Chantier Villeurbanne', type: 'chantier', quantity: 15, address: 'Rue de la Mairie' }
    ],
    suppliers: [
      {
        id: 'sup-1',
        supplierId: 'lafarge-001',
        supplierName: 'Lafarge France',
        purchasePrice: 85,
        deliveryTime: 3,
        minOrderQuantity: 5,
        isPreferred: true
      }
    ],
    isActive: true,
    isManaged: true,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-25T14:30:00Z',
    createdBy: 'user-1'
  },
  {
    id: '2',
    name: 'Acier HA12 - Barres 6m',
    description: 'Acier haute adhérence HA12 en barres de 6 mètres pour armatures béton',
    reference: 'ACI-HA12-6M',
    category: 'materiau',
    subcategory: 'Acier',
    brand: 'ArcelorMittal',
    unit: 't',
    unitPackaging: 'Fagot de 2 tonnes',
    purchasePrice: 750,
    sellingPrice: 950,
    margin: 26.7,
    currentStock: 3.5,
    minStock: 1,
    maxStock: 10,
    reservedStock: 0.8,
    availableStock: 2.7,
    locations: [
      { id: 'loc-1', name: 'Entrepôt Principal', type: 'entrepot', quantity: 3.5, address: 'Zone C - Aciers' }
    ],
    suppliers: [
      {
        id: 'sup-2',
        supplierId: 'arcelor-001',
        supplierName: 'ArcelorMittal Distribution',
        purchasePrice: 750,
        deliveryTime: 7,
        minOrderQuantity: 1,
        isPreferred: true
      }
    ],
    isActive: true,
    isManaged: true,
    createdAt: '2024-01-08T09:15:00Z',
    createdBy: 'user-1'
  },
  {
    id: '3',
    name: 'Perceuse sans fil DEWALT 18V',
    description: 'Perceuse-visseuse sans fil DEWALT 18V Li-Ion avec 2 batteries et chargeur',
    reference: 'OUT-DEW-18V-001',
    ean: '1234567890123',
    category: 'outil',
    subcategory: 'Outillage électroportatif',
    brand: 'DEWALT',
    model: 'DCD771C2',
    unit: 'u',
    purchasePrice: 129,
    sellingPrice: 189,
    margin: 46.5,
    currentStock: 8,
    minStock: 3,
    maxStock: 15,
    reservedStock: 2,
    availableStock: 6,
    locations: [
      { id: 'loc-3', name: 'Magasin Outils', type: 'magasin', quantity: 5, address: 'Étagère A2' },
      { id: 'loc-4', name: 'Camion 1', type: 'camion', quantity: 3, address: 'Véhicule PEUGEOT-AB-123-CD' }
    ],
    suppliers: [
      {
        id: 'sup-3',
        supplierId: 'dewalt-001',
        supplierName: 'DEWALT France',
        purchasePrice: 129,
        deliveryTime: 5,
        minOrderQuantity: 1,
        isPreferred: true
      }
    ],
    isActive: true,
    isManaged: true,
    createdAt: '2024-01-12T11:20:00Z',
    createdBy: 'user-1'
  },
  {
    id: '4',
    name: 'Carrelage grès cérame 60x60',
    description: 'Carrelage grès cérame rectifié 60x60 cm aspect pierre naturelle',
    reference: 'CAR-GRE-6060',
    category: 'materiau',
    subcategory: 'Carrelage',
    brand: 'Porcelanosa',
    unit: 'm²',
    unitPackaging: 'Boîte de 1,44 m² (4 carreaux)',
    purchasePrice: 28,
    sellingPrice: 45,
    margin: 60.7,
    currentStock: 156.8,
    minStock: 50,
    maxStock: 300,
    reservedStock: 28.8,
    availableStock: 128,
    locations: [
      { id: 'loc-1', name: 'Entrepôt Principal', type: 'entrepot', quantity: 156.8, address: 'Zone B - Revêtements' }
    ],
    suppliers: [
      {
        id: 'sup-4',
        supplierId: 'porce-001',
        supplierName: 'Porcelanosa France',
        purchasePrice: 28,
        deliveryTime: 10,
        minOrderQuantity: 50,
        isPreferred: true
      }
    ],
    isActive: true,
    isManaged: true,
    createdAt: '2024-01-15T16:45:00Z',
    createdBy: 'user-1'
  },
  {
    id: '5',
    name: 'Casque de chantier DELTA PLUS',
    description: 'Casque de protection individuelle conforme EN 397',
    reference: 'EPI-CAS-001',
    category: 'equipement',
    subcategory: 'EPI',
    brand: 'Delta Plus',
    model: 'QUARTZ UP III',
    unit: 'u',
    purchasePrice: 12,
    sellingPrice: 18,
    margin: 50,
    currentStock: 25,
    minStock: 10,
    maxStock: 50,
    reservedStock: 0,
    availableStock: 25,
    locations: [
      { id: 'loc-3', name: 'Magasin Outils', type: 'magasin', quantity: 15, address: 'Étagère EPI-A' },
      { id: 'loc-4', name: 'Camion 1', type: 'camion', quantity: 5, address: 'Coffre EPI' },
      { id: 'loc-2', name: 'Chantier Villeurbanne', type: 'chantier', quantity: 5, address: 'Bureau chantier' }
    ],
    suppliers: [
      {
        id: 'sup-5',
        supplierId: 'delta-001',
        supplierName: 'Delta Plus France',
        purchasePrice: 12,
        deliveryTime: 3,
        minOrderQuantity: 10,
        isPreferred: true
      }
    ],
    isActive: true,
    isManaged: true,
    createdAt: '2024-01-20T08:30:00Z',
    createdBy: 'user-1'
  },
  {
    id: '6',
    name: 'Ciment Portland CEM I 52.5N',
    description: 'Ciment Portland CEM I 52.5N pour bétons hautes performances',
    reference: 'CIM-PORT-525',
    category: 'materiau',
    subcategory: 'Ciment',
    brand: 'Holcim',
    unit: 't',
    unitPackaging: 'Sac de 35 kg (palette de 1,4t)',
    purchasePrice: 105,
    sellingPrice: 140,
    margin: 33.3,
    currentStock: 8.4,
    minStock: 5,
    maxStock: 20,
    reservedStock: 2.1,
    availableStock: 6.3,
    locations: [
      { id: 'loc-1', name: 'Entrepôt Principal', type: 'entrepot', quantity: 8.4, address: 'Zone D - Liants' }
    ],
    suppliers: [
      {
        id: 'sup-6',
        supplierId: 'holcim-001',
        supplierName: 'Holcim France',
        purchasePrice: 105,
        deliveryTime: 5,
        minOrderQuantity: 1.4,
        isPreferred: true
      }
    ],
    isActive: true,
    isManaged: true,
    createdAt: '2024-01-05T13:15:00Z',
    createdBy: 'user-1'
  },
  {
    id: '7',
    name: 'Parpaing creux 20x20x50',
    description: 'Parpaing en béton creux 20x20x50 cm classe B40',
    reference: 'PAR-BE20-001',
    category: 'materiau',
    subcategory: 'Maçonnerie',
    brand: 'Alkern',
    unit: 'u',
    unitPackaging: 'Palette de 60 unités',
    purchasePrice: 1.25,
    sellingPrice: 1.85,
    margin: 48,
    currentStock: 840,
    minStock: 200,
    maxStock: 1500,
    reservedStock: 120,
    availableStock: 720,
    locations: [
      { id: 'loc-1', name: 'Entrepôt Principal', type: 'entrepot', quantity: 600, address: 'Cour extérieure A' },
      { id: 'loc-2', name: 'Chantier Villeurbanne', type: 'chantier', quantity: 240, address: 'Zone stockage' }
    ],
    suppliers: [
      {
        id: 'sup-7',
        supplierId: 'alkern-001',
        supplierName: 'Alkern France',
        purchasePrice: 1.25,
        deliveryTime: 2,
        minOrderQuantity: 60,
        isPreferred: true
      }
    ],
    isActive: true,
    isManaged: true,
    createdAt: '2024-01-03T10:45:00Z',
    createdBy: 'user-1'
  },
  {
    id: '8',
    name: 'Sable fin 0/2 lavé',
    description: 'Sable fin lavé granulométrie 0/2 pour mortiers et enduits',
    reference: 'SAB-FIN-02',
    category: 'materiau',
    subcategory: 'Granulats',
    unit: 't',
    unitPackaging: 'Big bag de 1 tonne',
    purchasePrice: 18,
    sellingPrice: 28,
    margin: 55.6,
    currentStock: 2.5,
    minStock: 5,
    maxStock: 15,
    reservedStock: 0,
    availableStock: 2.5,
    locations: [
      { id: 'loc-1', name: 'Entrepôt Principal', type: 'entrepot', quantity: 2.5, address: 'Zone E - Granulats' }
    ],
    suppliers: [
      {
        id: 'sup-8',
        supplierId: 'granulats-001',
        supplierName: 'Granulats du Rhône',
        purchasePrice: 18,
        deliveryTime: 1,
        minOrderQuantity: 5,
        isPreferred: true
      }
    ],
    isActive: true,
    isManaged: true,
    createdAt: '2024-01-18T14:20:00Z',
    createdBy: 'user-1'
  }
];

let DEMO_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-1',
    productId: '1',
    productName: 'Béton prêt à l\'emploi C25/30',
    productReference: 'BET-C25-001',
    type: 'entree',
    quantity: 20,
    previousStock: 25,
    newStock: 45,
    reason: 'achat',
    reference: 'CMD-2024-001',
    locationTo: 'loc-1',
    unitCost: 85,
    totalCost: 1700,
    notes: 'Réapprovisionnement stock',
    createdAt: '2024-01-25T09:30:00Z',
    createdBy: 'user-1'
  },
  {
    id: 'mov-2',
    productId: '3',
    productName: 'Perceuse sans fil DEWALT 18V',
    productReference: 'OUT-DEW-18V-001',
    type: 'sortie',
    quantity: 2,
    previousStock: 10,
    newStock: 8,
    reason: 'transfert_chantier',
    reference: 'CHANTIER-VIL-001',
    locationFrom: 'loc-3',
    locationTo: 'loc-4',
    unitCost: 129,
    notes: 'Transfert vers chantier Villeurbanne',
    createdAt: '2024-01-24T14:15:00Z',
    createdBy: 'user-2'
  },
  {
    id: 'mov-3',
    productId: '4',
    productName: 'Carrelage grès cérame 60x60',
    productReference: 'CAR-GRE-6060',
    type: 'sortie',
    quantity: 28.8,
    previousStock: 185.6,
    newStock: 156.8,
    reason: 'vente',
    reference: 'FAC-2024-002',
    locationFrom: 'loc-1',
    unitCost: 28,
    totalCost: 806.4,
    notes: 'Livraison client Leclerc',
    createdAt: '2024-01-23T11:45:00Z',
    createdBy: 'user-1'
  }
];

let DEMO_ALERTS: StockAlert[] = [
  {
    id: 'alert-1',
    productId: '8',
    productName: 'Sable fin 0/2 lavé',
    productReference: 'SAB-FIN-02',
    type: 'stock_minimum',
    level: 'critical',
    currentValue: 2.5,
    thresholdValue: 5,
    message: 'Stock critique : 2.5t en stock (minimum: 5t)',
    isRead: false,
    createdAt: '2024-01-26T08:00:00Z'
  },
  {
    id: 'alert-2',
    productId: '1',
    productName: 'Béton prêt à l\'emploi C25/30',
    productReference: 'BET-C25-001',
    type: 'stock_minimum',
    level: 'warning',
    currentValue: 33,
    thresholdValue: 20,
    message: 'Stock disponible faible : 33m³ disponibles sur 45m³ (12m³ réservés)',
    isRead: false,
    createdAt: '2024-01-26T10:30:00Z'
  }
];

// Utilitaires
const calculateMargin = (purchasePrice: number, sellingPrice: number): number => {
  return ((sellingPrice - purchasePrice) / sellingPrice) * 100;
};

const updateProductCalculations = (product: Product): Product => {
  return {
    ...product,
    availableStock: product.currentStock - product.reservedStock,
    margin: calculateMargin(product.purchasePrice, product.sellingPrice)
  };
};

const generateProductReference = (category: string): string => {
  const prefixes = {
    materiau: 'MAT',
    outil: 'OUT',
    equipement: 'EQP',
    consommable: 'CON'
  };
  const timestamp = Date.now().toString().slice(-6);
  return `${prefixes[category]}-${timestamp}`;
};

const applyFilters = (products: Product[], filters: ProductFilters): Product[] => {
  let filtered = [...products];
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.reference.toLowerCase().includes(search) ||
      (p.brand && p.brand.toLowerCase().includes(search)) ||
      (p.description && p.description.toLowerCase().includes(search))
    );
  }
  
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(p => p.category === filters.category);
  }
  
  if (filters.subcategory) {
    filtered = filtered.filter(p => p.subcategory === filters.subcategory);
  }
  
  if (filters.brand) {
    filtered = filtered.filter(p => p.brand === filters.brand);
  }
  
  if (filters.stockLevel && filters.stockLevel !== 'tous') {
    filtered = filtered.filter(p => {
      const stockRatio = p.currentStock / p.minStock;
      switch (filters.stockLevel) {
        case 'rupture':
          return p.currentStock <= 0;
        case 'critique':
          return p.currentStock > 0 && stockRatio <= 0.5;
        case 'faible':
          return stockRatio > 0.5 && stockRatio <= 1;
        case 'normal':
          return stockRatio > 1;
        default:
          return true;
      }
    });
  }
  
  if (filters.isActive !== undefined) {
    filtered = filtered.filter(p => p.isActive === filters.isActive);
  }
  
  if (filters.isManaged !== undefined) {
    filtered = filtered.filter(p => p.isManaged === filters.isManaged);
  }
  
  return filtered;
};

const paginateProducts = (products: Product[], page: number, limit = 20) => {
  const startIndex = (page - 1) * limit;
  return products.slice(startIndex, startIndex + limit);
};

interface StockState {
  // État
  products: Product[];
  filteredProducts: Product[];
  movements: StockMovement[];
  alerts: StockAlert[];
  selectedProduct: Product | null;
  isLoading: boolean;
  filters: ProductFilters;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  
  // Statistiques
  stats: StockStats | null;
  
  // Actions - Produits
  loadProducts: () => Promise<void>;
  searchProducts: (search: string) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  setCurrentPage: (page: number) => void;
  getProductById: (id: string) => Product | null;
  addProduct: (productData: CreateProductData) => Promise<Product>;
  updateProduct: (id: string, productData: Partial<CreateProductData>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Actions - Mouvements
  loadMovements: () => Promise<void>;
  addMovement: (movementData: CreateMovementData) => Promise<void>;
  
  // Actions - Alertes
  loadAlerts: () => Promise<void>;
  markAlertAsRead: (alertId: string) => Promise<void>;
  
  // Statistiques
  calculateStats: () => void;
}

export const useStockStore = create<StockState>((set, get) => ({
  // État initial
  products: [],
  filteredProducts: [],
  movements: [],
  alerts: [],
  selectedProduct: null,
  isLoading: false,
  filters: {},
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  stats: null,

  // Charger tous les produits
  loadProducts: async () => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mettre à jour les calculs
    const updatedProducts = DEMO_PRODUCTS.map(updateProductCalculations);
    DEMO_PRODUCTS = updatedProducts;
    
    const { filters, currentPage } = get();
    const allFilteredProducts = applyFilters(DEMO_PRODUCTS, filters);
    const paginatedProducts = paginateProducts(allFilteredProducts, currentPage);
    
    set({
      products: DEMO_PRODUCTS,
      filteredProducts: paginatedProducts,
      totalProducts: allFilteredProducts.length,
      totalPages: Math.ceil(allFilteredProducts.length / 20),
      isLoading: false
    });
    
    // Calculer les stats
    get().calculateStats();
  },

  // Recherche
  searchProducts: (search: string) => {
    const state = get();
    const newFilters = { ...state.filters, search };
    const allFilteredProducts = applyFilters(DEMO_PRODUCTS, newFilters);
    const paginatedProducts = paginateProducts(allFilteredProducts, 1);
    
    set({
      filters: newFilters,
      currentPage: 1,
      filteredProducts: paginatedProducts,
      totalProducts: allFilteredProducts.length,
      totalPages: Math.ceil(allFilteredProducts.length / 20)
    });
  },

  // Appliquer les filtres
  setFilters: (newFilters: Partial<ProductFilters>) => {
    const state = get();
    const updatedFilters = { ...state.filters, ...newFilters };
    const allFilteredProducts = applyFilters(DEMO_PRODUCTS, updatedFilters);
    const paginatedProducts = paginateProducts(allFilteredProducts, 1);
    
    set({
      filters: updatedFilters,
      currentPage: 1,
      filteredProducts: paginatedProducts,
      totalProducts: allFilteredProducts.length,
      totalPages: Math.ceil(allFilteredProducts.length / 20)
    });
  },

  // Changer de page
  setCurrentPage: (page: number) => {
    const { filters } = get();
    const allFilteredProducts = applyFilters(DEMO_PRODUCTS, filters);
    const paginatedProducts = paginateProducts(allFilteredProducts, page);
    
    set({
      currentPage: page,
      filteredProducts: paginatedProducts
    });
  },

  // Récupérer un produit par ID
  getProductById: (id: string) => {
    return DEMO_PRODUCTS.find(p => p.id === id) || null;
  },

  // Ajouter un produit
  addProduct: async (productData: CreateProductData): Promise<Product> => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      reference: productData.reference || generateProductReference(productData.category),
      margin: calculateMargin(productData.purchasePrice, productData.sellingPrice),
      reservedStock: 0,
      availableStock: productData.currentStock,
      locations: productData.locations.map((loc, index) => ({
        ...loc,
        id: `loc-${Date.now()}-${index}`
      })),
      suppliers: productData.suppliers.map((sup, index) => ({
        ...sup,
        id: `sup-${Date.now()}-${index}`
      })),
      createdAt: new Date().toISOString(),
      createdBy: 'current-user'
    };
    
    DEMO_PRODUCTS.unshift(newProduct);
    await get().loadProducts();
    return newProduct;
  },

  // Mettre à jour un produit
  updateProduct: async (id: string, productData: Partial<CreateProductData>) => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const productIndex = DEMO_PRODUCTS.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      const existingProduct = DEMO_PRODUCTS[productIndex];
      DEMO_PRODUCTS[productIndex] = updateProductCalculations({
        ...existingProduct,
        ...productData,
        updatedAt: new Date().toISOString()
      });
    }
    
    await get().loadProducts();
  },

  // Supprimer un produit
  deleteProduct: async (id: string) => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const productIndex = DEMO_PRODUCTS.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      DEMO_PRODUCTS.splice(productIndex, 1);
    }
    
    await get().loadProducts();
  },

  // Charger les mouvements
  loadMovements: async () => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    set({
      movements: [...DEMO_MOVEMENTS].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
      isLoading: false
    });
  },

  // Ajouter un mouvement
  addMovement: async (movementData: CreateMovementData) => {
    set({ isLoading: true });
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const product = DEMO_PRODUCTS.find(p => p.id === movementData.productId);
    if (!product) return;
    
    const newStock = movementData.type === 'entree' 
      ? product.currentStock + movementData.quantity
      : product.currentStock - movementData.quantity;
    
    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      ...movementData,
      productName: product.name,
      productReference: product.reference,
      previousStock: product.currentStock,
      newStock,
      unitCost: movementData.unitCost || product.purchasePrice,
      totalCost: (movementData.unitCost || product.purchasePrice) * movementData.quantity,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user'
    };
    
    // Mettre à jour le stock du produit
    const productIndex = DEMO_PRODUCTS.findIndex(p => p.id === movementData.productId);
    if (productIndex !== -1) {
      DEMO_PRODUCTS[productIndex] = updateProductCalculations({
        ...DEMO_PRODUCTS[productIndex],
        currentStock: newStock,
        updatedAt: new Date().toISOString()
      });
    }
    
    // Ajouter le mouvement
    DEMO_MOVEMENTS.unshift(newMovement);
    
    await get().loadProducts();
    await get().loadMovements();
  },

  // Charger les alertes
  loadAlerts: async () => {
    // Générer des alertes automatiques basées sur les stocks
    const autoAlerts: StockAlert[] = [];
    
    DEMO_PRODUCTS.forEach(product => {
      if (product.isManaged) {
        if (product.currentStock <= 0) {
          autoAlerts.push({
            id: `auto-${product.id}-rupture`,
            productId: product.id,
            productName: product.name,
            productReference: product.reference,
            type: 'stock_negatif',
            level: 'critical',
            currentValue: product.currentStock,
            thresholdValue: 0,
            message: `Rupture de stock : ${product.currentStock}${product.unit}`,
            isRead: false,
            createdAt: new Date().toISOString()
          });
        } else if (product.currentStock < product.minStock) {
          autoAlerts.push({
            id: `auto-${product.id}-min`,
            productId: product.id,
            productName: product.name,
            productReference: product.reference,
            type: 'stock_minimum',
            level: product.currentStock <= product.minStock * 0.5 ? 'critical' : 'warning',
            currentValue: product.currentStock,
            thresholdValue: product.minStock,
            message: `Stock faible : ${product.currentStock}${product.unit} (minimum: ${product.minStock}${product.unit})`,
            isRead: false,
            createdAt: new Date().toISOString()
          });
        }
      }
    });
    
    set({
      alerts: [...DEMO_ALERTS, ...autoAlerts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    });
  },

  // Marquer une alerte comme lue
  markAlertAsRead: async (alertId: string) => {
    const alertIndex = DEMO_ALERTS.findIndex(a => a.id === alertId);
    if (alertIndex !== -1) {
      DEMO_ALERTS[alertIndex].isRead = true;
    }
    await get().loadAlerts();
  },

  // Calculer les statistiques
  calculateStats: () => {
    const activeProducts = DEMO_PRODUCTS.filter(p => p.isActive);
    const managedProducts = activeProducts.filter(p => p.isManaged);
    
    const totalValue = activeProducts.reduce((sum, p) => sum + (p.currentStock * p.purchasePrice), 0);
    const totalValueAtSellingPrice = activeProducts.reduce((sum, p) => sum + (p.currentStock * p.sellingPrice), 0);
    
    const lowStockProducts = managedProducts.filter(p => p.currentStock < p.minStock && p.currentStock > 0).length;
    const outOfStockProducts = managedProducts.filter(p => p.currentStock <= 0).length;
    
    const averageMargin = activeProducts.length > 0 
      ? activeProducts.reduce((sum, p) => sum + p.margin, 0) / activeProducts.length
      : 0;
    
    // Statistiques par catégorie
    const categoryStats = ['materiau', 'outil', 'equipement', 'consommable'].map(category => {
      const categoryProducts = activeProducts.filter(p => p.category === category);
      const categoryValue = categoryProducts.reduce((sum, p) => sum + (p.currentStock * p.purchasePrice), 0);
      
      return {
        category,
        count: categoryProducts.length,
        value: categoryValue,
        percentage: totalValue > 0 ? (categoryValue / totalValue) * 100 : 0
      };
    });
    
    const stats: StockStats = {
      totalProducts: activeProducts.length,
      activeProducts: activeProducts.length,
      totalValue,
      totalValueAtSellingPrice,
      lowStockProducts,
      outOfStockProducts,
      averageMargin,
      categoryStats,
      recentMovements: DEMO_MOVEMENTS.filter(m => 
        new Date(m.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      totalMovementsValue: DEMO_MOVEMENTS.reduce((sum, m) => sum + (m.totalCost || 0), 0),
      totalAlerts: DEMO_ALERTS.length,
      criticalAlerts: DEMO_ALERTS.filter(a => a.level === 'critical' && !a.isRead).length
    };
    
    set({ stats });
  }
}));