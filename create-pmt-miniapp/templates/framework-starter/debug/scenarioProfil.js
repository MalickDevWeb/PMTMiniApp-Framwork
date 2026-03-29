function executerScenarioProfil(profilService, options = {}) {
  if (!profilService) {
    console.error('[debug] profilService introuvable')
    return
  }

  const logger = typeof options.logger === 'function' ? options.logger : console.log
  const getNoyau = typeof options.getNoyau === 'function' ? options.getNoyau : () => ({})

  const nomInitial = profilService.lireNom('Invite')
  logger('nom initial:', nomInitial)

  profilService.mettreNom('Aicha')
  profilService.mettreNom('Moussa')

  const supprime = profilService.supprimerNom()
  logger('remove nom:', supprime)
  logger('apres remove:', profilService.lireNom('Invite'))

  const noyau = getNoyau() || {}
  logger('[Page] Noyau keys:', Object.keys(noyau))
}

module.exports = { executerScenarioProfil }
