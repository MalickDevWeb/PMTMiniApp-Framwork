const fs = require('fs')
const path = require('path')
const {
  analyserConfigurationRoutage,
  estObjetSimple,
  normaliserPageRoute,
} = require('../core/navigation/navigationConfig.shared')

const racineProjet = path.resolve(__dirname, '..')
const cheminRoutes = path.join(racineProjet, 'routage', 'routes.json')
const cheminAppJson = path.join(racineProjet, 'app.json')
const cheminProjectConfig = path.join(racineProjet, 'project.config.json')

function lireJson(chemin) {
  return JSON.parse(fs.readFileSync(chemin, 'utf8'))
}

function verifierRoutes() {
  const configuration = lireJson(cheminRoutes)
  return analyserConfigurationRoutage(configuration)
}

function verifierAppJson(pagesAttendues) {
  const appConfig = lireJson(cheminAppJson)
  const pagesActuelles = Array.isArray(appConfig.pages)
    ? appConfig.pages.map(normaliserPageRoute)
    : null

  if (!pagesActuelles) {
    throw new Error('app.json.pages doit etre un tableau')
  }

  const estSynchro = JSON.stringify(pagesActuelles) === JSON.stringify(pagesAttendues)
  if (!estSynchro) {
    throw new Error('app.json.pages n est pas synchronise avec routage/routes.json')
  }
}

function verifierHooksProjet() {
  const projectConfig = lireJson(cheminProjectConfig)
  const scripts = estObjetSimple(projectConfig.scripts) ? projectConfig.scripts : {}
  const hooks = ['beforeCompile', 'beforePreview', 'beforeUpload']

  hooks.forEach((hook) => {
    if (!commandeHookValide(scripts[hook])) {
      throw new Error(`project.config.json -> scripts.${hook} doit lancer la synchronisation de navigation`)
    }
  })
}

function commandeHookValide(commande) {
  if (typeof commande !== 'string' || commande.trim().length === 0) return false

  const commandeNormalisee = commande.trim()
    .replace(/\\/g, '/')
    .replace(/\s+/g, ' ')

  return /\bnode(?:\.exe)?\b/i.test(commandeNormalisee)
    && /scripts\/syncAppPages\.js(?:\s|$)/i.test(commandeNormalisee)
}

function main() {
  const { pageEntree, pages, routesListe } = verifierRoutes()
  verifierAppJson(pages)
  verifierHooksProjet()

  console.log('[doctorNavigation] configuration navigation OK')
  console.log(`[doctorNavigation] ${pages.length} routes detectees`)
  console.log(`[doctorNavigation] pageEntree -> ${pageEntree}`)
  routesListe.forEach(({ nomRoute, cheminPage, estPageEntree }) => {
    const suffixe = estPageEntree ? ' [entree]' : ''
    console.log(`[doctorNavigation] - ${nomRoute} -> ${cheminPage}${suffixe}`)
  })
}

try {
  main()
} catch (erreur) {
  console.error('[doctorNavigation] erreur:', erreur.message)
  process.exit(1)
}
