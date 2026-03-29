const { definitionsStorageSimples } = require('./definitionsStorageSimples')
const {
  creerServicesStorageSimples,
  lireClesStorageSimples,
  creerProfilStorageService,
} = require('./servicesStorageSimples')

const clesStorageSimples = lireClesStorageSimples()

module.exports = {
  definitionsStorageSimples,
  clesStorageSimples,
  creerServicesStorageSimples,
  creerProfilStorageService,
}
