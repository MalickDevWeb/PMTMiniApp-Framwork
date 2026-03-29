Component({
  options: {
    multipleSlots: true,
  },

  properties: {
    visible: { type: Boolean, value: false },
    titre: { type: String, value: '' },
    message: { type: String, value: '' },
    texteActionPrimaire: { type: String, value: 'Confirmer' },
    texteActionSecondaire: { type: String, value: 'Annuler' },
    afficherActionSecondaire: { type: Boolean, value: false },
    overlayColor: { type: String, value: '#000' },
    overlayOpacity: { type: Number, value: 0.5 },
    placement: { type: String, value: 'center' },
    size: { type: String, value: 'md' },
    blur: { type: Number, value: 6 },
    classeConteneur: { type: String, value: '' },
    classeOverlay: { type: String, value: '' },
    fermetureBackdrop: { type: Boolean, value: true },
    loading: { type: Boolean, value: false },
  },

  data: {
    overlayRGBA: '',
    computedStyle: '',
  },

  lifetimes: {
    attached() {
      this.computeOverlay();
      this.computeStyle();
    },
  },

  observers: {
    'overlayColor, overlayOpacity': function () {
      this.computeOverlay();
    },
    'placement, size': function () {
      this.computeStyle();
    },
  },

  methods: {
    computeOverlay() {
      const { overlayColor, overlayOpacity } = this.properties;
      const alpha = Math.min(Math.max(overlayOpacity, 0), 1);
      this.setData({
        overlayRGBA: this.hexToRGBA(overlayColor, alpha),
      });
    },

    computeStyle() {
      const { placement, size } = this.properties;
      const isAtBottom = placement === 'bottom';

      let justify = isAtBottom ? 'flex-end' : 'center';
      let width = '80%';

      if (size === 'sm') width = '60%';
      else if (size === 'lg') width = '90%';
      else if (size === 'full') width = '100%';

      const bottomStyles = isAtBottom ? 'border-bottom-left-radius: 0 !important; border-bottom-right-radius: 0 !important;' : '';
      const styles = `width: ${width} !important; align-self: ${justify};`;

      this.setData({
        computedStyle: styles + bottomStyles,
      });
    },

    onOverlayTap() {
      if (this.properties.fermetureBackdrop) {
        this.triggerEvent('close');
      }
    },

    handleCancel() {
      if (this.properties.loading) return;
      this.triggerEvent('cancel');
    },

    handleConfirm() {
      if (this.properties.loading) return;
      this.triggerEvent('confirm');
    },

    hexToRGBA(hex, alpha = 1) {
      let r = 0, g = 0, b = 0;

      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
      }

      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
  },
})
