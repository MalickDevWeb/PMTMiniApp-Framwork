const { tracerCycleVie } = require('../../debug/lifecycleTrace');
const {
  serviceApp,
  attendreInitialisationApp,
} = require('../../core/app-services/serviceApp');

Page({
  data: {
    initialisationEnCours: true,
    inputNom: '',
    nomActuel: 'Invite',
    messageTitre: '',
    messageVariante: 'info',
    message: '',
  },

  handleInputNom(e) {
    this.setData({ inputNom: e.detail.value || '' });
  },

  actualiserNom() {
    const { profilService } = serviceApp();
    if (!profilService) return;

    const nom = profilService.lireNom('Invite');
    if (nom !== this.data.nomActuel) {
      this.setData({ nomActuel: nom });
    }
  },

  sauvegarderNom() {
    const { profilService } = serviceApp();
    if (!profilService) {
      console.error('[login] profilService introuvable');
      return;
    }

    const ok = profilService.mettreNom(this.data.inputNom);
    this.setData({
      messageTitre: ok ? 'Succès' : 'Erreur',
      messageVariante: ok ? 'succes' : 'erreur',
      message: ok ? 'Nom sauvegardé avec succès.' : 'Nom invalide. Le texte est vide.',
      inputNom: ok ? '' : this.data.inputNom,
    });
    this.actualiserNom();
  },

  viderNom() {
    const { profilService } = serviceApp();
    if (!profilService) {
      console.error('[login] profilService introuvable');
      return;
    }

    const ok = profilService.supprimerNom();
    this.setData({
      messageTitre: ok ? 'Information' : 'Information',
      messageVariante: ok ? 'alerte' : 'info',
      message: ok ? 'Nom supprimé.' : 'Aucun nom à supprimer.',
    });
    this.actualiserNom();
  },

  fermerMessage() {
    this.setData({
      messageTitre: '',
      messageVariante: 'info',
      message: '',
    });
  },

  async allerIndex() {
    const { navigation } = serviceApp();
    if (!navigation) {
      console.error('[login] service navigation introuvable');
      return;
    }

    try {
      const res = await navigation.remplacerPage('index');
      console.log('[login] remplacerPage index success:', res);
    } catch (err) {
      console.error('[login] remplacerPage index fail:', err);
    }
  },

  async allerHome() {
    const { navigation } = serviceApp();
    if (!navigation) {
      console.error('[login] service navigation introuvable');
      return;
    }

    try {
      const res = await navigation.remplacerPage('home');
      console.log('[login] remplacerPage home success:', res);
    } catch (err) {
      console.error('[login] remplacerPage home fail:', err);
    }
  },

  onLoad() {
    tracerCycleVie('login', 'onLoad');
    const { profilService } = serviceApp();
    if (!profilService) {
      console.error('[login] profilService introuvable');
      return;
    }

    this._arreterNom = profilService.onNomChange((v) => {
      const nom = typeof v === 'string' && v.trim().length > 0 ? v : 'Invite';
      this.setData({ nomActuel: nom });
      console.log('[login] onNomChange:', v);
    });
  },

  async onShow() {
    tracerCycleVie('login', 'onShow');
    this.setData({ initialisationEnCours: true });

    try {
      await attendreInitialisationApp();
      this.actualiserNom();
    } finally {
      this.setData({ initialisationEnCours: false });
    }
  },

  onUnload() {
    tracerCycleVie('login', 'onUnload');
    if (typeof this._arreterNom === 'function') {
      this._arreterNom();
      this._arreterNom = null;
    }
  },
});
