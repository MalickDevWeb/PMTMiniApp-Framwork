# Journal de progression

## Entrée type
- Date:
- Étape:
- Ce qui a été construit:
- Bugs rencontrés:
- Corrections:
- Leçon retenue:

## Dernier état
- Noyau global en place
- Gestionnaire d'état (set/get/onState/remove) validé fonctionnellement
- Abonnement lifecycle propre (`onLoad` subscribe, `onUnload` unsubscribe)
- Debug extrait en modules (`scenarioEtat`, `lifecycleTrace`)
- Service navigation centralisé

## Entrée récente
- Date: 2026-03-26
- Étape: 02 (robustesse service état)
- Ce qui a été construit:
  - validation des entrées
  - booléen de retour sur `set`
  - défense callback via `try/catch`
  - suppression `remove` + fallback validé
- Bugs rencontrés:
  - `listeners is not defined` lors du unsubscribe
  - `remove is not a function` (non exposé dans le return)
- Corrections:
  - usage systématique de `noyau.listeners`
  - ajout de `remove` dans l'API retournée
- Leçon retenue:
  - une API n'existe côté page que si elle est explicitement exposée
  - un test d'abonnement doit toujours vérifier le désabonnement

## Entrée récente 2
- Date: 2026-03-27
- Étape: 10 (service navigation + refactor debug)
- Ce qui a été construit:
  - `core/navigation/serviceNavigation.js`
  - injection du service dans `globalData.noyau.services.navigation`
  - remplacement des `wx.redirectTo` directs dans `index` et `home`
  - extraction des traces lifecycle dans `debug/lifecycleTrace.js`
  - extraction du scénario état dans `debug/scenarioEtat.js`
- Bugs rencontrés:
  - risque de service non initialisé dans la page
- Corrections:
  - garde défensive `if (!navigation)` + log explicite
- Leçon retenue:
  - séparation des responsabilités = pages plus lisibles et plus testables

## Entrée récente 3
- Date: 2026-03-27
- Étape: documentation séparation state manager
- Ce qui a été documenté:
  - usage direct `page -> gestionnaireEtat`
  - usage façade `page -> service métier -> gestionnaireEtat`
  - règles pro d'abonnement/désabonnement
  - anti-pattern d'accès direct à `noyau.state`
- Leçon retenue:
  - apprendre en direct est utile, mais l'architecture cible reste la façade métier

## Entrée récente 4
- Date: 2026-03-27
- Étape: 12 (page login + validation de flux)
- Ce qui a été construit:
  - nouvelle page `pages/login/*`
  - `index`, `login`, `home` branchés sur `profilService`
  - navigation centralisée via `serviceNavigation`
  - tests manuels de flux documentés
- Leçon retenue:
  - le trio UI (page) + métier (profilService) + infra (gestionnaireEtat) est plus lisible et maintenable

## Entrée récente 5
- Date: 2026-03-27
- Étape: 13 (analyse parallèle TCMPP)
- Ce qui a été fait:
  - lecture de `app.js`, `utils/event/*`, `utils/apis/*`, `helpers`, `behaviors` du boilerplate
  - mapping 1:1 avec notre architecture from-scratch
  - backlog ordonné des briques manquantes
- Leçon retenue:
  - notre base est saine; le gap principal est sur `initPromise`, helpers/behaviors, et API layer
