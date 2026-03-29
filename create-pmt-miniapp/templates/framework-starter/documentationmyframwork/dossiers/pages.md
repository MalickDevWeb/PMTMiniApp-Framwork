# Dossier `pages`

## Rôle d'une page
Une page sert à :
- afficher l'interface
- réagir aux actions utilisateur
- appeler les services de l'application

Une page ne doit pas :
- réécrire la logique métier
- naviguer avec `wx.navigateTo` directement
- modifier `noyau.state` directement

## Ce qu'une page utilise
Dans ce projet, une page utilise surtout :
- `serviceApp()` pour récupérer les services
- `profilService` pour lire ou modifier les données
- `utilisateurService` pour le profil courant
- `compteService` pour le compte courant
- `authService` pour login / logout / restore
- `apiService` pour appeler le backend
- `sessionService` et `profilStorageService` pour garder des données locales
- `navigation` pour changer de page

Import :
```js
const {
  serviceApp,
  attendreInitialisationApp,
} = require('../../core/app-services/serviceApp')
```

## Modèle simple d'une page
Une page suit en général cet ordre :
1. importer `serviceApp()`
2. créer les méthodes utiles
3. utiliser `onLoad`
4. utiliser `onShow`
5. utiliser `onUnload`

## Pour lire une donnée
Faire :
```js
const { profilService } = serviceApp()
const nom = profilService.lireNom('Invite')
```

## Pour modifier une donnée
Faire :
```js
const { profilService } = serviceApp()
profilService.mettreNom('Aicha')
```

## Pour garder une donnée locale
Faire :
```js
const { sessionService } = serviceApp()
await sessionService.sauvegarderToken('abc123')
```

## Pour ouvrir une session après login
Faire :
```js
const { authService } = serviceApp()

await authService.login({
  email: 'aicha@mail.com',
  password: 'secret',
})
```

## Pour appeler une API protégée
Faire :
```js
const { apiService } = serviceApp()

const reponse = await apiService.get('/me', {
  auth: true,
})
```

## Pour naviguer
Faire :
```js
const { navigation } = serviceApp()
await navigation.remplacerPage('home')
```

## Pour écouter les changements
Faire dans `onLoad` :
```js
const { profilService } = serviceApp()

this._arreterNom = profilService.onNomChange((nom) => {
  this.setData({
    nomActuel: typeof nom === 'string' && nom.trim() ? nom : 'Invite',
  })
})
```

Puis faire dans `onUnload` :
```js
if (typeof this._arreterNom === 'function') {
  this._arreterNom()
  this._arreterNom = null
}
```

## Cycle simple
- `onLoad` : je démarre les abonnements
- `onShow` : j'attends l'initialisation puis je relis les données
- `onUnload` : je nettoie

## Exemple prêt à copier
```js
const {
  serviceApp,
  attendreInitialisationApp,
} = require('../../core/app-services/serviceApp')

Page({
  data: {
    nomActuel: 'Invite',
  },

  chargerNom() {
    const { utilisateurService } = serviceApp()
    if (!utilisateurService) return

    const nom = utilisateurService.lireNom('Invite')
    this.setData({ nomActuel: nom })
  },

  sauvegarderNom() {
    const { profilService } = serviceApp()
    if (!profilService) return

    profilService.mettreNom('Aicha')
    this.chargerNom()
  },

  async allerHome() {
    const { navigation } = serviceApp()
    if (!navigation) return

    await navigation.remplacerPage('home')
  },

  onLoad() {
    const { utilisateurService } = serviceApp()
    if (!utilisateurService) return

    this._arreterNom = utilisateurService.onNomChange((nom) => {
      this.setData({
        nomActuel: typeof nom === 'string' && nom.trim() ? nom : 'Invite',
      })
    })
  },

  async onShow() {
    await attendreInitialisationApp()
    this.chargerNom()
  },

  onUnload() {
    if (typeof this._arreterNom === 'function') {
      this._arreterNom()
      this._arreterNom = null
    }
  },
})
```

## Règle à retenir
- la page gère l'interface
- les services gèrent la logique
- la page appelle les services
