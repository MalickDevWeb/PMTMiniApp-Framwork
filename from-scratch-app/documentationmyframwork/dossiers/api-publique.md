# API publique du framework

## Objectif
Dire clairement à une équipe quels fichiers sont stables à utiliser sans ouvrir toute l'implémentation.

## Points d'entrée stables

### Navigation
- `core/navigation/index.js`

API exposée :
- `serviceNavigation`
- `resoudrePage`
- `routesNavigation`
- `pageEntreeNavigation`

### Gestion d'état
- `core/gestion-etats/index.js`

API exposée :
- `gestionnaireEtat`
- `creerProfilService`
- `creerUtilisateurService`
- `creerCompteService`

### Storage
- `core/storage/index.js`

API exposée :
- `serviceStorage`
- `clesStorage`
- `creerSessionStorageService`
- `creerSessionService`
- `creerServicesStorageSimples`
- `creerProfilStorageService`
- `creerRestaurationStorageService`

### Auth
- `core/auth/index.js`

API exposée :
- `creerAuthService`
- `creerAuthApiService`
- `creerAuthLocalService`

### API layer
- `core/api-layer/index.js`

API exposée :
- `apiConfig`
- `authApiConfig`
- `serviceApi`
- `creerAuthApiClient`

### Services utilisables dans une page
- `core/app-services/serviceApp.js`

API recommandée :
- `serviceApp()`
- `attendreInitialisationApp()`

### Composants UI
- `components/ui/bouton-action`
- `components/ui/carte-section`
- `components/ui/champ-texte`
- `components/ui/barre-navigation`
- `components/ui/boite-dialogue`
- `components/ui/chargeur-page`
- `components/ui/message-action`
- `components/ui/etat-vide`

## Fichiers internes
Ces fichiers ne doivent pas être utilisés comme API d'équipe :
- `*.shared.js`
- `routes.runtime.js`
- `scripts/*`
- `debug/*`

## Règle simple
- une équipe importe depuis les fichiers d'entrée
- le framework garde ses détails internes derrière ces entrées
