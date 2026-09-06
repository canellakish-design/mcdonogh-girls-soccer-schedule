// The player profile questionnaire. Answers post to Netlify Forms, which
// puts them in the site's Netlify dashboard — private to the account
// holder. Nothing is kept in the browser and nothing is shown back to
// other players.

import { useState } from 'react'
import { SCALE, SECTIONS, ALL_ITEMS } from '../data/questionnaire.js'

const FORM_NAME = 'player-profile'

function encode(data) {
  return Object.keys(data)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&')
}

export default function Questionnaire() {
  const [player, setPlayer] = useState('')
  const [answers, setAnswers] = useState({})
  const [state, setState] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')

  const answered = ALL_ITEMS.filter((i) => answers[`q${i.n}`]).length
  const complete = answered === ALL_ITEMS.length && player.trim().length > 0

  function firstUnanswered() {
    const miss = ALL_ITEMS.find((i) => !answers[`q${i.n}`])
    return miss ? miss.n : null
  }

  async function submit(e) {
    e.preventDefault()
    if (!complete) {
      const n = firstUnanswered()
      setError(
        !player.trim()
          ? 'Add your name first.'
          : `Question ${n} still needs an answer.`,
      )
      if (n) document.getElementById(`q${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setState('sending')
    setError('')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': FORM_NAME, player: player.trim(), ...answers }),
      })
      if (!res.ok) throw new Error(`Server said ${res.status}`)
      setState('done')
    } catch (err) {
      setState('error')
      setError(err.message || 'Something went wrong.')
    }
  }

  if (state === 'done') {
    return (
      <div className="detail">
        <a className="detail-back" href="#/">← Full schedule</a>
        <div className="q-done">
          <h2>Thanks, {player.trim()}.</h2>
          <p>Your answers went to the coaching staff. Nobody else on the team sees them.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="detail">
      <a className="detail-back" href="#/">← Full schedule</a>

      <div className="detail-head">
        <h2 className="detail-name">Player Profile</h2>
        <p className="detail-meta">24 statements · about five minutes</p>
      </div>

      <p className="q-intro">
        There are no right answers — this is about how you like to be coached. Rate each
        statement from <strong>Strongly disagree</strong> to <strong>Strongly agree</strong>.
        Answers go to the coaching staff only; your teammates never see them.
      </p>

      <form onSubmit={submit} noValidate>
        <div className="q-name">
          <label htmlFor="player">Your name</label>
          <input
            id="player"
            className="q-input"
            type="text"
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
            placeholder="First and last name"
            autoComplete="name"
          />
        </div>

        {SECTIONS.map((section) => (
          <section key={section.key} className="q-section">
            <h3 className="q-section-head">
              {section.name}
              {section.subtitle && <span className="q-section-sub">{section.subtitle}</span>}
            </h3>

            {section.items.map((item) => (
              <fieldset key={item.n} id={`q${item.n}`} className="q-item">
                <legend className="q-text">
                  <span className="q-num">{item.n}</span>
                  {item.text}
                </legend>
                <div className="q-scale">
                  {SCALE.map((s) => {
                    const id = `q${item.n}-${s.value}`
                    const checked = answers[`q${item.n}`] === String(s.value)
                    return (
                      <label key={s.value} className={`q-opt ${checked ? 'q-opt-on' : ''}`} htmlFor={id}>
                        <input
                          id={id}
                          type="radio"
                          name={`q${item.n}`}
                          value={s.value}
                          checked={checked}
                          onChange={() => {
                            setAnswers((a) => ({ ...a, [`q${item.n}`]: String(s.value) }))
                            setError('')
                          }}
                        />
                        <span className="q-opt-num">{s.value}</span>
                        <span className="q-opt-label">{s.short}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            ))}
          </section>
        ))}

        <div className="q-footer">
          <p className="q-count">
            {answered} of {ALL_ITEMS.length} answered
          </p>
          {error && <p className="q-error" role="alert">{error}</p>}
          <button className="q-submit" type="submit" disabled={state === 'sending'}>
            {state === 'sending' ? 'Sending…' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  )
}
