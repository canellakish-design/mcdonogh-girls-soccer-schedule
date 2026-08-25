// =====================================================================
// McDONOGH SCHOOL — GIRLS VARSITY SOCCER — TEAM SCHEDULE
// SOURCE OF TRUTH for the site. Edit this file to update the schedule.
// ---------------------------------------------------------------------
// Match schedule mirrors the official McDonogh Athletics page:
//   https://www.mcdonogh.org/athletics/teams-schedules/sport/girls-soccer/girls-varsity-soccer/2995
//
// SEASON RULES currently baked in:
//   • Week 1 runs Sat Aug 15 → Fri Aug 21. Tryouts Aug 15–17, 9:00 AM.
//     Training that week is 9:00 AM, except Thu Aug 20 at 11:00 AM;
//     the Aug 19 Orange v. White match is 7:00 PM.
//   • Aug 22–23 (Sat/Sun) off. Training resumes Mon Aug 24.
//   • From Aug 24 on: weekday training at 4:00 PM; matches keep their listed times.
//     Weekends are off unless there is a match.
//
// EACH DAY (one card):
//   type: 'training' -> blue "TRAINING" badge   |   'match' -> orange "MATCH" badge
//   home: true (we host, "vs.") | false (we travel, "@") | 'neutral' (third site)
//   scrimmage: true -> grey "SCRIMMAGE" tag     |   playoff: true -> "PLAYOFFS" tag
//   result: '' -> fill in after the game, e.g. 'W 3–1' / 'L 0–2' / 'T 1–1'
//   focus:  '' -> training theme or pre-match focus
//   note:   '' -> bus time, uniforms, conflicts, anything else
//
// sortDate (YYYY-MM-DD) drives ordering and the "Today" highlight — keep it accurate.
// =====================================================================

export const TEAM = {
  school: 'McDonogh School',
  program: 'Girls Varsity Soccer',
  season: 'Fall 2026',
  title: 'Team Schedule',
  coaches: 'Harry Canellakis · Mary Beth Todd',
}

// ---------------------------------------------------------------------
// VENUES — keyed by the `location` string used on a day.
//   onCampus: true  -> show the McDonogh campus map
//   query:          -> destination for the Google Maps directions link.
//                      Place name + city resolves reliably; no API key needed.
// ---------------------------------------------------------------------
const MCDONOGH = '8600 McDonogh Road, Owings Mills, MD 21117'

export const VENUES = {
  'McDonogh — Field 16': {
    onCampus: true,
    address: MCDONOGH,
    map: '/campus-map.png',
    mapCaption: 'McDonogh campus — the arrow marks Field 16.',
  },
  'McDonogh — Dixon Field (Turf)': {
    onCampus: true,
    address: MCDONOGH,
    map: '/campus-map-dixon.png',
    mapCaption: 'McDonogh campus — the arrow marks Dixon Turf Field.',
  },
  'McDonogh — Rollins-Luetkemeyer Athletic Center': {
    onCampus: true,
    address: MCDONOGH,
  },
  'Seminary Park — Turf Field': {
    address: 'Seminary Park, Lutherville-Timonium, MD 21093',
    map: '/venues/seminary-park.png',
  },
  'Mercy High School': {
    address: '1300 E Northern Parkway, Baltimore, MD 21239',
    map: '/venues/mercy.png',
  },
  'Liberty High School': {
    address: 'Liberty High School, Eldersburg, MD 21784',
    map: '/venues/liberty.png',
  },
  'Our Lady of Good Counsel H.S.': {
    address: '17301 Old Vic Blvd, Olney, MD 20832',
    map: '/venues/good-counsel.png',
  },
  'Notre Dame Prep': {
    address: '815 Hampton Lane, Baltimore, MD 21286',
    map: '/venues/notre-dame.png',
  },
  'Roland Park Country School': {
    address: '5204 Roland Avenue, Baltimore, MD 21210',
    map: '/venues/roland-park.png',
  },
}

// Google Maps directions from wherever the viewer is. No API key needed.
export function directionsUrl(location) {
  const v = VENUES[location]
  if (!v || !v.address) return null
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(v.address)}`
}

export function venueAddress(location) {
  const v = VENUES[location]
  return v ? v.address : null
}

export function isOnCampus(location) {
  const v = VENUES[location]
  return !!(v && v.onCampus)
}

// The map image for a venue, plus its caption. Campus days get the campus
// map with an arrow to the right field.
export function venueMap(location) {
  const v = VENUES[location]
  if (!v || !v.map) return null
  return {
    src: v.map,
    caption: v.mapCaption || '',
    onCampus: !!v.onCampus,
    // Campus maps open full size to read the field label; away maps hand
    // straight off to Google Maps directions.
    href: v.onCampus ? v.map : directionsUrl(location),
  }
}

// ---------------------------------------------------------------------
// KIT — shown in a grey box on every day. A day can override it with its
// own `kit`; otherwise it falls back to the default for that type.
// Set `match` once you know what they wear for games.
// ---------------------------------------------------------------------
export const KIT_COLORS = {
  grey: { color: '#9aa1aa', name: 'Grey' },
  white: { color: '#ffffff', name: 'White' },
  black: { color: '#1a1a1a', name: 'Black' },
  blue: { color: '#1f4fa3', name: 'Blue' },
  orange: { color: '#e8541e', name: 'Orange' },
}

// Training gear by day of week: [shirt, shorts, socks].
// 0 = Sunday through 6 = Saturday.
export const TRAINING_KIT_BY_DAY = {
  0: ['black', 'black', 'black'],
  1: ['grey', 'white', 'white'],
  2: ['black', 'black', 'black'],
  3: ['white', 'blue', 'white'],
  4: ['grey', 'white', 'white'],
  5: ['white', 'blue', 'white'],
  6: ['black', 'black', 'black'],
}

export function buildKit([shirt, shorts, socks]) {
  const part = (key, item) => ({
    color: KIT_COLORS[key].color,
    label: `${KIT_COLORS[key].name} ${item}`,
  })
  return {
    shirt: part(shirt, 'shirt'),
    shorts: part(shorts, 'shorts'),
    socks: part(socks, 'socks'),
  }
}

// Match days have no fixed kit — the captains pick it.
export const MATCH_KIT_TEXT = 'Captain’s choice'

export function kitFor(item) {
  if (item.type === 'note') return null
  if (item.kit) return Array.isArray(item.kit) ? buildKit(item.kit) : item.kit
  if (item.type === 'match') return { text: MATCH_KIT_TEXT }
  if (item.type !== 'training') return null
  const [y, m, d] = item.sortDate.split('-').map(Number)
  const weekday = new Date(y, m - 1, d).getDay()
  return buildKit(TRAINING_KIT_BY_DAY[weekday])
}

// ---------------------------------------------------------------------
// TEAM RULES — shown at the top of the schedule. These apply all season
// and are not tied to any one date. Add or edit freely.
// ---------------------------------------------------------------------
export const rules = [
  {
    title: 'Be on time for training',
    body: 'Be ready to go at the start time, not arriving at it.',
  },
  {
    title: 'Training room is for injuries only',
    body:
      'The training room is not an excuse for being late. If you have 4th period free, go to the training room then.',
  },
]

// ---------------------------------------------------------------------
// CLEARANCE — attached to any day with `clearance: true` (the tryout days).
// Stated factually: what is required, where to check, what happens if it
// is incomplete.
// ---------------------------------------------------------------------
export const clearance = {
  title: 'Clearance Requirements',
  intro: 'All four items must be complete before the first tryout:',
  items: [
    'Physical — updated and approved.',
    'Athletics Agreement and Release of Liability — completed by both the student and a parent.',
    'Concussion Baseline Test.',
    'Community Service Hours — seniors only, 40 hours.',
  ],
  outro:
    'Documents are under “Manage Records” in DASH. Current eligibility status is on your DASH page. Every item must be checked to be eligible for the first day. Players whose clearance is incomplete will not be permitted to participate.',
}

// ---------------------------------------------------------------------
// CHANGED DAYS — when a session moves, say so on the day rather than just
// editing the number. Subscribed calendars can lag a day behind (Google
// refreshes external feeds on its own schedule), so the banner is what
// tells someone the time they remember is out of date.
//
//   changed: [{ field: 'Time', from: '12:00 PM', to: '11:00 AM' }]
//
// Add a second entry if the venue moved too. Clear the array once the day
// has passed and the change no longer needs flagging.
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// PLAYERS' CODE — the shared code that reveals the players-only parts of
// the site (practice points and the standings). Change it here and every
// phone is locked out until the new one is entered; case and spaces are
// ignored, so 'Eagles 2026' and 'eagles2026' both work.
//
// This keeps practice points out of a parent's casual view. It is NOT
// security: the page is public and anyone who reads the site's source can
// find what is behind the code. Do not put anything genuinely private here.
// ---------------------------------------------------------------------
export const PLAYERS_CODE = 'eagles2026'

// ---------------------------------------------------------------------
// PRACTICE POINTS — a running tally kept all season. The ways to earn are
// fixed and live here; a day opts in with its own `practicePoints` block
// describing that session:
//
//   practicePoints: { format: '3 × 25-minute matches', first: true }
//
// `first` flags the season opener. Deliberately no total: there is no cap,
// since a player can keep scoring.
// ---------------------------------------------------------------------
export const practicePoints = {
  title: 'Practice Points',
  intro: 'Points are tracked all season and the running tally is kept on this site.',
  // Every category says what it means. A player should be able to read this
  // and know exactly how to earn, without asking a coach.
  earn: [
    {
      pts: '2 pts',
      for: 'Win',
      note: 'Every player on the winning side, every match.',
    },
    {
      pts: '1 pt',
      for: 'Goal',
      note:
        'To whoever scores it. Goals count in the 9 v 9, 8 v 8 and 7 v 7 ' +
        'scrimmages — not in small-sided games like 3 v 3.',
    },
    {
      pts: '1 pt',
      for: 'Assist',
      note: 'The pass that sets up the goal, in those same scrimmages.',
    },
    {
      pts: '1 pt',
      for: 'Shutout',
      note:
        'Your side concedes nothing across a full scrimmage. 2 pts if you played ' +
        'at the back or in goal.',
    },
    {
      pts: '1 pt',
      for: 'Bang bang',
      note:
        'Two goals back to back. A point to each of the two scorers — a bang bang '  +
        'counts as its own thing, not as goals on top.',
    },
  ],
}

// ---------------------------------------------------------------------
// PRACTICE POINTS LOG — what each player actually earned, session by
// session. Record what HAPPENED, not the total: the points are worked out
// from the rules above, so changing a rule reprices the whole season and
// nothing has to be re-added by hand.
//
//   { player: 'Parker', wins: 2, goals: 1, assists: 0, shutouts: 1, back: true }
//
// `back: true` marks a defender or goalkeeper, who takes 2 for a shutout
// instead of 1. Omit any field that is zero. Add a session by appending a
// block; the standings page picks it up on its own.
//
// `bonus` covers anything the four standing rules do not — a point awarded
// on the day for something worth rewarding. Always say what it was for, so
// the table can be read back months later:
//
//   { player: 'Grace', bonus: 1, bonusFor: 'Bang bang' }
// ---------------------------------------------------------------------
export const pointsLog = [
  {
    sortDate: '2026-08-19',
    session: 'Orange v. White',
    note: 'Orange won all three matches and kept a clean sheet in each.',
    // Orange: 3 wins and 3 shutouts for everyone on the side. The four
    // defenders take 2 a shutout instead of 1.
    tally: [
      { player: 'Parker', wins: 3, shutouts: 3, back: true },
      { player: 'Anna', wins: 3, shutouts: 3, back: true },
      { player: 'Amber', wins: 3, shutouts: 3, back: true },
      { player: 'Maya', wins: 3, shutouts: 3, back: true },
      { player: 'Zoe', wins: 3, shutouts: 3, goals: 2 },
      { player: 'Lily', wins: 3, shutouts: 3, goals: 1 },
      { player: 'Alyssa', wins: 3, shutouts: 3 },
      { player: 'Isabelle', wins: 3, shutouts: 3 },
      { player: 'Ari', wins: 3, shutouts: 3 },
      { player: 'Cassie', wins: 3, shutouts: 3 },
    ],
  },
  {
    sortDate: '2026-08-20',
    session: 'Training — Orange v. Grey',
    note:
      'Orange won both 8 v 8 games, 4–0 and 1–0, and one 3 v 3 transition game. ' +
      'Grey won the other 3 v 3 and Over the River. No shutouts counted, and the ' +
      'goals are the 8 v 8 ones. Bang bang for Isabelle and Grace, Zoe and Maya, ' +
      'and Zoe and Isabelle.',
    tally: [
      // Orange: two 8 v 8s and one 3 v 3.
      { player: 'Cassie', wins: 3 },
      { player: 'Kaitlyn', wins: 3 },
      { player: 'Parker', wins: 3 },
      { player: 'Aubrey', wins: 3 },
      { player: 'Zoe', wins: 3, goals: 2, bangBangs: 2 },
      { player: 'Isabelle', wins: 3, goals: 2, bangBangs: 2 },
      { player: 'Lily', wins: 3, goals: 1 },
      { player: 'Alex', wins: 3 },
      { player: 'Kate', wins: 3 },
      // Grey: the other 3 v 3, and Over the River.
      { player: 'Anna', wins: 2 },
      { player: 'Virginia', wins: 2 },
      { player: 'Samara', wins: 2 },
      { player: 'Alyssa', wins: 2 },
      { player: 'Amber', wins: 2 },
      { player: 'Ari', wins: 2 },
      { player: 'Grace', wins: 2, bangBangs: 1 },
      { player: 'Maya', wins: 2, bangBangs: 1 },
    ],
  },
]

// One player's haul from one session, priced by the rules above.
export function pointsFor(e) {
  // Every clean sheet is worth 1; one earned in goal or at the back is worth
  // 2, so it scores the extra on top. `back: true` means all of them were;
  // `backShutouts` says how many, for a keeper who only played some games.
  const shutouts = e.shutouts || 0
  const atTheBack = e.backShutouts != null ? e.backShutouts : e.back ? shutouts : 0

  return (
    (e.wins || 0) * 2 +
    (e.bangBangs || 0) +
    (e.goals || 0) +
    (e.assists || 0) +
    shutouts +
    atTheBack +
    (e.bonus || 0)
  )
}

// Season standings, highest first. Ties break alphabetically so the order is
// stable rather than dependent on who happens to be entered first.
export function standings() {
  const byPlayer = new Map()
  for (const session of pointsLog) {
    for (const e of session.tally || []) {
      const row = byPlayer.get(e.player) || {
        player: e.player,
        pts: 0,
        wins: 0,
        bangBangs: 0,
        goals: 0,
        assists: 0,
        shutouts: 0,
        bonus: 0,
        sessions: 0,
      }
      row.pts += pointsFor(e)
      row.wins += e.wins || 0
      row.bangBangs += e.bangBangs || 0
      row.goals += e.goals || 0
      row.assists += e.assists || 0
      row.shutouts += e.shutouts || 0
      row.bonus += e.bonus || 0
      row.sessions += 1
      byPlayer.set(e.player, row)
    }
  }
  return [...byPlayer.values()].sort(
    (a, b) => b.pts - a.pts || a.player.localeCompare(b.player),
  )
}

// ---------------------------------------------------------------------
// OBSERVANCES — small print inside the card for that date. Each is keyed to
// a day that actually has a card, so multi-day holidays are folded into the
// nearest session rather than floating on their own. Jewish holidays begin
// at sundown the evening before.
// ---------------------------------------------------------------------
export const observances = [
  {
    sortDate: '2026-09-11',
    text: 'Erev Rosh Hashanah — begins at sundown. Rosh Hashanah runs Sep 12–13.',
  },
  {
    sortDate: '2026-09-21',
    text: 'Yom Kippur — through sundown. Kol Nidre began sundown Sep 20.',
  },
  {
    sortDate: '2026-09-25',
    text: 'Erev Sukkot — begins at sundown. Sukkot runs through Oct 2.',
  },
  {
    sortDate: '2026-10-03',
    text: 'Shemini Atzeret. Simchat Torah follows Oct 4.',
  },
  {
    sortDate: '2026-11-06',
    text: 'Diwali — Nov 6–10, main day Sunday Nov 8.',
  },
]

export const schedule = [
  {
    no: 1,
    date: 'Sat, Aug 15',
    sortDate: '2026-08-15',
    type: 'training',
    time: '9:00 AM',
    location: 'McDonogh — Field 16',
    clearance: true,
    kit: ['white', 'black', 'black'],
    focus: 'Tryouts — Day 1',
    note: '',
  },
  {
    no: 2,
    date: 'Sun, Aug 16',
    sortDate: '2026-08-16',
    type: 'training',
    time: '9:00 AM',
    location: 'McDonogh — Dixon Field (Turf)',
    clearance: true,
    kit: ['white', 'black', 'black'],
    focus: 'Tryouts — Day 2',
    note: '',
  },
  {
    no: 3,
    date: 'Mon, Aug 17',
    sortDate: '2026-08-17',
    type: 'training',
    time: '9:00 AM',
    location: 'McDonogh — Field 16',
    clearance: true,
    kit: ['white', 'black', 'black'],
    cancelled: true,
    focus: 'Tryouts — Day 3',
    note:
      'Field 16 is closed because of rain. Selection still goes ahead: 22–23 players ' +
      'will be picked for the first training session on Aug 18 and the Orange v. White ' +
      'match on Aug 19, 7:00 PM on the turf. Players will get a phone call from the ' +
      'coaching staff on the number they gave at registration — reply to the email if ' +
      'you want a different number used. All returning players are through and will ' +
      'not be called.',
  },
  {
    no: 4,
    date: 'Tue, Aug 18',
    sortDate: '2026-08-18',
    type: 'training',
    time: '9:00 AM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: 'We are running the Yo-Yo test.',
    resources: [
      {
        label: 'How the Yo-Yo test works',
        url: 'https://www.theyoyotest.com/',
        hint: 'Description only — do not buy anything from the site.',
      },
      {
        label: 'Yo-Yo test recording',
        url: 'https://drive.google.com/file/d/1AFVyMUyEkN3FmpApFKUPpXsGxQvIampX/view',
        hint: 'This is the recording we run to.',
      },
    ],
  },
  {
    no: 5,
    date: 'Wed, Aug 19',
    sortDate: '2026-08-19',
    type: 'match',
    home: true,
    scrimmage: true,
    opponent: 'Orange v. White match',
    title: 'Orange v. White match',
    time: '7:00 PM',
    teamTalk: '6:00 PM',
    teamTalkRoom: 'Alumni Room',
    location: 'McDonogh — Dixon Field (Turf)',
    result: '',
    focus: '',
    note: 'Intra-squad.',
    practicePoints: {
      first: true,
      format: '3 × 25-minute matches',
    },
    // Intra-squad: two sides, each with its own kit, meeting room and squad.
    teams: [
      {
        name: 'Team Orange',
        kit: ['orange', 'white', 'white'],
        meetIn: 'the Cage',
        players: [
          'Parker', 'Anna', 'Alyssa', 'Isabelle', 'Amber',
          'Maya', 'Zoe', 'Lily', 'Ari', 'Cassie',
        ],
      },
      {
        name: 'Team White',
        kit: ['white', 'black', 'black'],
        meetIn: 'the Alumni Room',
        players: [
          'Kaitlyn', 'Virginia', 'Samara', 'Alex', 'Aubrey',
          'Grace', 'Paula', 'Layla', 'Kate',
        ],
      },
    ],
  },
  {
    no: 6,
    date: 'Thu, Aug 20',
    sortDate: '2026-08-20',
    type: 'training',
    time: '11:00 AM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
    changed: [{ field: 'Time', from: '12:00 PM', to: '11:00 AM' }],
    // No kit per side — both wear the day's training kit, shown above.
    // Cassie starts on Mary's second list but went in goal for Orange when
    // the keepers switched.
    teams: [
      {
        name: 'Orange',
        players: ['Kaitlyn', 'Parker', 'Isabelle', 'Alex', 'Zoe', 'Aubrey', 'Lily', 'Kate', 'Cassie'],
      },
      {
        name: 'Grey',
        players: ['Anna', 'Virginia', 'Samara', 'Alyssa', 'Amber', 'Ari', 'Grace', 'Maya'],
      },
    ],
  },
  {
    no: 7,
    date: 'Fri, Aug 21',
    sortDate: '2026-08-21',
    type: 'match',
    home: 'neutral',
    scrimmage: true,
    opponent: 'Dulaney High School',
    time: '3:00 PM',
    arrive: '2:00 PM',
    location: 'Seminary Park — Turf Field',
    result: '',
    focus: '',
    // Named rather than built from a colour, since the top is the training
    // top and the socks are the plain ones, not the usual match pair.
    kit: {
      shirt: { color: KIT_COLORS.black.color, label: 'Black training top' },
      shorts: { color: KIT_COLORS.black.color, label: 'Black shorts' },
      socks: { color: KIT_COLORS.black.color, label: 'Plain black socks — bring your own' },
    },
    note:
      'Everyone bring plain black socks — they are not being issued. ' +
      'Bring the black training top too. The new black shorts will be issued to you.',
  },
  {
    no: 101,
    date: 'Mon, Aug 24',
    sortDate: '2026-08-24',
    type: 'event',
    title: 'Uniform pickup',
    time: '3:15 PM',
    location: 'McDonogh — Rollins-Luetkemeyer Athletic Center',
    note: 'Meet in the RL Center at 3:15 to collect your uniform, before training.',
  },
  {
    no: 8,
    date: 'Mon, Aug 24',
    sortDate: '2026-08-24',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 102,
    date: 'Tue, Aug 25',
    sortDate: '2026-08-25',
    type: 'event',
    title: 'Media day',
    time: 'TBA',
    tentative: true,
    location: '',
    note: 'Time and place to be confirmed.',
  },
  {
    no: 9,
    date: 'Tue, Aug 25',
    sortDate: '2026-08-25',
    type: 'training',
    time: '3:30 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
    changed: [{ field: 'Time', from: '4:00 PM', to: '3:30 PM' }],
  },
  {
    no: 10,
    date: 'Wed, Aug 26',
    sortDate: '2026-08-26',
    type: 'match',
    home: true,
    scrimmage: true,
    opponent: 'Hereford High School',
    time: '4:15 PM',
    location: 'McDonogh — Field 16',
    result: '',
    focus: '',
    note: '',
  },
  {
    no: 11,
    date: 'Thu, Aug 27',
    sortDate: '2026-08-27',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 12,
    date: 'Fri, Aug 28',
    sortDate: '2026-08-28',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 13,
    date: 'Mon, Aug 31',
    sortDate: '2026-08-31',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 14,
    date: 'Tue, Sep 1',
    sortDate: '2026-09-01',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 15,
    date: 'Wed, Sep 2',
    sortDate: '2026-09-02',
    type: 'match',
    home: true,
    opponent: 'Bishop Denis J. O\'Connell H.S.',
    time: '4:15 PM',
    location: 'McDonogh — Field 16',
    result: '',
    focus: '',
    note: '',
  },
  {
    no: 16,
    date: 'Thu, Sep 3',
    sortDate: '2026-09-03',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 17,
    date: 'Fri, Sep 4',
    sortDate: '2026-09-04',
    type: 'match',
    home: true,
    opponent: 'Cumberland Valley High School, PA',
    time: '4:15 PM',
    location: 'McDonogh — Field 16',
    result: '',
    focus: '',
    note: '',
  },
  {
    no: 18,
    date: 'Mon, Sep 7',
    sortDate: '2026-09-07',
    type: 'training',
    time: '5:30 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: 'Labor Day — later start, no classes.',
  },
  {
    no: 19,
    date: 'Tue, Sep 8',
    sortDate: '2026-09-08',
    type: 'match',
    home: true,
    opponent: 'Paul VI Catholic H.S., VA',
    time: '4:30 PM',
    location: 'McDonogh — Field 16',
    result: '',
    focus: '',
    note: '',
  },
  {
    no: 20,
    date: 'Wed, Sep 9',
    sortDate: '2026-09-09',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 21,
    date: 'Thu, Sep 10',
    sortDate: '2026-09-10',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 22,
    date: 'Fri, Sep 11',
    sortDate: '2026-09-11',
    type: 'match',
    home: true,
    opponent: 'St. Paul\'s School for Girls',
    time: '3:30 PM',
    teamTalk: '2:45 PM',
    dismissal: '2:00 PM',
    location: 'McDonogh — Field 16',
    result: '',
    focus: '',
    note: 'IAAM. Early 3:30 start so everyone is home before sundown for Rosh Hashanah.',
  },
  {
    no: 23,
    date: 'Mon, Sep 14',
    sortDate: '2026-09-14',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  // The TBA scrimmage that was here has been dropped. Per the standing rule,
  // a weekday without a match is a training day.
  {
    no: 24,
    date: 'Tue, Sep 15',
    sortDate: '2026-09-15',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 25,
    date: 'Wed, Sep 16',
    sortDate: '2026-09-16',
    type: 'match',
    home: true,
    opponent: 'Mount de Sales Academy',
    time: '4:15 PM',
    location: 'McDonogh — Field 16',
    result: '',
    focus: '',
    note: 'IAAM.',
  },
  {
    no: 26,
    date: 'Thu, Sep 17',
    sortDate: '2026-09-17',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 27,
    date: 'Fri, Sep 18',
    sortDate: '2026-09-18',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 28,
    date: 'Sat, Sep 19',
    sortDate: '2026-09-19',
    type: 'match',
    home: 'neutral',
    opponent: 'Agnes Irwin School (PA)',
    time: '4:00 PM',
    location: 'Mercy High School',
    result: '',
    focus: '',
    note: 'Played on the turf at Mercy.',
  },
  {
    no: 29,
    date: 'Mon, Sep 21',
    sortDate: '2026-09-21',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 30,
    date: 'Tue, Sep 22',
    sortDate: '2026-09-22',
    type: 'match',
    home: false,
    opponent: 'Liberty High School',
    time: '6:30 PM',
    dismissal: '3:15 PM',
    location: 'Liberty High School',
    result: '',
    focus: '',
    note: '',
  },
  {
    no: 31,
    date: 'Wed, Sep 23',
    sortDate: '2026-09-23',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 32,
    date: 'Thu, Sep 24',
    sortDate: '2026-09-24',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 33,
    date: 'Fri, Sep 25',
    sortDate: '2026-09-25',
    type: 'match',
    home: false,
    opponent: 'Our Lady of Good Counsel H.S.',
    time: '5:30 PM',
    dismissal: '1:30 PM',
    location: 'Our Lady of Good Counsel H.S.',
    result: '',
    focus: '',
    note: '',
  },
  {
    no: 34,
    date: 'Mon, Sep 28',
    sortDate: '2026-09-28',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 35,
    date: 'Tue, Sep 29',
    sortDate: '2026-09-29',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 36,
    date: 'Wed, Sep 30',
    sortDate: '2026-09-30',
    type: 'match',
    home: false,
    opponent: 'Notre Dame Prep',
    time: '6:00 PM',
    dismissal: '3:15 PM',
    location: 'Notre Dame Prep',
    result: '',
    focus: '',
    note: 'IAAM.',
  },
  {
    no: 37,
    date: 'Thu, Oct 1',
    sortDate: '2026-10-01',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  // type: 'note' marks a day with no session — a card carrying no time or badge.
  {
    no: 38,
    date: 'Fri, Oct 2',
    sortDate: '2026-10-02',
    type: 'note',
    title: 'College Visit Weekend',
    time: '',
    location: '',
    note: '',
  },
  {
    no: 67,
    date: 'Sat, Oct 3',
    sortDate: '2026-10-03',
    type: 'note',
    title: 'College Visit Weekend',
    time: '',
    location: '',
    note: '',
  },
  {
    no: 68,
    date: 'Sun, Oct 4',
    sortDate: '2026-10-04',
    type: 'note',
    title: 'College Visit Weekend',
    time: '',
    location: '',
    note: '',
  },
  {
    no: 39,
    date: 'Mon, Oct 5',
    sortDate: '2026-10-05',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 40,
    date: 'Tue, Oct 6',
    sortDate: '2026-10-06',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 41,
    date: 'Wed, Oct 7',
    sortDate: '2026-10-07',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 42,
    date: 'Thu, Oct 8',
    sortDate: '2026-10-08',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 43,
    date: 'Fri, Oct 9',
    sortDate: '2026-10-09',
    type: 'match',
    home: false,
    opponent: 'Mercy High School',
    time: '7:00 PM',
    dismissal: '3:15 PM',
    location: 'Mercy High School',
    result: '',
    focus: '',
    note: 'IAAM.',
  },
  {
    no: 44,
    date: 'Mon, Oct 12',
    sortDate: '2026-10-12',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 45,
    date: 'Tue, Oct 13',
    sortDate: '2026-10-13',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 46,
    date: 'Wed, Oct 14',
    sortDate: '2026-10-14',
    type: 'match',
    home: true,
    opponent: 'Severn School',
    time: '4:15 PM',
    location: 'McDonogh — Field 16',
    result: '',
    focus: '',
    note: '',
  },
  {
    no: 47,
    date: 'Thu, Oct 15',
    sortDate: '2026-10-15',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 48,
    date: 'Fri, Oct 16',
    sortDate: '2026-10-16',
    type: 'match',
    home: true,
    opponent: 'Maryvale Preparatory School',
    time: '4:15 PM',
    location: 'McDonogh — Field 16',
    result: '',
    focus: '',
    note: 'IAAM.',
  },
  {
    no: 49,
    date: 'Mon, Oct 19',
    sortDate: '2026-10-19',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 50,
    date: 'Tue, Oct 20',
    sortDate: '2026-10-20',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 51,
    date: 'Wed, Oct 21',
    sortDate: '2026-10-21',
    type: 'match',
    home: true,
    opponent: 'John Carroll School',
    time: '4:15 PM',
    location: 'McDonogh — Field 16',
    result: '',
    focus: '',
    note: '',
  },
  {
    no: 52,
    date: 'Thu, Oct 22',
    sortDate: '2026-10-22',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 53,
    date: 'Fri, Oct 23',
    sortDate: '2026-10-23',
    type: 'match',
    home: false,
    opponent: 'Roland Park Country School',
    time: '4:00 PM',
    dismissal: '2:00 PM',
    location: 'Roland Park Country School',
    result: '',
    focus: '',
    note: 'IAAM.',
  },
  {
    no: 54,
    date: 'Mon, Oct 26',
    sortDate: '2026-10-26',
    type: 'match',
    home: true,
    opponent: 'Archbishop Spalding',
    time: '4:15 PM',
    location: 'McDonogh — Field 16',
    result: '',
    focus: '',
    note: '',
  },
  {
    no: 55,
    date: 'Tue, Oct 27',
    sortDate: '2026-10-27',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 56,
    date: 'Wed, Oct 28',
    sortDate: '2026-10-28',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 57,
    date: 'Thu, Oct 29',
    sortDate: '2026-10-29',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 58,
    date: 'Fri, Oct 30',
    sortDate: '2026-10-30',
    type: 'match',
    home: false,
    playoff: true,
    opponent: 'IAAM Playoffs — Quarterfinals',
    time: '4:00 PM',
    location: 'TBD',
    result: '',
    focus: '',
    note: 'Site & opponent by seeding.',
  },
  {
    no: 59,
    date: 'Mon, Nov 2',
    sortDate: '2026-11-02',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 60,
    date: 'Tue, Nov 3',
    sortDate: '2026-11-03',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 61,
    date: 'Wed, Nov 4',
    sortDate: '2026-11-04',
    type: 'match',
    home: true,
    playoff: true,
    opponent: 'IAAM Playoffs — Semifinals',
    time: '4:00 PM',
    location: 'TBD',
    result: '',
    focus: '',
    note: 'Site & opponent by seeding.',
  },
  {
    no: 62,
    date: 'Thu, Nov 5',
    sortDate: '2026-11-05',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  {
    no: 63,
    date: 'Fri, Nov 6',
    sortDate: '2026-11-06',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  // Added session — weekends are otherwise off.
  {
    no: 66,
    date: 'Sun, Oct 25',
    sortDate: '2026-10-25',
    type: 'training',
    time: '4:00 PM',
    location: 'McDonogh — Field 16',
    focus: 'Training',
    note: '',
  },
  // Paul VI (NJ) is parked — they can only play on a weekend, and no weekend in the
  // Sep 30 → Oct 9 gap is available. Re-add with a weekend sortDate if a date is agreed.
  {
    no: 64,
    date: 'Sat, Nov 7',
    sortDate: '2026-11-07',
    type: 'match',
    home: 'neutral',
    playoff: true,
    opponent: 'IAAM Championship',
    time: 'TBA',
    location: 'TBD',
    result: '',
    focus: '',
    note: 'If we qualify.',
  },
]
