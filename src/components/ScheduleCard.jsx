// One row in the schedule list. Left = date box; middle = matchup/focus; right = tags.

function dateBox(sortDate) {
  // sortDate is 'YYYY-MM-DD' — render as month abbrev + day, no timezone parsing.
  const [, m, d] = sortDate.split('-')
  const months = ['', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  return { mon: months[parseInt(m, 10)] || '', day: String(parseInt(d, 10)) }
}

export function matchTitle(item) {
  if (item.type === 'note') return item.title
  if (item.type === 'training') return item.focus || 'Training'
  const prefix = item.home === true ? 'vs. ' : item.home === false ? '@ ' : 'vs. '
  return prefix + item.opponent
}

export default function ScheduleCard({ item, highlight, observance }) {
  const { mon, day } = dateBox(item.sortDate)
  const isTraining = item.type === 'training'
  const isNote = item.type === 'note'
  const boxClass = isNote ? 'datebox-note' : isTraining ? 'datebox-training' : 'datebox-match'

  return (
    <a
      className={`card ${isNote ? 'card-note ' : ''}${highlight ? `card-${highlight}` : ''}`}
      href={`#/day/${item.no}`}
    >
      <span className={`datebox ${boxClass}`}>
        <span className="datebox-mon">{mon}</span>
        <span className="datebox-day">{day}</span>
      </span>

      <span className="card-main">
        {highlight && (
          <span className="card-flag">{highlight === 'today' ? 'Today' : 'Next up'}</span>
        )}
        <span className="card-title">{matchTitle(item)}</span>
        <span className="card-meta">
          {item.date}
          {item.time ? <> &nbsp;·&nbsp; {item.time}</> : null}
          {item.location ? <> &nbsp;·&nbsp; {item.location}</> : null}
        </span>
        {observance && <span className="card-obs">{observance.text}</span>}
      </span>

      <span className="card-tags">
        {item.result && <span className="tag tag-result">{item.result}</span>}
        {isNote
          ? <span className="tag tag-yellow">No Sessions</span>
          : isTraining
            ? <span className="tag tag-training">Training</span>
            : <span className="tag tag-match">Match</span>}
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
