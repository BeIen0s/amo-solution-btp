# 🚀 Guide Rapide - Déployer sur Netlify

## Étape 1 : Pousser le code sur GitHub

Votre code est déjà prêt et configuré ! Poussez-le sur GitHub :

```bash
git push origin master
```

*(ou `main` selon votre branche par défaut)*

## Étape 2 : Créer un compte Netlify

1. Allez sur : **https://app.netlify.com/**
2. Cliquez sur **"Sign up"**
3. Choisissez **"GitHub"** pour vous connecter avec votre compte GitHub
4. Autorisez Netlify à accéder à vos repositories

## Étape 3 : Connecter votre repository

1. Une fois connecté, cliquez sur **"New site from Git"**
2. Choisissez **"GitHub"** comme provider
3. Sélectionnez votre repository **`amo-solution-btp`**
4. Configurer les paramètres de build :

```
Branch to deploy: master
Build command: cd frontend && npm run build
Publish directory: frontend/dist
```

## Étape 4 : Variables d'environnement

Dans les paramètres Netlify (Site settings > Environment variables), ajoutez :

```
NODE_ENV=production
VITE_API_URL=https://votre-backend-url.com
VITE_APP_NAME=A.M.O Solution BTP
VITE_APP_VERSION=1.0.0
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
```

*(Pour l'instant, utilisez une URL temporaire pour VITE_API_URL)*

## Étape 5 : Déployer

1. Cliquez sur **"Deploy site"**
2. Netlify va :
   - Cloner votre repository
   - Installer les dépendances (`npm install`)
   - Construire l'application (`npm run build`)
   - Déployer les fichiers statiques

## 🎯 Configuration Automatique

Votre projet contient déjà :

✅ **`netlify.toml`** - Configuration automatique de Netlify  
✅ **`frontend/public/_redirects`** - Redirections pour SPA et API  
✅ **Headers de sécurité** - Protection HTTPS, XSS, etc.  
✅ **Variables d'environnement** - Fichier `.env.production` prêt  

## 📱 Résultat

Après le déploiement, vous obtiendrez :
- Une URL Netlify : `https://random-name-123456.netlify.app`
- Déploiement automatique à chaque push sur `master`
- HTTPS activé par défaut
- Redirections API fonctionnelles (vers `/api/*`)

## 🔄 Étapes Suivantes

1. **Déployer le backend** sur Railway/Heroku
2. **Mettre à jour** `VITE_API_URL` avec l'URL réelle du backend
3. **Configurer un domaine personnalisé** (optionnel)

## 🚨 Problèmes Courants

**Build Failed ?**
- Vérifiez les logs dans Netlify Dashboard > Deploys
- Assurez-vous que `frontend/package.json` est correct

**404 sur les routes ?**
- Le fichier `_redirects` devrait résoudre cela automatiquement

**API non accessible ?**
- Vérifiez que `VITE_API_URL` est correctement configuré
- Le backend doit être déployé et accessible

---

🎉 **Votre application sera en ligne en quelques minutes !**