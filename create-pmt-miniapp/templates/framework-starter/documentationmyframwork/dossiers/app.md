# Dossier `app`

## Rôle de `app.js`
`app.js` démarre l'application.

Son rôle est simple :
- créer le noyau global
- créer les services
- injecter les services dans `globalData.noyau.services`
- restaurer certaines données locales au démarrage

## Au démarrage, l'application fait quoi ?
Dans `onLaunch`, l'application fait cet ordre :
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

Dans l'état actuel du projet, `app.js` branche `authService` avec la stratégie `local`.

## Ce que les pages récupèrent ensuite
Les pages ne créent pas les services.

Elles récupèrent seulement les services déjà injectés par `app.js`.

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
`app.js` injecte :
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

## Exemple simple
```js
App({
  onLaunch() {
    this.globalData = this.globalData || {}
    this.globalData.noyau = creerNoyau()

    const dataGlobal = this.globalData.noyau
    const serviceEtat = gestionnaireEtat(dataGlobal)
    const utilisateurService = creerUtilisateurService(serviceEtat)
    const compteService = creerCompteService(serviceEtat)
    const storage = serviceStorage({
      allowedKeys: Object.values(clesStorage),
    })
    const sessionStorageService = creerSessionStorageService(storage)
    const sessionService = creerSessionService({
      etat: serviceEtat,
      sessionStorageService,
    })
    const apiService = serviceApi({
      baseUrl: apiConfig.baseUrl,
      timeoutMs: apiConfig.timeoutMs,
      sessionService,
    })
    const servicesStorageSimples = creerServicesStorageSimples(storage)
    const profilStorageService = servicesStorageSimples.profilStorageService || null
    const restaurationStorageService = creerRestaurationStorageService({
      etat: serviceEtat,
      sessionService,
      profilStorageService,
    })
    const authService = creerAuthService({
      strategie: apiConfig.authStrategy,
      sessionService,
      utilisateurService,
      compteService,
      apiClient: creerAuthApiClient(apiService, authApiConfig),
    })

    this.globalData.noyau.services.gestionnaireEtat = serviceEtat
    this.globalData.noyau.services.profilService = creerProfilService(utilisateurService)
    this.globalData.noyau.services.utilisateurService = utilisateurService
    this.globalData.noyau.services.compteService = compteService
    this.globalData.noyau.services.apiService = apiService
    this.globalData.noyau.services.storage = storage
    this.globalData.noyau.services.sessionStorageService = sessionStorageService
    this.globalData.noyau.services.sessionService = sessionService
    this.globalData.noyau.services.authService = authService
    Object.assign(this.globalData.noyau.services, servicesStorageSimples)
    this.globalData.noyau.services.navigation = serviceNavigation()

    this.globalData.noyau.meta.initialisationPromise = restaurationStorageService.restaurer()
  },
})
```

## Règle à retenir
- `app.js` prépare
- les pages utilisent
- les pages ne recréent pas les services

## Fichiers liés
- `app.js`
- `core/noyau/noyau.js`
- `core/gestion-etats`
- `core/auth`
- `core/api-layer`
- `core/storage`
- `core/storage/restaurationStorageService.js`
- `core/navigation`
- `core/app-services/serviceApp.js`
