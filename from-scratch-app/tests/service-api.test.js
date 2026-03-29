const test = require('node:test')
const assert = require('node:assert/strict')

const { serviceApi } = require('../core/api-layer/serviceApi')

function creerClientRequest(handler) {
  return {
    request(config) {
      Promise.resolve()
        .then(() => handler(config))
        .then((reponse) => config.success(reponse))
        .catch((error) => config.fail(error))
    },
  }
}

test('apiService ajoute Authorization si auth=true', async () => {
  let requeteCapturee = null

  const apiService = serviceApi({
    baseUrl: 'https://api.exemple.com',
    sessionService: {
      lireToken() {
        return 'abc123'
      },
    },
    client: creerClientRequest((config) => {
      requeteCapturee = config
      return {
        statusCode: 200,
        data: { ok: true },
        header: { 'x-test': '1' },
      }
    }),
  })

  const reponse = await apiService.get('/me', { auth: true })

  assert.deepEqual(reponse, { ok: true })
  assert.equal(requeteCapturee.url, 'https://api.exemple.com/me')
  assert.equal(requeteCapturee.method, 'GET')
  assert.equal(requeteCapturee.header.Authorization, 'Bearer abc123')
})

test('apiService rejette une erreur normalisee si statusCode non 2xx', async () => {
  const apiService = serviceApi({
    baseUrl: 'https://api.exemple.com',
    client: creerClientRequest(() => ({
      statusCode: 401,
      data: { message: 'unauthorized' },
      header: {},
    })),
  })

  await assert.rejects(
    apiService.get('/me', { auth: true }),
    (error) => error && error.isApiError === true && error.statusCode === 401,
  )
})
