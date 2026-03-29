# Dossier `noyau`

## C'est quoi le noyau ?
Le noyau est l'objet global partagé de l'application.

Il est placé ici :
```js
globalData.noyau
```

Il est recréé au démarrage de l'application.

## Il contient quoi ?
Le noyau contient 3 parties :
- `state`
- `listeners`
- `services`

## `state`
`state` contient les données globales.

Exemple :
```js
globalData.noyau.state
```

Dedans, on peut retrouver par exemple :
- `utilisateur.nom`

Mais dans une page, on ne lit pas `state` directement.

## `listeners`
`listeners` contient les abonnements.

Il sert au `gestionnaireEtat` pour savoir quels callbacks appeler quand une donnée change.

Dans une page, on ne modifie pas `listeners` directement.

## `services`
`services` contient les services injectés au démarrage.

Exemple :
- `gestionnaireEtat`
- `profilService`
- `storage`
- `sessionStorageService`
- `profilStorageService`
- `navigation`

Dans une page, c'est surtout cette partie qu'on utilise.

## Qui prépare le noyau ?
`app.js` prépare le noyau au lancement.

Exemple :
```js
this.globalData.noyau = creerNoyau()
```

Puis `app.js` ajoute les services dans :
```js
this.globalData.noyau.services
```

## Dans une page, on utilise quoi ?
Dans une page, on n'utilise pas le noyau directement.

On utilise :
```js
const { serviceApp } = require('../../core/app-services/serviceApp')
const { profilService, navigation } = serviceApp()
```

## Ce qu'il ne faut pas faire
À éviter dans une page :
- modifier `globalData.noyau.state` directement
- modifier `globalData.noyau.listeners` directement
- recréer les services à la main

## Règle à retenir
- `noyau` stocke
- `app.js` prépare
- les services utilisent
- les pages consomment les services

## Fichiers liés
- `core/noyau/noyau.js`
- `app.js`
- `core/gestion-etats`
- `core/navigation`
- `core/app-services/serviceApp.js`
