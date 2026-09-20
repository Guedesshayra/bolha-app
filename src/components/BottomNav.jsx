import { NavLink } from 'react-router-dom'
import { FeedIcon, AgendaIcon, ConversasIcon, PerfilIcon } from '../icons/NavIcons'

// Não existe mais uma página "Bolhas" separada — as bolhas (grupo) e
// as conversas 1 pra 1 moram juntas em Conversas.jsx, e abrir uma
// bolha de lá leva pro Mural dela (ver ConversaThread.jsx).
const items = [
  { to: '/', label: 'Feed', Icon: FeedIcon, end: true },
  { to: '/agenda', label: 'Agenda', Icon: AgendaIcon },
  { to: '/conversas', label: 'Conversas', Icon: ConversasIcon },
  { to: '/perfil', label: 'Perfil', Icon: PerfilIcon },
]

export default function BottomNav() {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '9px 8px calc(11px + env(safe-area-inset-bottom))',
      borderTop: '1px solid var(--line)',
      background: 'linear-gradient(to top, rgba(6,13,26,0.98), rgba(6,13,26,0.85) 70%, rgba(6,13,26,0))',
    }}>
      {items.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          style={({ isActive }) => ({
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            fontSize: 10.5, fontWeight: 600, textDecoration: 'none',
            padding: '2px 6px', minWidth: 54,
            color: isActive ? 'var(--sea)' : 'var(--text-muted)',
            transition: 'color .15s',
          })}
        >
          {({ isActive }) => (
            <>
              <Icon size={22} style={{ opacity: isActive ? 1 : 0.9 }} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
