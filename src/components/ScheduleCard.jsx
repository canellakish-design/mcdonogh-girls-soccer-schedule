// One row in the schedule list. Left = date box; middle = matchup/focus; right = tags.

import { usePlayerAccess } from '../playerAccess.jsx'

function dateBox(sortDate) {
  // sortDate is 'YYYY-MM-DD' — render as month abbrev + day + weekday.
  const [y, m, d] = sortDate.split('-').map(Number)
  const months = ['', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  // Numeric parts build a local date, so no timezone can shift the weekday
  // the way parsing the string as UTC would.
  return {
    mon: months[m] || '',
    day: String(d),
    dow: weekdays[new Date(y, m - 1, d).getDay()],
  }
}


// Home matches: team talk before kickoff. Board Room at 3:30 PM is the
// standard; a day can override the time with `teamTalk` and the room with
// `teamTalkRoom`.
const DEFAULT_TEAM_TALK = '3:30 PM'
const DEFAULT_TEAM_TALK_ROOM = 'Board Room'

export function meetNote(item) {
  if (item.type === 'note') return null
  const parts = []

  // `arrive` is set per day and applies wherever we are playing — the team
  // talk below is a home fixture's own arrangement.
  if (item.arrive) parts.push(`Arrive at ${item.arrive}.`)

  // Split-squad days: each side has its own room, listed on its own panel.
  if (item.type === 'match' && item.home === true && !item.teams) {
    const at = item.teamTalk || DEFAULT_TEAM_TALK
    const room = item.teamTalkRoom || DEFAULT_TEAM_TALK_ROOM
    parts.push(`Team talk in the ${room} at ${at}.`)
  }

  return parts.length ? parts.join(' ') : null
}

export function matchTitle(item) {
  // `title` wins outright — for days whose label is not "vs. <opponent>".
  if (item.title) return item.title
  if (item.type === 'training') return item.focus || 'Training'
  const prefix = item.home === true ? 'vs. ' : item.home === false ? '@ ' : 'vs. '
  return prefix + item.opponent
}

export default function ScheduleCard({ item, highlight, observance }) {
  const { unlocked } = usePlayerAccess()
  const { mon, day, dow } = dateBox(item.sortDate)
  const isTraining = item.type === 'training'
  const isNote = item.type === 'note'
  const boxClass = isNote ? 'datebox-note' : isTraining ? 'datebox-training' : 'datebox-match'

  return (
    <a
      className={`card ${isNote ? 'card-note ' : ''}${item.type === 'match' ? 'card-match ' : ''}${
        item.cancelled ? 'card-cancelled ' : ''
      }${highlight ? `card-${highlight}` : ''}`}
      href={`#/day/${item.no}`}
    >
      <span className={`datebox ${boxClass}`}>
        <span className="datebox-mon">{mon}</span>
        <span className="datebox-day">{day}</span>
        <span className="datebox-dow">{dow}</span>
      </span>

      <span className="card-main">
        {highlight && (
          <span className="card-flag">{highlight === 'today' ? 'Today' : 'Next up'}</span>
        )}
        <span className="card-title">{matchTitle(item)}</span>
        {/* No date here — the box on the left already carries it. */}
        <span className="card-meta">
          {item.time && <strong className="card-time">{item.time}</strong>}
          {item.time && item.location ? <> &nbsp;·&nbsp; </> : null}
          {item.location}
        </span>
        {item.dismissal && (
          <span className="card-dismissal">Dismissal {item.dismissal}</span>
        )}
        {item.note && <span className="card-note-line">{item.note}</span>}
        {observance && <span className="card-obs">{observance.text}</span>}
      </span>

      <span className="card-tags">
        {item.result && <span className="tag tag-result">{item.result}</span>}
        {isNote
          ? <span className="tag tag-yellow">No Sessions</span>
          : isTraining
            ? <span className="tag tag-training">Training</span>
            : <span className="tag tag-match">Match</span>}
        {item.cancelled && <span className="tag tag-cancelled">Cancelled</span>}
        {item.changed?.length > 0 && !item.cancelled && (
          <span className="tag tag-changed">Changed</span>
        )}
        {item.practicePoints && !item.cancelled && unlocked && (
          <span className="tag tag-points">Points</span>
        )}
        {item.tentative && <span className="tag tag-tentative">Tentative</span>}
        {item.scrimmage && <span className="tag tag-grey">Scrimmage</span>}
        {item.playoff && <span className="tag tag-orange-soft">Playoffs</span>}
        {!isTraining && !isNote && (
          <span className={`tag ${item.home === false ? 'tag-away' : 'tag-home'}`}>
            {item.home === false ? 'Away' : item.home === 'neutral' ? 'Neutral' : 'Home'}
          </span>
        )}
        <span className="card-chevron" aria-hidden="true" />
      </span>
    </a>
  )
}
