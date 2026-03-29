const { serviceNavigation } = require('./serviceNavigation')
const {
  pageValide,
  paramsValides,
  deltaValide,
} = require('./validations')
const {
  pageEntreeNavigation,
  routesNavigation,
  resoudrePage,
} = require('./routes')

module.exports = {
  serviceNavigation,
  pageValide,
  paramsValides,
  deltaValide,
  pageEntreeNavigation,
  routesNavigation,
  resoudrePage,
}
