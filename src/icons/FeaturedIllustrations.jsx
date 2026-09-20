// Ilustrações vetoriais dos banners "Em destaque" — as mesmas do
// protótipo, agora como componentes React reutilizáveis.
export function SurfIllustration() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="skySurf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fe0d4" /><stop offset="42%" stopColor="#0f6f66" /><stop offset="100%" stopColor="#0a1730" />
        </linearGradient>
        <linearGradient id="waveSurf1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5fb3ad" /><stop offset="100%" stopColor="#a79bd1" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#skySurf)" />
      <circle cx="305" cy="72" r="46" fill="#fff6e0" opacity="0.92" />
      <path d="M0 168 Q60 138 120 168 T240 168 T400 168 V240 H0 Z" fill="url(#waveSurf1)" opacity="0.92" />
      <path d="M0 196 Q70 166 140 196 T280 196 T400 196 V240 H0 Z" fill="#0a1730" opacity="0.6" />
    </svg>
  )
}
export function CeramicIllustration() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="bgCer" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4a3416" /><stop offset="100%" stopColor="#0a1730" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#bgCer)" />
      <circle cx="285" cy="150" r="98" fill="none" stroke="#2ec4b6" strokeWidth="2" opacity="0.5" />
      <circle cx="285" cy="150" r="68" fill="none" stroke="#2ec4b6" strokeWidth="2" opacity="0.35" />
      <path d="M268 55 Q246 100 268 140 Q290 172 268 214 L312 214 Q334 172 312 140 Q334 100 312 55 Z" fill="#0f6f66" opacity="0.9" />
    </svg>
  )
}
export function PaintballIllustration() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="bgPaint" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2e2154" /><stop offset="100%" stopColor="#0a1730" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#bgPaint)" />
      <circle cx="90" cy="55" r="36" fill="#c98ea6" opacity="0.85" />
      <circle cx="155" cy="112" r="19" fill="#2ec4b6" opacity="0.88" />
      <circle cx="322" cy="182" r="54" fill="#a79bd1" opacity="0.75" />
      <circle cx="262" cy="48" r="15" fill="#5fb3ad" opacity="0.85" />
      <circle cx="55" cy="182" r="23" fill="#2ec4b6" opacity="0.65" />
    </svg>
  )
}
export const illustrationByKind = { surf: SurfIllustration, ceramica: CeramicIllustration, paintball: PaintballIllustration }
