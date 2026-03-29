const { creerServiceTexteStorage } = require('../serviceTexteStorage.shared')
const { sessionStorageConfig } = require('./sessionStorage.config')

function creerSessionStorageService(storage) {
  const serviceTexteStorage = creerServiceTexteStorage(storage, {
    cle: sessionStorageConfig.cle,
    valeurParDefaut: sessionStorageConfig.valeurParDefaut,
    optionsStorage: sessionStorageConfig.optionsStorage,
  })

  return {
    lireToken: serviceTexteStorage.lireValeur,
    lireTokenStrict: serviceTexteStorage.lireValeurStrict,
    sauvegarderToken: serviceTexteStorage.sauvegarderValeur,
    supprimerToken: serviceTexteStorage.supprimerValeur,
  }
}

module.exports = {
  creerSessionStorageService,
}
