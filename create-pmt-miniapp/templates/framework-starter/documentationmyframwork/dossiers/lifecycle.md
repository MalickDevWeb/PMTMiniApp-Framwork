# Dossier `lifecycle`

## Utilisation simple
Dans une page, le cycle le plus simple est :
- `onLoad`
- `onShow`
- `onUnload`

## À quoi sert chaque hook

## `onLoad`
À utiliser pour :
- démarrer un abonnement
- préparer une ressource
- initialiser une logique une seule fois

Exemple :
```js
onLoad() {
  const { profilService } = serviceApp()
  if (!profilService) return

  this._arreterNom = profilService.onNomChange((nom) => {
    this.setData({
      nomActuel: typeof nom === 'string' && nom.trim() ? nom : 'Invite',
    })
  })
}
```

## `onShow`
À utiliser pour :
- relire la valeur actuelle
- resynchroniser l'écran

Exemple :
```js
async onShow() {
  await attendreInitialisationApp()
  this.chargerNom()
}
```

## `onUnload`
À utiliser pour :
- arrêter les abonnements
- nettoyer ce qui a été démarré dans `onLoad`

Exemple :
```js
onUnload() {
  if (typeof this._arreterNom === 'function') {
    this._arreterNom()
    this._arreterNom = null
  }
}
```

## Quand utiliser `onHide`
Utiliser `onHide` seulement si tu dois :
- arrêter un timer temporairement
- mettre en pause une ressource
- tracer un comportement de sortie d'écran

Si tu n'as rien à faire, ne pas ajouter `onHide`.

## Modèle simple
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
    const { profilService } = serviceApp()
    if (!profilService) return

    const nom = profilService.lireNom('Invite')
    this.setData({ nomActuel: nom })
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
- `onLoad` : je démarre
- `onShow` : j'attends l'initialisation puis je relis
- `onUnload` : j'arrête
