// End-of-season uniform check-in, laid out as a grid: a row a player, a
// column an item. Red cross means it is still out; green tick means it is
// back in. The names column stays put while the items scroll sideways,
// which is the only way nine columns read on a phone.

import { uniformReturn } from '../data/schedule.js'
import { roster } from '../data/roster.js'

function isBack(name, item) {
  const list = uniformReturn.returned[name]
  return Array.isArray(list) && list.includes(item)
}

export default function UniformReturn() {
  const { items } = uniformReturn
  // Squad order, by number, with the keepers whose shirt says GK last.
  const players = [...roster].sort((a, b) => {
    if (a.no == null && b.no == null) return a.name.localeCompare(b.name)
    if (a.no == null) return 1
    if (b.no == null) return -1
    return a.no - b.no
  })

  const outstanding = players.reduce(
    (n, p) => n + items.filter((it) => !isBack(p.name, it)).length,
    0,
  )

  return (
    <section className="uniform">
      {/* The day's own note already carries the instructions and the
          warning, so this is the grid and nothing else. */}
      <h3 className="uniform-head">Who still owes what</h3>

      <div className="uniform-key">
        <span><b className="u-out">✗</b> still out</span>
        <span><b className="u-in">✓</b> returned</span>
        <span className="uniform-count">{outstanding} items still out</span>
      </div>

      <div className="uniform-scroll">
        <table className="uniform-grid">
          <thead>
            <tr>
              <th className="u-name" scope="col">Player</th>
              <th className="u-no" scope="col">No.</th>
              {items.map((it) => (
                <th key={it} scope="col">{it}</th>
              ))}
              <th className="u-left" scope="col">Left</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => {
              const left = items.filter((it) => !isBack(p.name, it)).length
              return (
                <tr key={p.name} className={left === 0 ? 'u-row-done' : ''}>
                  <th className="u-name" scope="row">{p.name}</th>
                  <td className="u-no">{p.no == null ? 'GK' : p.no}</td>
                  {items.map((it) => {
                    const back = isBack(p.name, it)
                    return (
                      <td key={it} className={back ? 'u-in' : 'u-out'}>
                        <span aria-hidden="true">{back ? '✓' : '✗'}</span>
                        <span className="sr-only">
                          {back ? 'returned' : 'not returned'}
                        </span>
                      </td>
                    )
                  })}
                  <td className="u-left">{left === 0 ? '—' : left}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="uniform-foot">
        Told Harry you have handed something in and it still shows a cross?
        Tell him again — the grid only moves when he says so.
      </p>
    </section>
  )
}
