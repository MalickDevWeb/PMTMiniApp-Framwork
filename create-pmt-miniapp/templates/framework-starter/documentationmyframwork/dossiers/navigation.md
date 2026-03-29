# Dossier `navigation`

## Utilisation simple
Dans une page, tu utilises :
- `serviceApp()` pour récupérer `navigation`

Import :
```js
const { serviceApp } = require('../../core/app-services/serviceApp')
```

## Pour aller vers une page
Faire :
```js
const { navigation } = serviceApp()
await navigation.remplacerPage('home')
```

## Pour ouvrir une page sans remplacer
Faire :
```js
const { navigation } = serviceApp()
await navigation.allerA('home')
```

## Pour envoyer des paramètres
Faire :
```js
const { navigation } = serviceApp()

await navigation.allerA('home', {
  params: {
    source: 'login',
    actif: true,
  },
})
```

## Pour revenir en arrière
Faire :
```js
const { navigation } = serviceApp()
await navigation.revenir()
```

## Pour redémarrer vers une page
Faire :
```js
const { navigation } = serviceApp()
await navigation.redemarrerA('login')
```

## Pour ajouter ou modifier une route
Modifier seulement :
- `routage/routes.json`

Exemple :
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

## Après modification des routes
Faire :
1. cliquer `Compile` dans WeChat DevTools
2. ou lancer `npm run sync:pages`

## Dans WeChat DevTools
À faire une seule fois sur le poste :
1. ouvrir `Settings`
2. ouvrir `Local Settings`
3. activer `Enable Custom Processing Commands`

## Exemple prêt à copier
```js
const { serviceApp } = require('../../core/app-services/serviceApp')

Page({
  async allerLogin() {
    const { navigation } = serviceApp()
    if (!navigation) return

    await navigation.remplacerPage('login')
  },

  async allerHome() {
    const { navigation } = serviceApp()
    if (!navigation) return

    await navigation.allerA('home', {
      params: {
        source: 'index',
      },
    })
  },

  async revenirPagePrecedente() {
    const { navigation } = serviceApp()
    if (!navigation) return

    await navigation.revenir()
  },
})
```

## Règle à retenir
- dans une page, ne pas utiliser `wx.navigateTo` directement
- dans une page, utiliser `navigation`
- les routes se modifient dans `routage/routes.json`
- `app.json` se met à jour à partir de ce fichier
