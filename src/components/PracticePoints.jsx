// Practice points for one session. The ways to earn are season-wide and come
// from schedule.js; the day supplies what is on offer that night.

import { practicePoints } from '../data/schedule.js'

export default function PracticePoints({ day }) {
  if (!day) return null

  return (
    <section className="points">
      <h3 className="points-title">
        {practicePoints.title}
        {day.first && <span className="points-first">First opportunity</span>}
      </h3>

      <p className="points-lead">
        {day.first ? 'This is the first chance to earn practice points this season. ' : ''}
        {day.format ? `${day.format} — ` : ''}
        <strong>
          {day.available} practice point{day.available === 1 ? '' : 's'} available
        </strong>
        .
      </p>

      <ul className="points-earn">
        {practicePoints.earn.map((e) => (
          <li key={e.for}>
            <span className="points-pts">{e.pts}</span>
            <span className="points-for">
              {e.for}
              {e.note && <span className="points-note">{e.note}</span>}
            </span>
          </li>
        ))}
      </ul>

      <p className="points-outro">
        {practicePoints.intro} <a href="#/points">See the standings</a>.
      </p>
    </section>
  )
}
