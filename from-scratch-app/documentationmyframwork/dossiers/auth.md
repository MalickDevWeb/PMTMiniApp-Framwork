# Dossier `auth`

## Rôle de `authService`
`authService` orchestre la session complète.

Il sert à :
- ouvrir une session après login API
- hydrater le profil courant
- hydrater le compte courant
- restaurer la session avec un appel API
- déconnecter proprement

`authService` est une façade.

Derrière, il peut utiliser :
- une stratégie `api`
- une stratégie `local`

## Répartition simple
- `sessionService` : gère le token
- `utilisateurService` : gère le profil courant
- `compteService` : gère le compte courant
- `authService` : coordonne les trois

## Les 2 stratégies

### Stratégie `api`
Elle sert quand le backend gère déjà l'auth.

Elle :
- appelle l'API de login
- appelle l'API de session courante
- appelle l'API de logout
- garde le token
- hydrate utilisateur + compte

### Stratégie `local`
Elle sert pour :
- test
- démo
- mode offline

Elle :
- ne parle pas à l'API
- ouvre une session locale
- garde le token
- hydrate utilisateur + compte localement

## Source de vérité
- token : storage + état
- profil : API + état
- compte : API + état

## Pour ouvrir une session après login
Faire :
```js
const { serviceApp } = require('../../core/app-services/serviceApp')

const { authService } = serviceApp()

await authService.login({
  email: 'aicha@mail.com',
  password: 'secret',
})
```

## Pour restaurer après redémarrage
Au démarrage :
- le token est relu depuis le storage
- puis on peut appeler l'API pour recharger le profil et le compte

Faire :
```js
const { serviceApp } = require('../../core/app-services/serviceApp')

const { authService } = serviceApp()

await authService.restaurer()
```

## Pour se déconnecter
Faire :
```js
const { serviceApp } = require('../../core/app-services/serviceApp')

const { authService } = serviceApp()

await authService.logout()
```

`authService.logout()` supprime :
- le token
- le profil courant
- le compte courant

## Exemple très simple
```js
const { serviceApp } = require('../../core/app-services/serviceApp')

Page({
  async login() {
    const { authService } = serviceApp()
    if (!authService) return

    await authService.login({
      email: 'aicha@mail.com',
      password: 'secret',
    })
  },

  async logout() {
    const { authService } = serviceApp()
    if (!authService) return

    await authService.logout()
  },
})
```

## Règle à retenir
- stratégie `api` : utiliser `authService.login(...)`, `authService.restaurer()`, `authService.logout()`
- stratégie `local` : utiliser les mêmes méthodes, mais sans backend
- compatibilité : `ouvrirSession`, `restaurerDepuisApi`, `deconnecter` existent encore
