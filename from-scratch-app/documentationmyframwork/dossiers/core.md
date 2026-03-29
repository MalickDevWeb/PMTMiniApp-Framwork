# Dossier `core`

## Rôle de `core`
Le dossier `core` contient les briques centrales du projet.

Ce sont les briques que les pages utilisent, mais ne recréent pas.

## Ce qu'on trouve dans `core`
- `core/noyau`
- `core/gestion-etats`
- `core/auth`
- `core/api-layer`
- `core/navigation`
- `core/storage`
- `core/app-services`

À côté de `core`, le projet a aussi :
- `components`

## `core/noyau`
Rôle :
- stocker le noyau global de l'application

Contenu principal :
- `state`
- `listeners`
- `services`

Doc simple :
- `dossiers/noyau.md`

## `core/gestion-etats`
Rôle :
- gérer l'état global
- lire les données
- modifier les données
- écouter les changements

Exemples :
- `gestionnaireEtat`
- `profilService`
- `utilisateurService`
- `compteService`

Doc simple :
- `dossiers/gestion-etat.md`

## `core/auth`
Rôle :
- ouvrir une session
- restaurer une session depuis l'API
- fermer une session

Exemple :
- `authService`

Doc simple :
- `dossiers/auth.md`

## `core/api-layer`
Rôle :
- centraliser les appels HTTP
- ajouter le token automatiquement
- normaliser les erreurs API

Exemple :
- `apiService`

Doc simple :
- `dossiers/api-layer.md`

## `core/navigation`
Rôle :
- centraliser la navigation
- utiliser des noms de routes lisibles
- éviter la navigation directe avec `wx.*`

Doc simple :
- `dossiers/navigation.md`

Les routes visibles du projet sont dans :
- `routage/routes.json`

## `core/storage`
Rôle :
- sauvegarder des données localement
- relire ces données plus tard
- nettoyer des anciennes clés si besoin
- exposer des services métier simples pour les cas fréquents

Structure :
- l'infra commune reste dans `core/storage`
- les cas spéciaux ont leur dossier
- les clés simples passent par `core/storage/simples`
- exemple spécial actuel : `core/storage/session`

Doc simple :
- `dossiers/storage.md`

## `core/app-services`
Rôle :
- récupérer simplement les services injectés par `app.js`

Exemple :
```js
const { serviceApp } = require('../../core/app-services/serviceApp')
const {
  profilService,
  utilisateurService,
  compteService,
  authService,
  apiService,
  sessionService,
  sessionStorageService,
  profilStorageService,
  navigation,
} = serviceApp()
```

## Comment les pages utilisent `core`
Une page :
1. récupère les services avec `serviceApp()`
2. utilise `profilService` ou `utilisateurService` pour les données utilisateur
3. utilise `compteService` pour le compte courant
4. utilise `authService` pour login / restore / logout
5. utilise `apiService` pour les appels backend
6. utilise les services de storage pour la persistance locale
7. utilise `navigation` pour changer de page

Une page ne doit pas :
- modifier `noyau.state` directement
- appeler `wx.navigateTo` directement
- recréer les services

## Docs liées
- `dossiers/app.md`
- `dossiers/noyau.md`
- `dossiers/gestion-etat.md`
- `dossiers/auth.md`
- `dossiers/api-layer.md`
- `dossiers/composants.md`
- `dossiers/lifecycle.md`
- `dossiers/pages.md`
- `dossiers/navigation.md`
- `dossiers/storage.md`

## Règle à retenir
- `core` contient la logique centrale
- `app.js` prépare cette logique
- les pages utilisent cette logique
