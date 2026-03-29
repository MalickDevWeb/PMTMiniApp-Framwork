const { corrigerPageEntreeAuDemarrage } = require('./pageEntreeDemarrage.shared')

function creerDefinitionApp({ initialiserNoyau, nomApp = 'App' }) {
  if (typeof initialiserNoyau !== 'function') {
    throw new Error('`initialiserNoyau` doit etre une fonction')
  }

  return {
    onLaunch() {
      this.globalData = this.globalData || {}
      this.globalData.noyau = initialiserNoyau({ app: this })

      console.log(`[${nomApp}] Demarer...`)
      console.log(`[${nomApp}] noyau keys :`, Object.keys(this.globalData.noyau))
    },

    onShow() {
      corrigerPageEntreeAuDemarrage(this)
    },
  }
}

module.exports = {
  creerDefinitionApp,
}
