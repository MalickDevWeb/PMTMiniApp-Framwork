# PMTMiniApp

Framework Mini Program structuré autour de 7 briques :
- `navigation`
- `gestion-etats`
- `storage`
- `auth`
- `api-layer`
- `app-services`
- `components`

Ce fichier est le point d'entrée pour un développeur qui clone le projet.

## Statut
- version courante : `1.0.0`
- niveau : base stable de framework interne Mini Program
- point de démonstration : route `frameworkDemo`
- starter officiel : `PMTMiniApp`
- CLI de création : package `create-pmtminiapp`
- CI : `.github/workflows/pmtminiapp-ci.yml`

## Pré-requis

### Systèmes supportés
- Windows
- macOS
- Linux

### Outils
- Node.js `>= 18`
- npm
- WeChat DevTools

### Réglage WeChat DevTools
Dans WeChat DevTools, active une fois :
- `Enable Custom Processing Commands`

Ce réglage permet d'exécuter automatiquement :
- `beforeCompile`
- `beforePreview`
- `beforeUpload`

Ces hooks lancent :
- `node scripts/syncAppPages.js`

## Démarrage rapide

### 1. Installer les dépendances du poste
Vérifie simplement que `node` est disponible :

```bash
node -v
npm -v
```

### 2. Ouvrir le projet dans WeChat DevTools
Ouvre le dossier :
- `PMTMiniApp`

### 3. Compiler
Clique sur :
- `Compile`

La synchronisation du routage vers `app.json` se fait automatiquement avant compilation.

## Créer une nouvelle application

Le framework peut aussi être généré comme starter via le CLI :

```bash
npx create-pmtminiapp mon-app
```

ou

```bash
npm create pmtminiapp mon-app
```

Le CLI :
- copie le starter officiel
- personnalise le nom du projet
- synchronise le routage
- lance `npm install`

## Flux développeur

### Modifier les routes
Le seul fichier à modifier est :
- `routage/routes.json`

Puis :
- `Compile` dans WeChat DevTools
- ou `npm run sync:pages`

Références :
- `routage/README.md`
- `documentationmyframwork/dossiers/navigation.md`

### Utiliser les services dans une page
Le point d'accès recommandé est :
- `core/app-services/serviceApp.js`

Exemple :
```js
const {
  serviceApp,
  attendreInitialisationApp,
} = require('../../core/app-services/serviceApp')

const {
  profilService,
  sessionService,
  utilisateurService,
  compteService,
  authService,
  apiService,
  profilStorageService,
  navigation,
} = serviceApp()
```

Références :
- `documentationmyframwork/dossiers/pages.md`
- `documentationmyframwork/dossiers/lifecycle.md`
- `documentationmyframwork/dossiers/gestion-etat.md`
- `documentationmyframwork/dossiers/storage.md`
- `documentationmyframwork/dossiers/auth.md`
- `documentationmyframwork/dossiers/api-layer.md`
- `documentationmyframwork/dossiers/composants.md`

### Vérifier le projet
Commandes utiles :
- `npm run framework:ready`
- `npm run doctor`
- `npm run check`
- `npm run doctor:navigation`
- `npm run check:navigation`
- `npm run check:etat`
- `npm run check:storage`
- `npm run check:api`

## Structure principale
- `core/navigation` : résolution des routes et service de navigation
- `core/gestion-etats` : état global et services métier d'état
- `core/storage` : persistance locale et session
- `core/auth` : façade d'authentification locale ou API
- `core/api-layer` : client HTTP central
- `core/noyau` : conteneur global de l'application
- `core/app-services` : accès simplifié aux services depuis les pages
- `components` : composants UI réutilisables
- `routage` : source de vérité des routes

## Documentation architecture
- `documentationmyframwork/dossiers/api-publique.md`
- `documentationmyframwork/dossiers/core.md`
- `documentationmyframwork/dossiers/app.md`
- `documentationmyframwork/dossiers/noyau.md`
- `documentationmyframwork/README.md`

## Fichiers projet utiles
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `RELEASING.md`
