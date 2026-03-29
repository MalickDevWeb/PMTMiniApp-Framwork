const test = require('node:test')
const assert = require('node:assert/strict')

const { serviceStorage } = require('../core/storage/serviceStorage')
const { creerSessionStorageService } = require('../core/storage/session/sessionStorageService')
const { clesStorage } = require('../core/storage/clesStorage')
const {
  MARQUEUR_FORMAT_STORAGE,
  VERSION_FORMAT_STORAGE,
} = require('../core/storage/storage.shared')

function creerClientStorageMemoire() {
  const memory = {}
  const appels = {
    setStorage: null,
    getStorage: null,
  }

  return {
    getStorage(config) {
      appels.getStorage = config
      const { key, success, fail } = config

      if (Object.prototype.hasOwnProperty.call(memory, key)) {
        success({ data: memory[key] })
        return
      }

      fail({ errMsg: 'getStorage:fail data not found' })
    },
    setStorage(config) {
      appels.setStorage = config
      const { key, data, success } = config
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
      Object.keys(memory).forEach((key) => {
        delete memory[key]
      })
      success()
    },
    memory,
    appels,
  }
}

test('sauvegarderToken nettoie et ecrit le token', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })
  const sessionStorageService = creerSessionStorageService(storage)

  assert.equal(await sessionStorageService.sauvegarderToken('  abc123  '), true)
  assert.equal(client.memory[clesStorage.SESSION_TOKEN][MARQUEUR_FORMAT_STORAGE], true)
  assert.equal(client.memory[clesStorage.SESSION_TOKEN].version, VERSION_FORMAT_STORAGE)
  assert.equal(client.memory[clesStorage.SESSION_TOKEN].value, 'abc123')
  assert.equal(client.appels.setStorage.encrypt, true)
})

test('lireToken relit le token sauvegarde', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })
  const sessionStorageService = creerSessionStorageService(storage)

  await sessionStorageService.sauvegarderToken('abc123')
  assert.equal(await sessionStorageService.lireToken(''), 'abc123')
  assert.equal(client.appels.getStorage.encrypt, true)
})

test('supprimerToken est idempotent', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })
  const sessionStorageService = creerSessionStorageService(storage)

  assert.equal(await sessionStorageService.supprimerToken(), true)
})

test('sauvegarderToken accepte une dureeExpirationMs explicite', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })
  const sessionStorageService = creerSessionStorageService(storage)

  assert.equal(await sessionStorageService.sauvegarderToken('abc123', { dureeExpirationMs: 60000 }), true)
  assert.equal(typeof client.memory[clesStorage.SESSION_TOKEN].expireAt, 'number')
  assert.equal(client.memory[clesStorage.SESSION_TOKEN].expireAt > Date.now(), true)
})
