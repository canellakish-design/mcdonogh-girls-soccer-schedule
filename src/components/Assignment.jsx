// A piece of video work set for the squad. Players-only — it lives behind
// the team code, like practice points.

export default function Assignment({ assignment }) {
  if (!assignment) return null
  const a = assignment

  return (
    <section className="assign">
      <div className="assign-head">
        <h3 className="assign-title">{a.title}</h3>
        <p className="assign-due">
          <span className="assign-due-label">Due</span> {a.due}
        </p>
      </div>

      <p className="assign-who">{a.who}</p>
      {a.alsoYou && <p className="assign-also">{a.alsoYou}</p>}

      <ol className="assign-parts">
        {a.parts.map((p) => (
          <li key={p.head}>
            <h4>{p.head}</h4>
            <p>{p.body}</p>
          </li>
        ))}
      </ol>

      {a.rules?.length > 0 && (
        <ul className="assign-rules">
          {a.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}

      {a.howTo && (
        <div className="assign-how">
          <h4 className="assign-how-title">{a.howTo.title}</h4>
          <ol className="assign-how-steps">
            {a.howTo.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          {a.howTo.tips?.length > 0 && (
            <ul className="assign-how-tips">
              {a.howTo.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          {a.howTo.caveat && <p className="assign-how-caveat">{a.howTo.caveat}</p>}
        </div>
      )}

      {a.resources?.length > 0 && (
        <ul className="assign-links">
          {a.resources.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noopener noreferrer">
                {r.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
