Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
    variante: {
      type: String,
      value: 'info',
    },
    titre: {
      type: String,
      value: '',
    },
    message: {
      type: String,
      value: '',
    },
    texteAction: {
      type: String,
      value: '',
    },
    fermetureVisible: {
      type: Boolean,
      value: true,
    },
    compacte: {
      type: Boolean,
      value: false,
    },
  },

  methods: {
    handleActionTap() {
      this.triggerEvent('actiontap')
    },

    handleCloseTap() {
      this.triggerEvent('closetap')
    },
  },
})
