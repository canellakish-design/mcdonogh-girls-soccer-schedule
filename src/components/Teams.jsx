// Intra-squad days split the squad into sides. Each side gets the same kit
// panel the rest of the site uses, plus the room it meets in.

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
          <KitIcons kit={buildKit(team.kit)} />
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
