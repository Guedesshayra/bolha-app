import { useEffect, useRef, useState } from 'react'
import BubbleLogo from './BubbleLogo'
import { useAuth } from '../auth/AuthContext'

export default function TopBar() {
  const { usuario, sair } = useAuth()
  const [aberto, setAberto] = useState(false)
  const areaRef = useRef(null)

  // Clicar em qualquer lugar fora fecha o menuzinho da conta.
  useEffect(() => {
    if (!aberto) return
    function aoClicarFora(e) {
      if (!areaRef.current?.contains(e.target)) setAberto(false)
    }
    document.addEventListener('pointerdown', aoClicarFora)
    return () => document.removeEventListener('pointerdown', aoClicarFora)
  }, [aberto])

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 20px 14px',
    }}>
      <BubbleLogo height={28} />

      <div ref={areaRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setAberto(v => !v)}
          aria-label="Sua conta"
          style={{
            width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', padding: 0,
            border: '1px solid var(--line)', overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--sea), var(--pink))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {usuario?.foto ? (
            <img
              src={usuario.foto}
              alt=""
              referrerPolicy="no-referrer"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: 14, fontWeight: 700, color: '#052e2a' }}>
              {(usuario?.nome || '?').charAt(0).toUpperCase()}
            </span>
          )}
        </button>

        {aberto && (
          <div style={{
            position: 'absolute', top: 42, right: 0, zIndex: 20, width: 230,
            padding: 14, borderRadius: 16,
            background: 'var(--panel)', border: '1px solid var(--line)',
            boxShadow: '0 18px 40px -14px rgba(0,0,0,0.7)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{usuario?.nome}</div>
            <div style={{
              fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 10,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {usuario?.email}
            </div>

            <div style={{
              fontSize: 10.5, fontWeight: 600, marginBottom: 12, padding: '4px 8px',
              borderRadius: 999, display: 'inline-block',
              background: usuario?.provedor === 'google' ? 'rgba(95,179,173,0.16)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${usuario?.provedor === 'google' ? 'rgba(95,179,173,0.45)' : 'var(--line)'}`,
              color: usuario?.provedor === 'google' ? 'var(--teal)' : 'var(--text-muted)',
            }}>
              {usuario?.provedor === 'google' ? 'E-mail verificado pelo Google' : 'Modo demonstração'}
            </div>

            <button onClick={sair} style={{
              width: '100%', padding: '9px 12px', borderRadius: 11, cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)',
              color: 'var(--text)', fontSize: 12.5, fontWeight: 600,
            }}>
              Sair
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
