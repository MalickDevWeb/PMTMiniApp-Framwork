const { clesStorage: clesSessionStorage } = require('./session/index')
const { clesStorageSimples } = require('./simples/index')

const clesStorage = Object.freeze({
  ...clesSessionStorage,
  ...clesStorageSimples,
})

module.exports = {
  clesStorage,
}
