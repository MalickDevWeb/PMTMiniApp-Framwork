# Étape 10 - Service Navigation

## Objectif
Sortir la navigation des pages pour éviter de dupliquer `wx.redirectTo` partout.

## Pourquoi
- Une page doit piloter le flux UI/lifecycle, pas contenir toute la technique.
- Un service unique permet des validations communes (page/options) et des logs homogènes.

## Implémentation
- Création de `core/navigation/serviceNavigation.js`
- API exposée:
  - `allerA(page, options)`
  - `remplacerPage(page, options)`
  - `revenir(options)`
  - `redemarrerA(page, options)`
- Validation:
  - `pageValide(page)`
  - `paramsValides(params)`
  - `deltaValide(delta)`
- Comportement:
  - toutes les méthodes principales retournent une `Promise`

## Injection App
- `app.js` initialise:
  - `globalData.noyau.services.navigation = serviceNavigation()`

## Consommation pages
- `pages/index/index.js` et `pages/home/home.js` utilisent:
  - `getApp().globalData.noyau.services.navigation`
  - `navigation.remplacerPage('login')` ou `navigation.allerA('home')`

## Critère de validation
- Le bouton index -> home fonctionne via service.
- Le bouton home -> index fonctionne via service.
- Plus aucun `wx.redirectTo` direct dans les pages.
