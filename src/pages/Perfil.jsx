import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { myBolhas } from '../data/bolhas'
import { objetivos as opcoesDeObjetivo } from '../data/objetivos'
import { gostos as opcoesDeGosto } from '../data/gostos'

// Perfil enxuto de propósito: foto, nome, as bolhas de interesse da
// pessoa, o que ela busca no Bolha e do que ela gosta. Esses dois
// últimos campos não são bio pública de "o que eu procuro" tipo app
// de relacionamento — eles alimentam o filtro/ranqueamento do Feed
// por trás dos panos (src/utils/compatibilidade.js e a pontuação de
// gostos em src/pages/Feed.jsx).
export default function Perfil() {
  const { usuario } = useAuth()
  const nome = usuario?.nome || 'Você'
  const meusObjetivos = opcoesDeObjetivo.filter(o => usuario?.objetivos?.includes(o.id))
  const meusGostos = opcoesDeGosto.filter(g => usuario?.gostos?.includes(g.id))

  return (
    <div style={{ padding: '4px 18px 24px' }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 26 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--sea), var(--pink))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 23, color: '#052e2a',
        }}>
          {usuario?.foto ? (
            <img src={usuario.foto} alt="" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            nome.charAt(0).toUpperCase()
          )}
        </div>
        <div style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 20 }}>{nome}</div>
        <button onClick={() => alert('Editar perfil — próximo passo do app')} style={editBtn}>Editar</button>
      </div>

      <SectionLabel>Bolhas de interesse</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 22 }}>
        {myBolhas.map(b => (
          <div key={b.name} onClick={() => alert(b.name + ' — próximo passo do app')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 14, background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{b.icon}</div>
            <div style={{ fontSize: 9.5, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2 }}>{b.name}</div>
          </div>
        ))}
        <Link to="/conversas" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
          <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px dashed var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'var(--text-muted)' }}>+</div>
          <div style={{ fontSize: 9.5, color: 'var(--text-muted)', textAlign: 'center' }}>Ver todas</div>
        </Link>
      </div>

      <SectionLabel>O que você busca no Bolha</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
        {meusObjetivos.map(o => (
          <span key={o.id} className="tag">{o.icon} {o.label}</span>
        ))}
        <Link to="/perfil/objetivos" className="tag" style={{ color: 'var(--sea)', textDecoration: 'none' }}>Editar</Link>
      </div>

      <SectionLabel>Seus gostos</SectionLabel>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
        {meusGostos.map(g => (
          <span key={g.id} className="tag">{g.icon} {g.label}</span>
        ))}
        <Link to="/perfil/gostos" className="tag" style={{ color: 'var(--sea)', textDecoration: 'none' }}>Editar</Link>
      </div>

      <SectionLabel>Bolha para empresas</SectionLabel>
      <Link to="/parceiro" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '14px 15px',
        borderRadius: 16, background: 'rgba(255,255,255,0.035)', border: '1px solid var(--line)', textDecoration: 'none', color: 'var(--text)',
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>É dono de um espaço ou experiência?</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Cadastre sua empresa e receba reservas de bolhas direto pelo app.</div>
        </div>
        <span style={{ color: 'var(--text-muted)' }}>›</span>
      </Link>
    </div>
  )
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', margin: '4px 0 10px' }}>{children}</div>
}

const editBtn = {
  padding: '8px 16px', borderRadius: 12, border: '1px solid var(--line)', cursor: 'pointer',
  background: 'rgba(255,255,255,0.06)', color: 'var(--text)', fontSize: 12.5, fontWeight: 600, flexShrink: 0,
}
