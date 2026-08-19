// Season practice points, per player. Reads the log in schedule.js and
// prices it with the same rules the day cards show.

import { practicePoints, pointsLog, standings } from '../data/schedule.js'
import PlayerGate from './PlayerGate.jsx'
import { usePlayerAccess } from '../playerAccess.jsx'

function Rank({ i, pts, prev }) {
  // Players level on points share a rank rather than being ordered arbitrarily.
  const tied = prev !== null && prev === pts
  return <span className="rank">{tied ? '' : i + 1}</span>
}

export default function Standings() {
  const { unlocked, lock } = usePlayerAccess()
  const rows = standings()
  const sessions = pointsLog.length

  if (!unlocked) {
    return (
      <main className="container">
        <a className="detail-back" href="#/">← Full schedule</a>
        <PlayerGate what="The practice points table" />
      </main>
    )
  }

  return (
    <main className="container">
      <a className="detail-back" href="#/">← Full schedule</a>

      <div className="detail-head">
        <h2 className="detail-name">Practice Points</h2>
        <p className="detail-meta">
          {sessions === 0
            ? 'No sessions counted yet'
            : `${sessions} session${sessions === 1 ? '' : 's'} counted`}
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="standings-empty">
          The table fills in after the first session. Points are earned as{' '}
          {practicePoints.earn.map((e, i) => {
            const noun = e.for.toLowerCase()
            return (
              <span key={e.for}>
                {i > 0 ? ', ' : ''}
                {e.pts.toLowerCase()} for {'aeiou'.includes(noun[0]) ? 'an' : 'a'} {noun}
              </span>
            )
          })}
          .
        </p>
      ) : (
        <table className="standings">
          <thead>
            <tr>
              <th className="col-rank" scope="col"><span className="sr-only">Rank</span></th>
              <th scope="col">Player</th>
              <th className="num" scope="col"><abbr title="Wins">W</abbr></th>
              <th className="num" scope="col"><abbr title="Goals">G</abbr></th>
              <th className="num" scope="col"><abbr title="Assists">A</abbr></th>
              <th className="num" scope="col"><abbr title="Shutouts">SO</abbr></th>
              <th className="num col-pts" scope="col">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.player}>
                <td className="col-rank">
                  <Rank i={i} pts={r.pts} prev={i > 0 ? rows[i - 1].pts : null} />
                </td>
                <th scope="row" className="col-player">{r.player}</th>
                <td className="num">{r.wins || '—'}</td>
                <td className="num">{r.goals || '—'}</td>
                <td className="num">{r.assists || '—'}</td>
                <td className="num">{r.shutouts || '—'}</td>
                <td className="num col-pts">{r.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {sessions > 0 && (
        <ol className="standings-log">
          {pointsLog.map((s) => (
            <li key={s.sortDate}>
              <span className="log-session">{s.session}</span>
              <span className="log-date">{s.sortDate}</span>
            </li>
          ))}
        </ol>
      )}

      <button className="gate-lock" type="button" onClick={lock}>
        Hide players-only content on this device
      </button>
    </main>
  )
}
