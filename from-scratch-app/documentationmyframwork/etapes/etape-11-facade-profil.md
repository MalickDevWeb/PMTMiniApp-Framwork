# Étape 11 - Façade Métier Profil

## Objectif
Ne plus faire d'appels directs à `gestionnaireEtat` dans la page `index`.

## Principe
La page parle au métier (`profilService`), pas au stockage technique.

Flux:
- page -> `profilService` -> `gestionnaireEtat` -> `noyau.state`

## Implémentation
- `core/gestion-etats/profilService.js` créé avec:
  - `lireNom`
  - `mettreNom`
  - `onNomChange`
  - `supprimerNom`
- `app.js` injecte:
  - `globalData.noyau.services.profilService`
- `pages/index/index.js`:
  - utilise `profilService` en `onLoad` et `onShow`

## Bénéfice
- page plus lisible
- clé métier `utilisateur.nom` centralisée
- futur refactor plus simple (une seule zone à modifier)
