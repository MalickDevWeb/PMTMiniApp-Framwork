function creerServiceTexteStorage(storage, options = {}) {
  const cle = options.cle
  const valeurParDefaut = options.valeurParDefaut
  const optionsStorage = options.optionsStorage || {}

  function fusionnerOptionsEcriture(optionsEcriture = {}) {
    return {
      ...optionsStorage,
      ...optionsEcriture,
    }
  }

  function lireValeur(fallback = valeurParDefaut) {
    if (!storage || typeof storage.lire !== 'function') {
      return Promise.resolve(fallback)
    }

    return storage.lire(cle, fallback, optionsStorage)
  }

  function lireValeurStrict(fallback = valeurParDefaut) {
    if (!storage || typeof storage.lireStrict !== 'function') {
      return Promise.reject(new Error('service storage indisponible'))
    }

    return storage.lireStrict(cle, fallback, optionsStorage)
  }

  function sauvegarderValeur(valeur, optionsEcriture = {}) {
    if (!storage || typeof storage.ecrire !== 'function') {
      return Promise.resolve(false)
    }

    if (typeof valeur !== 'string') {
      return Promise.resolve(false)
    }

    const valeurNettoyee = valeur.trim()
    if (!valeurNettoyee) {
      return Promise.resolve(false)
    }

    return storage.ecrire(cle, valeurNettoyee, fusionnerOptionsEcriture(optionsEcriture))
  }

  function supprimerValeur() {
    if (!storage || typeof storage.supprimer !== 'function') {
      return Promise.resolve(false)
    }

    return storage.supprimer(cle)
  }

  return {
    lireValeur,
    lireValeurStrict,
    sauvegarderValeur,
    supprimerValeur,
  }
}

module.exports = {
  creerServiceTexteStorage,
}
