function tracerCycleVie(pageName, hookName, details) {
  const base = `[lifecycle][${pageName}] ${hookName}`;
  if (typeof details === 'undefined') {
    console.log(base);
    return;
  }
  console.log(base, details);
}

module.exports = { tracerCycleVie };
