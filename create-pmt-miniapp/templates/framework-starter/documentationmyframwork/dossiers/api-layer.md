# Dossier `api-layer`

## Rôle de `apiService`
`apiService` centralise les appels HTTP.

Il sert à :
- éviter `wx.request` dans les pages
- garder l'URL de base au même endroit
- ajouter le token automatiquement
- normaliser les erreurs

## Où est la config
- [api.config.js](/home/pmt/WeChatProjects/Mes_document/documentation/from-scratch-app/core/api-layer/api.config.js)
- [authApi.config.js](/home/pmt/WeChatProjects/Mes_document/documentation/from-scratch-app/core/api-layer/authApi.config.js)

Tu peux y régler :
- `baseUrl`
- `timeoutMs`
- `authStrategy`
- les routes `login`, `me`, `logout`

## Où est la logique
- [serviceApi.js](/home/pmt/WeChatProjects/Mes_document/documentation/from-scratch-app/core/api-layer/serviceApi.js)
- [authApiClient.js](/home/pmt/WeChatProjects/Mes_document/documentation/from-scratch-app/core/api-layer/authApiClient.js)

## Utilisation simple dans une page
```js
const { serviceApp } = require('../../core/app-services/serviceApp')

Page({
  async chargerProfil() {
    const { apiService } = serviceApp()
    if (!apiService) return

    const reponse = await apiService.get('/me', {
      auth: true,
    })

    console.log(reponse)
  },
})
```

## Méthodes disponibles
- `apiService.get(path, options)`
- `apiService.post(path, data, options)`
- `apiService.put(path, data, options)`
- `apiService.patch(path, data, options)`
- `apiService.supprimer(path, options)`

## Pour une route protégée
Faire :
```js
const { apiService } = serviceApp()

const reponse = await apiService.get('/me', {
  auth: true,
})
```

Si `auth: true`, le token est ajouté automatiquement.

## Pour une route publique
Faire :
```js
const { apiService } = serviceApp()

const reponse = await apiService.post('/login', {
  email: 'aicha@mail.com',
  password: 'secret',
})
```

## Lien avec `authService`
Si tu utilises la stratégie `api` :
- `authService.login(...)` appelle l'API de login
- `authService.restaurer()` appelle l'API de session courante
- `authService.logout()` appelle l'API de logout

Le mapping par défaut accepte déjà des réponses du style :
```js
{
  access_token: 'abc123',
  expires_in: 3600,
  user: { ... },
  account: { ... },
}
```

## Règle à retenir
- page : appelle `apiService`
- `apiService` : appelle le backend
- `authService` : orchestre login / restore / logout
