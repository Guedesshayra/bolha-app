import { MONTHS, fmt } from '../utils/date'
import { zoneColor } from '../data/agenda'

export default function CalendarGrid({ year, month, selected, events, onSelect, onShiftMonth }) {
  const today = new Date()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  let cells = []
  for (let i = firstWeekday - 1; i >= 0; i--) cells.push({ d: daysInPrevMonth - i, other: true, m: month - 1, y: year })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ d, other: false, m: month, y: year })
  while (cells.length % 7 !== 0 || cells.length < 42) cells.push({ d: cells.length, other: true, m: month + 1, y: year })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, textTransform: 'capitalize' }}>
          {MONTHS[month]} de {year}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onShiftMonth(-1)} style={navBtnStyle}>‹</button>
          <button onClick={() => onShiftMonth(1)} style={navBtnStyle}>›</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>
        {['dom','seg','ter','qua','qui','sex','sáb'].map(d => <span key={d}>{d}</span>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5, marginBottom: 8 }}>
        {cells.map((c, i) => {
          let m = c.m, y = c.y
          if (m < 0) { m = 11; y-- } if (m > 11) { m = 0; y++ }
          const dateObj = new Date(y, m, c.d)
          const key = fmt(dateObj)
          const isToday = key === fmt(today)
          const isSel = key === selected
          const dayEvents = events[key] || []
          const hasBolha = dayEvents.some(e => e.zone === 'bolha')
          const hasPerto = !hasBolha && dayEvents.some(e => e.zone === 'perto')
          return (
            <div
              key={i}
              onClick={() => onSelect(key, m, y)}
              style={{
                aspectRatio: '1/1', borderRadius: 11, cursor: 'pointer', position: 'relative',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
                opacity: c.other ? 0.28 : 1,
                background: isSel ? 'rgba(46,196,182,0.16)' : hasBolha ? 'rgba(167,155,209,0.16)' : hasPerto ? 'rgba(215,226,242,0.10)' : 'rgba(255,255,255,0.035)',
                boxShadow: isToday ? '0 0 0 1.5px var(--sea) inset' : 'none',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600 }}>{c.d}</div>
              <div style={{ display: 'flex', gap: 2.5, height: 5 }}>
                {dayEvents.slice(0, 3).map((e, idx) => (
                  <span key={idx} style={{ width: 5, height: 5, borderRadius: '50%', background: zoneColor[e.zone] }} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const navBtnStyle = {
  width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
  border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: 'var(--text)', fontSize: 16,
}
