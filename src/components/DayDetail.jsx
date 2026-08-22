import { matchTitle, meetNote } from './ScheduleCard.jsx'
import KitIcons from './KitIcons.jsx'
import Teams from './Teams.jsx'
import PracticePoints from './PracticePoints.jsx'
import PlayerGate from './PlayerGate.jsx'
import ChangeNotice from './ChangeNotice.jsx'
import { usePlayerAccess } from '../playerAccess.jsx'
import { clearance, directionsUrl, venueAddress, venueMap, kitFor } from '../data/schedule.js'

function Fact({ label, value }) {
  if (!value) return null
  return (
    <div className="fact">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

export default function DayDetail({ item }) {
  const { unlocked } = usePlayerAccess()
  const teamsCarryKit = item.teams?.length > 0 && item.teams.every((t) => t.kit)
  const isTraining = item.type === 'training'
  const isNote = item.type === 'note'
  // Anything that is not a match must not pick up opponent, result or a
  // home/away label — 'event' days (uniform pickup, media day) included.
  const isMatch = item.type === 'match'
  const isEvent = item.type === 'event'
  const homeLabel = item.home === false ? 'Away' : item.home === 'neutral' ? 'Neutral site' : 'Home'

  return (
    <div className="detail">
      <a className="detail-back" href="#/">← Full schedule</a>

      <div className="detail-head">
        <h2 className="detail-name">{matchTitle(item)}</h2>
        <p className="detail-meta">
          {item.date}
          {item.time ? <> &nbsp;·&nbsp; <strong className="detail-time">{item.time}</strong></> : null}
        </p>
        <div className="indicators">
          {isNote
            ? <span className="indicator indicator-yellow">No Sessions</span>
            : isEvent
              ? <span className="indicator indicator-event">Team Event</span>
              : isTraining
                ? <span className="indicator indicator-training">Training</span>
                : <span className="indicator indicator-match">Match</span>}
          {item.cancelled && <span className="indicator indicator-cancelled">Cancelled</span>}
          {item.tentative && <span className="indicator indicator-tentative">Tentative</span>}
          {item.scrimmage && <span className="indicator indicator-grey">Scrimmage</span>}
          {item.playoff && <span className="indicator indicator-orange">IAAM Playoffs</span>}
          {isMatch && <span className="indicator indicator-grey">{homeLabel}</span>}
          {item.result && <span className="indicator indicator-result">{item.result}</span>}
        </div>
      </div>

      {!item.cancelled && <ChangeNotice changed={item.changed} />}

      <dl className="facts">
        <Fact label="Date" value={item.date} />
        <Fact label="Time" value={item.time} />
        <Fact label="Arrive" value={item.arrive} />
        <Fact label="Location" value={item.location} />
        <Fact label="Dismissal" value={item.dismissal} />
        {/* A day with its own `title` already names itself — no Opponent row. */}
        {isMatch && !item.title && <Fact label="Opponent" value={item.opponent} />}
        {isMatch && <Fact label="Result" value={item.result || '—'} />}
        {item.focus && <Fact label="Focus" value={item.focus} />}
      </dl>

      {/* The single Kit box drops out only when each side brings its own —
          otherwise it would just repeat what the panels already say. A
          training day where both sides wear the day's kit keeps it. */}
      {!item.cancelled && !teamsCarryKit && kitFor(item) && (
        <div className="detail-kit">
          <h3 className="detail-kit-label">Kit</h3>
          <KitIcons kit={kitFor(item)} />
        </div>
      )}

      {!item.cancelled && <Teams teams={item.teams} at={item.teamTalk} />}

      {/* Practice points are squad business — parents see the gate instead. */}
      {!item.cancelled && item.practicePoints && (
        unlocked
          ? <PracticePoints day={item.practicePoints} />
          : <PlayerGate what="Practice points for this session" />
      )}

      {item.note && <p className="detail-note">{item.note}</p>}

      {/* Links attached to a day — the Yo-Yo description and recording, say. */}
      {item.resources?.length > 0 && (
        <ul className="resources">
          {item.resources.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                {r.label}
              </a>
              {r.hint && <span className="resource-hint">{r.hint}</span>}
            </li>
          ))}
        </ul>
      )}

      {meetNote(item) && <p className="detail-note detail-meet">{meetNote(item)}</p>}

      {venueAddress(item.location) && (
        <div className="venue">
          <p className="venue-address">{venueAddress(item.location)}</p>
          <a
            className="venue-btn"
            href={directionsUrl(item.location)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get directions
          </a>
        </div>
      )}

      {venueMap(item.location) && (
        <figure className="campus-map">
          <a href={venueMap(item.location).href} target="_blank" rel="noopener noreferrer">
            <img
              src={venueMap(item.location).src}
              alt={venueMap(item.location).caption || `Map of ${item.location}`}
            />
          </a>
          <figcaption>
            {venueMap(item.location).onCampus
              ? `${venueMap(item.location).caption} Tap to enlarge.`
              : 'Tap the map for directions in Google Maps.'}
          </figcaption>
        </figure>
      )}

      {item.clearance && (
        <section className="clearance">
          <h3>{clearance.title}</h3>
          <p>{clearance.intro}</p>
          <ol>
            {clearance.items.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
          <p>{clearance.outro}</p>
        </section>
      )}
    </div>
  )
}
