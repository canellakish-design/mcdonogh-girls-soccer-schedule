// Generates public/mcdonogh-soccer.ics from src/data/schedule.js.
// schedule.js stays the single source of truth; the calendar feed is derived.
// Run via `npm run build:ics` (also runs automatically before `npm run build`).

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { TEAM, schedule } from '../src/data/schedule.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(here, '..', 'public', 'mcdonogh-soccer.ics')

// Event lengths. Matches his existing calendar pattern (90-minute sessions).
const TRAINING_MINUTES = 90
const MATCH_MINUTES = 120

// '4:15 PM' -> { h: 16, m: 15 }. Returns null for 'TBA' and anything unparseable.
function parseTime(t) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec((t || '').trim())
  if (!m) return null
  let h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  const ampm = m[3].toUpperCase()
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return { h, m: min }
}

const pad = (n) => String(n).padStart(2, '0')

// Local wall-clock stamp; paired with TZID so Google resolves the offset itself
// (which matters once DST ends on Nov 1 and the playoff dates shift to EST).
function localStamp(sortDate, h, m) {
  return `${sortDate.replace(/-/g, '')}T${pad(h)}${pad(m)}00`
}

function addMinutes(sortDate, h, m, minutes) {
  const [y, mo, d] = sortDate.split('-').map(Number)
  const dt = new Date(Date.UTC(y, mo - 1, d, h, m))
  dt.setUTCMinutes(dt.getUTCMinutes() + minutes)
  return {
    date: `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`,
    h: dt.getUTCHours(),
    m: dt.getUTCMinutes(),
  }
}

function nextDay(sortDate) {
  const [y, mo, d] = sortDate.split('-').map(Number)
  const dt = new Date(Date.UTC(y, mo - 1, d + 1))
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`
}

// RFC 5545: escape backslash, semicolon, comma, newline.
function esc(s) {
  return String(s || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

// Lines must be <= 75 octets; continuations start with a single space.
function fold(line) {
  const bytes = Buffer.from(line, 'utf8')
  if (bytes.length <= 75) return line
  const out = []
  let cur = Buffer.alloc(0)
  for (const ch of [...line]) {
    const b = Buffer.from(ch, 'utf8')
    const limit = out.length === 0 ? 75 : 74
    if (cur.length + b.length > limit) {
      out.push(cur.toString('utf8'))
      cur = Buffer.alloc(0)
    }
    cur = Buffer.concat([cur, b])
  }
  if (cur.length) out.push(cur.toString('utf8'))
  return out.join('\r\n ')
}

function title(item) {
  if (item.type === 'note') return item.title
  if (item.type === 'training') return item.focus || 'Training'
  const prefix = item.home === true ? 'vs. ' : item.home === false ? '@ ' : 'vs. '
  return prefix + item.opponent
}

// A 'note' block covers a span of days; endDate is the last day it applies to.
// DTEND is exclusive, so the writer advances one past it.
function noteEndDate(item) {
  return item.endDate || item.sortDate
}

const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

const lines = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//McDonogh Girls Varsity Soccer//Schedule//EN',
  'CALSCALE:GREGORIAN',
  'METHOD:PUBLISH',
  `X-WR-CALNAME:${esc(`${TEAM.school} ${TEAM.program}`)}`,
  `X-WR-CALDESC:${esc(`${TEAM.title} — ${TEAM.season}`)}`,
  'X-WR-TIMEZONE:America/New_York',
  'REFRESH-INTERVAL;VALUE=DURATION:PT6H',
  'X-PUBLISHED-TTL:PT6H',
  // America/New_York, so DST is resolved correctly across the Nov 1 changeover.
  'BEGIN:VTIMEZONE',
  'TZID:America/New_York',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:-0500',
  'TZOFFSETTO:-0400',
  'TZNAME:EDT',
  'DTSTART:19700308T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:-0400',
  'TZOFFSETTO:-0500',
  'TZNAME:EST',
  'DTSTART:19701101T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
]

for (const item of schedule) {
  const t = parseTime(item.time)
  const isTraining = item.type === 'training'
  const isNote = item.type === 'note'

  lines.push('BEGIN:VEVENT')
  lines.push(`UID:mcdonogh-soccer-${item.no}-${item.sortDate}@mcdonogh-girls-soccer`)
  lines.push(`DTSTAMP:${stamp}`)

  if (isNote) {
    lines.push(`DTSTART;VALUE=DATE:${item.sortDate.replace(/-/g, '')}`)
    lines.push(`DTEND;VALUE=DATE:${nextDay(noteEndDate(item)).replace(/-/g, '')}`)
    lines.push('TRANSP:TRANSPARENT')
  } else if (t) {
    const end = addMinutes(item.sortDate, t.h, t.m, isTraining ? TRAINING_MINUTES : MATCH_MINUTES)
    lines.push(`DTSTART;TZID=America/New_York:${localStamp(item.sortDate, t.h, t.m)}`)
    lines.push(`DTEND;TZID=America/New_York:${localStamp(end.date, end.h, end.m)}`)
  } else {
    // Time TBA -> all-day event. DTEND is exclusive, so it points at the next day.
    lines.push(`DTSTART;VALUE=DATE:${item.sortDate.replace(/-/g, '')}`)
    lines.push(`DTEND;VALUE=DATE:${nextDay(item.sortDate).replace(/-/g, '')}`)
  }

  lines.push(`SUMMARY:${esc(title(item))}`)
  if (item.location) lines.push(`LOCATION:${esc(item.location)}`)

  const desc = []
  if (isTraining && item.focus) desc.push(`Focus: ${item.focus}`)
  if (!isTraining && !isNote) {
    if (item.scrimmage) desc.push('Scrimmage')
    if (item.playoff) desc.push('IAAM Playoffs')
    desc.push(item.home === false ? 'Away' : item.home === 'neutral' ? 'Neutral site' : 'Home')
    if (item.result) desc.push(`Result: ${item.result}`)
  }
  if (item.note) desc.push(item.note)
  if (desc.length) lines.push(`DESCRIPTION:${esc(desc.join('\n'))}`)

  lines.push(`CATEGORIES:${isNote ? 'Note' : isTraining ? 'Training' : 'Match'}`)
  lines.push('END:VEVENT')
}

lines.push('END:VCALENDAR')

fs.writeFileSync(OUT, lines.map(fold).join('\r\n') + '\r\n')
console.log(`Wrote ${OUT} — ${schedule.length} events`)
