const { apiConfig } = require('./api.config')
const { authApiConfig } = require('./authApi.config')
const { serviceApi } = require('./serviceApi')
const {
  creerAuthApiClient,
  mapperReponseLoginParDefaut,
  mapperReponseSessionCouranteParDefaut,
} = require('./authApiClient')

module.exports = {
  apiConfig,
  authApiConfig,
  serviceApi,
  creerAuthApiClient,
  mapperReponseLoginParDefaut,
  mapperReponseSessionCouranteParDefaut,
}
