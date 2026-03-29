const test = require('node:test')
const assert = require('node:assert/strict')

const { serviceStorage } = require('../core/storage/serviceStorage')
const {
  creerProfilStorageService,
  creerServicesStorageSimples,
} = require('../core/storage/simples')
const { clesStorage } = require('../core/storage/clesStorage')
const { MARQUEUR_FORMAT_STORAGE } = require('../core/storage/storage.shared')

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
      Object.keys(memory).forEach((key) => {
        delete memory[key]
      })
      success()
    },
    memory,
  }
}

test('sauvegarderNom nettoie et ecrit le nom', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })
  const profilStorageService = creerProfilStorageService(storage)

  assert.equal(await profilStorageService.sauvegarderNom('  Aicha  '), true)
  assert.equal(client.memory[clesStorage.UTILISATEUR_NOM][MARQUEUR_FORMAT_STORAGE], true)
  assert.equal(client.memory[clesStorage.UTILISATEUR_NOM].value, 'Aicha')
})

test('lireNom relit le nom sauvegarde', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })
  const profilStorageService = creerProfilStorageService(storage)

  await profilStorageService.sauvegarderNom('Aicha')
  assert.equal(await profilStorageService.lireNom('Invite'), 'Aicha')
})

test('supprimerNom est idempotent', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })
  const profilStorageService = creerProfilStorageService(storage)

  assert.equal(await profilStorageService.supprimerNom(), true)
})

test('creerServicesStorageSimples expose automatiquement profilStorageService', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })

  const servicesStorageSimples = creerServicesStorageSimples(storage)

  assert.equal(typeof servicesStorageSimples.profilStorageService.lireNom, 'function')
  assert.equal(typeof servicesStorageSimples.profilStorageService.sauvegarderNom, 'function')
})
