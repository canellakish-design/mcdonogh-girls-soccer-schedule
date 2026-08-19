// The players-only gate. One shared code, remembered on the device so a
// player enters it once. No accounts, no server.
//
// Worth being clear about what this is: it hides practice points from a
// parent scrolling the site. It is not security — the page is public, and
// what sits behind the code is in the source for anyone who looks.

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { PLAYERS_CODE } from './data/schedule.js'

const STORE_KEY = 'mcdonogh-players-code'

// Forgiving about how it is typed: case and spaces never decide the answer.
const normalise = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, '')

// The stored value is the code itself, so changing PLAYERS_CODE in the data
// locks every device that held the old one.
function storedIsCurrent() {
  try {
    return localStorage.getItem(STORE_KEY) === normalise(PLAYERS_CODE)
  } catch {
    return false // private browsing, or storage disabled
  }
}

const Ctx = createContext({ unlocked: false, unlock: () => false, lock: () => {} })

export function PlayerAccessProvider({ children }) {
  const [unlocked, setUnlocked] = useState(storedIsCurrent)

  // Another tab unlocking or locking should not leave this one disagreeing.
  useEffect(() => {
    const on = (e) => {
      if (e.key === STORE_KEY) setUnlocked(storedIsCurrent())
    }
    window.addEventListener('storage', on)
    return () => window.removeEventListener('storage', on)
  }, [])

  const unlock = useCallback((input) => {
    if (normalise(input) !== normalise(PLAYERS_CODE)) return false
    try {
      localStorage.setItem(STORE_KEY, normalise(PLAYERS_CODE))
    } catch {
      // Storage unavailable — unlock for this visit only.
    }
    setUnlocked(true)
    return true
  }, [])

  const lock = useCallback(() => {
    try {
      localStorage.removeItem(STORE_KEY)
    } catch {
      // Nothing stored to clear.
    }
    setUnlocked(false)
  }, [])

  return <Ctx.Provider value={{ unlocked, unlock, lock }}>{children}</Ctx.Provider>
}

export function usePlayerAccess() {
  return useContext(Ctx)
}
