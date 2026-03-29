Component({
  properties: {
    nom: {
      type: String,
      value: '',
    },
    label: {
      type: String,
      value: '',
    },
    value: {
      type: String,
      value: '',
    },
    placeholder: {
      type: String,
      value: '',
    },
    type: {
      type: String,
      value: 'text',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    requis: {
      type: Boolean,
      value: false,
    },
    erreur: {
      type: String,
      value: '',
    },
    aide: {
      type: String,
      value: '',
    },
    maxlength: {
      type: Number,
      value: 140,
    },
    confirmType: {
      type: String,
      value: 'done',
    },
    motDePasse: {
      type: Boolean,
      value: false,
    },
    effacable: {
      type: Boolean,
      value: false,
    },
    classeConteneur: {
      type: String,
      value: '',
    },
  },
  methods: {
    buildDetail(e) {
      return {
        nom: this.properties.nom,
        value: e && e.detail ? e.detail.value : this.properties.value,
      };
    },
    handleInput(e) {
      this.triggerEvent('input', this.buildDetail(e));
    },
    handleConfirm(e) {
      this.triggerEvent('confirm', this.buildDetail(e));
    },
    handleBlur(e) {
      this.triggerEvent('blur', this.buildDetail(e));
    },
    handleFocus(e) {
      this.triggerEvent('focus', this.buildDetail(e));
    },
    handleClear() {
      if (this.properties.disabled) return;

      this.triggerEvent('clear', {
        nom: this.properties.nom,
      });
      this.triggerEvent('input', {
        nom: this.properties.nom,
        value: '',
      });
    }
  }
})
