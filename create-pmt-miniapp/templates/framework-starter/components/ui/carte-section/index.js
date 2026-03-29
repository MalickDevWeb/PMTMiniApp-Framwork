Component({
  options: {
    multipleSlots: true,
  },

  properties: {
    titre: {
      type: String,
      value: '',
    },
    sousTitre: {
      type: String,
      value: '',
    },
    texteAction: {
      type: String,
      value: '',
    },
    compacte: {
      type: Boolean,
      value: false,
    },
    accentuee: {
      type: Boolean,
      value: false,
    },
    classeConteneur: {
      type: String,
      value: '',
    },
  },

  methods: {
    handleActionTap() {
      this.triggerEvent('actiontap');
    },
  },
})
