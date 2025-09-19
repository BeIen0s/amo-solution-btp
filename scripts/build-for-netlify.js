#!/usr/bin/env node

/**
 * Script de build optimisé pour Netlify
 * Optimise le build React pour la production
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Début du build pour Netlify...');

const frontendDir = path.join(__dirname, '..', 'frontend');
const distDir = path.join(frontendDir, 'dist');

try {
  // 1. Nettoyer le répertoire de build précédent
  console.log('🧹 Nettoyage des builds précédents...');
  if (fs.existsSync(distDir)) {
    execSync(`rm -rf "${distDir}"`, { stdio: 'inherit' });
  }

  // 2. Installer les dépendances si nécessaire
  console.log('📦 Vérification des dépendances...');
  const nodeModulesExists = fs.existsSync(path.join(frontendDir, 'node_modules'));
  if (!nodeModulesExists) {
    console.log('📥 Installation des dépendances...');
    execSync('npm ci', { cwd: frontendDir, stdio: 'inherit' });
  }

  // 3. Vérification TypeScript
  console.log('🔍 Vérification TypeScript...');
  execSync('npm run type-check', { cwd: frontendDir, stdio: 'inherit' });

  // 4. Lint du code
  console.log('🎨 Vérification du code (ESLint)...');
  try {
    execSync('npm run lint', { cwd: frontendDir, stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️ Avertissements ESLint détectés, mais le build continue...');
  }

  // 5. Build de production
  console.log('🏗️ Build de production...');
  execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

  // 6. Optimisations post-build
  console.log('⚡ Optimisations post-build...');
  
  // Créer un fichier de version
  const packageJson = JSON.parse(fs.readFileSync(path.join(frontendDir, 'package.json'), 'utf8'));
  const versionInfo = {
    version: packageJson.version,
    buildDate: new Date().toISOString(),
    gitCommit: process.env.COMMIT_REF || 'unknown'
  };
  
  fs.writeFileSync(
    path.join(distDir, 'version.json'),
    JSON.stringify(versionInfo, null, 2)
  );

  // Créer un fichier robots.txt si il n'existe pas
  const robotsPath = path.join(distDir, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    const robotsContent = `User-agent: *
Allow: /
Sitemap: ${process.env.URL || 'https://amo-solution-btp.netlify.app'}/sitemap.xml`;
    fs.writeFileSync(robotsPath, robotsContent);
  }

  // 7. Statistiques du build
  console.log('📊 Statistiques du build :');
  const stats = getDirectoryStats(distDir);
  console.log(`   📁 Fichiers total: ${stats.files}`);
  console.log(`   📏 Taille total: ${formatBytes(stats.size)}`);

  console.log('✅ Build terminé avec succès !');
  console.log(`📂 Fichiers générés dans : ${distDir}`);

} catch (error) {
  console.error('❌ Erreur durant le build :');
  console.error(error.message);
  process.exit(1);
}

/**
 * Obtenir les statistiques d'un répertoire
 */
function getDirectoryStats(dir) {
  let files = 0;
  let size = 0;

  function traverseDirectory(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverseDirectory(fullPath);
      } else {
        files++;
        size += stat.size;
      }
    }
  }

  traverseDirectory(dir);
  return { files, size };
}

/**
 * Formater les bytes en format lisible
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}