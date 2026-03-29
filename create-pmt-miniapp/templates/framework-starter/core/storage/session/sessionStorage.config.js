const sessionStorageConfig = Object.freeze({
  cle: 'session.token',
  valeurParDefaut: '',
  optionsStorage: Object.freeze({
    encrypt: true,
  }),
})

module.exports = {
  sessionStorageConfig,
}
