# Étape 13 - Analyse parallèle avec `tcmpp-boilerplate`

## But
Comparer notre framework from-scratch avec le boilerplate TCMPP pour identifier:
- ce que nous avons déjà
- ce qui manque encore
- l'ordre d'implémentation recommandé

## Mapping architecture (1:1)

### 1) Bootstrap global
- TCMPP:
  - `app.js` initialise `eventBus`, `initPromise`, clés d'état/événements
  - gère update manager, réseau, erreurs globales
- From-scratch:
  - `app.js` initialise `noyau`, `gestionnaireEtat`, `profilService`, `navigation`
- Écart:
  - pas encore de `initPromise`
  - pas encore de gestion réseau/update/erreurs globale structurée

### 2) State/Event core
- TCMPP:
  - Bus avancé (`utils/event/builder.js`): `on/off/once/emit`, `setState/getState/onState`
  - validation stricte, middleware, historique, namespace, priorités
- From-scratch:
  - `gestionnaireEtat`: `set/get/onState/remove` + validation basique
- Écart:
  - pas encore d'API événements séparée (`emit/on`)
  - pas encore de middleware/historique/namespace

### 3) Couche métier
- TCMPP:
  - pages consomment `eventBus` + helpers
- From-scratch:
  - `profilService` (façade métier) déjà en place
- Écart:
  - créer d'autres services métier (auth/session) pour généraliser le pattern

### 4) Navigation
- TCMPP:
  - navigation classique depuis pages
- From-scratch:
  - navigation centralisée + validation URL + logs
- Écart:
  - ajouter `naviguerVers` et `retour` pour couvrir tous les cas

### 5) Helpers/Behaviors
- TCMPP:
  - `createPageHelpers` (subscribe/loadInitial/unsubscribe)
  - `loadingBehavior` (withLoading, setError, clearError)
- From-scratch:
  - pas encore implémenté
- Écart:
  - important pour réduire le code répétitif dans les pages

### 6) API layer
- TCMPP:
  - `utils/apis/http.js` (client unifié + headers session)
  - `utils/apis/native.js` (invoke plugin + retry/backoff + fallback dev)
- From-scratch:
  - pas encore de couche API dédiée
- Écart:
  - prochaine grosse brique après helpers/behaviors

## Niveau actuel (résumé)
- Solide:
  - noyau + état + façade profil + navigation + lifecycle propre + docs
- Intermédiaire:
  - séparation responsabilités correcte
- À construire pour atteindre TCMPP:
  - `initPromise`, helpers de page, behavior loading, API layer, event bus avancé

## Ordre recommandé (prochaines étapes)
1. Ajouter `initPromise` dans `app.js` (pattern de démarrage non bloquant)
2. Créer `utils/helpers/pageHelpers` minimal (subscribe/unsubscribe)
3. Créer un `loadingBehavior` simple (withLoading)
4. Étendre navigation (`naviguerVers`, `retour`)
5. Créer `apis/httpClient` minimal
6. Étendre le bus vers `emit/on` (phase avancée)
