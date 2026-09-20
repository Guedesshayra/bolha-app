import { niceDateLabel } from '../utils/date'
import { zoneLabel } from '../data/agenda'
import { PinIcon, LockIcon, EyeIcon } from '../icons/MiniIcons'

function MiniChip({ children, tone }) {
  const tones = {
    bolha: { bg: 'rgba(167,155,209,0.2)', bd: 'rgba(167,155,209,0.5)', fg: 'var(--lavender)' },
    perto: { bg: 'rgba(215,226,242,0.14)', bd: 'rgba(215,226,242,0.45)', fg: 'var(--mist)' },
    pessoal: { bg: 'rgba(95,179,173,0.18)', bd: 'rgba(95,179,173,0.45)', fg: 'var(--teal)' },
    date: { bg: 'rgba(201,142,166,0.2)', bd: 'rgba(201,142,166,0.5)', fg: 'var(--pink)' },
    sea: { bg: 'rgba(46,196,182,0.16)', bd: 'rgba(46,196,182,0.45)', fg: 'var(--sea)' },
    muted: { bg: 'rgba(255,255,255,0.06)', bd: 'var(--line)', fg: 'var(--text-muted)' },
  }
  const t = tones[tone]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 600,
      padding: '3px 8px 3px 6px', borderRadius: 999, background: t.bg, border: `1px solid ${t.bd}`, color: t.fg,
    }}>{children}</span>
  )
}

export default function DayPanel({ selected, events, onInscrever }) {
  const list = events[selected] || []
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, margin: '20px 0 12px', textTransform: 'capitalize' }}>
        {niceDateLabel(selected)}
      </div>
      {!list.length && (
        <div style={{ fontSize: 12.5, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 10px' }}>
          Nada marcado nesse dia ainda.
        </div>
      )}
      {list.map((ev, i) => (
        <div key={i} style={{
          display: 'flex', gap: 13, padding: 14, borderRadius: 16, alignItems: 'flex-start', marginBottom: 10,
          background: ev.sponsor ? 'rgba(46,196,182,0.08)' : 'var(--surface)',
          border: `1px solid ${ev.sponsor ? 'rgba(46,196,182,0.4)' : 'var(--line)'}`,
        }}>
          <div style={{ width: 46, flexShrink: 0, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>{ev.hh}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 4 }}>{ev.title}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{ev.source}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              {ev.lembrete ? (
                <MiniChip tone="muted">🔔 Lembrete</MiniChip>
              ) : (
                <MiniChip tone={ev.zone}>{ev.zone === 'perto' && <PinIcon />}{zoneLabel[ev.zone]}</MiniChip>
              )}
              {ev.sponsor && <MiniChip tone="sea"><PinIcon />Parceiro</MiniChip>}
              {ev.local && <MiniChip tone="muted">{ev.local.modo === 'online' ? '💻' : '📍'} {ev.local.valor}</MiniChip>}
              {ev.convidados?.length > 0 && <MiniChip tone="muted">👥 {ev.convidados.length}</MiniChip>}
              <MiniChip tone={ev.privacy === 'privado' ? 'muted' : 'sea'}>
                {ev.privacy === 'privado' ? <><LockIcon /> Só você vê</> : <><EyeIcon /> Visível pra quem te conhece</>}
              </MiniChip>
            </div>
            {ev.status === 'sugestao' ? (
              <button onClick={() => onInscrever(ev.title)} style={primaryBtn}>Inscrever-se</button>
            ) : ev.origem === 'google' && ev.link ? (
              // Compromisso importado: quem manda nele é o Google, então
              // a gente manda a pessoa editar lá em vez de fingir que o
              // Bolha é o dono do evento.
              <a href={ev.link} target="_blank" rel="noreferrer" style={linkBtn}>Abrir no Google ↗</a>
            ) : (
              <button onClick={() => alert('Detalhes — próximo passo do app')} style={ghostBtn}>Ver detalhes</button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const primaryBtn = { border: 'none', borderRadius: 10, padding: '7px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'linear-gradient(90deg, var(--sea), #0f6f66)', color: '#052e2a' }
const ghostBtn = { border: '1px solid var(--line)', borderRadius: 10, padding: '7px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'rgba(255,255,255,0.07)', color: 'var(--text)' }
const linkBtn = { ...ghostBtn, display: 'inline-block', textDecoration: 'none' }
