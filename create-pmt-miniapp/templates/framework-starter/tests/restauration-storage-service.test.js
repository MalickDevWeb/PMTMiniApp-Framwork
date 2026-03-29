const test = require('node:test')
const assert = require('node:assert/strict')

const { creerRestaurationStorageService } = require('../core/storage/restaurationStorageService')

test('restaurer remet token et nom dans l etat quand ils existent', async () => {
  const appels = []
  const service = creerRestaurationStorageService({
    etat: {
      set: (cle, valeur) => {
        appels.push([cle, valeur])
        return true
      },
    },
    sessionService: {
      restaurerToken: async () => {
        appels.push(['session.token', 'abc123'])
        return true
      },
    },
    profilStorageService: {
      lireNom: async () => 'Aicha',
    },
  })

  const resultat = await service.restaurer()

  assert.deepEqual(resultat, { token: true, nom: true })
  assert.deepEqual(appels, [
    ['session.token', 'abc123'],
    ['utilisateur.nom', 'Aicha'],
  ])
})

test('restaurer ignore les valeurs vides', async () => {
  const appels = []
  const service = creerRestaurationStorageService({
    etat: {
      set: (cle, valeur) => {
        appels.push([cle, valeur])
        return true
      },
    },
    sessionService: {
      restaurerToken: async () => false,
    },
    profilStorageService: {
      lireNom: async () => '   ',
    },
  })

  const resultat = await service.restaurer()

  assert.deepEqual(resultat, { token: false, nom: false })
  assert.deepEqual(appels, [])
})

test('restaurer retourne un resultat stable si une lecture jette une erreur', async () => {
  const logs = []
  const service = creerRestaurationStorageService({
    etat: {
      set: () => true,
    },
    sessionService: {
      restaurerToken: async () => {
        throw new Error('boom')
      },
    },
    profilStorageService: {
      lireNom: async () => 'Aicha',
    },
    logger: {
      error: (...args) => logs.push(args),
    },
  })

  const resultat = await service.restaurer()

  assert.deepEqual(resultat, { token: false, nom: true })
  assert.equal(logs.length, 1)
})
