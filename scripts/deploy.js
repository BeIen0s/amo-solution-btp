#!/usr/bin/env node

/**
 * Script CLI de déploiement pour A.M.O Solution BTP
 * Facilite le déploiement et la configuration
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Couleurs pour les messages
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  title: (msg) => console.log(`${colors.magenta}🚀 ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.cyan}📋 ${msg}${colors.reset}`)
};

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  log.title('Déploiement A.M.O Solution BTP');
  console.log('=====================================\n');

  try {
    // 1. Vérification de l'environnement
    log.step('1. Vérification de l\'environnement...');
    await checkEnvironment();

    // 2. Choix du type de déploiement
    log.step('2. Type de déploiement');
    const deployType = await question(
      'Que souhaitez-vous déployer ?\n' +
      '1) Frontend uniquement (Netlify)\n' +
      '2) Backend uniquement\n' +
      '3) Frontend + Backend (complet)\n' +
      '4) Tests et validation\n' +
      'Votre choix (1-4): '
    );

    switch (deployType.trim()) {
      case '1':
        await deployFrontend();
        break;
      case '2':
        await deployBackend();
        break;
      case '3':
        await deployFull();
        break;
      case '4':
        await runTests();
        break;
      default:
        log.error('Option invalide');
        process.exit(1);
    }

  } catch (error) {
    log.error(`Erreur durant le déploiement: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

async function checkEnvironment() {
  // Vérifier Node.js
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    log.success(`Node.js ${nodeVersion} détecté`);
  } catch {
    log.error('Node.js non trouvé');
    process.exit(1);
  }

  // Vérifier npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    log.success(`npm ${npmVersion} détecté`);
  } catch {
    log.error('npm non trouvé');
    process.exit(1);
  }

  // Vérifier Git
  try {
    const gitVersion = execSync('git --version', { encoding: 'utf8' }).trim();
    log.success(`${gitVersion} détecté`);
  } catch {
    log.warning('Git non trouvé - déploiement manuel requis');
  }

  // Vérifier la structure du projet
  const requiredDirs = ['frontend', 'backend', 'scripts'];
  for (const dir of requiredDirs) {
    if (!fs.existsSync(dir)) {
      log.error(`Répertoire ${dir} manquant`);
      process.exit(1);
    }
  }
  log.success('Structure du projet validée');
}

async function deployFrontend() {
  log.title('Déploiement Frontend');
  
  // Vérifier les variables d'environnement
  const envFile = path.join('frontend', '.env.production');
  if (!fs.existsSync(envFile)) {
    log.warning('.env.production manquant');
    const createEnv = await question('Créer le fichier .env.production ? (y/N): ');
    if (createEnv.toLowerCase() === 'y') {
      await createProductionEnv();
    }
  }

  // Build du frontend
  log.step('Build du frontend...');
  try {
    execSync('npm run build:netlify', { cwd: 'frontend', stdio: 'inherit' });
    log.success('Build frontend terminé');
  } catch (error) {
    log.error('Erreur durant le build frontend');
    throw error;
  }

  // Instructions Netlify
  console.log('\n📋 Instructions pour Netlify:');
  console.log('1. Visitez https://app.netlify.com/');
  console.log('2. Cliquez sur "New site from Git"');
  console.log('3. Connectez votre repository GitHub');
  console.log('4. Configuration:');
  console.log('   - Branch: main');
  console.log('   - Build command: cd frontend && npm run build');
  console.log('   - Publish directory: frontend/dist');
  console.log('5. Ajoutez les variables d\'environnement depuis .env.production');
}

async function deployBackend() {
  log.title('Déploiement Backend');
  
  const platform = await question(
    'Choisissez la plateforme backend:\n' +
    '1) Railway (recommandé)\n' +
    '2) Heroku\n' +
    '3) DigitalOcean\n' +
    '4) Instructions manuelles\n' +
    'Votre choix (1-4): '
  );

  switch (platform.trim()) {
    case '1':
      await deployToRailway();
      break;
    case '2':
      await deployToHeroku();
      break;
    case '3':
      await deployToDigitalOcean();
      break;
    case '4':
      showManualInstructions();
      break;
    default:
      log.error('Option invalide');
  }
}

async function deployToRailway() {
  log.step('Configuration Railway...');
  
  // Vérifier Railway CLI
  try {
    execSync('railway --version', { encoding: 'utf8' });
    log.success('Railway CLI détecté');
  } catch {
    log.warning('Railway CLI non trouvé');
    console.log('Installez avec: npm install -g @railway/cli');
    console.log('Puis: railway login');
    return;
  }

  console.log('\n📋 Instructions Railway:');
  console.log('1. railway login');
  console.log('2. railway init');
  console.log('3. railway add --database postgresql');
  console.log('4. railway add --database redis');
  console.log('5. railway up');
  
  const deployNow = await question('Déployer maintenant ? (y/N): ');
  if (deployNow.toLowerCase() === 'y') {
    try {
      log.step('Déploiement sur Railway...');
      execSync('railway up', { cwd: 'backend', stdio: 'inherit' });
      log.success('Déployé sur Railway');
    } catch (error) {
      log.error('Erreur durant le déploiement Railway');
      throw error;
    }
  }
}

async function deployToHeroku() {
  log.step('Configuration Heroku...');
  
  try {
    execSync('heroku --version', { encoding: 'utf8' });
    log.success('Heroku CLI détecté');
  } catch {
    log.warning('Heroku CLI non trouvé');
    console.log('Installez depuis: https://devcenter.heroku.com/articles/heroku-cli');
    return;
  }

  const appName = await question('Nom de l\'app Heroku: ');
  
  console.log('\n📋 Instructions Heroku:');
  console.log(`1. heroku create ${appName}`);
  console.log(`2. heroku addons:create heroku-postgresql:hobby-dev -a ${appName}`);
  console.log(`3. heroku addons:create heroku-redis:hobby-dev -a ${appName}`);
  console.log(`4. git push heroku main`);
  
  const deployNow = await question('Exécuter ces commandes ? (y/N): ');
  if (deployNow.toLowerCase() === 'y') {
    try {
      execSync(`heroku create ${appName}`, { stdio: 'inherit' });
      execSync(`heroku addons:create heroku-postgresql:hobby-dev -a ${appName}`, { stdio: 'inherit' });
      execSync(`heroku addons:create heroku-redis:hobby-dev -a ${appName}`, { stdio: 'inherit' });
      execSync('git push heroku main', { stdio: 'inherit' });
      log.success('Déployé sur Heroku');
    } catch (error) {
      log.error('Erreur durant le déploiement Heroku');
      throw error;
    }
  }
}

async function deployToDigitalOcean() {
  console.log('\n📋 Instructions DigitalOcean App Platform:');
  console.log('1. Visitez https://cloud.digitalocean.com/apps');
  console.log('2. Cliquez sur "Create App"');
  console.log('3. Connectez votre repository GitHub');
  console.log('4. Configurez:');
  console.log('   - Source Directory: /backend');
  console.log('   - Build Command: npm run build');
  console.log('   - Run Command: npm start');
  console.log('5. Ajoutez une base PostgreSQL');
  console.log('6. Configurez les variables d\'environnement');
}

async function deployFull() {
  log.title('Déploiement Complet');
  await deployFrontend();
  console.log('\n');
  await deployBackend();
  
  log.success('Déploiement complet terminé !');
  console.log('\n📋 Étapes finales:');
  console.log('1. Mettez à jour l\'URL backend dans les variables Netlify');
  console.log('2. Testez la connectivité frontend-backend');
  console.log('3. Configurez les domaines personnalisés si nécessaire');
}

async function runTests() {
  log.title('Tests et Validation');
  
  // Tests frontend
  log.step('Tests frontend...');
  try {
    execSync('npm test', { cwd: 'frontend', stdio: 'inherit' });
    log.success('Tests frontend réussis');
  } catch (error) {
    log.warning('Certains tests frontend ont échoué');
  }

  // Tests backend
  log.step('Tests backend...');
  try {
    execSync('npm test', { cwd: 'backend', stdio: 'inherit' });
    log.success('Tests backend réussis');
  } catch (error) {
    log.warning('Certains tests backend ont échoué');
  }

  // Build test
  log.step('Test de build...');
  try {
    execSync('npm run build', { cwd: 'frontend', stdio: 'inherit' });
    log.success('Build de test réussi');
  } catch (error) {
    log.error('Build de test échoué');
    throw error;
  }
}

async function createProductionEnv() {
  const backendUrl = await question('URL du backend (ex: https://api.example.com): ');
  
  const envContent = `NODE_ENV=production
VITE_API_URL=${backendUrl}
VITE_APP_NAME=A.M.O Solution BTP
VITE_APP_VERSION=1.0.0
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
`;

  fs.writeFileSync(path.join('frontend', '.env.production'), envContent);
  log.success('.env.production créé');
}

function showManualInstructions() {
  console.log('\n📋 Instructions de déploiement manuel:');
  console.log('1. Buildez l\'application: npm run build');
  console.log('2. Configurez votre serveur (Node.js 18+)');
  console.log('3. Installez PostgreSQL et Redis');
  console.log('4. Configurez les variables d\'environnement');
  console.log('5. Déployez les fichiers sur votre serveur');
  console.log('6. Démarrez avec: npm start');
  console.log('\nConsultez DEPLOYMENT.md pour plus de détails');
}

if (require.main === module) {
  main();
}