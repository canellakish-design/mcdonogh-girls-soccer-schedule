import { matchTitle, meetNote } from './ScheduleCard.jsx'
import { clearance, directionsUrl, venueAddress, isOnCampus, kitFor } from '../data/schedule.js'

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
  const isTraining = item.type === 'training'
  const isNote = item.type === 'note'
  const homeLabel = item.home === false ? 'Away' : item.home === 'neutral' ? 'Neutral site' : 'Home'

  return (
    <div className="detail">
      <a className="detail-back" href="#/">← Full schedule</a>

      <div className="detail-head">
        <h2 className="detail-name">{matchTitle(item)}</h2>
        <p className="detail-meta">
          {item.date}
          {item.time ? <> &nbsp;·&nbsp; {item.time}</> : null}
        </p>
        <div className="indicators">
          {isNote
            ? <span className="indicator indicator-yellow">No Sessions</span>
            : isTraining
              ? <span className="indicator indicator-training">Training</span>
              : <span className="indicator indicator-match">Match</span>}
          {item.tentative && <span className="indicator indicator-tentative">Tentative</span>}
          {item.scrimmage && <span className="indicator indicator-grey">Scrimmage</span>}
          {item.playoff && <span className="indicator indicator-orange">IAAM Playoffs</span>}
          {!isTraining && !isNote && (
            <span className="indicator indicator-grey">{homeLabel}</span>
          )}
          {item.result && <span className="indicator indicator-result">{item.result}</span>}
        </div>
      </div>

      <dl className="facts">
        <Fact label="Date" value={item.date} />
        <Fact label="Time" value={item.time} />
        <Fact label="Location" value={item.location} />
        <Fact label="Dismissal" value={item.dismissal} />
        {!isTraining && !isNote && <Fact label="Opponent" value={item.opponent} />}
        {!isTraining && !isNote && <Fact label="Result" value={item.result || '—'} />}
        {item.focus && <Fact label="Focus" value={item.focus} />}
      </dl>

      {kitFor(item) && (
        <p className="detail-kit">
          <span className="detail-kit-label">Kit</span>
          {kitFor(item)}
        </p>
      )}

      {item.note && <p className="detail-note">{item.note}</p>}

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

      {isOnCampus(item.location) && (
        <figure className="campus-map">
          <a href="/campus-map.png" target="_blank" rel="noopener noreferrer">
            <img src="/campus-map.png" alt="McDonogh campus map with Field 16 marked" />
          </a>
          <figcaption>McDonogh campus — the arrow marks Field 16. Tap to enlarge.</figcaption>
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
