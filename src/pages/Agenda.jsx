import { useCallback, useMemo, useState } from 'react'
import { fmt } from '../utils/date'
import { seedEvents } from '../data/agenda'
import { reservasComoEventos } from '../data/reservas'
import FeaturedCarousel from '../components/FeaturedCarousel'
import CalendarGrid from '../components/CalendarGrid'
import DayPanel from '../components/DayPanel'
import AddEventSheet from '../components/AddEventSheet'
import GoogleAgendaCard from '../components/GoogleAgendaCard'
import { juntarEventos } from '../services/googleCalendar'

const today = new Date()

// Junta os eventos de exemplo com as reservas feitas em experiências
// de parceiro (ver ReservaExperienciaSheet.jsx) — como não existe
// backend nem estado global ainda, isso é recalculado toda vez que a
// Agenda monta, lendo o que tiver no localStorage (src/data/reservas.js).
function eventosIniciais() {
  const base = seedEvents()
  const reservados = reservasComoEventos()
  const combinados = { ...base }
  for (const dia in reservados) {
    combinados[dia] = [...(combinados[dia] || []), ...reservados[dia]].sort((a, b) => a.hh.localeCompare(b.hh))
  }
  return combinados
}

export default function Agenda() {
  // Os eventos do Bolha e os importados do Google ficam em caixas
  // separadas de propósito: assim dá pra reimportar ou desconectar o
  // Google sem duplicar nem apagar o que é do app.
  const [events, setEvents] = useState(eventosIniciais)
  const [eventosGoogle, setEventosGoogle] = useState({})
  const todosOsEventos = useMemo(() => juntarEventos(events, eventosGoogle), [events, eventosGoogle])

  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState(fmt(today))
  const [sheetOpen, setSheetOpen] = useState(false)

  function shiftMonth(n) {
    let m = month + n, y = year
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    setMonth(m); setYear(y)
  }

  function selectDate(key, m, y) {
    setSelected(key)
    if (m !== month || y !== year) { setMonth(m); setYear(y) }
  }

  function saveEvent(ev) {
    setEvents(prev => {
      const next = { ...prev }
      const list = [...(next[selected] || []), ev].sort((a, b) => a.hh.localeCompare(b.hh))
      next[selected] = list
      return next
    })
    setSheetOpen(false)
  }

  const receberEventosDoGoogle = useCallback((porDia) => setEventosGoogle(porDia), [])

  return (
    <div style={{ padding: '4px 18px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24 }}>Agenda</h1>
        <GoogleAgendaCard onEventos={receberEventosDoGoogle} />
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', margin: '4px 0 10px' }}>Eventos que estão rolando</div>
      <FeaturedCarousel />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 14px', marginBottom: 16 }}>
        {[['var(--lavender)', 'Da bolha'], ['var(--mist)', 'Perto de você'], ['var(--teal)', 'Pessoal'], ['var(--pink)', 'Date 1 pra 1']].map(([color, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />{label}
          </div>
        ))}
      </div>

      <CalendarGrid year={year} month={month} selected={selected} events={todosOsEventos} onSelect={selectDate} onShiftMonth={shiftMonth} />

      <button
        onClick={() => setSheetOpen(true)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: 13, borderRadius: 14, border: '1px dashed rgba(46,196,182,0.5)',
          background: 'rgba(46,196,182,0.08)', color: 'var(--sea)', fontWeight: 600, fontSize: 13,
          cursor: 'pointer', marginTop: 14,
        }}
      >
        <span style={{ fontSize: 15 }}>+</span> Marcar algo nesse dia
      </button>

      <DayPanel selected={selected} events={todosOsEventos} onInscrever={(title) => alert('Inscrição feita em ' + title)} />

      <AddEventSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onSave={saveEvent} />
    </div>
  )
}
