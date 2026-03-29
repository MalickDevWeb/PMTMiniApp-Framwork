const test = require('node:test')
const assert = require('node:assert/strict')

const { creerAuthApiClient } = require('../core/api-layer/authApiClient')

test('authApiClient mappe une reponse login REST classique', async () => {
  const appels = []
  const authApiClient = creerAuthApiClient({
    post: async (path, data, options) => {
      appels.push(['post', path, data, options])
      return {
        access_token: 'abc123',
        expires_in: 3600,
        user: {
          id: 'u1',
          nom: 'Aicha',
          email: 'aicha@mail.com',
        },
        account: {
          id: 'c1',
          type: 'client',
        },
      }
    },
    get: async (path, options) => {
      appels.push(['get', path, options])
      return {
        user: {
          id: 'u1',
          nom: 'Aicha',
          email: 'aicha@mail.com',
        },
        account: {
          id: 'c1',
          type: 'client',
        },
      }
    },
    supprimer: async (path, options) => {
      appels.push(['supprimer', path, options])
      return { ok: true }
    },
  })

  const login = await authApiClient.login({
    email: 'aicha@mail.com',
    password: 'secret',
  })
  const sessionCourante = await authApiClient.sessionCourante()
  await authApiClient.logout()

  assert.deepEqual(login, {
    token: 'abc123',
    expiresInSeconds: 3600,
    utilisateur: {
      id: 'u1',
      nom: 'Aicha',
      email: 'aicha@mail.com',
    },
    compte: {
      id: 'c1',
      type: 'client',
    },
  })
  assert.deepEqual(sessionCourante, {
    utilisateur: {
      id: 'u1',
      nom: 'Aicha',
      email: 'aicha@mail.com',
    },
    compte: {
      id: 'c1',
      type: 'client',
    },
  })
  assert.deepEqual(appels, [
    ['post', '/login', { email: 'aicha@mail.com', password: 'secret' }, {}],
    ['get', '/me', { auth: true, headers: undefined }],
    ['post', '/logout', null, { auth: true }],
  ])
})
