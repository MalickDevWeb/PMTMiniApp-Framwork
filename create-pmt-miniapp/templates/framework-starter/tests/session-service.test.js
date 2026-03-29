const test = require('node:test')
const assert = require('node:assert/strict')

const { gestionnaireEtat } = require('../core/gestion-etats/gestionnaireEtat')
const { serviceStorage } = require('../core/storage/serviceStorage')
const { creerSessionStorageService } = require('../core/storage/session/sessionStorageService')
const { creerSessionService } = require('../core/storage/session/sessionService')
const { clesStorage } = require('../core/storage/clesStorage')

function creerClientStorageMemoire() {
  const memory = {}

  return {
    getStorage({ key, success, fail }) {
      if (Object.prototype.hasOwnProperty.call(memory, key)) {
        success({ data: memory[key] })
        return
      }

      fail({ errMsg: 'getStorage:fail data not found' })
    },
    setStorage({ key, data, success }) {
      memory[key] = data
      success()
    },
    removeStorage({ key, success, fail }) {
      if (!Object.prototype.hasOwnProperty.call(memory, key)) {
        fail({ errMsg: 'removeStorage:fail data not found' })
        return
      }

      delete memory[key]
      success()
    },
    clearStorage({ success }) {
      Object.keys(memory).forEach((key) => delete memory[key])
      success()
    },
    memory,
  }
}

test('sauvegarderToken synchronise storage et etat', async () => {
  const noyau = { state: {}, listeners: {} }
  const etat = gestionnaireEtat(noyau)
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })
  const sessionStorageService = creerSessionStorageService(storage)
  const sessionService = creerSessionService({ etat, sessionStorageService })

  assert.equal(await sessionService.sauvegarderToken('  abc123  '), true)
  assert.equal(etat.get(clesStorage.SESSION_TOKEN, ''), 'abc123')
  assert.equal(await sessionStorageService.lireToken(''), 'abc123')
})

test('supprimerToken retire le token du storage et de l etat', async () => {
  const noyau = { state: {}, listeners: {} }
  const etat = gestionnaireEtat(noyau)
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })
  const sessionStorageService = creerSessionStorageService(storage)
  const sessionService = creerSessionService({ etat, sessionStorageService })

  await sessionService.sauvegarderToken('abc123')

  assert.equal(await sessionService.supprimerToken(), true)
  assert.equal(etat.get(clesStorage.SESSION_TOKEN, ''), '')
  assert.equal(await sessionStorageService.lireToken('vide'), 'vide')
})

test('restaurerToken remet le token en memoire depuis le storage', async () => {
  const noyau = { state: {}, listeners: {} }
  const etat = gestionnaireEtat(noyau)
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })
  const sessionStorageService = creerSessionStorageService(storage)
  const sessionService = creerSessionService({ etat, sessionStorageService })

  await sessionStorageService.sauvegarderToken('abc123')

  assert.equal(await sessionService.restaurerToken(), true)
  assert.equal(sessionService.lireToken(''), 'abc123')
  assert.equal(sessionService.estConnecte(), true)
})

test('onTokenChange ecoute les changements de token', async () => {
  const noyau = { state: {}, listeners: {} }
  const etat = gestionnaireEtat(noyau)
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })
  const sessionStorageService = creerSessionStorageService(storage)
  const sessionService = creerSessionService({ etat, sessionStorageService })
  const valeurs = []

  const unsubscribe = sessionService.onTokenChange((token) => {
    valeurs.push(token)
  })

  await sessionService.sauvegarderToken('abc123')
  await sessionService.supprimerToken()
  unsubscribe()

  assert.deepEqual(valeurs, ['abc123', undefined])
})
