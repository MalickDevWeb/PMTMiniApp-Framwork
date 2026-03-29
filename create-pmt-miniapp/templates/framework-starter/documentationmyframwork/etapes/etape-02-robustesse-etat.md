# Étape 02 — Robustesse du gestionnaire d'état

## Objectif
Rendre l'API d'état défensive et fiable en production.

## Portée technique
Service concerné: `core/gestion-etats/gestionnaireEtat.js`

API ciblée:
1. `set(cle, valeur)` -> retourne `true/false`
2. `get(cle, valeurParDefaut)`
3. `onState(cle, callback)` -> retourne `unsubscribe`
4. `remove(cle)` -> retourne `true/false`

## Travaux réalisés
1. Validation de clé (`cleValide`) sur `set/get/onState/remove`
2. Validation de callback sur `onState`
3. Gestion défensive des callbacks via `try/catch` dans `notifier`
4. `set` retourne un booléen de succès
5. `remove` supprime la clé et notifie les listeners avec `undefined`

## Test professionnel recommandé
1. `set('', 'x')` -> `false` + warning
2. `onState('utilisateur.nom', 'pasFonction')` -> no-op unsubscribe + warning
3. `set('utilisateur.nom', 'Aicha')` -> `true`
4. `onState('utilisateur.nom', cbQuiThrow)` + `set(...)` -> pas de crash global
5. `unsubscribe()` -> plus de callback sur `set` suivant
6. `remove('utilisateur.nom')` -> `true` puis `get(..., 'Invité')` -> `Invité`

## Critères de validation
- clé invalide => warning + pas de crash
- callback invalide => no-op unsubscribe
- `set` indique succès/échec
- unsubscribe coupe bien l'écoute
- `remove` rétablit le fallback côté `get`

## Décision d'architecture
Convention adoptée: `globalData.noyau`.

Pourquoi:
1. cohérence sémantique avec `core/noyau/noyau.js`
2. réduction de confusion avec `this.data` dans les pages
