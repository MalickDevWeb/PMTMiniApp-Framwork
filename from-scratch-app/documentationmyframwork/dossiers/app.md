# Dossier `app`

## Rôle de `app.js`
`app.js` démarre l'application.

Son rôle doit rester minimal :
- enregistrer l'application avec `App(...)`
- appeler un bootstrap dédié

La vraie composition ne vit plus dans `app.js`.

Elle vit maintenant dans :
- `core/app-bootstrap/creerDefinitionApp.js`
- `core/app-bootstrap/creerNoyauApp.js`
- `core/app-bootstrap/pageEntreeDemarrage.shared.js`

Exemple actuel :
```js
const {
  creerDefinitionApp,
  creerNoyauApp,
} = require('./core/app-bootstrap/index')

App(
  creerDefinitionApp({
    initialiserNoyau: creerNoyauApp,
  })
)
```

## Au démarrage, l'application fait quoi ?
Le bootstrap fait cet ordre :
1. prépare `globalData`
2. crée un nouveau `noyau`
3. place `noyau` dans `globalData.noyau`
4. crée `gestionnaireEtat`
5. crée `utilisateurService`
6. crée `compteService`
7. crée `profilService`
8. crée `storage`
9. crée `sessionService`
10. crée `apiService`
11. crée les services storage simples
12. crée `authService`
13. crée `navigation`
14. stocke tout dans `globalData.noyau.services`
15. lance un service dédié de restauration

Dans l'état actuel du projet, `creerNoyauApp.js` branche `authService` avec la stratégie `local`.

## Pourquoi cette séparation ?
Parce que `app.js` ne doit pas devenir un gros fichier métier.

La règle est :
- `app.js` = point d'entrée
- `core/app-bootstrap` = composition de l'application
- `core/app-services/serviceApp.js` = accès simple depuis les pages

Donc :
- le démarrage reste clair
- le framework est plus facile à maintenir
- une app métier peut remplacer seulement son bootstrap sans salir `app.js`

## Ce que les pages récupèrent ensuite
Les pages ne créent pas les services.

Elles récupèrent seulement les services déjà injectés par le bootstrap.

Exemple :
```js
const { serviceApp } = require('../../core/app-services/serviceApp')
const {
  profilService,
  utilisateurService,
  compteService,
  authService,
  apiService,
  storage,
  sessionService,
  sessionStorageService,
  profilStorageService,
  navigation,
} = serviceApp()
```

## Les services injectés
`creerNoyauApp.js` injecte :
- `gestionnaireEtat`
- `profilService`
- `utilisateurService`
- `compteService`
- `authService`
- `apiService`
- `storage`
- `sessionService`
- `sessionStorageService`
- `profilStorageService`
- `navigation`

Puis il utilise en interne :
- `restaurationStorageService`

Les services storage viennent maintenant de dossiers dédiés :
- `core/storage/session`
- `core/storage/simples`

## Exemple simple de bootstrap
```js
function creerNoyauApp() {
  const noyau = creerNoyau()
  const serviceEtat = gestionnaireEtat(noyau)
  const utilisateurService = creerUtilisateurService(serviceEtat)
  const compteService = creerCompteService(serviceEtat)
  const storage = serviceStorage({
    allowedKeys: Object.values(clesStorage),
  })

  // composition des services
  // injection dans noyau.services
  // lancement de la restauration

  return noyau
}
```

## Règle à retenir
- `app.js` initialise
- `core/app-bootstrap` prépare
- les pages utilisent
- les pages ne recréent pas les services

## Fichiers liés
- `app.js`
- `core/app-bootstrap`
- `core/noyau/noyau.js`
- `core/gestion-etats`
- `core/auth`
- `core/api-layer`
- `core/storage`
- `core/storage/restaurationStorageService.js`
- `core/navigation`
- `core/app-services/serviceApp.js`
