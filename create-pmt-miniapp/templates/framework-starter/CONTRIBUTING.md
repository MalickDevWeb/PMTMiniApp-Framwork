# Contribuer

## Objectif
Conserver un framework simple à lire, simple à utiliser et simple à faire évoluer.

## Règles
- garder des noms explicites
- séparer la logique métier, la persistance, la navigation et l'UI
- documenter toute nouvelle brique visible par une équipe
- ajouter ou mettre à jour les tests quand un comportement change
- ne pas exposer un fichier `*.shared.js` comme API publique

## Workflow recommandé
1. modifier la brique concernée
2. synchroniser les routes si nécessaire avec `npm run sync:pages`
3. lancer `npm run doctor`
4. lancer `npm run check`
5. mettre à jour la documentation publique si l'usage change

## Surface publique
Les points d'entrée recommandés sont :
- `core/navigation/index.js`
- `core/gestion-etats/index.js`
- `core/storage/index.js`
- `core/auth/index.js`
- `core/api-layer/index.js`
- `core/app-services/serviceApp.js`
- `components/ui/*`

Les fichiers `*.shared.js`, `routes.runtime.js`, `scripts/*` et `debug/*` sont internes.
