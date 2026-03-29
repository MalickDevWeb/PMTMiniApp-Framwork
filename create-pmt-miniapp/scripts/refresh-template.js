const fs = require('node:fs');
const path = require('node:path');

const racineCli = path.resolve(__dirname, '..');
const sourceStarter = path.resolve(racineCli, '..', 'from-scratch-app');
const cibleTemplate = path.join(racineCli, 'templates', 'framework-starter');

const exclusions = new Set([
  'project.private.config.json',
]);

function copier(source, cible) {
  const stats = fs.statSync(source);

  if (stats.isDirectory()) {
    fs.mkdirSync(cible, { recursive: true });
    const elements = fs.readdirSync(source);

    elements.forEach((element) => {
      if (exclusions.has(element)) return;
      copier(path.join(source, element), path.join(cible, element));
    });
    return;
  }

  fs.copyFileSync(source, cible);
}

function main() {
  if (!fs.existsSync(sourceStarter)) {
    throw new Error(`starter source introuvable: ${sourceStarter}`);
  }

  fs.rmSync(cibleTemplate, { recursive: true, force: true });
  fs.mkdirSync(cibleTemplate, { recursive: true });
  copier(sourceStarter, cibleTemplate);

  console.log(`[refresh-template] template regenere depuis ${sourceStarter}`);
}

main();
