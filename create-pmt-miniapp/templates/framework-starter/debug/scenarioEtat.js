function executerScenarioEtat(etat, options = {}) {
  if (!etat) {
    console.error('[debug] gestionnaireEtat introuvable');
    return;
  }

  const logger = typeof options.logger === 'function' ? options.logger : console.log;
  const getNoyau = typeof options.getNoyau === 'function' ? options.getNoyau : () => ({});

  const role = etat.get('utilisateur.nom', 'Invite');
  const invite = etat.get('utilisateur.role', 'Invite');
  logger('role:', role);
  logger('invite:', invite);

  etat.set('utilisateur.nom', 'Aicha');
  etat.set('utilisateur.nom', 'Moussa');

  const cleSupprimee = etat.remove('utilisateur.nom');
  logger('remove:', cleSupprimee);
  logger('apres remove:', etat.get('utilisateur.nom', 'Invite'));

  const noyau = getNoyau() || {};
  logger('[Page] Noyau keys:', Object.keys(noyau));
}

module.exports = { executerScenarioEtat };
