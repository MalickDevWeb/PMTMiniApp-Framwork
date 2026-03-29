const test = require('node:test')
const assert = require('node:assert/strict')

const { gestionnaireEtat } = require('../core/gestion-etats/gestionnaireEtat.shared')
const { creerUtilisateurService } = require('../core/gestion-etats/utilisateurService')
const { creerCompteService } = require('../core/gestion-etats/compteService')
const { serviceStorage } = require('../core/storage/serviceStorage')
const { creerSessionStorageService } = require('../core/storage/session')
const { creerSessionService } = require('../core/storage/session')
const { creerAuthService } = require('../core/auth')

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
  }
}

function creerServices() {
  const etat = gestionnaireEtat({})
  const utilisateurService = creerUtilisateurService(etat)
  const compteService = creerCompteService(etat)
  const storage = serviceStorage({ client: creerClientStorageMemoire() })
  const sessionStorageService = creerSessionStorageService(storage)
  const sessionService = creerSessionService({
    etat,
    sessionStorageService,
  })
  const authService = creerAuthService({
    sessionService,
    utilisateurService,
    compteService,
  })

  return {
    authService,
    sessionService,
    utilisateurService,
    compteService,
  }
}

test('ouvrirSession synchronise token, utilisateur et compte', async () => {
  const {
    authService,
    sessionService,
    utilisateurService,
    compteService,
  } = creerServices()

  const ok = await authService.ouvrirSession({
    token: 'abc123',
    expiresInSeconds: 3600,
    utilisateur: {
      id: 'u1',
      nom: 'Aicha',
    },
    compte: {
      id: 'c1',
      type: 'client',
    },
  })

  assert.equal(ok, true)
  assert.equal(sessionService.estConnecte(), true)
  assert.equal(utilisateurService.lireNom('Invite'), 'Aicha')
  assert.equal(compteService.lireType(''), 'client')
})

test('deconnecter supprime token, utilisateur et compte', async () => {
  const {
    authService,
    sessionService,
    utilisateurService,
    compteService,
  } = creerServices()

  await authService.ouvrirSession({
    token: 'abc123',
    utilisateur: { id: 'u1', nom: 'Aicha' },
    compte: { id: 'c1', type: 'client' },
  })

  assert.equal(await authService.deconnecter(), true)
  assert.equal(sessionService.estConnecte(), false)
  assert.equal(utilisateurService.lireUtilisateur(null), null)
  assert.equal(compteService.lireCompte(null), null)
})

test('strategie local expose login et logout', async () => {
  const {
    authService,
    sessionService,
  } = creerServices()

  assert.equal(authService.strategie, 'local')

  const okLogin = await authService.login({
    token: 'xyz789',
    utilisateur: { id: 'u2', nom: 'Fatou' },
  })

  assert.equal(okLogin, true)
  assert.equal(sessionService.lireToken(''), 'xyz789')

  const okLogout = await authService.logout()
  assert.equal(okLogout, true)
  assert.equal(sessionService.estConnecte(), false)
})

test('strategie api consomme login, session courante et logout distants', async () => {
  const etat = gestionnaireEtat({})
  const utilisateurService = creerUtilisateurService(etat)
  const compteService = creerCompteService(etat)
  const storage = serviceStorage({ client: creerClientStorageMemoire() })
  const sessionStorageService = creerSessionStorageService(storage)
  const sessionService = creerSessionService({
    etat,
    sessionStorageService,
  })

  const appels = []
  const authService = creerAuthService({
    strategie: 'api',
    sessionService,
    utilisateurService,
    compteService,
    apiClient: {
      async login(payload) {
        appels.push(['login', payload])
        return {
          token: 'api-token',
          expiresInSeconds: 3600,
          utilisateur: { id: 'u3', nom: 'Mariama', email: 'mariama@mail.com' },
          compte: { id: 'c3', type: 'pro', nom: 'Compte pro' },
        }
      },
      async sessionCourante({ token }) {
        appels.push(['sessionCourante', token])
        return {
          utilisateur: { id: 'u3', nom: 'Mariama', email: 'mariama@mail.com' },
          compte: { id: 'c3', type: 'pro', nom: 'Compte pro' },
        }
      },
      async logout({ token }) {
        appels.push(['logout', token])
        return true
      },
    },
  })

  assert.equal(authService.strategie, 'api')
  assert.equal(await authService.login({ email: 'mariama@mail.com', password: 'secret' }), true)
  assert.equal(sessionService.lireToken(''), 'api-token')
  assert.equal(utilisateurService.lireNom(''), 'Mariama')
  assert.equal(compteService.lireType(''), 'pro')

  utilisateurService.supprimerUtilisateur()
  compteService.supprimerCompte()

  assert.equal(await authService.restaurer(), true)
  assert.equal(utilisateurService.lireEmail(''), 'mariama@mail.com')
  assert.equal(compteService.lireNom(''), 'Compte pro')

  assert.equal(await authService.logout(), true)
  assert.equal(sessionService.estConnecte(), false)
  assert.deepEqual(appels, [
    ['login', { email: 'mariama@mail.com', password: 'secret' }],
    ['sessionCourante', 'api-token'],
    ['logout', 'api-token'],
  ])
})
