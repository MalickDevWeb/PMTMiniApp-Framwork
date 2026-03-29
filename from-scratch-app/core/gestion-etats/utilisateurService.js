const { creerServiceEntiteEtat } = require('./entiteEtat.shared')

function creerUtilisateurService(etat) {
  const serviceEntiteEtat = creerServiceEntiteEtat(etat, {
    cleBase: 'utilisateur',
    champs: ['id', 'nom', 'email'],
    valeurParDefautEntite: null,
  })

  function lireUtilisateur(valeurParDefaut = null) {
    return serviceEntiteEtat.lireEntite(valeurParDefaut)
  }

  function hydraterUtilisateur(utilisateur) {
    return serviceEntiteEtat.hydraterEntite(utilisateur)
  }

  function fusionnerUtilisateur(partiel) {
    return serviceEntiteEtat.fusionnerEntite(partiel)
  }

  function supprimerUtilisateur() {
    return serviceEntiteEtat.supprimerEntite()
  }

  function onUtilisateurChange(callback) {
    return serviceEntiteEtat.onEntiteChange(callback)
  }

  function lireId(valeurParDefaut = '') {
    return serviceEntiteEtat.lireChamp('id', valeurParDefaut)
  }

  function lireNom(valeurParDefaut = 'Invite') {
    return serviceEntiteEtat.lireChamp('nom', valeurParDefaut)
  }

  function lireEmail(valeurParDefaut = '') {
    return serviceEntiteEtat.lireChamp('email', valeurParDefaut)
  }

  function mettreNom(nom) {
    if (typeof nom !== 'string') return false

    const nomNettoye = nom.trim()
    if (!nomNettoye) return false

    return serviceEntiteEtat.mettreChamp('nom', nomNettoye)
  }

  function supprimerNom() {
    return serviceEntiteEtat.supprimerChamp('nom')
  }

  function onNomChange(callback) {
    return serviceEntiteEtat.onChampChange('nom', callback)
  }

  return {
    lireUtilisateur,
    hydraterUtilisateur,
    fusionnerUtilisateur,
    supprimerUtilisateur,
    onUtilisateurChange,
    lireId,
    lireNom,
    lireEmail,
    mettreNom,
    supprimerNom,
    onNomChange,
  }
}

module.exports = {
  creerUtilisateurService,
}
