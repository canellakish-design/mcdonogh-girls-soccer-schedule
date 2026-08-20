// Intra-squad days split the squad into sides. A side can carry the same kit
// panel the rest of the site uses and the room it meets in; a training day
// that just needs two lists can leave both off.

import KitIcons from './KitIcons.jsx'
import { buildKit } from '../data/schedule.js'

export default function Teams({ teams, at }) {
  if (!teams?.length) return null

  return (
    <div className="teams">
      {teams.map((team) => (
        <section key={team.name} className="team">
          <h3 className="team-name">
            {team.name}
            {team.players?.length ? (
              <span className="team-count">{team.players.length}</span>
            ) : null}
          </h3>
          {team.kit && <KitIcons kit={buildKit(team.kit)} />}
          {team.players?.length > 0 && (
            <ul className="team-players">
              {team.players.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
          {team.meetIn && (
            <p className="team-meet">
              Meets in {team.meetIn}
              {at ? ` at ${at}` : ''}
            </p>
          )}
        </section>
      ))}
    </div>
  )
}
