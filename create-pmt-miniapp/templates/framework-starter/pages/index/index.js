const { tracerCycleVie } = require('../../debug/lifecycleTrace');
const {
  serviceApp,
  attendreInitialisationApp,
} = require('../../core/app-services/serviceApp');

// pages/index/index.js
Page({
  data: {
    initialisationEnCours: true,
    nomActuel: 'Invite',
  },

  chargerNomCourant() {
    const { profilService } = serviceApp();
    if (!profilService) return;

    const nom = profilService.lireNom('Invite');
    if (nom !== this.data.nomActuel) {
      this.setData({ nomActuel: nom });
    }
  },

  async allerLogin() {
    const { navigation } = serviceApp();
    if (!navigation) {
      console.error('[index] service navigation introuvable');
      return;
    }

    try {
      const res = await navigation.remplacerPage('login');
      console.log('[index] remplacerPage login success:', res);
    } catch (err) {
      console.error('[index] remplacerPage login fail:', err);
    }
  },

  async allerHome() {
    const { navigation } = serviceApp();
    if (!navigation) {
      console.error('[index] service navigation introuvable');
      return;
    }

    try {
      const res = await navigation.remplacerPage('home');
      console.log('[index] remplacerPage home success:', res);
    } catch (err) {
      console.error('[index] remplacerPage home fail:', err);
    }
  },

  async allerDemoFramework() {
    const { navigation } = serviceApp();
    if (!navigation) {
      console.error('[index] service navigation introuvable');
      return;
    }

    try {
      const res = await navigation.allerA('frameworkDemo');
      console.log('[index] allerA frameworkDemo success:', res);
    } catch (err) {
      console.error('[index] allerA frameworkDemo fail:', err);
    }
  },

  supprimerNomDepuisIndex() {
    const { profilService } = serviceApp();
    if (!profilService) {
      console.error('[index] profilService introuvable');
      return;
    }

    const ok = profilService.supprimerNom();
    console.log('[index] supprimer nom:', ok);
    this.chargerNomCourant();
  },

  onLoad() {
    const { profilService } = serviceApp();
    tracerCycleVie('index', 'onLoad');
    if (!profilService) {
      console.error('[index] profilService introuvable');
      return;
    }

    this._arreterNom = profilService.onNomChange((v) => {
      const nom = typeof v === 'string' && v.trim().length > 0 ? v : 'Invite';
      this.setData({ nomActuel: nom });
      console.log('[index] onNomChange:', v);
    });
  },

  async onShow() {
    tracerCycleVie('index', 'onShow');
    this.setData({ initialisationEnCours: true });

    try {
      await attendreInitialisationApp();
      this.chargerNomCourant();
    } finally {
      this.setData({ initialisationEnCours: false });
    }
  },

  onUnload() {
    tracerCycleVie('index', 'onUnload');
    if (typeof this._arreterNom === 'function') {
      this._arreterNom();
      this._arreterNom = null;
    }
  },
});
