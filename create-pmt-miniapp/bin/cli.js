#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function afficherAide() {
  console.log(`
Usage:
  npx create-pmtminiapp <nom-projet>
  npm create pmtminiapp <nom-projet>

Options:
  --no-install    copie le starter sans lancer npm install
  --help          affiche cette aide
`.trim());
}

function normaliserNomProjet(valeur) {
  const brut = typeof valeur === 'string' ? valeur.trim() : '';
  if (!brut) return 'pmtminiapp';

  return brut
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'pmtminiapp';
}

function lireArguments(argv) {
  const args = argv.slice(2);
  const aideDemandee = args.includes('--help') || args.includes('-h');
  const sansInstallation = args.includes('--no-install') || args.includes('--skip-install');
  const nomBrut = args.find((arg) => !arg.startsWith('-')) || 'pmtminiapp';

  return {
    aideDemandee,
    sansInstallation,
    nomProjet: normaliserNomProjet(nomBrut),
  };
}

function copierDossier(source, cible) {
  fs.cpSync(source, cible, {
    recursive: true,
    force: false,
    errorOnExist: true,
  });
}

function personnaliserPackageJson(cibleProjet, nomProjet) {
  const cheminPackage = path.join(cibleProjet, 'package.json');
  if (!fs.existsSync(cheminPackage)) return;

  const contenu = JSON.parse(fs.readFileSync(cheminPackage, 'utf8'));
  contenu.name = nomProjet;
  fs.writeFileSync(cheminPackage, `${JSON.stringify(contenu, null, 2)}\n`);
}

function personnaliserReadme(cibleProjet, nomProjet) {
  const cheminReadme = path.join(cibleProjet, 'README.md');
  if (!fs.existsSync(cheminReadme)) return;

  const contenu = fs.readFileSync(cheminReadme, 'utf8');
  const remplace = contenu.replace(/^# .+$/m, `# ${nomProjet}`);
  fs.writeFileSync(cheminReadme, remplace);
}

function lancerCommande(commande, args, cwd) {
  const resultat = spawnSync(commande, args, {
    cwd,
    stdio: 'inherit',
  });

  return typeof resultat.status === 'number' ? resultat.status : 1;
}

function lancerInstallation(cibleProjet) {
  const commandeNpm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  return lancerCommande(commandeNpm, ['install'], cibleProjet);
}

function lancerSynchronisation(cibleProjet) {
  return lancerCommande(process.execPath, ['scripts/syncAppPages.js'], cibleProjet);
}

function main() {
  const { aideDemandee, sansInstallation, nomProjet } = lireArguments(process.argv);
  if (aideDemandee) {
    afficherAide();
    return;
  }

  const racineCli = path.resolve(__dirname, '..');
  const templateDir = path.join(racineCli, 'templates', 'framework-starter');
  const cibleProjet = path.resolve(process.cwd(), nomProjet);

  if (!fs.existsSync(templateDir)) {
    console.error('[create-pmtminiapp] template introuvable. Lance `npm run refresh:template`.');
    process.exit(1);
  }

  if (fs.existsSync(cibleProjet) && fs.readdirSync(cibleProjet).length > 0) {
    console.error(`[create-pmtminiapp] le dossier "${nomProjet}" existe deja et n'est pas vide.`);
    process.exit(1);
  }

  console.log(`[create-pmtminiapp] creation du projet ${nomProjet}...`);
  copierDossier(templateDir, cibleProjet);
  personnaliserPackageJson(cibleProjet, nomProjet);
  personnaliserReadme(cibleProjet, nomProjet);

  const statutSync = lancerSynchronisation(cibleProjet);
  if (statutSync !== 0) {
    console.error('[create-pmtminiapp] echec de synchronisation du starter.');
    process.exit(statutSync);
  }

  if (!sansInstallation) {
    console.log('[create-pmtminiapp] installation des dependances...');
    const statutInstallation = lancerInstallation(cibleProjet);
    if (statutInstallation !== 0) {
      console.error('[create-pmtminiapp] echec de npm install.');
      process.exit(statutInstallation);
    }
  }

  console.log('');
  console.log('[create-pmtminiapp] projet cree avec succes.');
  console.log('');
  console.log(`Prochaines etapes :`);
  console.log(`  cd ${nomProjet}`);
  if (sansInstallation) {
    console.log('  npm install');
  }
  console.log('  npm run framework:ready');
  console.log('  Ouvrir le projet dans WeChat DevTools');
}

main();
