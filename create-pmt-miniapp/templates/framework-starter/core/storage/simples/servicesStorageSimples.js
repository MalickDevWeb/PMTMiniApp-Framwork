const { creerServiceTexteStorage } = require('../serviceTexteStorage.shared')
const { definitionsStorageSimples } = require('./definitionsStorageSimples')

function lireDefinitionsStorageSimples() {
  return Object.entries(definitionsStorageSimples)
}

function creerServiceStorageSimple(storage, definition) {
  const serviceTexteStorage = creerServiceTexteStorage(storage, {
    cle: definition.cle,
    valeurParDefaut: definition.valeurParDefaut,
    optionsStorage: definition.optionsStorage,
  })

  return {
    [definition.methodes.lire]: serviceTexteStorage.lireValeur,
    [definition.methodes.lireStrict]: serviceTexteStorage.lireValeurStrict,
    [definition.methodes.sauvegarder]: serviceTexteStorage.sauvegarderValeur,
    [definition.methodes.supprimer]: serviceTexteStorage.supprimerValeur,
  }
}

function creerServicesStorageSimples(storage) {
  const services = {}

  lireDefinitionsStorageSimples().forEach(([, definition]) => {
    services[definition.nomService] = creerServiceStorageSimple(storage, definition)
  })

  return services
}

function lireClesStorageSimples() {
  const clesStorageSimples = {}

  lireDefinitionsStorageSimples().forEach(([nomCle, definition]) => {
    clesStorageSimples[nomCle] = definition.cle
  })

  return Object.freeze(clesStorageSimples)
}

function lireDefinitionStorageSimpleParService(nomService) {
  return lireDefinitionsStorageSimples()
    .map(([, definition]) => definition)
    .find((definition) => definition.nomService === nomService) || null
}

function creerServiceStorageSimpleParService(storage, nomService) {
  const definition = lireDefinitionStorageSimpleParService(nomService)
  if (!definition) {
    throw new Error(`service storage simple inconnu: ${nomService}`)
  }

  return creerServiceStorageSimple(storage, definition)
}

function creerProfilStorageService(storage) {
  return creerServiceStorageSimpleParService(storage, 'profilStorageService')
}

module.exports = {
  lireDefinitionsStorageSimples,
  creerServiceStorageSimple,
  creerServicesStorageSimples,
  lireClesStorageSimples,
  lireDefinitionStorageSimpleParService,
  creerServiceStorageSimpleParService,
  creerProfilStorageService,
}
