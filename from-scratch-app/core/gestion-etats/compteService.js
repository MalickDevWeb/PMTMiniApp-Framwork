const { creerServiceEntiteEtat } = require('./entiteEtat.shared')

function creerCompteService(etat) {
  const serviceEntiteEtat = creerServiceEntiteEtat(etat, {
    cleBase: 'compte',
    champs: ['id', 'type', 'nom'],
    valeurParDefautEntite: null,
  })

  function lireCompte(valeurParDefaut = null) {
    return serviceEntiteEtat.lireEntite(valeurParDefaut)
  }

  function hydraterCompte(compte) {
    return serviceEntiteEtat.hydraterEntite(compte)
  }

  function fusionnerCompte(partiel) {
    return serviceEntiteEtat.fusionnerEntite(partiel)
  }

  function supprimerCompte() {
    return serviceEntiteEtat.supprimerEntite()
  }

  function onCompteChange(callback) {
    return serviceEntiteEtat.onEntiteChange(callback)
  }

  function lireId(valeurParDefaut = '') {
    return serviceEntiteEtat.lireChamp('id', valeurParDefaut)
  }

  function lireType(valeurParDefaut = '') {
    return serviceEntiteEtat.lireChamp('type', valeurParDefaut)
  }

  function lireNom(valeurParDefaut = '') {
    return serviceEntiteEtat.lireChamp('nom', valeurParDefaut)
  }

  return {
    lireCompte,
    hydraterCompte,
    fusionnerCompte,
    supprimerCompte,
    onCompteChange,
    lireId,
    lireType,
    lireNom,
  }
}

module.exports = {
  creerCompteService,
}
