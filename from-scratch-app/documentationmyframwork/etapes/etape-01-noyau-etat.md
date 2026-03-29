# Étape 01 — Noyau global + gestionnaire d'état

## Objectif
Construire la première brique du framework:
- noyau global
- service d'état centralisé

## Ce qui a été construit
1. `core/noyau/noyau.js`
2. `core/gestion-etats/gestionnaireEtat.js`
3. Injection dans `app.js`
4. Tests dans `pages/index/index.js`

## Définition des méthodes
- `set` : écrit une valeur dans `state`
- `get` : lit une valeur ou fallback
- `onState` : abonne un callback à une clé
- `remove` : supprime une clé du state

## Validation obtenue
- noyau chargé au launch
- clés noyau visibles: `state`, `listeners`, `services`
- `onState` + `unsubscribe` fonctionnels
- `remove` retourne `true` et `get` revient au fallback

## Points d'attention
- `set` ne retourne pas la valeur métier
- toujours désabonner en fin de cycle (`onUnload`)
- rester cohérent sur les noms de clés
