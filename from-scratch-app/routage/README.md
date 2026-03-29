# Routage

## Source de vérité
Le fichier à modifier est:
- `routage/routes.json`

Exemple:
```json
{
  "pageEntree": "login",
  "routes": {
    "login": "pages/login/login",
    "index": "pages/index/index",
    "home": "pages/home/home"
  }
}
```

## Règle
- `pageEntree` définit explicitement la page de démarrage
- la clé est le nom de route utilisé dans le code
- la valeur est le chemin WeChat sans slash initial
- `app.json.pages` est généré à partir de ce fichier

## Usage dans le code
Exemple:
```js
await navigation.remplacerPage('login')
await navigation.allerA('home')
```

## Après modification
- dans WeChat DevTools, `Compile` suffit si `Enable Custom Processing Commands` est activé
- en local hors DevTools: `npm run sync:pages`
- diagnostic rapide: `npm run doctor:navigation`
- vérification complète: `npm run check:navigation`

## Robustesse interne
Le projet partage une validation unique du routage dans:
- `core/navigation/navigationConfig.shared.js`

Cette validation est utilisée par:
- le runtime navigation
- `scripts/syncAppPages.js`
- `scripts/doctorNavigation.js`
- `tests/navigation-config.test.js`
