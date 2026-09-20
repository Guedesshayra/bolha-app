// Marca do Bolha: "BO" dentro da bolha de vidro, "LHA" em letra
// bolhuda saindo dela. Mesmo SVG gerado pro logo em PNG/SVG.
export default function BubbleLogo({ height = 30 }) {
  return (
    <svg viewBox="0 0 700 340" height={height} style={{ display: 'block' }}>
      <defs>
        <radialGradient id="bBig" cx="35%" cy="28%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#a79bd1" stopOpacity="0.16" />
        </radialGradient>
        <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2ec4b6" />
          <stop offset="35%" stopColor="#c98ea6" />
          <stop offset="70%" stopColor="#a79bd1" />
          <stop offset="100%" stopColor="#5fb3ad" />
        </linearGradient>
      </defs>
      <circle cx="170" cy="160" r="152" fill="url(#bBig)" stroke="url(#rim)" strokeWidth="3" />
      <circle cx="170" cy="160" r="152" fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.2" />
      <ellipse cx="118" cy="95" rx="34" ry="20" fill="#ffffff" opacity="0.4" transform="rotate(-25 118 95)" />
      <circle cx="600" cy="48" r="18" fill="url(#bBig)" stroke="url(#rim)" strokeWidth="2" />
      <circle cx="650" cy="290" r="10" fill="url(#bBig)" stroke="url(#rim)" strokeWidth="1.4" />
      {['BO', 'LHA'].map((word, i) => {
        const x = i === 0 ? 170 : 332
        const anchor = i === 0 ? 'middle' : 'start'
        const accent = i === 0 ? '#2ec4b6' : '#c98ea6'
        return (
          <g key={word}>
            <text x={x} y="215" textAnchor={anchor} fontFamily="'Fredoka', sans-serif" fontWeight="700" fontSize="150" fill="#0a1730" stroke="#0a1730" strokeWidth="22" strokeLinejoin="round">{word}</text>
            <text x={x} y="215" textAnchor={anchor} fontFamily="'Fredoka', sans-serif" fontWeight="700" fontSize="150" fill={accent} stroke={accent} strokeWidth="9" strokeLinejoin="round">{word}</text>
            <text x={x} y="215" textAnchor={anchor} fontFamily="'Fredoka', sans-serif" fontWeight="700" fontSize="150" fill="#f6f2e8">{word}</text>
          </g>
        )
      })}
    </svg>
  )
}
