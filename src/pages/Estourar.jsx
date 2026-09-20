import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bolhasDeFora } from '../data/exploracao'
import { EstourarIcon } from '../icons/NavIcons'

const coresDoTunel = ['var(--sea)', 'var(--teal)', 'var(--lavender)', 'var(--pink)', 'var(--mist)']

// Os anéis que dão a sensação de atravessar um túnel até o fim,
// na cor do app, terminando num flash — o instante do "ploc" (o som
// sai do Feed, no clique; aqui é só a parte visual).
function TunelTransicao() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {coresDoTunel.map((cor, i) => (
        <span key={i} style={{
          position: 'absolute', width: 40, height: 40, borderRadius: '50%',
          border: `2px solid ${cor}`, opacity: 0,
          animation: 'bolha-tunel .9s cubic-bezier(.2,.7,.3,1) forwards',
          animationDelay: `${i * 0.08}s`,
        }} />
      ))}
      <span style={{
        position: 'absolute', width: 26, height: 26, borderRadius: '50%',
        background: 'var(--sea)', filter: 'blur(1px)',
        animation: 'bolha-flash .9s ease-out forwards',
      }} />
    </div>
  )
}

function BolhaFlutuante({ b, onClick }) {
  const mostrarNome = b.diam >= 68

  return (
    <button
      onClick={onClick}
      aria-label={b.name}
      style={{
        position: 'absolute', top: `${b.top}%`, left: `${b.left}%`,
        width: b.diam, height: b.diam, borderRadius: '50%', border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 2, padding: 6, textAlign: 'center',
        background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55), ${b.color} 72%)`,
        boxShadow: '0 10px 26px -10px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.35)',
        color: '#0a1730',
        animation: `bolha-boiar ${4 + (b.diam % 5) * 0.3}s ease-in-out infinite`,
        animationDelay: `${-(b.diam % 7) * 0.5}s`,
      }}
    >
      <span style={{ fontSize: Math.max(16, b.diam * 0.28) }}>{b.icon}</span>
      {mostrarNome && (
        <span style={{ fontSize: Math.min(12, b.diam * 0.1), fontWeight: 700, lineHeight: 1.1 }}>{b.name}</span>
      )}
    </button>
  )
}

function FichaDaBolha({ b, status, onSolicitar, onFechar }) {
  const enviado = status === 'enviado'

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onFechar()}
      style={{ position: 'absolute', inset: 0, background: 'rgba(4,9,20,0.62)', zIndex: 80, display: 'flex', alignItems: 'flex-end' }}
    >
      <div style={{
        width: '100%', maxWidth: 468, margin: '0 auto', background: 'var(--panel)', borderRadius: '22px 22px 0 0',
        padding: '22px 20px calc(24px + env(safe-area-inset-bottom))', border: '1px solid var(--line)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <span style={{
            width: 52, height: 52, borderRadius: '50%', flexShrink: 0, fontSize: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55), ${b.color} 72%)`,
          }}>{b.icon}</span>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 600 }}>{b.name}</h3>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{b.members} pessoas · fora da sua bolha</div>
          </div>
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 18 }}>{b.bio}</p>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onFechar} style={{
            flex: 1, border: '1px solid var(--line)', borderRadius: 14, padding: '13px 18px',
            fontWeight: 600, fontSize: 14.5, cursor: 'pointer',
            background: 'rgba(255,255,255,0.07)', color: 'var(--text)',
          }}>Voltar</button>
          <button
            onClick={onSolicitar}
            disabled={enviado}
            style={{
              flex: 1, border: 'none', borderRadius: 14, padding: '13px 18px',
              fontWeight: 600, fontSize: 14.5, cursor: enviado ? 'default' : 'pointer',
              background: enviado ? 'rgba(95,179,173,0.18)' : 'linear-gradient(90deg, var(--sea), #0f6f66)',
              color: enviado ? 'var(--teal)' : '#052e2a',
            }}
          >{enviado ? 'Pedido enviado ✓' : 'Pedir pra entrar'}</button>
        </div>

        {enviado && (
          // Ainda não existe backend (ver Não esquecer.md) — isso é só
          // o estado local simulando o pedido. Quando existir admin de
          // verdade, é aqui que entra a chamada pra API.
          <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.4 }}>
            O pedido foi pro admin dessa bolha aprovar. Você recebe um aviso quando ela responder.
          </p>
        )}
      </div>
    </div>
  )
}

export default function Estourar() {
  const navigate = useNavigate()
  const [fase, setFase] = useState('tunel')
  const [selecionada, setSelecionada] = useState(null)
  const [pedidos, setPedidos] = useState({})

  useEffect(() => {
    const t = setTimeout(() => setFase('nuvem'), 950)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      // `absolute` (não `fixed`) de propósito: a moldura do app
      // (Moldura.jsx) é quem tem o tamanho de celular, e é ela quem
      // vira o "ponto de referência" pra esse `inset:0`. Com `fixed`
      // essa tela cobria a janela inteira do navegador — ficava com
      // cara de página web, não de tela de celular.
      position: 'absolute', inset: 0, zIndex: 60, overflow: 'hidden',
      background: 'radial-gradient(circle at 50% 30%, #142248, var(--deep) 70%)',
    }}>
      {fase === 'tunel' ? (
        <TunelTransicao />
      ) : (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'bolha-entra .5s ease both' }}>
          <div style={{ padding: '20px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/')} aria-label="Voltar pro feed" style={{
              width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--line)', cursor: 'pointer', color: 'var(--text)', fontSize: 16, flexShrink: 0,
            }}>‹</button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--sea)', fontSize: 12, fontWeight: 600 }}>
                <EstourarIcon size={15} /> Fora da sua bolha
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Um mundo que você nunca viu</h1>
            </div>
          </div>
          <p style={{ padding: '0 20px', fontSize: 12.5, color: 'var(--text-muted)', maxWidth: '40ch', lineHeight: 1.4 }}>
            Nada aqui tem a ver com o que você curte hoje. Toca numa bolha pra conhecer.
          </p>

          <div style={{ position: 'relative', flex: 1, margin: '4px 4px 0' }}>
            {bolhasDeFora.map(b => (
              <BolhaFlutuante key={b.id} b={b} onClick={() => setSelecionada(b)} />
            ))}
          </div>
        </div>
      )}

      {selecionada && (
        <FichaDaBolha
          b={selecionada}
          status={pedidos[selecionada.id]}
          onSolicitar={() => setPedidos(p => ({ ...p, [selecionada.id]: 'enviado' }))}
          onFechar={() => setSelecionada(null)}
        />
      )}
    </div>
  )
}
