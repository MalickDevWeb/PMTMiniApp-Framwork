const { spawnSync } = require('child_process')
const path = require('path')

const racineProjet = path.resolve(__dirname, '..')

function executerNode(args, label) {
  const resultat = spawnSync(process.execPath, args, {
    cwd: racineProjet,
    stdio: 'inherit',
  })

  if (resultat.status !== 0) {
    process.exit(resultat.status || 1)
  }

  console.log(`[checkNavigation] ${label} OK`)
}

executerNode(['scripts/doctorNavigation.js'], 'doctor')
executerNode(['--test', 'tests/navigation-config.test.js'], 'tests')
