const { tracerCycleVie } = require('../../debug/lifecycleTrace');
const {
  serviceApp,
  attendreInitialisationApp,
} = require('../../core/app-services/serviceApp');

// pages/home/home.js
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

  async allerIndex() {
    const { navigation } = serviceApp();
    if (!navigation) {
      console.error('[home] service navigation introuvable');
      return;
    }

    try {
      const res = await navigation.remplacerPage('index');
      console.log('[home] remplacerPage index success:', res);
    } catch (err) {
      console.error('[home] remplacerPage index fail:', err);
    }
  },

  async allerLogin() {
    const { navigation } = serviceApp();
    if (!navigation) {
      console.error('[home] service navigation introuvable');
      return;
    }

    try {
      const res = await navigation.remplacerPage('login');
      console.log('[home] remplacerPage login success:', res);
    } catch (err) {
      console.error('[home] remplacerPage login fail:', err);
    }
  },

  async allerDemoFramework() {
    const { navigation } = serviceApp();
    if (!navigation) {
      console.error('[home] service navigation introuvable');
      return;
    }

    try {
      const res = await navigation.allerA('frameworkDemo');
      console.log('[home] allerA frameworkDemo success:', res);
    } catch (err) {
      console.error('[home] allerA frameworkDemo fail:', err);
    }
  },

  onLoad() {
    tracerCycleVie('home', 'onLoad');
    const { profilService } = serviceApp();
    if (!profilService) {
      console.error('[home] profilService introuvable');
      return;
    }

    this._arreterNom = profilService.onNomChange((v) => {
      const nom = typeof v === 'string' && v.trim().length > 0 ? v : 'Invite';
      this.setData({ nomActuel: nom });
      console.log('[home] onNomChange:', v);
    });
  },

  async onShow() {
    tracerCycleVie('home', 'onShow');
    this.setData({ initialisationEnCours: true });

    try {
      await attendreInitialisationApp();
      this.chargerNomCourant();
    } finally {
      this.setData({ initialisationEnCours: false });
    }
  },

  onUnload() {
    tracerCycleVie('home', 'onUnload');
    if (typeof this._arreterNom === 'function') {
      this._arreterNom();
      this._arreterNom = null;
    }
  },
});
