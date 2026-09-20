import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cards } from '../data/cards'
import { myBolhas } from '../data/bolhas'
import { iconeDoTipo } from '../icons/KindIcons'
import { EstourarIcon } from '../icons/NavIcons'
import { PinIcon } from '../icons/MiniIcons'
import { tocarPloc } from '../utils/som'
import { useAuth } from '../auth/AuthContext'
import { saoCompativeis } from '../utils/compatibilidade'
import ReservaExperienciaSheet from '../components/ReservaExperienciaSheet'

const coresDeAvatar = ['var(--sea)', 'var(--lavender)', 'var(--teal)', 'var(--pink)']

// Pilha de iniciais de quem já está na bolha, com o "+N" do resto.
function PilhaDeAvatares({ avatares, pessoas }) {
  const restante = Math.max(0, (pessoas || 0) - avatares.length)

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
      {avatares.map((letra, i) => (
        <span key={i} style={{
          width: 27, height: 27, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11.5, fontWeight: 700, color: '#0a1730',
          background: coresDeAvatar[i % coresDeAvatar.length],
          border: '2px solid var(--deep)',
          marginLeft: i === 0 ? 0 : -9,
        }}>{letra}</span>
      ))}
      {restante > 0 && (
        <span style={{
          height: 27, minWidth: 27, padding: '0 7px', borderRadius: 999, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
          background: 'rgba(255,255,255,0.08)', border: '2px solid var(--deep)',
          marginLeft: -9,
        }}>+{restante}</span>
      )}
    </div>
  )
}

function Card({ c }) {
  const [salvo, setSalvo] = useState(false)
  const [reservando, setReservando] = useState(false)
  const Icone = iconeDoTipo(c.kind)

  return (
    <div style={{
      borderRadius: 20, padding: 20, marginBottom: 14,
      background: 'var(--surface)', border: '1px solid var(--line)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{
          width: 28, height: 28, borderRadius: 9, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: c.dot, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)',
        }}>
          <Icone size={16} />
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{c.kind.toUpperCase()}</span>
        {c.pop && <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: 'var(--sea)' }}>Fora da sua bolha</span>}
        {c.sponsor && (
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: 'var(--sea)' }}>
            <PinIcon /> Parceiro Bolha
          </span>
        )}
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 21, marginBottom: 4 }}>{c.title}</h2>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>{c.meta}</div>
      <p style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>{c.bio}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {c.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>

      {c.avatares && <PilhaDeAvatares avatares={c.avatares} pessoas={c.pessoas} />}

      <div style={{ display: 'flex', gap: 9 }}>
        <button
          onClick={c.experienciaId ? () => setReservando(true) : undefined}
          style={{
            flex: 1, border: 'none', borderRadius: 14, padding: '13px 18px',
            fontWeight: 600, fontSize: 14.5, cursor: c.experienciaId ? 'pointer' : 'default',
            background: 'linear-gradient(90deg, var(--sea), #0f6f66)', color: '#052e2a',
          }}
        >{c.action}</button>

        <button
          onClick={() => setSalvo(v => !v)}
          aria-pressed={salvo}
          style={{
            borderRadius: 14, padding: '13px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            flexShrink: 0, whiteSpace: 'nowrap',
            background: salvo ? 'rgba(46,196,182,0.16)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${salvo ? 'rgba(46,196,182,0.5)' : 'var(--line)'}`,
            color: salvo ? 'var(--sea)' : 'var(--text)',
          }}
        >{salvo ? 'Salvo' : 'Salvar'}</button>
      </div>

      {c.experienciaId && reservando && (
        <ReservaExperienciaSheet experienciaId={c.experienciaId} onClose={() => setReservando(false)} />
      )}
    </div>
  )
}

export default function Feed() {
  const navigate = useNavigate()
  const { usuario } = useAuth()

  // O Feed é só descoberta (ver Bolhas.jsx): bolha que a pessoa já
  // faz parte não deve reaparecer aqui como sugestão — essa já mora
  // em "Minhas bolhas".
  const nomesDasMinhasBolhas = new Set(myBolhas.map(b => b.name))

  // Quantos gostos essa pessoa do card tem em comum com quem tá
  // olhando — só usado pra ordenar (src/data/gostos.js), não pra
  // excluir ninguém como a regra de objetivos faz.
  function pontosDeGostoEmComum(c) {
    if (c.kind !== 'Pessoa' || !c.gostos || !usuario?.gostos) return 0
    return c.gostos.filter(g => usuario.gostos.includes(g)).length
  }

  const paraDescobrir = cards
    .filter(c => c.kind !== 'Bolha' || !nomesDasMinhasBolhas.has(c.title))
    // Regra de compatibilidade (src/utils/compatibilidade.js): quem
    // busca relacionamento só aparece pra quem também busca, mesmo que
    // as duas pessoas coincidam em outros objetivos.
    .filter(c => c.kind !== 'Pessoa' || saoCompativeis(usuario?.objetivos, c.objetivos))
    .map((c, i) => ({ c, i, pontos: pontosDeGostoEmComum(c) }))
    .sort((a, b) => b.pontos - a.pontos || a.i - b.i)
    .map(({ c }) => c)

  // "Estourar a bolha" não filtra mais o Feed no lugar — leva pra
  // uma tela própria, com um algoritmo oposto ao de sempre.
  function estourarABolha() {
    tocarPloc()
    navigate('/estourar-bolha')
  }

  return (
    <div style={{ padding: '4px 18px 24px' }}>
      <button
        onClick={estourarABolha}
        style={{
          display: 'flex', alignItems: 'center', gap: 7, padding: '9px 14px',
          borderRadius: 999, border: '1px solid rgba(46,196,182,0.55)', cursor: 'pointer',
          fontWeight: 600, fontSize: 12, marginBottom: 16,
          background: 'rgba(10,23,48,0.82)', color: 'var(--sea)',
        }}
      >
        <EstourarIcon size={16} /> Estourar a bolha
      </button>
      {paraDescobrir.map((c, i) => <Card key={i} c={c} />)}
    </div>
  )
}
