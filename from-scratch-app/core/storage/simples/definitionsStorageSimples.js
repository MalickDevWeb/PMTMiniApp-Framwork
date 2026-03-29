const definitionsStorageSimples = Object.freeze({
  UTILISATEUR_NOM: Object.freeze({
    nomService: 'profilStorageService',
    cle: 'utilisateur.nom',
    valeurParDefaut: 'Invite',
    optionsStorage: Object.freeze({}),
    methodes: Object.freeze({
      lire: 'lireNom',
      lireStrict: 'lireNomStrict',
      sauvegarder: 'sauvegarderNom',
      supprimer: 'supprimerNom',
    }),
  }),
})

module.exports = {
  definitionsStorageSimples,
}
