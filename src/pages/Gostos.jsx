import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { gostos as opcoesDeGosto } from '../data/gostos'
import Moldura from '../components/Moldura'

/* ============================================================
   Do que a pessoa gosta — dança, jogos, música... Diferente de
   Objetivo.jsx (que é um portão obrigatório de compatibilidade),
   isso aqui é só sinal de ranqueamento: quem tem mais gosto em comum
   aparece primeiro no Feed (ver a pontuação em src/pages/Feed.jsx).
   `modo="editar"` reaproveita a mesma tela dentro do Perfil.
   ============================================================ */
export default function Gostos({ modo = 'onboarding' }) {
  const { usuario, definirGostos } = useAuth()
  const navigate = useNavigate()
  const [selecionados, setSelecionados] = useState(usuario?.gostos || [])

  function alternar(id) {
    setSelecionados(sel => (sel.includes(id) ? sel.filter(s => s !== id) : [...sel, id]))
  }

  function salvar() {
    definirGostos(selecionados)
    if (modo === 'editar') navigate('/perfil')
  }

  const miolo = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {modo === 'editar' && (
        <button onClick={() => navigate('/perfil')} style={backBtn}>‹</button>
      )}

      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 23, lineHeight: 1.25, marginBottom: 8 }}>
        Do que você gosta?
      </h1>
      <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-muted)', marginBottom: 20 }}>
        Pode marcar mais de um. É isso que ajuda o Feed a colocar primeiro quem tem mais a ver
        com você.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        {opcoesDeGosto.map(g => {
          const marcado = selecionados.includes(g.id)
          return (
            <button
              key={g.id}
              onClick={() => alternar(g.id)}
              aria-pressed={marcado}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '11px 16px',
                borderRadius: 999, cursor: 'pointer',
                background: marcado ? 'rgba(46,196,182,0.16)' : 'rgba(255,255,255,0.035)',
                border: `1px solid ${marcado ? 'rgba(46,196,182,0.55)' : 'var(--line)'}`,
                color: marcado ? 'var(--sea)' : 'var(--text)',
              }}
            >
              <span style={{ fontSize: 16 }}>{g.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{g.label}</span>
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
