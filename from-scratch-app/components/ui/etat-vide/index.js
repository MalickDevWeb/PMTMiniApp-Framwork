Component({
  properties: {
    visible: {
      type: Boolean,
      value: true,
    },
    emoji: {
      type: String,
      value: '○',
    },
    titre: {
      type: String,
      value: 'Aucune donnée',
    },
    message: {
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
  },

  methods: {
    handleActionTap() {
      this.triggerEvent('actiontap')
    },
  },
})
