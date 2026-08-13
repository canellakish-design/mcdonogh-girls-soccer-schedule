// Shirt / shorts / socks, stacked, each filled with that item's colour.
// Every shape carries a stroke so a white kit still reads on a white card.

const STROKE = '#8b9099'

function Shirt({ color }) {
  return (
    <svg viewBox="0 0 24 24" className="kit-svg" aria-hidden="true">
      <path
        d="M9 3 L4 5.5 L5.5 10 L7.5 9.5 L7.5 21 L16.5 21 L16.5 9.5 L18.5 10 L20 5.5 L15 3 A3 3 0 0 1 9 3 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Shorts({ color }) {
  return (
    <svg viewBox="0 0 24 24" className="kit-svg" aria-hidden="true">
      <path
        d="M5 4 H19 L18.2 20 H13.4 L12 11.5 L10.6 20 H5.8 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Socks({ color }) {
  return (
    <svg viewBox="0 0 24 24" className="kit-svg" aria-hidden="true">
      <path
        d="M8 3 H13 V13 Q13 15 14.6 16.2 L17.5 18.4 Q19 19.6 17.8 21 H12.5 Q10.5 21 9.4 19.6 L8 17.8 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function KitIcons({ kit, size = 'sm' }) {
  if (!kit) return null
  const parts = [
    ['shirt', Shirt, kit.shirt],
    ['shorts', Shorts, kit.shorts],
    ['socks', Socks, kit.socks],
  ].filter(([, , v]) => v)

  const label = parts.map(([, , v]) => v.label).join(', ')

  return (
    <span className={`kit-stack kit-${size}`} title={label}>
      {parts.map(([key, Icon, v]) => (
        <span key={key} className="kit-item">
          <Icon color={v.color} />
        </span>
      ))}
      <span className="sr-only">Kit: {label}</span>
    </span>
  )
}
