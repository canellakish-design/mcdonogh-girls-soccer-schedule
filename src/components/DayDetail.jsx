import { matchTitle } from './ScheduleCard.jsx'

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
  const homeLabel = item.home === false ? 'Away' : item.home === 'neutral' ? 'Neutral site' : 'Home'

  return (
    <div className="detail">
      <a className="detail-back" href="#/">← Full schedule</a>

      <div className="detail-head">
        <h2 className="detail-name">{matchTitle(item)}</h2>
        <p className="detail-meta">{item.date} &nbsp;·&nbsp; {item.time}</p>
        <div className="indicators">
          {isTraining
            ? <span className="indicator indicator-training">Training</span>
            : <span className="indicator indicator-match">Match</span>}
          {item.tentative && <span className="indicator indicator-tentative">Tentative</span>}
          {item.scrimmage && <span className="indicator indicator-grey">Scrimmage</span>}
          {item.playoff && <span className="indicator indicator-orange">IAAM Playoffs</span>}
          {!isTraining && <span className="indicator indicator-grey">{homeLabel}</span>}
          {item.result && <span className="indicator indicator-result">{item.result}</span>}
        </div>
      </div>

      <dl className="facts">
        <Fact label="Date" value={item.date} />
        <Fact label="Time" value={item.time} />
        <Fact label="Location" value={item.location} />
        {!isTraining && <Fact label="Opponent" value={item.opponent} />}
        {!isTraining && <Fact label="Result" value={item.result || '—'} />}
        {item.focus && <Fact label="Focus" value={item.focus} />}
      </dl>

      {item.note && <p className="detail-note">{item.note}</p>}
    </div>
  )
}
