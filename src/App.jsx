import { useState, useEffect, useMemo } from 'react'
import { TEAM, schedule, observances, rules } from './data/schedule.js'
import ScheduleCard from './components/ScheduleCard.jsx'
import DayDetail from './components/DayDetail.jsx'

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const on = () => setHash(window.location.hash)
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return hash
}

function Masthead() {
  return (
    <header className="masthead">
      <div className="masthead-inner">
        <a href="#/" className="crest-link">
          <img className="crest" src="/eagle-orange.png" alt="McDonogh Eagles" />
        </a>
        <div className="masthead-text">
          <p className="eyebrow">{TEAM.school} · {TEAM.program}</p>
          <h1>{TEAM.title}</h1>
          <p className="season">{TEAM.season}</p>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>{TEAM.school} — {TEAM.program} · {TEAM.season}</p>
      <p className="fine">Coaches: {TEAM.coaches}</p>
    </footer>
  )
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'match', label: 'Matches' },
  { key: 'training', label: 'Training' },
]

// Local calendar date as 'YYYY-MM-DD' (matches the sortDate format in the data).
function todayISO() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function ListView() {
  const [filter, setFilter] = useState('all')
  const [showPast, setShowPast] = useState(false)
  const [showRules, setShowRules] = useState(true)
  const today = todayISO()

  // Holiday notes ride inside the card for that date.
  const obsByDate = useMemo(
    () => new Map(observances.map((o) => [o.sortDate, o])),
    [],
  )

  const { upcoming, past } = useMemo(() => {
    const rows = schedule
      .filter((d) => filter === 'all' || d.type === filter)
      .sort((a, b) => (a.sortDate || '').localeCompare(b.sortDate || ''))
    return {
      upcoming: rows.filter((d) => (d.sortDate || '') >= today), // today floats to the top
      past: rows.filter((d) => (d.sortDate || '') < today).reverse(), // most recent first
    }
  }, [filter, today])

  return (
    <main className="container">
      {rules.length > 0 && (
        <section className="rules">
          <button
            className="rules-head"
            onClick={() => setShowRules((v) => !v)}
            aria-expanded={showRules}
          >
            <span className={`caret ${showRules ? 'caret-open' : ''}`} aria-hidden="true" />
            Team Rules
          </button>
          {showRules && (
            <ul className="rules-list">
              {rules.map((r) => (
                <li key={r.title}>
                  <strong>{r.title}.</strong> {r.body}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="toolbar">
        <div className="segmented" role="tablist" aria-label="Filter schedule">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`seg ${filter === f.key ? 'seg-on' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="count">{upcoming.length} upcoming</span>
      </div>

      <div className="list">
        {upcoming.map((item, i) => (
          <ScheduleCard
            key={item.no}
            item={item}
            observance={obsByDate.get(item.sortDate)}
            highlight={i === 0 ? (item.sortDate === today ? 'today' : 'next') : null}
          />
        ))}
        {upcoming.length === 0 && <p className="empty">Season complete — see completed days below.</p>}
      </div>

      {past.length > 0 && (
        <div className="past-block">
          <button className="past-toggle" onClick={() => setShowPast((v) => !v)}>
            {showPast ? '▾' : '▸'} Completed ({past.length})
          </button>
          {showPast && (
            <div className="list list-past">
              {past.map((item) => (
                <ScheduleCard
                  key={item.no}
                  item={item}
                  observance={obsByDate.get(item.sortDate)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  )
}

export default function App() {
  const hash = useHashRoute()
  const match = hash.match(/#\/day\/(\d+)/)
  const current = match ? schedule.find((d) => String(d.no) === match[1]) : null

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [hash])

  return (
    <div className="page">
      <Masthead />
      {current ? (
        <main className="container">
          <DayDetail item={current} />
        </main>
      ) : (
        <ListView />
      )}
      <Footer />
    </div>
  )
}
