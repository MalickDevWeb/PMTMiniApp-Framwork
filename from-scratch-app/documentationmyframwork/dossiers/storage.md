# Dossier `storage`

## C'est quoi `storage` ?
`storage` sert à garder une donnée même après fermeture de l'application.

Exemple :
- token de session
- nom utilisateur
- petite donnée locale

## Différence avec l'état
- `gestionnaireEtat` : mémoire pendant l'exécution
- `storage` : mémoire persistante sur l'appareil

## Ce qu'il faut utiliser en premier
Pour un développeur, le plus simple est d'utiliser :
- `sessionService`
- `sessionStorageService`
- `profilStorageService`

Le service brut `storage` reste disponible si besoin, mais il est limité aux clés déclarées dans `core/storage/clesStorage.js`.

## Nouvelle structure
Chaque donnée importante peut avoir son propre dossier.

Exemple actuel :
- `core/storage/session`
- `core/storage/simples`

Dans un dossier comme `session`, on met :
- la clé
- la valeur par défaut
- les options storage
- le service storage
- le service global si la donnée parle aussi avec l'état

Donc le token a maintenant tout ici :
- `core/storage/session/sessionStorage.config.js`
- `core/storage/session/sessionStorageService.js`
- `core/storage/session/sessionService.js`

Pour les clés simples, on ne crée plus un dossier à chaque fois.

On ajoute simplement une définition ici :
- `core/storage/simples/definitionsStorageSimples.js`

Puis le framework crée automatiquement :
- le service simple
- l'injection dans `app.js`
- l'accès depuis `serviceApp()`

## Ce qui est sécurisé par défaut
- `sessionStorageService` lit et écrit le token en mode chiffré WeChat
- `sessionService` garde le token synchronisé entre storage et état global
- `profilStorageService` reste en mode simple
- toutes les écritures passent dans un format versionné
- une donnée peut avoir une date d'expiration

## Dans une page, on récupère quoi ?
```js
const { serviceApp } = require('../../core/app-services/serviceApp')

const {
  sessionService,
  sessionStorageService,
  profilStorageService,
  storage,
} = serviceApp()
```

## Les clés de storage
Les clés visibles du projet sont centralisées ici :
- `core/storage/clesStorage.js`

Mais `clesStorage.js` est seulement un agrégateur.

La vraie source reste dans les dossiers métier.

Exemple :
- la clé du token vient de `core/storage/session/sessionStorage.config.js`
- la clé du nom vient de `core/storage/simples/definitionsStorageSimples.js`

Donc on évite d'écrire les chaînes en dur partout.

## Pour sauvegarder un token global
Faire :
```js
const { sessionService } = serviceApp()
await sessionService.sauvegarderToken('abc123')
```

## Pour lire un token global
Faire :
```js
const { sessionService } = serviceApp()
const token = sessionService.lireToken('')
```

## Pour supprimer un token global
Faire :
```js
const { sessionService } = serviceApp()
await sessionService.supprimerToken()
```

## Pour restaurer un token depuis le storage
Faire :
```js
const { sessionService } = serviceApp()
await sessionService.restaurerToken()
```

## Pour sauvegarder un nom
Faire :
```js
const { profilStorageService } = serviceApp()
await profilStorageService.sauvegarderNom('Aicha')
```

## Pour mettre une expiration
Faire :
```js
const { sessionService } = serviceApp()
await sessionService.sauvegarderToken('abc123', { dureeExpirationMs: 3600000 })
```

Ou avec une date fixe :
```js
const { sessionStorageService } = serviceApp()
await sessionStorageService.sauvegarderToken('abc123', {
  expireAt: Date.now() + 3600000,
})
```

## Pour lire un nom
Faire :
```js
const { profilStorageService } = serviceApp()
const nom = await profilStorageService.lireNom('Invite')
```

## Pour une lecture stricte
Utiliser la lecture stricte seulement si tu veux être averti d'une vraie erreur.

Exemple :
```js
const { storage } = serviceApp()

try {
  const token = await storage.lireStrict('session.token', '')
  console.log(token)
} catch (error) {
  console.error(error)
}
```

## Pour utiliser le chiffrement WeChat avec le service brut
Faire :
```js
const { storage } = serviceApp()

await storage.ecrire('session.token', 'abc123', { encrypt: true })
const token = await storage.lire('session.token', '', { encrypt: true })
```

## Pour utiliser le service brut
Le service brut sert si tu veux lire une clé déjà déclarée.

Tu ne peux pas utiliser une clé libre directement depuis une page.

Si tu as besoin d'une nouvelle clé :
1. ajoute une définition dans `core/storage/simples/definitionsStorageSimples.js`
2. donne le nom du service
3. donne la clé
4. donne la valeur par défaut
5. donne les noms des méthodes

Donc la règle est :
- donnée simple = une définition
- donnée spéciale = un dossier dédié
- `clesStorage.js` = vue globale, pas source principale

Exemple de nouvelle clé simple :
```js
UTILISATEUR_PRENOM: Object.freeze({
  nomService: 'prenomStorageService',
  cle: 'utilisateur.prenom',
  valeurParDefaut: '',
  optionsStorage: Object.freeze({}),
  methodes: Object.freeze({
    lire: 'lirePrenom',
    lireStrict: 'lirePrenomStrict',
    sauvegarder: 'sauvegarderPrenom',
    supprimer: 'supprimerPrenom',
  }),
})
```

Après ça, `serviceApp()` pourra déjà donner :
```js
const { prenomStorageService } = serviceApp()
```

Exemple :
```js
const { storage } = serviceApp()

await storage.ecrire('utilisateur.nom', 'Aicha')
const valeur = await storage.lire('utilisateur.nom', 'Invite')
await storage.supprimer('utilisateur.nom')
```

## Au démarrage de l'application
`app.js` relit automatiquement :
- le token
- le nom utilisateur

Puis il remet ces valeurs dans l'état global.

Cette logique est sortie dans :
- `core/storage/restaurationStorageService.js`

## Exemple prêt à copier
```js
const { serviceApp } = require('../../core/app-services/serviceApp')

Page({
  data: {
    token: '',
    nom: 'Invite',
  },

  async chargerDonneesLocales() {
    const { sessionService, profilStorageService } = serviceApp()
    if (!sessionService || !profilStorageService) return

    const token = sessionService.lireToken('')
    const nom = await profilStorageService.lireNom('Invite')

    this.setData({ token, nom })
  },

  async sauvegarderDonneesLocales() {
    const { sessionService, profilStorageService } = serviceApp()
    if (!sessionService || !profilStorageService) return

    await sessionService.sauvegarderToken('abc123', { dureeExpirationMs: 3600000 })
    await profilStorageService.sauvegarderNom('Aicha')
  },

  async effacerDonneesLocales() {
    const { sessionService, profilStorageService } = serviceApp()
    if (!sessionService || !profilStorageService) return

    await sessionService.supprimerToken()
    await profilStorageService.supprimerNom()
    this.setData({ token: '', nom: 'Invite' })
  },
})
```

## Règle à retenir
- utiliser d'abord `sessionService` pour le token global
- utiliser ensuite les services métier de storage
- utiliser le service brut seulement pour une clé déjà déclarée
- `app.js` restaure déjà les données locales principales au démarrage
- pour une nouvelle clé simple, ajouter une définition dans `simples/definitionsStorageSimples.js`
- garder un dossier dédié seulement pour les cas spéciaux comme `session`
