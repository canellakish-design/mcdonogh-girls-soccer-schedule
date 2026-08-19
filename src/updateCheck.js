// Safari keeps a home-screen page alive for days, and pull-to-refresh does
// not always reach the network — so the squad can sit on a stale schedule
// long after a new one is published.
//
// Whenever the page comes back into view, ask the server what bundle the
// current build points at. If it has moved on, reload. Offline or in dev
// (where the entry is /src/main.jsx, not a hashed asset) this does nothing.

const BUNDLE = /assets\/index-[A-Za-z0-9_-]+\.js/

const running = [...document.getElementsByTagName('script')]
  .map((s) => s.getAttribute('src') || '')
  .find((src) => BUNDLE.test(src))

async function checkForUpdate() {
  if (!running || document.visibilityState !== 'visible') return
  try {
    const res = await fetch('/index.html', { cache: 'no-store' })
    if (!res.ok) return
    const deployed = (await res.text()).match(BUNDLE)
    if (deployed && !running.endsWith(deployed[0])) window.location.reload()
  } catch {
    // Offline: keep showing what we already have.
  }
}

export function watchForUpdates() {
  document.addEventListener('visibilitychange', checkForUpdate)
  window.addEventListener('pageshow', checkForUpdate)
  checkForUpdate()
}
