import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { OfferType, UserStatus, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données...');

  // ===== CRÉATION DES RÔLES =====
  console.log('👤 Création des rôles...');
  
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      description: 'Administrateur système avec tous les droits',
      permissions: {
        users: ['create', 'read', 'update', 'delete', 'impersonate'],
        roles: ['create', 'read', 'update', 'delete'],
        clients: ['create', 'read', 'update', 'delete'],
        subscriptions: ['create', 'read', 'update', 'delete'],
        featureFlags: ['create', 'read', 'update', 'delete'],
        devis: ['create', 'read', 'update', 'delete'],
        factures: ['create', 'read', 'update', 'delete'],
        commandes: ['create', 'read', 'update', 'delete'],
        stock: ['create', 'read', 'update', 'delete'],
        interventions: ['create', 'read', 'update', 'delete'],
        documents: ['create', 'read', 'update', 'delete'],
        auditLogs: ['read'],
        systemConfig: ['create', 'read', 'update', 'delete'],
      },
      isDefault: false,
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrateur avec droits étendus',
      permissions: {
        users: ['create', 'read', 'update'],
        roles: ['read'],
        clients: ['create', 'read', 'update', 'delete'],
        devis: ['create', 'read', 'update', 'delete'],
        factures: ['create', 'read', 'update', 'delete'],
        commandes: ['create', 'read', 'update', 'delete'],
        stock: ['create', 'read', 'update', 'delete'],
        interventions: ['create', 'read', 'update', 'delete'],
        documents: ['create', 'read', 'update', 'delete'],
      },
      isDefault: false,
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
      description: 'Utilisateur standard',
      permissions: {
        clients: ['read', 'create', 'update'],
        devis: ['read', 'create', 'update'],
        factures: ['read', 'create', 'update'],
        commandes: ['read', 'create', 'update'],
        stock: ['read'],
        interventions: ['read', 'create', 'update'],
        documents: ['read', 'create'],
      },
      isDefault: true,
    },
  });

  // ===== CRÉATION DES FEATURE FLAGS =====
  console.log('🚩 Création des feature flags...');
  
  const featureFlags = [
    {
      name: 'commercial_base',
      description: 'Gestion commerciale de base (clients, devis, factures)',
      module: 'commercial',
      requiredOffer: [OfferType.VENTE, OfferType.GESTION, OfferType.GESTION_AVANCEE, OfferType.ENTREPRISE],
    },
    {
      name: 'achat_base',
      description: 'Gestion des achats de base',
      module: 'achat',
      requiredOffer: [OfferType.GESTION, OfferType.GESTION_AVANCEE, OfferType.ENTREPRISE],
    },
    {
      name: 'achat_avance',
      description: 'Gestion avancée des achats et fournisseurs',
      module: 'achat',
      requiredOffer: [OfferType.GESTION_AVANCEE, OfferType.ENTREPRISE],
    },
    {
      name: 'bi_simple',
      description: 'Business Intelligence simplifié',
      module: 'bi',
      requiredOffer: [OfferType.GESTION, OfferType.GESTION_AVANCEE, OfferType.ENTREPRISE],
    },
    {
      name: 'bi_avance',
      description: 'Business Intelligence avancé avec tableaux de bord',
      module: 'bi',
      requiredOffer: [OfferType.GESTION_AVANCEE, OfferType.ENTREPRISE],
    },
    {
      name: 'documents_base',
      description: 'Gestion documentaire de base',
      module: 'documents',
      requiredOffer: [OfferType.GESTION, OfferType.GESTION_AVANCEE, OfferType.ENTREPRISE],
    },
    {
      name: 'documents_signature',
      description: 'Signature électronique des documents',
      module: 'documents',
      requiredOffer: [OfferType.GESTION, OfferType.GESTION_AVANCEE, OfferType.ENTREPRISE],
    },
    {
      name: 'temps_saisie',
      description: 'Saisie des temps de travail',
      module: 'temps',
      requiredOffer: [OfferType.GESTION_AVANCEE, OfferType.ENTREPRISE],
    },
    {
      name: 'stock_base',
      description: 'Gestion de stock de base',
      module: 'stock',
      requiredOffer: [OfferType.GESTION_AVANCEE, OfferType.ENTREPRISE],
    },
    {
      name: 'planning',
      description: 'Planification et gestion des ressources',
      module: 'planning',
      requiredOffer: [OfferType.GESTION_AVANCEE, OfferType.ENTREPRISE],
    },
    {
      name: 'intervention_sav',
      description: 'Gestion des interventions et SAV',
      module: 'intervention',
      requiredOffer: [OfferType.ENTREPRISE],
    },
    {
      name: 'api_publique',
      description: 'API publique et webhooks',
      module: 'api',
      requiredOffer: [OfferType.ENTREPRISE],
    },
    {
      name: 'connecteur_compta',
      description: 'Connecteur comptabilité avancé',
      module: 'comptabilite',
      requiredOffer: [OfferType.GESTION_AVANCEE, OfferType.ENTREPRISE],
    },
  ];

  for (const flag of featureFlags) {
    await prisma.featureFlag.upsert({
      where: { name: flag.name },
      update: {},
      create: flag,
    });
  }

  // ===== CRÉATION DES ABONNEMENTS =====
  console.log('📋 Création des abonnements...');
  
  const venteSubscription = await prisma.subscription.upsert({
    where: { id: 'sub_vente_001' },
    update: {},
    create: {
      id: 'sub_vente_001',
      name: 'Offre Vente',
      offerType: OfferType.VENTE,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
      trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      autoRenew: true,
    },
  });

  // ===== CRÉATION DU SUPER ADMIN =====
  console.log('👑 Création du super administrateur...');
  
  const hashedPassword = await bcrypt.hash('Admin123!', 12);
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@amo-solution-btp.com' },
    update: {},
    create: {
      email: 'admin@amo-solution-btp.com',
      username: 'superadmin',
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+33123456789',
      password: hashedPassword,
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  });

  // Attribution du rôle super admin
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: superAdmin.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: superAdmin.id,
      roleId: superAdminRole.id,
      assignedBy: superAdmin.id,
    },
  });

  // ===== CRÉATION D'UN CLIENT TEST =====
  console.log('🏢 Création du client de test...');
  
  const testClient = await prisma.client.upsert({
    where: { id: 'client_test_001' },
    update: {},
    create: {
      id: 'client_test_001',
      name: 'Entreprise BTP Test SARL',
      type: 'ENTREPRISE',
      siret: '12345678901234',
      vatNumber: 'FR12345678901',
      contactName: 'Jean Dupont',
      email: 'contact@entreprise-test.fr',
      phone: '0123456789',
      mobile: '0612345678',
      address: '123 Rue de la Construction',
      postalCode: '75001',
      city: 'Paris',
      country: 'France',
      subscriptionId: venteSubscription.id,
      isProspect: false,
      source: 'DEMO',
      notes: 'Client de démonstration créé lors du seeding',
      createdBy: superAdmin.id,
    },
  });

  // ===== CRÉATION D'UN CHANTIER TEST =====
  console.log('🏗️ Création du chantier de test...');
  
  const testChantier = await prisma.chantier.upsert({
    where: { reference: 'CHT-2024-001' },
    update: {},
    create: {
      name: 'Rénovation Villa Moderne',
      reference: 'CHT-2024-001',
      description: 'Rénovation complète d\'une villa avec extension',
      address: '456 Avenue des Travaux',
      postalCode: '69001',
      city: 'Lyon',
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 jours
      budgetHT: 85000.00,
      budgetTTC: 102000.00,
      clientId: testClient.id,
    },
  });

  // ===== CRÉATION D'UN DEVIS TEST =====
  console.log('📄 Création du devis de test...');
  
  const testDevis = await prisma.devis.upsert({
    where: { number: 'DEV-2024-001' },
    update: {},
    create: {
      number: 'DEV-2024-001',
      title: 'Devis Rénovation Villa Moderne',
      description: 'Devis pour la rénovation complète avec extension',
      status: 'ENVOYE',
      date: new Date(),
      validityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      totalHT: 85000.00,
      totalTTC: 102000.00,
      vatAmount: 17000.00,
      clientId: testClient.id,
      chantierId: testChantier.id,
      createdBy: superAdmin.id,
    },
  });

  // Ajout des lignes du devis
  await prisma.devisItem.createMany({
    data: [
      {
        description: 'Démolition et évacuation',
        quantity: 1,
        unitPrice: 8000.00,
        vatRate: 20.00,
        totalHT: 8000.00,
        devisId: testDevis.id,
      },
      {
        description: 'Gros œuvre extension',
        quantity: 1,
        unitPrice: 35000.00,
        vatRate: 20.00,
        totalHT: 35000.00,
        devisId: testDevis.id,
      },
      {
        description: 'Plomberie et électricité',
        quantity: 1,
        unitPrice: 25000.00,
        vatRate: 20.00,
        totalHT: 25000.00,
        devisId: testDevis.id,
      },
      {
        description: 'Finitions et peinture',
        quantity: 1,
        unitPrice: 17000.00,
        vatRate: 20.00,
        totalHT: 17000.00,
        devisId: testDevis.id,
      },
    ],
  });

  // ===== CRÉATION DE PRODUITS ET STOCK TEST =====
  console.log('📦 Création des produits et stock de test...');
  
  const warehouse = await prisma.warehouse.upsert({
    where: { id: 'warehouse_001' },
    update: {},
    create: {
      id: 'warehouse_001',
      name: 'Dépôt Principal',
      description: 'Dépôt principal de l\'entreprise',
      address: '789 Zone Industrielle',
    },
  });

  const products = [
    {
      name: 'Ciment Portland 25kg',
      reference: 'CIM-POR-25',
      category: 'Matériaux',
      unit: 'sac',
      purchasePrice: 8.50,
      salePrice: 12.75,
      currentStock: 150,
      minStock: 20,
      maxStock: 300,
    },
    {
      name: 'Brique rouge 20x10x5',
      reference: 'BRI-ROU-201',
      category: 'Matériaux',
      unit: 'unité',
      purchasePrice: 0.85,
      salePrice: 1.20,
      currentStock: 5000,
      minStock: 1000,
      maxStock: 10000,
    },
    {
      name: 'Plaque de plâtre BA13',
      reference: 'PLA-PLA-BA13',
      category: 'Cloisons',
      unit: 'm²',
      purchasePrice: 3.20,
      salePrice: 4.80,
      currentStock: 200,
      minStock: 50,
      maxStock: 500,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { reference: product.reference },
      update: {},
      create: product,
    });
  }

  // ===== CONFIGURATION SYSTÈME =====
  console.log('⚙️ Configuration système...');
  
  const systemConfigs = [
    {
      key: 'company_name',
      value: 'A.M.O Solution BTP',
      description: 'Nom de l\'entreprise',
      isPublic: true,
    },
    {
      key: 'company_siret',
      value: '98765432109876',
      description: 'SIRET de l\'entreprise',
      isPublic: false,
    },
    {
      key: 'vat_number',
      value: 'FR98765432109',
      description: 'Numéro de TVA',
      isPublic: false,
    },
    {
      key: 'default_vat_rate',
      value: '20.00',
      description: 'Taux de TVA par défaut',
      isPublic: false,
    },
    {
      key: 'invoice_prefix',
      value: 'FAC',
      description: 'Préfixe des numéros de facture',
      isPublic: false,
    },
    {
      key: 'quote_prefix',
      value: 'DEV',
      description: 'Préfixe des numéros de devis',
      isPublic: false,
    },
    {
      key: 'quote_validity_days',
      value: '30',
      description: 'Durée de validité des devis en jours',
      isPublic: false,
    },
  ];

  for (const config of systemConfigs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    });
  }

  // ===== LOG D'AUDIT INITIAL =====
  console.log('📝 Création du log d\'audit initial...');
  
  await prisma.auditLog.create({
    data: {
      action: 'SYSTEM_INIT',
      entity: 'system',
      entityId: null,
      newValues: {
        message: 'Base de données initialisée avec les données de démonstration',
        timestamp: new Date().toISOString(),
      },
      userId: superAdmin.id,
      level: 'INFO',
    },
  });

  console.log('✅ Seeding terminé avec succès !');
  console.log('');
  console.log('🔐 Informations de connexion Super Admin :');
  console.log('   Email : admin@amo-solution-btp.com');
  console.log('   Mot de passe : Admin123!');
  console.log('');
  console.log('🏢 Client de test créé : Entreprise BTP Test SARL');
  console.log('🏗️ Chantier de test créé : Rénovation Villa Moderne');
  console.log('📄 Devis de test créé : DEV-2024-001');
  console.log('');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erreur lors du seeding :', e);
    await prisma.$disconnect();
    process.exit(1);
  });