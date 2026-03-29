const { tracerCycleVie } = require('../../debug/lifecycleTrace');
const {
  serviceApp,
  attendreInitialisationApp,
} = require('../../core/app-services/serviceApp');

function attendre(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

Page({
  data: {
    initialisationEnCours: true,
    chargementSimulation: false,
    dialogueVisible: false,
    messageVisible: false,
    messageVariante: 'info',
    messageTitre: '',
    messageTexte: '',
    nomSaisi: '',
    nomCourant: 'Invite',
  },

  chargerNomCourant() {
    const { profilService } = serviceApp();
    if (!profilService) return;

    const nom = profilService.lireNom('Invite');
    this.setData({
      nomCourant: nom,
      nomSaisi: nom === 'Invite' ? '' : nom,
    });
  },

  afficherMessage(variante, titre, message) {
    this.setData({
      messageVisible: true,
      messageVariante: variante,
      messageTitre: titre,
      messageTexte: message,
    });
  },

  fermerMessage() {
    this.setData({
      messageVisible: false,
      messageVariante: 'info',
      messageTitre: '',
      messageTexte: '',
    });
  },

  handleInputNom(event) {
    const valeur = event && event.detail && typeof event.detail.value === 'string'
      ? event.detail.value
      : '';

    this.setData({
      nomSaisi: valeur,
    });
  },

  sauvegarderNom() {
    const { profilService } = serviceApp();
    if (!profilService) {
      this.afficherMessage('erreur', 'Service indisponible', 'Le service profil est introuvable.');
      return;
    }

    const nom = this.data.nomSaisi.trim();
    if (!nom) {
      this.afficherMessage('alerte', 'Nom requis', 'Saisis un nom avant de sauvegarder.');
      return;
    }

    const ok = profilService.mettreNom(nom);
    if (!ok) {
      this.afficherMessage('erreur', 'Échec', 'Le nom n’a pas pu être sauvegardé.');
      return;
    }

    this.chargerNomCourant();
    this.afficherMessage('succes', 'Nom sauvegardé', 'Le service profil a bien mis à jour l’état global.');
  },

  supprimerNom() {
    const { profilService } = serviceApp();
    if (!profilService) {
      this.afficherMessage('erreur', 'Service indisponible', 'Le service profil est introuvable.');
      return;
    }

    const ok = profilService.supprimerNom();
    if (!ok) {
      this.afficherMessage('info', 'Aucun changement', 'Aucun nom n’était enregistré.');
      return;
    }

    this.chargerNomCourant();
    this.afficherMessage('info', 'Nom supprimé', 'L’état global a été nettoyé.');
  },

  async simulerChargement() {
    this.setData({
      chargementSimulation: true,
    });

    try {
      await attendre(800);
      this.afficherMessage('info', 'Simulation terminée', 'Le composant de chargement a été affiché correctement.');
    } finally {
      this.setData({
        chargementSimulation: false,
      });
    }
  },

  ouvrirDialogue() {
    this.setData({
      dialogueVisible: true,
    });
  },

  fermerDialogue() {
    this.setData({
      dialogueVisible: false,
    });
  },

  confirmerDialogue() {
    this.setData({
      dialogueVisible: false,
    });
    this.afficherMessage('succes', 'Dialogue confirmé', 'La boîte de dialogue a bien renvoyé son action.');
  },

  async allerLogin() {
    const { navigation } = serviceApp();
    if (!navigation) return;
    await navigation.allerA('login');
  },

  async allerHome() {
    const { navigation } = serviceApp();
    if (!navigation) return;
    await navigation.allerA('home');
  },

  onLoad() {
    tracerCycleVie('framework-demo', 'onLoad');

    const { profilService } = serviceApp();
    if (!profilService) return;

    this._arreterNom = profilService.onNomChange((nom) => {
      const nomCourant = typeof nom === 'string' && nom.trim() ? nom : 'Invite';
      this.setData({
        nomCourant,
        nomSaisi: nomCourant === 'Invite' ? '' : nomCourant,
      });
    });
  },

  async onShow() {
    tracerCycleVie('framework-demo', 'onShow');
    this.setData({
      initialisationEnCours: true,
    });

    try {
      await attendreInitialisationApp();
      this.chargerNomCourant();
    } finally {
      this.setData({
        initialisationEnCours: false,
      });
    }
  },

  onUnload() {
    tracerCycleVie('framework-demo', 'onUnload');
    if (typeof this._arreterNom === 'function') {
      this._arreterNom();
      this._arreterNom = null;
    }
  },
});
