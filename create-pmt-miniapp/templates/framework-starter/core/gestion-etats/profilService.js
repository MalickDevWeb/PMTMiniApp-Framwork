const { creerUtilisateurService } = require('./utilisateurService')

function creerProfilService(source) {
  const utilisateurService = source && typeof source.lireUtilisateur === 'function'
    ? source
    : creerUtilisateurService(source)

  return {
    lireNom: utilisateurService.lireNom,
    mettreNom: utilisateurService.mettreNom,
    onNomChange: utilisateurService.onNomChange,
    supprimerNom: utilisateurService.supprimerNom,
  }
}

module.exports = {
  creerProfilService,
}
