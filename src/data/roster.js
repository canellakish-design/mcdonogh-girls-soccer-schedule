// =====================================================================
// SQUAD — the one place a player's position is recorded.
// ---------------------------------------------------------------------
// Positions came from Harry, player by player. Note they do NOT always
// match the `back: true` flags in the practice points log: Amber was
// flagged a back on Aug 19 but plays forward. Position here is the truth;
// the flag in the log is per-session bookkeeping.
//
//   pos: 'GK' | 'DEF' | 'MID' | 'FWD' | null   (null = not given yet)
//   injured: true                              status, not a position
//
// A clean sheet is worth 2 to a keeper or defender and 1 to everyone
// else, so `isBack()` below is the check the scoring should use.
// =====================================================================

export const roster = [
  { name: 'Alex', pos: 'MID' },
  { name: 'Alyssa', pos: 'MID' },
  { name: 'Amber', pos: 'FWD' },
  { name: 'Anna', pos: 'DEF' },
  { name: 'Ari', pos: 'FWD' },
  { name: 'Aubrey', pos: 'DEF' },
  { name: 'Cassie', pos: 'GK' },
  { name: 'Grace', pos: 'FWD' },
  { name: 'Isabelle', pos: 'MID' },
  { name: 'Kaitlyn', pos: 'DEF' },
  { name: 'Kate', pos: 'GK' },
  { name: 'Layla', pos: 'FWD' },
  { name: 'Lily', pos: 'FWD' },
  { name: 'Mary', pos: null, injured: true },
  { name: 'Maya', pos: 'DEF' },
  { name: 'Parker', pos: 'DEF' },
  { name: 'Paula', pos: 'FWD' },
  { name: 'Samara', pos: 'MID' },
  { name: 'Virginia', pos: 'DEF' },
  { name: 'Viv', pos: null, injured: true },
  { name: 'Zoe', pos: 'FWD' },
]

export const POSITION_NAMES = {
  GK: 'Goalkeeper',
  DEF: 'Defender',
  MID: 'Midfielder',
  FWD: 'Forward',
}

// Display order for a squad list: back to front.
export const POSITION_ORDER = ['GK', 'DEF', 'MID', 'FWD']

const byName = new Map(roster.map((p) => [p.name, p]))

export function player(name) {
  return byName.get(name) || null
}

export function positionOf(name) {
  return byName.get(name)?.pos ?? null
}

// Keepers and defenders take 2 for a clean sheet instead of 1.
export function isBack(name) {
  const pos = positionOf(name)
  return pos === 'GK' || pos === 'DEF'
}

export function byPosition() {
  return POSITION_ORDER.map((pos) => ({
    pos,
    name: POSITION_NAMES[pos],
    players: roster.filter((p) => p.pos === pos),
  }))
}

export const unassigned = roster.filter((p) => !p.pos)
