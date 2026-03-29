# PMTMiniApp-Framework

Framework WeChat Mini Program pour demarrer vite avec une base claire, reutilisable et deja structuree.

Ce depot contient 2 parties :

- `create-pmt-miniapp` : le generateur recommande pour creer un nouveau projet rapidement
- `from-scratch-app` : le starter complet du framework

## Demarrage rapide

La methode la plus simple pour commencer est d'utiliser le generateur :

```bash
npx create-pmtminiapp mon-app
cd mon-app
```

ou

```bash
npm create pmtminiapp mon-app
cd mon-app
```

Ensuite :

1. ouvrez le dossier `mon-app` dans WeChat DevTools
2. activez `Enable Custom Processing Commands` une seule fois
3. cliquez sur `Compile`

Le framework synchronise automatiquement le routage avant la compilation.

## Pre-requis

Installez avant tout :

- Node.js `>= 18`
- npm
- WeChat DevTools

Verifiez votre environnement :

```bash
node -v
npm -v
```

Si vous etes sur Linux et que vous voulez l'installateur prepare pour ce projet :

- `PMTMiniApp Dev Tools` : `https://github.com/MalickDevWeb/PMTMiniApp-Dev-Tools/releases`

## Comment creer un projet

### Option recommandee

Utilisez le CLI :

```bash
npx create-pmtminiapp mon-app
```

Ce que fait cette commande :

- copie le starter officiel
- remplace le nom du projet
- synchronise les pages vers `app.json`
- lance `npm install`

Si vous voulez creer le projet sans installer les dependances tout de suite :

```bash
npx create-pmtminiapp mon-app --no-install
```

### Option framework complet

Si vous voulez travailler directement sur la base complete du framework :

```bash
cd from-scratch-app
npm install
```

Puis ouvrez `from-scratch-app` dans WeChat DevTools.

## Initialisation dans WeChat DevTools

Une fois le projet ouvert :

1. ouvrez les reglages de WeChat DevTools
2. activez `Enable Custom Processing Commands`
3. revenez sur le projet
4. cliquez sur `Compile`

Pourquoi :

- `beforeCompile`
- `beforePreview`
- `beforeUpload`

peuvent lancer automatiquement :

```bash
node scripts/syncAppPages.js
```

Cela garde `app.json` synchronise avec `routage/routes.json`.

## Commandes utiles

Depuis la racine d'un projet genere ou depuis `from-scratch-app` :

### Synchroniser les pages

```bash
npm run sync:pages
```

### Synchroniser en mode watch

```bash
npm run sync:pages:watch
```

### Verifier la configuration de navigation

```bash
npm run doctor
```

ou

```bash
npm run doctor:navigation
```

### Lancer tous les checks

```bash
npm run check
```

### Preparer completement le framework

```bash
npm run framework:ready
```

Cette commande lance :

1. la synchronisation des pages
2. le diagnostic navigation
3. les tests du framework

## Workflow conseille

Pour un developpement rapide :

1. creez un projet avec `npx create-pmtminiapp mon-app`
2. ouvrez `mon-app` dans WeChat DevTools
3. modifiez vos routes dans `routage/routes.json`
4. cliquez sur `Compile`
5. utilisez `npm run check` avant de valider vos changements

## Fichiers importants

Dans un projet PMTMiniApp, retenez surtout :

- `routage/routes.json` : source de verite des routes
- `app.json` : genere et synchronise
- `core/app-services/serviceApp.js` : acces recommande aux services applicatifs
- `scripts/syncAppPages.js` : synchronisation du routage
- `project.config.json` : configuration WeChat DevTools

## Quand utiliser chaque dossier

### `create-pmt-miniapp`

A utiliser si vous voulez :

- creer une nouvelle mini-app rapidement
- partir d'une base propre
- automatiser la structure initiale

### `from-scratch-app`

A utiliser si vous voulez :

- etudier la structure complete du framework
- modifier le starter de reference
- travailler sur le coeur du framework

## Liens utiles

- generateur de projet : [create-pmt-miniapp](create-pmt-miniapp)
- starter du framework : [from-scratch-app](from-scratch-app)
- installateur Linux pour DevTools : `https://github.com/MalickDevWeb/PMTMiniApp-Dev-Tools/releases`
