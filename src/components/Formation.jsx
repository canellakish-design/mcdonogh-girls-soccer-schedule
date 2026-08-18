const COLORS = {
  orange: '#e8541e',
  white: '#ffffff',
  black: '#000000',
}

function getColor(colorName) {
  return COLORS[colorName] || colorName
}

export default function Formation({ formations }) {
  if (!formations || formations.length === 0) return null

  return (
    <div className="formations-container">
      {formations.map((team, idx) => (
        <div key={idx} className="formation-panel">
          <div className="formation-header">
            <h4>{team.name}</h4>
            <span className="formation-type">{team.formation}</span>
          </div>
          <svg viewBox="0 0 100 140" className="formation-field">
            {/* Field outline */}
            <rect x="5" y="5" width="90" height="130" fill="none" stroke="#2d5016" strokeWidth="0.5" />

            {/* Center line */}
            <line x1="5" y1="70" x2="95" y2="70" stroke="#2d5016" strokeWidth="0.5" opacity="0.5" />

            {/* Center circle */}
            <circle cx="50" cy="70" r="8" fill="none" stroke="#2d5016" strokeWidth="0.3" opacity="0.5" />

            {/* Goal areas */}
            <rect x="5" y="55" width="15" height="30" fill="none" stroke="#2d5016" strokeWidth="0.3" opacity="0.3" />
            <rect x="80" y="55" width="15" height="30" fill="none" stroke="#2d5016" strokeWidth="0.3" opacity="0.3" />

            {/* Goalkeeper */}
            <circle cx="10" cy="70" r="3.5" fill={getColor(team.kit[0])} stroke="#000" strokeWidth="0.2" />
            <text x="10" y="71" textAnchor="middle" dominantBaseline="middle" fontSize="2" fill="#000" fontWeight="bold">
              1
            </text>

            {/* Defenders (4) */}
            {[20, 35, 50, 65].map((y, i) => (
              <g key={`def-${i}`}>
                <circle cx="25" cy={y} r="3.5" fill={getColor(team.kit[0])} stroke="#000" strokeWidth="0.2" />
                <text x="25" y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="2" fill="#000" fontWeight="bold">
                  {i + 2}
                </text>
              </g>
            ))}

            {/* Midfielders (3) */}
            {[30, 50, 70].map((y, i) => (
              <g key={`mid-${i}`}>
                <circle cx="50" cy={y} r="3.5" fill={getColor(team.kit[1])} stroke="#000" strokeWidth="0.2" />
                <text x="50" y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="2" fill="#000" fontWeight="bold">
                  {i + 6}
                </text>
              </g>
            ))}

            {/* Forwards (3) */}
            {[25, 50, 75].map((y, i) => (
              <g key={`fwd-${i}`}>
                <circle cx="75" cy={y} r="3.5" fill={getColor(team.kit[2])} stroke="#000" strokeWidth="0.2" />
                <text x="75" y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="2" fill="#000" fontWeight="bold">
                  {i + 9}
                </text>
              </g>
            ))}
          </svg>
          <div className="formation-kit">
            <span className="kit-item" style={{ backgroundColor: getColor(team.kit[0]) }} title="Jersey" />
            <span className="kit-item" style={{ backgroundColor: getColor(team.kit[1]) }} title="Shorts" />
            <span className="kit-item" style={{ backgroundColor: getColor(team.kit[2]) }} title="Socks" />
          </div>
        </div>
      ))}
    </div>
  )
}
