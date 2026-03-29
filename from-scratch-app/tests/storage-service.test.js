const test = require('node:test')
const assert = require('node:assert/strict')

const { serviceStorage } = require('../core/storage/serviceStorage')
const {
  MARQUEUR_FORMAT_STORAGE,
  VERSION_FORMAT_STORAGE,
} = require('../core/storage/storage.shared')
const { clesStorage } = require('../core/storage/clesStorage')

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

test('ecrire puis lire retourne la valeur stockee', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })

  assert.equal(await storage.ecrire('session.token', 'abc'), true)
  assert.equal(client.memory['session.token'][MARQUEUR_FORMAT_STORAGE], true)
  assert.equal(client.memory['session.token'].version, VERSION_FORMAT_STORAGE)
  assert.equal(client.memory['session.token'].value, 'abc')
  assert.equal(await storage.lire('session.token', ''), 'abc')
})

test('propage encrypt true quand il est demande', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })

  await storage.ecrire('session.token', 'abc', { encrypt: true })
  await storage.lire('session.token', '', { encrypt: true })

  assert.equal(client.appels.setStorage.encrypt, true)
  assert.equal(client.appels.getStorage.encrypt, true)
})

test('n envoie pas encrypt quand il est desactive explicitement', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({
    client,
    encryptEnabled: false,
  })

  await storage.ecrire('session.token', 'abc', { encrypt: true })
  await storage.lire('session.token', '', { encrypt: true })

  assert.equal(Object.prototype.hasOwnProperty.call(client.appels.setStorage, 'encrypt'), false)
  assert.equal(Object.prototype.hasOwnProperty.call(client.appels.getStorage, 'encrypt'), false)
})

test('n envoie pas encrypt dans WeChat DevTools meme si la session demande un chiffrement', async () => {
  const client = creerClientStorageMemoire()
  const wxOriginal = global.wx

  global.wx = {
    ...client,
    getDeviceInfo() {
      return { platform: 'devtools' }
    },
    getAccountInfoSync() {
      return {
        miniProgram: {
          appId: 'demo-app-id',
        },
      }
    },
  }

  try {
    const storage = serviceStorage({})

    await storage.ecrire('session.token', 'abc', { encrypt: true })
    await storage.lire('session.token', '', { encrypt: true })

    assert.equal(Object.prototype.hasOwnProperty.call(client.appels.setStorage, 'encrypt'), false)
    assert.equal(Object.prototype.hasOwnProperty.call(client.appels.getStorage, 'encrypt'), false)
  } finally {
    if (typeof wxOriginal === 'undefined') {
      delete global.wx
    } else {
      global.wx = wxOriginal
    }
  }
})

test('lire retourne le fallback si la cle est absente', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })

  assert.equal(await storage.lire('session.token', 'vide'), 'vide')
})

test('lireStrict retourne le fallback si la cle est absente', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })

  assert.equal(await storage.lireStrict('session.token', 'vide'), 'vide')
})

test('lireStrict rejette sur une vraie erreur de lecture', async () => {
  const storage = serviceStorage({
    client: {
      getStorage({ fail }) {
        fail({ errMsg: 'getStorage:fail system error' })
      },
    },
  })

  await assert.rejects(() => storage.lireStrict('session.token', 'vide'), {
    message: 'lecture storage impossible',
  })
})

test('lire retourne une valeur legacy non versionnee pour garder la compatibilite', async () => {
  const client = creerClientStorageMemoire()
  client.memory['session.token'] = 'legacy-token'
  const storage = serviceStorage({ client })

  assert.equal(await storage.lire('session.token', ''), 'legacy-token')
})

test('lire retourne le fallback et nettoie la cle si la valeur est expiree', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })

  await storage.ecrire('session.token', 'abc', { expireAt: Date.now() - 1 })

  assert.equal(await storage.lire('session.token', 'vide'), 'vide')
  assert.equal(Object.prototype.hasOwnProperty.call(client.memory, 'session.token'), false)
})

test('lireStrict rejette si le format versionne est invalide', async () => {
  const client = creerClientStorageMemoire()
  client.memory['session.token'] = {
    [MARQUEUR_FORMAT_STORAGE]: true,
    version: VERSION_FORMAT_STORAGE + 1,
    value: 'abc',
    expireAt: null,
    updatedAt: Date.now(),
  }
  const storage = serviceStorage({ client })

  await assert.rejects(() => storage.lireStrict('session.token', ''), {
    message: 'format storage invalide',
  })
})

test('supprimer retire bien la valeur stockee', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })

  await storage.ecrire('session.token', 'abc')
  assert.equal(await storage.supprimer('session.token'), true)
  assert.equal(await storage.lire('session.token', 'vide'), 'vide')
})

test('supprimer est idempotent si la cle est deja absente', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })

  assert.equal(await storage.supprimer('session.token'), true)
})

test('vider efface tout le storage', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })

  await storage.ecrire('session.token', 'abc')
  await storage.ecrire('utilisateur.nom', 'Aicha')

  assert.equal(await storage.vider(), true)
  assert.deepEqual(client.memory, {})
})

test('nettoyerClesObsoletes supprime seulement les cles valides presentes', async () => {
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({ client })

  await storage.ecrire('ancienne.session', 'abc')
  await storage.ecrire('session.token', 'xyz')

  const total = await storage.nettoyerClesObsoletes([
    'ancienne.session',
    '',
    'cle.absente',
  ])

  assert.equal(total, 1)
  assert.equal(await storage.lire('ancienne.session', 'vide'), 'vide')
  assert.equal(await storage.lire('session.token', ''), 'xyz')
})

test('retourne des valeurs stables si la cle ou le client sont invalides', async () => {
  const logs = []
  const storage = serviceStorage({
    client: null,
    logger: {
      warn: (...args) => logs.push(['warn', ...args]),
      error: (...args) => logs.push(['error', ...args]),
    },
  })

  assert.equal(await storage.ecrire('', 'abc'), false)
  assert.equal(await storage.lire('', 'vide'), 'vide')
  assert.equal(await storage.supprimer('', 'abc'), false)
  assert.equal(await storage.vider(), false)
  assert.equal(await storage.nettoyerClesObsoletes('pas-un-tableau'), 0)
  assert.equal(logs[0][0], 'warn')
})

test('refuse les cles non declarees quand le storage est limite', async () => {
  const logs = []
  const client = creerClientStorageMemoire()
  const storage = serviceStorage({
    client,
    allowedKeys: Object.values(clesStorage),
    logger: {
      warn: (...args) => logs.push(['warn', ...args]),
      error: (...args) => logs.push(['error', ...args]),
    },
  })

  assert.equal(await storage.ecrire('cle.libre', 'abc'), false)
  assert.equal(await storage.lire('cle.libre', 'vide'), 'vide')
  await assert.rejects(() => storage.lireStrict('cle.libre', 'vide'), {
    message: 'cle storage non autorisee',
  })
  assert.equal(logs[0][0], 'warn')
})
