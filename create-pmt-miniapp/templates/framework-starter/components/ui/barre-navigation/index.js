Component({
  options: {
    multipleSlots: true,
  },

  properties: {
    titre: { type: String, value: '' },
    sousTitre: { type: String, value: '' },
    afficherRetour: { type: Boolean, value: true },
    retourAutomatique: { type: Boolean, value: true },
    transparent: { type: Boolean, value: false },
    couleurFond: { type: String, value: '#ffffff' },
    couleurTexte: { type: String, value: '#14253d' },
  },

  data: {
    statusBarHeight: 0,
    navHeight: 44,
  },

  lifetimes: {
    attached() {
      let statusBarHeight = 20;

      if (typeof wx.getWindowInfo === 'function') {
        const windowInfo = wx.getWindowInfo();
        statusBarHeight = windowInfo.statusBarHeight || 20;
      } else if (typeof wx.getSystemInfoSync === 'function') {
        const sysInfo = wx.getSystemInfoSync();
        statusBarHeight = sysInfo.statusBarHeight || 20;
      }

      this.setData({
        statusBarHeight,
      });
    },
  },

  methods: {
    handleBackTap() {
      this.triggerEvent('backtap');

      if (!this.properties.retourAutomatique) return;

      const pages = getCurrentPages();
      if (pages.length > 1) {
        wx.navigateBack();
      }
    },
  },
})
