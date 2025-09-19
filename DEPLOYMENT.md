# Guide de Déploiement - A.M.O Solution BTP

Ce guide détaille les étapes pour déployer l'application A.M.O Solution BTP sur Netlify (frontend) et d'autres plateformes cloud (backend).

## 📋 Prérequis

- Compte GitHub avec le repository `amo-solution-btp` pushé
- Compte Netlify (gratuit) : https://app.netlify.com/
- Node.js 18+ installé localement
- Variables d'environnement configurées

## 🚀 Déploiement Frontend sur Netlify

### 1. Connexion du Repository GitHub

1. **Créer un nouveau site sur Netlify :**
   - Visitez https://app.netlify.com/
   - Cliquez sur **"New site from Git"**
   - Choisissez **"GitHub"** comme provider
   - Autorisez Netlify à accéder à vos repositories GitHub
   - Sélectionnez le repository **`amo-solution-btp`**

2. **Configuration du déploiement :**
   ```
   Branch to deploy: main
   Build command: cd frontend && npm run build
   Publish directory: frontend/dist
   ```

### 2. Variables d'Environnement

Dans les paramètres Netlify, ajoutez les variables suivantes :

```env
NODE_ENV=production
VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=A.M.O Solution BTP
VITE_APP_VERSION=1.0.0
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
```

### 3. Configuration Build Settings

Dans **Site settings > Build & deploy > Build settings** :

- **Build command :** `npm run build:netlify`
- **Publish directory :** `frontend/dist`
- **Node version :** `18`

### 4. Déploiement Automatique

Le site sera automatiquement déployé à chaque push sur la branche `main`.

## 🔧 Scripts de Déploiement

### Build Local pour Test

```bash
# Tester le build localement
npm run build:netlify

# Prévisualiser le build
cd frontend && npm run preview
```

### Build avec Script Optimisé

```bash
# Utiliser le script personnalisé
node scripts/build-for-netlify.js
```

## 🌐 Déploiement Backend

### Options Recommandées

#### 1. Railway (Recommandé)
- **Avantages :** PostgreSQL inclus, déploiement simple, support Docker
- **URL :** https://railway.app/
- **Configuration :**
  ```bash
  # Variables d'environnement Railway
  DATABASE_URL=postgresql://...
  JWT_SECRET=your-jwt-secret
  REDIS_URL=redis://...
  NODE_ENV=production
  ```

#### 2. Heroku
- **Avantages :** Facile à utiliser, addons PostgreSQL/Redis
- **Configuration :**
  ```bash
  # Heroku CLI
  heroku create amo-solution-backend
  heroku addons:create heroku-postgresql:hobby-dev
  heroku addons:create heroku-redis:hobby-dev
  ```

#### 3. DigitalOcean App Platform
- **Avantages :** Performance, prix abordable
- **Configuration via `app.yaml`**

### Variables d'Environnement Backend

```env
# Base
NODE_ENV=production
PORT=3000

# Base de données
DATABASE_URL=postgresql://user:password@host:5432/amo_solution_btp

# Authentification
JWT_SECRET=your-super-secure-jwt-secret
JWT_REFRESH_SECRET=your-super-secure-refresh-secret

# Redis (sessions, cache)
REDIS_URL=redis://localhost:6379

# Stockage (MinIO/S3)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
MINIO_BUCKET_NAME=amo-documents

# Email (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## ⚙️ Configuration Netlify Avancée

### Headers de Sécurité

Les headers sont configurés dans `netlify.toml` :

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://your-backend-url.com"
```

### Redirections API

Les appels API sont automatiquement redirigés vers le backend :

```
/api/* https://your-backend-url.com/api/:splat 200
/* /index.html 200
```

## 🔍 Vérifications Post-Déploiement

### 1. Tests Frontend
```bash
# Vérifier que le site fonctionne
curl -I https://your-site-name.netlify.app

# Tester les routes principales
curl https://your-site-name.netlify.app/login
curl https://your-site-name.netlify.app/dashboard
```

### 2. Tests Backend
```bash
# Health check
curl https://your-backend-url.com/health

# Test auth
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@amo-solution.com","password":"Admin123!@#"}'
```

### 3. Tests de Connectivité Frontend-Backend
```bash
# Depuis le frontend déployé
curl https://your-site-name.netlify.app/api/health
```

## 🚨 Résolution de Problèmes

### Erreurs de Build Communes

1. **Module non trouvé**
   ```bash
   # Nettoyer et réinstaller
   rm -rf frontend/node_modules frontend/package-lock.json
   npm install
   ```

2. **Erreurs TypeScript**
   ```bash
   # Vérifier les types
   cd frontend && npm run type-check
   ```

3. **Erreurs ESLint**
   ```bash
   # Fix automatique
   cd frontend && npm run lint:fix
   ```

### Erreurs de Déploiement

1. **Variables d'environnement manquantes**
   - Vérifier dans Netlify Dashboard > Site settings > Environment variables

2. **Erreurs de redirection API**
   - Vérifier l'URL backend dans les variables d'environnement
   - Tester manuellement l'endpoint backend

3. **Erreurs 404 sur les routes SPA**
   - Vérifier que `_redirects` est présent dans `frontend/public/`

## 📊 Monitoring et Analytics

### Netlify Analytics
- Activer dans les paramètres du site
- Voir les statistiques de trafic et performance

### Monitoring Backend
- Configurer des alertes sur votre plateforme backend
- Surveiller les logs d'erreur
- Monitorer la base de données

## 🔄 Déploiements Continus

### GitHub Actions (Optionnel)

Configuration dans `.github/workflows/deploy.yml` pour des déploiements plus avancés avec tests automatisés.

### Branches de Déploiement

- `main` → Production (auto-deploy)
- `develop` → Preview deploys sur Netlify
- `feature/*` → Deploy previews sur Netlify

## 🔐 Sécurité

### Avant Production

1. **Changer tous les mots de passe par défaut**
2. **Configurer HTTPS uniquement**
3. **Activer les CORS correctement**
4. **Configurer les headers de sécurité**
5. **Vérifier les variables d'environnement**

### Checklist Sécurité

- [ ] JWT secrets changés
- [ ] Mots de passe DB sécurisés
- [ ] CORS configurés
- [ ] Headers de sécurité activés
- [ ] HTTPS forcé
- [ ] Variables sensibles dans l'environnement uniquement

---

## 📞 Support

En cas de problème, vérifiez :

1. **Logs Netlify :** Site dashboard > Deploys > Build log
2. **Logs Backend :** Selon votre plateforme de déploiement
3. **Console Browser :** F12 pour voir les erreurs JavaScript
4. **Network Tab :** Vérifier les appels API

Pour plus d'aide, consultez :
- [Documentation Netlify](https://docs.netlify.com/)
- [Documentation NestJS Deployment](https://docs.nestjs.com/recipes/deployment)