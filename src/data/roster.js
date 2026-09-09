// =====================================================================
// SQUAD — the one place a player's position and number are recorded.
// ---------------------------------------------------------------------
// Positions came from Harry player by player; numbers, the captain, and
// the starting eleven come from his Canva design "McDonogh Varsity 3-5-2
// Lineup" (Sep 4). Position here is the truth — the `back: true` flags in
// the practice points log are per-session bookkeeping and have been wrong
// (Amber was flagged a back on Aug 19 but plays forward).
//
//   pos:     'GK' | 'DEF' | 'MID' | 'FWD' | null   (null = not given yet)
//   no:      jersey number; null where the shirt shows "GK" instead
//   slot:    where she starts in the 3-5-2, if she is in the eleven
//   captain: true
//   injured: true                                   status, not a position
//   aka:     other spellings used elsewhere in the data
//
// A clean sheet is worth 2 to a keeper or defender and 1 to everyone
// else, so `isBack()` below is the check the scoring should use.
// =====================================================================

export const FORMATION = '3-5-2'

export const roster = [
  // --- starting eleven, back to front ---
  { name: 'Kate', pos: 'GK', no: null, slot: 'GK' },
  { name: 'Kaitlyn', pos: 'DEF', no: 17, slot: 'LCB' },
  { name: 'Virginia', pos: 'DEF', no: 5, slot: 'CB' },
  { name: 'Parker', pos: 'DEF', no: 9, slot: 'RCB' },
  { name: 'Grace', pos: 'FWD', no: 6, slot: 'LWB' },
  { name: 'Alyssa', pos: 'MID', no: 11, slot: 'CDM' },
  { name: 'Samara', pos: 'MID', no: 10, slot: 'LCM' },
  { name: 'Isabelle', pos: 'MID', no: 16, slot: 'RCM' },
  { name: 'Zoe', pos: 'FWD', no: 2, slot: 'RWB', aka: ['Zoë'] },
  { name: 'Lily', pos: 'FWD', no: 7, slot: 'ST' },
  { name: 'Layla', pos: 'FWD', no: 25, slot: 'ST' },
  // --- bench ---
  { name: 'Amber', pos: 'FWD', no: 3, captain: true },
  { name: 'Vivienne', pos: null, no: 13, injured: true, aka: ['Viv'] },
  { name: 'Anna', pos: 'DEF', no: 14 },
  { name: 'Paula', pos: 'FWD', no: 12 },
  { name: 'Mary', pos: null, no: 24, injured: true },
  { name: 'Maya', pos: 'DEF', no: 18 },
  { name: 'Ari', pos: 'FWD', no: 4 },
  { name: 'Aubrey', pos: 'DEF', no: 20 },
  { name: 'Alex', pos: 'MID', no: 19 },
  // --- on the squad lists, not on the Sep 4 lineup ---
  { name: 'Cassie', pos: 'GK', no: null },
]

export const POSITION_NAMES = {
  GK: 'Goalkeeper',
  DEF: 'Defender',
  MID: 'Midfielder',
  FWD: 'Forward',
}

// Display order for a squad list: back to front.
export const POSITION_ORDER = ['GK', 'DEF', 'MID', 'FWD']

// Resolve a name or any alias to the player record.
const byName = new Map()
for (const p of roster) {
  byName.set(p.name, p)
  for (const a of p.aka || []) byName.set(a, p)
}

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

export const startingXI = roster.filter((p) => p.slot)
export const bench = roster.filter((p) => !p.slot)
export const captain = roster.find((p) => p.captain) || null

export function byPosition() {
  return POSITION_ORDER.map((pos) => ({
    pos,
    name: POSITION_NAMES[pos],
    players: roster.filter((p) => p.pos === pos),
  }))
}

export const unassigned = roster.filter((p) => !p.pos)
