import { useState, useRef } from 'react'
import { featured } from '../data/agenda'
import { illustrationByKind } from '../icons/FeaturedIllustrations'
import { PinIcon } from '../icons/MiniIcons'

export default function FeaturedCarousel() {
  const [active, setActive] = useState(0)
  const rowRef = useRef(null)

  function onScroll() {
    const row = rowRef.current
    if (!row || !row.firstElementChild) return
    const cardW = row.firstElementChild.offsetWidth + 14
    setActive(Math.round(row.scrollLeft / cardW))
  }

  return (
    <div>
      <div
        ref={rowRef}
        onScroll={onScroll}
        className="rolagem-invisivel"
        style={{
          display: 'flex', gap: 14, overflowX: 'auto', scrollSnapType: 'x mandatory',
          padding: '2px 2px 4px', marginBottom: 10,
        }}
      >
        {featured.map((f, i) => {
          const Illustration = illustrationByKind[f.kind]
          return (
            <div
              key={i}
              onClick={() => alert('Ver detalhes do convite — próximo passo do app')}
              style={{
                flex: '0 0 86%', scrollSnapAlign: 'start', height: 228, borderRadius: 22,
                position: 'relative', overflow: 'hidden', cursor: 'pointer',
                boxShadow: '0 20px 44px -18px rgba(0,0,0,0.65)',
              }}
            >
              <Illustration />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(6,13,26,0.96) 0%, rgba(6,13,26,0.45) 52%, rgba(6,13,26,0.02) 100%)',
              }} />
              <div style={{
                position: 'absolute', top: 14, left: 14, zIndex: 2, background: 'rgba(10,23,48,0.82)',
                backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: 13,
                padding: '7px 11px', textAlign: 'center', lineHeight: 1.05,
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--sea)', letterSpacing: 0.6 }}>{f.dw}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: '#fff' }}>{f.dd}</div>
              </div>
              <div style={{
                position: 'absolute', top: 16, right: 14, zIndex: 2, fontSize: 10, fontWeight: 700,
                color: '#052e2a', background: 'var(--sea)', padding: '5px 10px 5px 8px', borderRadius: 999,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <PinIcon /> Parceiro Bolha
              </div>
              <div style={{ position: 'absolute', left: 16, right: 16, bottom: 15, zIndex: 2 }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#fff',
                  lineHeight: 1.14, marginBottom: 5, textShadow: '0 2px 14px rgba(0,0,0,0.45)',
                }}>{f.title}</h3>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.88)', marginBottom: 12 }}>{f.sub}</div>
                <button
                  onClick={(e) => { e.stopPropagation(); alert('Reserva iniciada — ' + f.title) }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--sea)',
                    color: '#052e2a', fontWeight: 700, fontSize: 12.5, padding: '9px 15px',
                    borderRadius: 999, border: 'none', cursor: 'pointer',
                  }}
                >{f.cta} →</button>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
        {featured.map((_, i) => (
          <span key={i} style={{
            width: i === active ? 16 : 6, height: 6, borderRadius: 999,
            background: i === active ? 'var(--sea)' : 'rgba(255,255,255,0.18)',
            transition: 'all .2s',
          }} />
        ))}
      </div>
    </div>
  )
}
