Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
    titre: {
      type: String,
      value: 'Chargement',
    },
    message: {
      type: String,
      value: 'Veuillez patienter...',
    },
    pleinEcran: {
      type: Boolean,
      value: true,
    },
    compact: {
      type: Boolean,
      value: false,
    },
    fondTransparent: {
      type: Boolean,
      value: false,
    },
  },
})
