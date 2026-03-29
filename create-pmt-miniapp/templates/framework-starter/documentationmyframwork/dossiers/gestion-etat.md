# Dossier `gestion-etat`

## Utilisation version 2
Dans une page, tu utilises :
- `serviceApp()` pour récupérer directement les services utiles

Services principaux :
- `profilService` : façade simple centrée sur le nom
- `utilisateurService` : profil courant complet
- `compteService` : compte courant complet
- `authService` : login / restore / logout

Import :
```js
const { serviceApp } = require('../../core/app-services/serviceApp')
```

## Pour afficher le nom
Faire :
```js
const { profilService } = serviceApp()
const nom = profilService.lireNom('Invite')
```

## Pour lire le profil courant
Faire :
```js
const { utilisateurService } = serviceApp()
const utilisateur = utilisateurService.lireUtilisateur(null)
```

## Pour lire le compte courant
Faire :
```js
const { compteService } = serviceApp()
const compte = compteService.lireCompte(null)
```

## Pour modifier le nom
Faire :
```js
const { profilService } = serviceApp()
profilService.mettreNom('Aicha')
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

## Cycle de page
- `onLoad` : je démarre l'abonnement
- `onShow` : je relis la valeur actuelle
- `onUnload` : j'arrête l'abonnement

## Exemple prêt à copier
```js
const { serviceApp } = require('../../core/app-services/serviceApp')

Page({
  data: {
    nomActuel: 'Invite',
  },

  chargerNom() {
    const { profilService } = serviceApp()
    if (!profilService) return

    const nom = profilService.lireNom('Invite')
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
    const { profilService } = serviceApp()
    if (!profilService) return

    this._arreterNom = profilService.onNomChange((nom) => {
      this.setData({
        nomActuel: typeof nom === 'string' && nom.trim() ? nom : 'Invite',
      })
    })
  },

  onShow() {
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
- la page parle à `profilService`
- `profilService` parle à `utilisateurService`
- `utilisateurService` et `compteService` parlent au `gestionnaireEtat`
- la page ne touche jamais `noyau.state` directement
