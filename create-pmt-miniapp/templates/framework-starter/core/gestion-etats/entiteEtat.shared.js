const {
  cleValide,
  creerNoopUnsubscribe,
  estObjetSimple,
} = require('./shared')

function creerServiceEntiteEtat(etat, options = {}) {
  const cleBase = cleValide(options.cleBase) ? options.cleBase.trim() : ''
  const champs = Array.isArray(options.champs)
    ? options.champs.filter((champ) => cleValide(champ)).map((champ) => champ.trim())
    : []
  const valeurParDefautEntite = typeof options.valeurParDefautEntite === 'undefined'
    ? null
    : options.valeurParDefautEntite
  const cleEntiteCourante = cleBase ? `${cleBase}.courant` : ''

  function etatDisponible(nomMethode) {
    return !!(etat && typeof etat[nomMethode] === 'function')
  }

  function cleChamp(nomChamp) {
    return cleValide(cleBase) && cleValide(nomChamp) ? `${cleBase}.${nomChamp.trim()}` : ''
  }

  function lireEntite(valeurParDefaut = valeurParDefautEntite) {
    if (!etatDisponible('get') || !cleValide(cleEntiteCourante)) return valeurParDefaut

    const entite = etat.get(cleEntiteCourante, valeurParDefaut)
    return estObjetSimple(entite) ? { ...entite } : valeurParDefaut
  }

  function lireChamp(nomChamp, valeurParDefaut = '') {
    const cle = cleChamp(nomChamp)
    if (!etatDisponible('get') || !cleValide(cle)) return valeurParDefaut
    return etat.get(cle, valeurParDefaut)
  }

  function hydraterEntite(entite) {
    if (!etatDisponible('set') || !estObjetSimple(entite) || !cleValide(cleEntiteCourante)) {
      return false
    }

    const copieEntite = { ...entite }
    const okEntite = etat.set(cleEntiteCourante, copieEntite)
    if (!okEntite) return false

    champs.forEach((champ) => {
      const cle = cleChamp(champ)
      if (!cle) return

      if (Object.prototype.hasOwnProperty.call(copieEntite, champ)) {
        etat.set(cle, copieEntite[champ])
        return
      }

      if (etatDisponible('remove')) {
        etat.remove(cle)
      }
    })

    return true
  }

  function fusionnerEntite(partiel) {
    if (!estObjetSimple(partiel)) return false

    const entiteActuelle = lireEntite({})
    const base = estObjetSimple(entiteActuelle) ? entiteActuelle : {}
    return hydraterEntite({
      ...base,
      ...partiel,
    })
  }

  function supprimerEntite() {
    if (!etatDisponible('remove') || !cleValide(cleEntiteCourante)) return false

    let supprime = etat.remove(cleEntiteCourante)
    champs.forEach((champ) => {
      const cle = cleChamp(champ)
      if (!cle) return
      if (etat.remove(cle)) supprime = true
    })

    return supprime
  }

  function mettreChamp(nomChamp, valeur) {
    if (!cleValide(nomChamp)) return false

    const entiteActuelle = lireEntite({})
    const base = estObjetSimple(entiteActuelle) ? entiteActuelle : {}

    return hydraterEntite({
      ...base,
      [nomChamp.trim()]: valeur,
    })
  }

  function supprimerChamp(nomChamp) {
    if (!etatDisponible('remove') || !cleValide(nomChamp)) return false

    const nomChampNettoye = nomChamp.trim()
    const cle = cleChamp(nomChampNettoye)
    const entiteActuelle = lireEntite(null)
    let supprime = false

    if (cle && etat.remove(cle)) {
      supprime = true
    }

    if (!estObjetSimple(entiteActuelle) || !Object.prototype.hasOwnProperty.call(entiteActuelle, nomChampNettoye)) {
      return supprime
    }

    const prochaineEntite = { ...entiteActuelle }
    delete prochaineEntite[nomChampNettoye]

    if (Object.keys(prochaineEntite).length === 0) {
      if (etat.remove(cleEntiteCourante)) {
        return true
      }

      return supprime
    }

    return hydraterEntite(prochaineEntite) || supprime
  }

  function onEntiteChange(callback) {
    if (!etatDisponible('onState') || !cleValide(cleEntiteCourante) || typeof callback !== 'function') {
      return creerNoopUnsubscribe()
    }

    return etat.onState(cleEntiteCourante, callback)
  }

  function onChampChange(nomChamp, callback) {
    const cle = cleChamp(nomChamp)
    if (!etatDisponible('onState') || !cleValide(cle) || typeof callback !== 'function') {
      return creerNoopUnsubscribe()
    }

    return etat.onState(cle, callback)
  }

  return {
    lireEntite,
    lireChamp,
    hydraterEntite,
    fusionnerEntite,
    supprimerEntite,
    mettreChamp,
    supprimerChamp,
    onEntiteChange,
    onChampChange,
  }
}

module.exports = {
  creerServiceEntiteEtat,
}
