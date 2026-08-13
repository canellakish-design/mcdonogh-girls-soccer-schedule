// Shirt / shorts / socks, each filled with that item's colour.
// Shapes carry a hairline stroke so a white kit still reads on a white card,
// plus a low-opacity detail line (collar, waistband, cuff) that works over
// any fill without needing a second colour.

const STROKE = '#7d838c'
const DETAIL = 'rgba(0,0,0,0.28)'

function Shirt({ color }) {
  return (
    <svg viewBox="0 0 32 32" className="kit-svg" aria-hidden="true">
      <path
        d="M12 4 L6 7 Q4 8 4.6 10.2 L6.2 15 Q6.6 16.2 7.8 15.9 L9.8 15.3 L9.8 26.5
           Q9.8 28 11.3 28 L20.7 28 Q22.2 28 22.2 26.5 L22.2 15.3 L24.2 15.9
           Q25.4 16.2 25.8 15 L27.4 10.2 Q28 8 26 7 L20 4 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      {/* collar */}
      <path
        d="M12 4 Q16 8.4 20 4"
        fill="none"
        stroke={DETAIL}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Shorts({ color }) {
  return (
    <svg viewBox="0 0 32 32" className="kit-svg" aria-hidden="true">
      <path
        d="M6.5 5 L25.5 5 Q26.6 5 26.5 6.2 L25 26.4 Q24.9 27.6 23.7 27.6
           L18.6 27.6 Q17.5 27.6 17.3 26.5 L16 17.8 L14.7 26.5
           Q14.5 27.6 13.4 27.6 L8.3 27.6 Q7.1 27.6 7 26.4 L5.5 6.2
           Q5.4 5 6.5 5 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      {/* waistband */}
      <path
        d="M5.8 9 L26.2 9"
        fill="none"
        stroke={DETAIL}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Socks({ color }) {
  return (
    <svg viewBox="0 0 32 32" className="kit-svg" aria-hidden="true">
      <path
        d="M11 4 L20 4 Q21 4 21 5 L21 16.5 Q21 18.6 22.6 19.9 L26 22.6
           Q28 24.2 26.5 26.4 Q25.4 28 23.5 28 L17.5 28 Q14.6 28 13 25.7
           L11.4 23.4 Q11 22.8 11 22 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      {/* cuff */}
      <path
        d="M11.4 8 L20.6 8"
        fill="none"
        stroke={DETAIL}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function KitIcons({ kit }) {
  if (!kit) return null
  // Days with no fixed colours just state who decides.
  if (kit.text) return <p className="kit-text">{kit.text}</p>
  const parts = [
    ['shirt', Shirt, kit.shirt],
    ['shorts', Shorts, kit.shorts],
    ['socks', Socks, kit.socks],
  ].filter(([, , v]) => v)
  if (!parts.length) return null

  return (
    <ul className="kit-list">
      {parts.map(([key, Icon, v]) => (
        <li key={key} className="kit-row">
          <span className="kit-icon">
            <Icon color={v.color} />
          </span>
          <span className="kit-name">{v.label}</span>
        </li>
      ))}
    </ul>
  )
}
