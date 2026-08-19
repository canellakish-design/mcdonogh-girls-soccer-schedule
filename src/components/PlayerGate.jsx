// The code prompt shown in place of players-only content.

import { useState } from 'react'
import { usePlayerAccess } from '../playerAccess.jsx'

export default function PlayerGate({ what = 'This section' }) {
  const { unlock } = usePlayerAccess()
  const [code, setCode] = useState('')
  const [wrong, setWrong] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (!unlock(code)) {
      setWrong(true)
      setCode('')
    }
  }

  return (
    <form className="gate" onSubmit={submit}>
      <h3 className="gate-title">Players only</h3>
      <p className="gate-lead">{what} is for the squad. Enter the team code to see it.</p>
      <div className="gate-row">
        <input
          className={`gate-input ${wrong ? 'gate-input-wrong' : ''}`}
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setWrong(false)
          }}
          placeholder="Team code"
          aria-label="Team code"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
          enterKeyHint="go"
        />
        <button className="gate-btn" type="submit">Enter</button>
      </div>
      {wrong && (
        <p className="gate-error" role="alert">
          That is not the code. Ask a coach.
        </p>
      )}
    </form>
  )
}
