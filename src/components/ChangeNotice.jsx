// Flags a session that has moved. The point is the calendar lag: someone
// who subscribed sees the old time until their app refreshes, which on
// Google can be the best part of a day.

export default function ChangeNotice({ changed }) {
  if (!changed?.length) return null

  return (
    <div className="change" role="status">
      <p className="change-title">Changed</p>
      <ul className="change-list">
        {changed.map((c) => (
          <li key={c.field}>
            <strong>{c.field}</strong> — was {c.from}, now {c.to}.
          </li>
        ))}
      </ul>
      <p className="change-fine">
        Your calendar app may still show the old {changed.length === 1
          ? changed[0].field.toLowerCase()
          : 'details'}. This page is always current.
      </p>
    </div>
  )
}
