import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { objetivos as opcoesDeObjetivo } from '../data/objetivos'
import BubbleLogo from '../components/BubbleLogo'
import Moldura from '../components/Moldura'

/* ============================================================
   O que a pessoa busca no Bolha.

   Essa pergunta é o que diferencia o Bolha de um app de
   relacionamento comum: quem não marca "relacionamento" nunca pode
   ser cruzado com quem marcou, mesmo que as duas pessoas tenham
   outros objetivos em comum (ver src/utils/compatibilidade.js). Por
   isso ela é obrigatória logo depois da entrada — sem essa resposta
   não dá pra montar o filtro. `modo="editar"` reaproveita a mesma
   tela dentro do Perfil, pra trocar a resposta depois.
   ============================================================ */
export default function Objetivo({ modo = 'onboarding' }) {
  const { usuario, definirObjetivos } = useAuth()
  const navigate = useNavigate()
  const [selecionados, setSelecionados] = useState(usuario?.objetivos || [])

  function alternar(id) {
    setSelecionados(sel => (sel.includes(id) ? sel.filter(s => s !== id) : [...sel, id]))
  }

  function salvar() {
    definirObjetivos(selecionados)
    if (modo === 'editar') navigate('/perfil')
  }

  const miolo = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {modo === 'editar' ? (
        <button onClick={() => navigate('/perfil')} style={backBtn}>‹</button>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
          <BubbleLogo height={40} />
        </div>
      )}

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 23, lineHeight: 1.25, marginBottom: 8 }}>
        O que você busca no Bolha?
      </h1>
      <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-muted)', marginBottom: 20 }}>
        Pode marcar mais de uma opção. É essa resposta que decide quem o algoritmo pode ou não te
        sugerir — quem busca relacionamento só cruza com quem também busca.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {opcoesDeObjetivo.map(o => {
          const marcado = selecionados.includes(o.id)
          return (
            <button
              key={o.id}
              onClick={() => alternar(o.id)}
              aria-pressed={marcado}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                background: marcado ? 'rgba(46,196,182,0.14)' : 'rgba(255,255,255,0.035)',
                border: `1px solid ${marcado ? 'rgba(46,196,182,0.55)' : 'var(--line)'}`,
              }}
            >
              <span style={{ fontSize: 20 }}>{o.icon}</span>
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500 }}>{o.label}</span>
              <span style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                border: `1.5px solid ${marcado ? 'var(--sea)' : 'var(--line)'}`,
                background: marcado ? 'var(--sea)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: '#052e2a',
              }}>{marcado ? '✓' : ''}</span>
            </button>
          )
        })}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 10 }}>
        <button
          onClick={salvar}
          disabled={selecionados.length === 0}
          style={{
            width: '100%', border: 'none', borderRadius: 14, padding: '14px 18px',
            fontWeight: 600, fontSize: 14.5, cursor: selecionados.length ? 'pointer' : 'default',
            background: selecionados.length ? 'linear-gradient(90deg, var(--sea), #0f6f66)' : 'rgba(255,255,255,0.06)',
            color: selecionados.length ? '#052e2a' : 'var(--text-muted)',
          }}
        >{modo === 'editar' ? 'Salvar' : 'Continuar'}</button>
      </div>
    </div>
  )

  if (modo === 'editar') {
    return <div style={{ padding: '4px 18px 24px' }}>{miolo}</div>
  }

  return (
    <Moldura>
      <div className="rolagem-invisivel" style={{ flex: 1, overflowY: 'auto', padding: '30px 22px 28px', display: 'flex', flexDirection: 'column' }}>
        {miolo}
      </div>
    </Moldura>
  )
}

const backBtn = {
  width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
  border: '1px solid var(--line)', cursor: 'pointer', color: 'var(--text)', fontSize: 16, marginBottom: 16,
}
