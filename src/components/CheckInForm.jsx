// Tryout check-in form. Posts to Netlify Forms — no backend, no database.
//
// Netlify only registers a form it can see in the HTML at deploy time, and a
// React SPA renders after that. So index.html carries a hidden copy of this
// form with matching field names; this component posts to it by name.
// Submissions land in the Netlify dashboard under Forms > tryout-check-in.

import { useState } from 'react'

export const FORM_NAME = 'tryout-check-in'

const POSITIONS = [
  'Goalkeeper',
  'Center back',
  'Outside back',
  'Defensive midfield',
  'Center midfield',
  'Attacking midfield',
  'Winger',
  'Striker',
]

// Field names are the column headings in the Netlify export, so they are
// written for a human reading a spreadsheet later.
const EMPTY = {
  'Name': '',
  'Year': '',
  'Years at McDonogh': '',
  'Primary position': '',
  'Secondary position': '',
  'Parent email 1': '',
  'Parent email 2': '',
  'McDonogh email access': '',
}

function encode(data) {
  return Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join('&')
}

export default function CheckInForm() {
  const [values, setValues] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [botField, setBotField] = useState('')

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': FORM_NAME, 'bot-field': botField, ...values }),
      })
      if (!res.ok) throw new Error(`Netlify returned ${res.status}`)
      setStatus('done')
    } catch (err) {
      console.error('Check-in submit failed:', err)
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="checkin-page">
        <a className="detail-back" href="#/">← Full schedule</a>
        <div className="checkin-done">
          <h2>You’re checked in</h2>
          <p>
            Thanks, {values['Name'].split(' ')[0] || 'and'} — we have your details. You only
            need to do this once.
          </p>
          <a className="checkin-btn" href="#/">Back to the schedule</a>
        </div>
      </div>
    )
  }

  return (
    <div className="checkin-page">
      <a className="detail-back" href="#/">← Full schedule</a>

      <div className="detail-head">
        <h2 className="detail-name">Tryout Check-In</h2>
        <p className="detail-meta">Fill this in once, at your first tryout.</p>
      </div>

      <form className="cform" name={FORM_NAME} onSubmit={onSubmit} noValidate={false}>
        {/* Spam trap — real people never see or fill this. */}
        <p className="cform-hp">
          <label>
            Leave this empty
            <input
              name="bot-field"
              value={botField}
              onChange={(e) => setBotField(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </p>

        <label className="cfield">
          <span className="cfield-label">First and last name <em>*</em></span>
          <input
            type="text"
            required
            autoComplete="name"
            value={values['Name']}
            onChange={set('Name')}
          />
        </label>

        <fieldset className="cfield">
          <legend className="cfield-label">Year <em>*</em></legend>
          <div className="cradios">
            {['9th', '10th', '11th', '12th'].map((y) => (
              <label key={y} className={`cradio ${values['Year'] === y ? 'cradio-on' : ''}`}>
                <input
                  type="radio"
                  name="Year"
                  value={y}
                  required
                  checked={values['Year'] === y}
                  onChange={set('Year')}
                />
                {y}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="cfield">
          <span className="cfield-label">Number of years at McDonogh <em>*</em></span>
          <input
            type="number"
            min="1"
            max="14"
            step="1"
            required
            inputMode="numeric"
            placeholder="Enter 1 if this is your first year"
            value={values['Years at McDonogh']}
            onChange={set('Years at McDonogh')}
          />
        </label>

        <label className="cfield">
          <span className="cfield-label">Primary position <em>*</em></span>
          <select required value={values['Primary position']} onChange={set('Primary position')}>
            <option value="">Choose one…</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>

        <label className="cfield">
          <span className="cfield-label">Secondary position</span>
          <select value={values['Secondary position']} onChange={set('Secondary position')}>
            <option value="">None</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>

        <label className="cfield">
          <span className="cfield-label">Parent email <em>*</em></span>
          <input
            type="email"
            required
            autoComplete="off"
            placeholder="parent@example.com"
            value={values['Parent email 1']}
            onChange={set('Parent email 1')}
          />
        </label>

        <label className="cfield">
          <span className="cfield-label">Second parent email</span>
          <input
            type="email"
            autoComplete="off"
            placeholder="Optional"
            value={values['Parent email 2']}
            onChange={set('Parent email 2')}
          />
        </label>

        <fieldset className="cfield">
          <legend className="cfield-label">
            Do you have access to your McDonogh email? <em>*</em>
          </legend>
          <div className="cradios">
            {['Yes', 'No'].map((v) => (
              <label
                key={v}
                className={`cradio ${values['McDonogh email access'] === v ? 'cradio-on' : ''}`}
              >
                <input
                  type="radio"
                  name="McDonogh email access"
                  value={v}
                  required
                  checked={values['McDonogh email access'] === v}
                  onChange={set('McDonogh email access')}
                />
                {v}
              </label>
            ))}
          </div>
        </fieldset>

        <button className="cform-submit" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Check in'}
        </button>

        {status === 'error' && (
          <p className="cform-error">
            That didn’t send. Check your signal and try again — or tell a coach and
            we’ll take your details by hand.
          </p>
        )}

        <p className="cform-fine">
          <em>*</em> required. Your details go to the coaching staff only.
        </p>
      </form>
    </div>
  )
}
