const fs = require('fs')
const path = require('path')
const { analyserConfigurationRoutage } = require('../core/navigation/navigationConfig.shared')

const racineProjet = path.resolve(__dirname, '..')
const cheminRoutes = path.join(racineProjet, 'routage', 'routes.json')
const cheminAppJson = path.join(racineProjet, 'app.json')
const cheminRoutesRuntime = path.join(racineProjet, 'core', 'navigation', 'routes.runtime.js')
const modeWatch = process.argv.includes('--watch')

function chargerConfigurationRoutage() {
  const configuration = JSON.parse(fs.readFileSync(cheminRoutes, 'utf8'))
  return analyserConfigurationRoutage(configuration)
}

function synchroniserAppJson() {
  const configurationRoutage = chargerConfigurationRoutage()
  const { pages, pageEntree, routes } = configurationRoutage
  const appConfig = JSON.parse(fs.readFileSync(cheminAppJson, 'utf8'))

  appConfig.pages = pages

  const contenu = `${JSON.stringify(appConfig, null, 2)}\n`
  fs.writeFileSync(cheminAppJson, contenu, 'utf8')
  fs.writeFileSync(cheminRoutesRuntime, construireRoutesRuntime(pageEntree, routes), 'utf8')

  console.log(`[syncAppPages] ${pages.length} pages synchronisees dans app.json et routes.runtime.js`)
}

function construireRoutesRuntime(pageEntree, routes) {
  const routesFormatees = JSON.stringify(routes, null, 2)
    .split('\n')
    .map((ligne) => (ligne ? `  ${ligne}` : ligne))
    .join('\n')

  return `const pageEntreeNavigation = ${JSON.stringify(pageEntree)}\nconst routesNavigation = Object.freeze(\n${routesFormatees}\n)\n\nmodule.exports = {\n  pageEntreeNavigation,\n  routesNavigation,\n}\n`
}

function demarrerModeWatch() {
  let timer = null

  console.log('[syncAppPages] mode watch actif')
  console.log(`[syncAppPages] surveillance de ${cheminRoutes}`)

  fs.watch(cheminRoutes, () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      try {
        synchroniserAppJson()
      } catch (erreur) {
        console.error('[syncAppPages] echec de synchronisation:', erreur.message)
      }
    }, 80)
  })
}

try {
  synchroniserAppJson()

  if (modeWatch) {
    demarrerModeWatch()
  }
} catch (erreur) {
  console.error('[syncAppPages] erreur:', erreur.message)
  process.exit(1)
}
