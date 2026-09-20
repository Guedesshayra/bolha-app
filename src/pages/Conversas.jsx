import { Link } from 'react-router-dom'
import { conversations, conversationOrder } from '../data/conversas'

export default function Conversas() {
  return (
    <div style={{ padding: '4px 18px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, marginBottom: 2 }}>Conversas</h1>
      <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 14 }}>
        Bolhas e pessoas com quem você já trocou uma palavra.
      </p>

      {conversationOrder.map(id => {
        const c = conversations[id]
        const preview = c.messages[c.messages.length - 1].text
        return (
          <Link key={id} to={`/conversas/${id}`} style={{
            display: 'flex', gap: 12, alignItems: 'center', padding: '12px 6px',
            borderBottom: '1px solid var(--line)', textDecoration: 'none', color: 'var(--text)',
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: '50%', background: c.color, color: '#0a1730',
              fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, flexShrink: 0, position: 'relative',
            }}>
              {c.icon}
              {c.unread && <span style={{ position: 'absolute', top: -1, right: -1, width: 11, height: 11, borderRadius: '50%', background: 'var(--sea)', border: '2px solid var(--deep)' }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                  {c.type === 'bolha' && (
                    <span style={{
                      fontSize: 9.5, fontWeight: 700, color: 'var(--lavender)', flexShrink: 0,
                      padding: '2px 7px', borderRadius: 999, background: 'rgba(167,155,209,0.16)', border: '1px solid rgba(167,155,209,0.4)',
                    }}>BOLHA</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{c.time}</div>
              </div>
              <div style={{
                fontSize: 12.5, color: c.unread ? 'var(--text)' : 'var(--text-muted)', fontWeight: c.unread ? 600 : 400,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2,
              }}>{preview}</div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
