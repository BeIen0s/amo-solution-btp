# 🏗️ A.M.O Solution BTP

**Application SaaS modulaire pour la gestion d'entreprises du secteur BTP**

[![License](https://img.shields.io/badge/license-PROPRIETARY-red.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-red.svg)](https://nestjs.com)

## 📋 Table des matières

- [🎯 Vue d'ensemble](#-vue-densemble)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🚀 Démarrage rapide](#-démarrage-rapide)
- [🔧 Installation détaillée](#-installation-détaillée)
- [🐳 Déploiement avec Docker](#-déploiement-avec-docker)
- [🔐 Configuration de sécurité](#-configuration-de-sécurité)
- [📖 API Documentation](#-api-documentation)
- [🧪 Tests](#-tests)
- [🔄 CI/CD](#-cicd)
- [🛠️ Développement](#️-développement)
- [📞 Support](#-support)

## 🎯 Vue d'ensemble

A.M.O Solution BTP est une plateforme SaaS moderne conçue spécifiquement pour les entreprises du secteur BTP. Elle offre une gamme complète d'outils de gestion modulaires, de la simple gestion commerciale aux fonctionnalités d'entreprise avancées.

### 🎨 Captures d'écran

```
📱 Interface moderne et responsive
🎨 Design system cohérent avec TailwindCSS
🔐 Authentification sécurisée avec 2FA
📊 Tableaux de bord interactifs
📄 Génération de documents PDF
```

## ✨ Fonctionnalités

### 🔐 **Sécurité avancée**
- ✅ Authentification JWT avec refresh tokens
- ✅ Authentification à deux facteurs (2FA/TOTP)
- ✅ Système RBAC complet (rôles et permissions)
- ✅ Rate limiting et protection contre les attaques
- ✅ Audit logging complet
- ✅ Chiffrement des données sensibles

### 📊 **Gestion commerciale (Offre VENTE)**
- ✅ Gestion de la base clients
- ✅ Suivi du pipeline commercial
- ✅ Création et gestion des devis
- ✅ Facturation avec génération PDF
- ✅ Suivi des paiements et relances

### 🏢 **Gestion d'entreprise (Offre GESTION)**
- ✅ Gestion des achats et fournisseurs
- ✅ Business Intelligence simplifié
- ✅ Gestion documentaire avec signature électronique
- ✅ Suivi de rentabilité des chantiers

### 🚀 **Gestion avancée (Offre GESTION AVANCÉE)**
- ✅ Connecteur comptabilité
- ✅ Gestion avancée des achats
- ✅ Saisie des temps et congés
- ✅ Tableaux de bord BI avancés
- ✅ Gestion multi-dépôts
- ✅ Planning et ressources

### 🏭 **Entreprise (Offre ENTREPRISE)**
- ✅ API publique et webhooks
- ✅ Personnalisation logicielle
- ✅ Politiques de sécurité personnalisables
- ✅ Gestion des interventions et SAV
- ✅ Édition automatique de documents
- ✅ Rapports de chantier avancés

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   React + TS    │◄──►│   NestJS + TS   │◄──►│  PostgreSQL     │
│   TailwindCSS   │    │   Prisma ORM    │    │   Redis Cache   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └─────────────►│   Storage       │◄─────────────┘
                        │ MinIO (dev)     │
                        │ AWS S3 (prod)   │
                        └─────────────────┘
```

### 🛠️ **Stack technique**

**Backend:**
- **NestJS** - Framework Node.js modulaire
- **TypeScript** - Langage typé pour JavaScript
- **Prisma** - ORM moderne avec migrations
- **PostgreSQL** - Base de données relationnelle
- **Redis** - Cache en mémoire et sessions
- **JWT** - Authentification stateless
- **Socket.IO** - Communication temps réel

**Frontend:**
- **React 18** - Bibliothèque UI avec hooks
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **TailwindCSS** - Framework CSS utilitaire
- **React Query** - Gestion d'état serveur
- **React Router** - Routage client-side
- **Framer Motion** - Animations fluides

**Infrastructure:**
- **Docker** - Conteneurisation
- **Nginx** - Reverse proxy et serveur statique
- **GitHub Actions** - CI/CD automatisé
- **MinIO/S3** - Stockage d'objets
- **Playwright** - Tests end-to-end

## 🚀 Démarrage rapide

### ⚡ Installation express (5 minutes)

```bash
# 1. Cloner le projet
git clone https://github.com/votre-org/amo-solution-btp.git
cd amo-solution-btp

# 2. Copier et configurer l'environnement
cp .env.example .env
# ✏️ Éditer le fichier .env avec vos paramètres

# 3. Démarrer avec Docker (recommandé)
docker-compose -f docker-compose.dev.yml up -d

# 4. Installer les dépendances
npm install

# 5. Lancer les migrations et le seeding
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# 6. Démarrer l'application
npm run dev
```

### 🌐 **Accès à l'application**

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Documentation API:** http://localhost:3001/api/docs
- **Prisma Studio:** http://localhost:5555 (optionnel)
- **MinIO Console:** http://localhost:9001
- **Mailhog (dev):** http://localhost:8025

### 🔑 **Connexion par défaut**

```
Email: admin@amo-solution-btp.com
Mot de passe: Admin123!
```

## 🔧 Installation détaillée

### 📋 **Prérequis**

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **Docker** et **Docker Compose**
- **Git**
- **PostgreSQL** (si pas avec Docker)

### 🔧 **Installation manuelle**

#### 1. **Clone et configuration**

```bash
git clone https://github.com/votre-org/amo-solution-btp.git
cd amo-solution-btp

# Copier les fichiers d'environnement
cp .env.example .env
```

#### 2. **Configuration de l'environnement**

Éditez le fichier `.env` avec vos paramètres :

```bash
# Base de données
DATABASE_URL="postgresql://amo_user:amo_password@localhost:5432/amo_solution_btp"

# JWT
JWT_SECRET="votre-clé-secrète-super-sécurisée"
JWT_REFRESH_SECRET="votre-autre-clé-secrète"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-app"

# Autres configurations...
```

#### 3. **Base de données**

```bash
# Démarrer PostgreSQL et Redis avec Docker
docker-compose -f docker-compose.dev.yml up -d postgres redis

# Ou installer localement sur votre système
```

#### 4. **Backend**

```bash
cd backend

# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate dev --name init

# Seeding des données de test
npx prisma db seed

# Démarrer le serveur backend
npm run start:dev
```

#### 5. **Frontend**

```bash
cd ../frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

## 🐳 Déploiement avec Docker

### 🔧 **Développement**

```bash
# Démarrer tous les services de développement
docker-compose -f docker-compose.dev.yml up -d

# Voir les logs
docker-compose -f docker-compose.dev.yml logs -f

# Arrêter les services
docker-compose -f docker-compose.dev.yml down
```

### 🚀 **Production**

```bash
# Construire et déployer en production
docker-compose -f docker-compose.prod.yml up -d

# Avec monitoring
docker-compose -f docker-compose.prod.yml --profile monitoring up -d
```

### 📊 **Services disponibles**

| Service | Dev Port | Prod Port | Description |
|---------|----------|-----------|-------------|
| Frontend | 5173 | 80/443 | Application React |
| Backend | 3001 | 3001 | API NestJS |
| PostgreSQL | 5432 | - | Base de données |
| Redis | 6379 | - | Cache |
| MinIO | 9000/9001 | - | Stockage fichiers |
| Mailhog | 8025 | - | Test emails |
| Prometheus | 9090 | 9090 | Monitoring |
| Grafana | 3000 | 3000 | Visualisation |

## 🔐 Configuration de sécurité

### 🔑 **Variables d'environnement critiques**

```bash
# Génération de clés sécurisées
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)
```

### 🛡️ **Sécurité en production**

1. **HTTPS obligatoire** - Certificats SSL/TLS
2. **Secrets externes** - Utiliser un gestionnaire de secrets
3. **Firewall** - Limiter l'accès aux ports
4. **Monitoring** - Surveiller les tentatives d'intrusion
5. **Sauvegardes** - Stratégie de sauvegarde automatisée

### 🔒 **RGPD et conformité**

- ✅ Audit logging immuable
- ✅ Chiffrement des données sensibles
- ✅ Export et suppression des données utilisateur
- ✅ Consentement et traçabilité

## 📖 API Documentation

### 🌐 **Swagger Documentation**

La documentation interactive de l'API est disponible à :
- **Développement:** http://localhost:3001/api/docs
- **Production:** https://votre-domaine.com/api/docs

### 🔗 **Endpoints principaux**

#### **Authentification**
```bash
POST /api/v1/auth/login        # Connexion
POST /api/v1/auth/logout       # Déconnexion
POST /api/v1/auth/refresh      # Rafraîchir token
GET  /api/v1/auth/me           # Profil utilisateur
```

#### **Clients**
```bash
GET    /api/v1/clients         # Liste des clients
POST   /api/v1/clients         # Créer un client
GET    /api/v1/clients/:id     # Détails client
PUT    /api/v1/clients/:id     # Modifier client
DELETE /api/v1/clients/:id     # Supprimer client
```

#### **Devis**
```bash
GET    /api/v1/devis           # Liste des devis
POST   /api/v1/devis           # Créer un devis
GET    /api/v1/devis/:id       # Détails devis
PUT    /api/v1/devis/:id       # Modifier devis
POST   /api/v1/devis/:id/pdf   # Générer PDF
```

### 📝 **Exemples cURL**

```bash
# Connexion
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@amo-solution-btp.com","password":"Admin123!"}'

# Créer un client
curl -X POST http://localhost:3001/api/v1/clients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Entreprise Test","email":"test@example.com","type":"ENTREPRISE"}'

# Lister les devis
curl -X GET http://localhost:3001/api/v1/devis \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🧪 Tests

### 🏃‍♂️ **Exécution des tests**

```bash
# Tests unitaires backend
cd backend && npm test

# Tests avec couverture
cd backend && npm run test:cov

# Tests frontend
cd frontend && npm test

# Tests end-to-end
cd frontend && npm run test:e2e
```

### 📊 **Couverture de code**

Le projet vise une couverture de code de **80%** minimum.

## 🔄 CI/CD

### 🚀 **Pipeline GitHub Actions**

Le projet inclut une pipeline complète :

1. **Tests automatisés** - Unit et E2E tests
2. **Build Docker** - Images optimisées
3. **Security scan** - Vulnérabilités
4. **Deployment** - Staging et Production

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    # Configuration complète...
```

## 🛠️ Développement

### 🏁 **Scripts disponibles**

```bash
# Root
npm run dev              # Démarrer frontend + backend
npm run build            # Build complet
npm run test             # Tests complets
npm run lint             # Vérification du code
npm run format           # Formatage automatique

# Backend
npm run start:dev        # Mode développement
npm run build            # Build production
npm run test:watch       # Tests en mode watch
npm run db:migrate       # Migrations Prisma
npm run db:seed          # Seeding données

# Frontend
npm run dev              # Serveur développement
npm run build            # Build production
npm run preview          # Prévisualiser build
npm run test:ui          # Tests avec interface
```

### 🔧 **Outils de développement**

- **ESLint** - Qualité du code
- **Prettier** - Formatage automatique
- **Husky** - Git hooks
- **TypeScript** - Vérification de types
- **Prisma Studio** - Interface base de données

### 🎨 **Conventions de code**

- **Commits**: Format conventionnel (`feat:`, `fix:`, `docs:`)
- **Branches**: Feature branches (`feature/nom-fonctionnalité`)
- **Code**: TypeScript strict avec ESLint
- **CSS**: Classes TailwindCSS utilitaires

## 📞 Support

### 📧 **Contact**

- **Email technique:** dev@amo-solution-btp.com
- **Email commercial:** contact@amo-solution-btp.com
- **Documentation:** https://docs.amo-solution-btp.com

### 🐛 **Signaler un problème**

1. Vérifier les [issues existantes](https://github.com/votre-org/amo-solution-btp/issues)
2. Créer une nouvelle issue avec:
   - Description détaillée du problème
   - Étapes de reproduction
   - Version et environnement
   - Logs d'erreur

### 🤝 **Contribuer**

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 🏆 **Créé avec ❤️ par l'équipe A.M.O Solution BTP**

**Version actuelle:** 1.0.0  
**Dernière mise à jour:** Septembre 2024

[![Construit avec NestJS](https://img.shields.io/badge/Built%20with-NestJS-red.svg)](https://nestjs.com)
[![Construit avec React](https://img.shields.io/badge/Built%20with-React-blue.svg)](https://reactjs.org)
[![Propulsé par TypeScript](https://img.shields.io/badge/Powered%20by-TypeScript-blue.svg)](https://www.typescriptlang.org)