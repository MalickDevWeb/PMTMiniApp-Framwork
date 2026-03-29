const { sessionStorageConfig } = require('./sessionStorage.config')
const { creerSessionStorageService } = require('./sessionStorageService')
const { creerSessionService } = require('./sessionService')

const clesStorage = Object.freeze({
  SESSION_TOKEN: sessionStorageConfig.cle,
})

module.exports = {
  clesStorage,
  sessionStorageConfig,
  creerSessionStorageService,
  creerSessionService,
}
