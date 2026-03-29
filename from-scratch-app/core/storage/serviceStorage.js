const {
  cleStorageValide,
  cleStorageAutorisee,
  erreurCleAbsente,
  analyserDonneeStorage,
  construireEnveloppeStorage,
  construireErreurStorage,
  normaliserCleStorage,
  normaliserClientStorage,
  normaliserListeClesStorage,
  normaliserLogger,
  methodeStorageDisponible,
} = require('./storage.shared')

function serviceStorage(options = {}) {
  const clientSource = typeof options.client !== 'undefined'
    ? options.client
    : (typeof wx !== 'undefined' ? wx : null)
  const client = normaliserClientStorage(clientSource)
  const logger = normaliserLogger(options.logger)
  const clesAutorisees = normaliserListeClesStorage(options.allowedKeys)
  const accesLibre = options.allowAnyKey === true || !clesAutorisees
  const chiffrementActif = detecterChiffrementActif()
  let avertissementChiffrementAffiche = false

  function lirePlateformeClient() {
    if (typeof wx === 'undefined' || !clientSource || clientSource !== wx) {
      return ''
    }

    try {
      if (typeof wx.getDeviceInfo === 'function') {
        const deviceInfo = wx.getDeviceInfo()
        return deviceInfo && typeof deviceInfo.platform === 'string'
          ? deviceInfo.platform.trim().toLowerCase()
          : ''
      }
    } catch (error) {
      logger.warn('[serviceStorage] lecture plateforme device impossible')
    }

    try {
      if (typeof wx.getSystemInfoSync === 'function') {
        const systemInfo = wx.getSystemInfoSync()
        return systemInfo && typeof systemInfo.platform === 'string'
          ? systemInfo.platform.trim().toLowerCase()
          : ''
      }
    } catch (error) {
      logger.warn('[serviceStorage] lecture plateforme systeme impossible')
    }

    return ''
  }

  function detecterChiffrementActif() {
    if (options.encryptEnabled === true) return true
    if (options.encryptEnabled === false) return false
    if (typeof wx === 'undefined' || !clientSource || clientSource !== wx) return true

    const plateformeClient = lirePlateformeClient()
    if (plateformeClient.includes('devtools')) {
      logger.warn('[serviceStorage] chiffrement storage desactive dans WeChat DevTools')
      return false
    }

    if (typeof wx.getAccountInfoSync !== 'function') return false

    try {
      const accountInfo = wx.getAccountInfoSync()
      const appId = accountInfo
        && accountInfo.miniProgram
        && typeof accountInfo.miniProgram.appId === 'string'
        ? accountInfo.miniProgram.appId.trim()
        : ''

      return appId.length > 0
    } catch (error) {
      logger.warn('[serviceStorage] chiffrement storage desactive: account info indisponible')
      return false
    }
  }

  function construireConfigOperation(baseConfig, optionsOperation = {}) {
    if (optionsOperation && optionsOperation.encrypt === true) {
      if (!chiffrementActif) {
        if (!avertissementChiffrementAffiche) {
          logger.warn('[serviceStorage] chiffrement storage indisponible dans cet environnement, fallback non chiffre')
          avertissementChiffrementAffiche = true
        }

        return baseConfig
      }

      return {
        ...baseConfig,
        encrypt: true,
      }
    }

    return baseConfig
  }

  function accesCleRefuse(cle, nomOperation, mode = 'stable') {
    const cleNettoyee = normaliserCleStorage(cle)

    if (!cleStorageValide(cle)) {
      logger.warn(`[serviceStorage] ${nomOperation}: cle invalide`, cle)
      if (mode === 'strict') {
        return construireErreurStorage('cle storage invalide', { cle })
      }
      return true
    }

    if (!accesLibre && !cleStorageAutorisee(cleNettoyee, clesAutorisees)) {
      logger.warn(`[serviceStorage] ${nomOperation}: cle non autorisee`, cleNettoyee)
      if (mode === 'strict') {
        return construireErreurStorage('cle storage non autorisee', { cle: cleNettoyee })
      }
      return true
    }

    return false
  }

  function lireDonneeClient(cle, optionsLecture = {}) {
    return new Promise((resolve, reject) => {
      client.getStorage(construireConfigOperation({
        key: normaliserCleStorage(cle),
        success: (resultat) => resolve(resultat.data),
        fail: (error) => reject(error),
      }, optionsLecture))
    })
  }

  async function lireInterne(cle, valeurParDefaut, mode, optionsLecture = {}) {
    const lectureStricte = mode === 'strict'
    const erreurAccesCle = accesCleRefuse(cle, lectureStricte ? 'lireStrict' : 'lire', mode)

    if (erreurAccesCle) {
      if (lectureStricte) {
        return Promise.reject(erreurAccesCle)
      }
      return valeurParDefaut
    }

    if (!methodeStorageDisponible(client, 'getStorage')) {
      logger.warn(`[serviceStorage] ${lectureStricte ? 'lireStrict' : 'lire'}: client storage indisponible`)
      if (lectureStricte) {
        return Promise.reject(construireErreurStorage('client storage indisponible', {
          cle: normaliserCleStorage(cle),
        }))
      }
      return valeurParDefaut
    }

    try {
      const donneeBrute = await lireDonneeClient(cle, optionsLecture)
      const resultat = analyserDonneeStorage(donneeBrute)

      if (resultat.statut === 'legacy' || resultat.statut === 'ok') {
        return resultat.valeur
      }

      if (resultat.statut === 'expire') {
        logger.warn(`[serviceStorage] ${lectureStricte ? 'lireStrict' : 'lire'}: valeur expiree`, {
          cle: normaliserCleStorage(cle),
          expireAt: resultat.expireAt,
        })
        await supprimerInterne(cle)
        return valeurParDefaut
      }

      logger.error(`[serviceStorage] ${lectureStricte ? 'lireStrict' : 'lire'}: format storage invalide`, {
        cle: normaliserCleStorage(cle),
        statut: resultat.statut,
        version: resultat.version,
      })

      if (lectureStricte) {
        throw construireErreurStorage('format storage invalide', {
          cle: normaliserCleStorage(cle),
          statut: resultat.statut,
          version: resultat.version,
        })
      }

      return valeurParDefaut
    } catch (error) {
      if (erreurCleAbsente(error)) {
        return valeurParDefaut
      }

      if (error && error.message === 'format storage invalide') {
        throw error
      }

      logger.error(`[serviceStorage] ${lectureStricte ? 'lireStrict' : 'lire'} fail:`, error)

      if (lectureStricte) {
        throw construireErreurStorage('lecture storage impossible', {
          cle: normaliserCleStorage(cle),
          error,
        })
      }

      return valeurParDefaut
    }
  }

  function supprimerInterne(cle) {
    const erreurAccesCle = accesCleRefuse(cle, 'supprimer')

    if (erreurAccesCle) {
      return Promise.resolve({ ok: false, existait: false })
    }

    if (!methodeStorageDisponible(client, 'removeStorage')) {
      logger.warn('[serviceStorage] supprimer: client storage indisponible')
      return Promise.resolve({ ok: false, existait: false })
    }

    return new Promise((resolve) => {
      client.removeStorage({
        key: normaliserCleStorage(cle),
        success: () => resolve({ ok: true, existait: true }),
        fail: (error) => {
          if (erreurCleAbsente(error)) {
            resolve({ ok: true, existait: false })
            return
          }

          logger.error('[serviceStorage] supprimer fail:', error)
          resolve({ ok: false, existait: false })
        },
      })
    })
  }

  function ecrire(cle, valeur, optionsEcriture = {}) {
    const erreurAccesCle = accesCleRefuse(cle, 'ecrire')
    if (erreurAccesCle) {
      return Promise.resolve(false)
    }

    if (!methodeStorageDisponible(client, 'setStorage')) {
      logger.warn('[serviceStorage] ecrire: client storage indisponible')
      return Promise.resolve(false)
    }

    const enveloppe = construireEnveloppeStorage(valeur, optionsEcriture)
    if (!enveloppe) {
      logger.warn('[serviceStorage] ecrire: options expiration invalides', optionsEcriture)
      return Promise.resolve(false)
    }

    return new Promise((resolve) => {
      client.setStorage(construireConfigOperation({
        key: normaliserCleStorage(cle),
        data: enveloppe,
        success: () => resolve(true),
        fail: (error) => {
          logger.error('[serviceStorage] ecrire fail:', error)
          resolve(false)
        },
      }, optionsEcriture))
    })
  }

  function lire(cle, valeurParDefaut = null, optionsLecture = {}) {
    return lireInterne(cle, valeurParDefaut, 'tolerant', optionsLecture)
  }

  function lireStrict(cle, valeurParDefaut = null, optionsLecture = {}) {
    return lireInterne(cle, valeurParDefaut, 'strict', optionsLecture)
  }

  function supprimer(cle) {
    return supprimerInterne(cle).then((resultat) => resultat.ok)
  }

  function vider() {
    if (!methodeStorageDisponible(client, 'clearStorage')) {
      logger.warn('[serviceStorage] vider: client storage indisponible')
      return Promise.resolve(false)
    }

    return new Promise((resolve) => {
      client.clearStorage({
        success: () => resolve(true),
        fail: (error) => {
          logger.error('[serviceStorage] vider fail:', error)
          resolve(false)
        },
      })
    })
  }

  async function nettoyerClesObsoletes(cles = []) {
    if (!Array.isArray(cles)) {
      logger.warn('[serviceStorage] nettoyerClesObsoletes: liste invalide')
      return 0
    }

    let totalSupprime = 0

    for (const cle of cles) {
      if (!cleStorageValide(cle)) continue
      const resultat = await supprimerInterne(cle)
      if (resultat.ok && resultat.existait) totalSupprime += 1
    }

    return totalSupprime
  }

  return {
    ecrire,
    lire,
    lireStrict,
    supprimer,
    vider,
    nettoyerClesObsoletes,
  }
}

module.exports = {
  serviceStorage,
}
