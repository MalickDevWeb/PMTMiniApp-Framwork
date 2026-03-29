Component({
  properties: {
    texte: {
      type: String,
      value: '',
    },
    variante: {
      type: String,
      value: 'primaire',
    },
    taille: {
      type: String,
      value: 'moyen',
    },
    pleinLargeur: {
      type: Boolean,
      value: true,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    loading: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    pressed: false,
  },

  methods: {
    handlePress() {
      if (!this.properties.disabled && !this.properties.loading) {
        this.triggerEvent('press');
      }
    },
    handleTouchStart() {
      if (!this.properties.disabled) {
        this.setData({ pressed: true });
      }
    },
    handleTouchEnd() {
      this.setData({ pressed: false });
    },
  },
})
