import { useCallback, useState } from 'react'
import BubbleLogo from '../components/BubbleLogo'
import GoogleSignInButton from '../components/GoogleSignInButton'
import Moldura from '../components/Moldura'
import { useAuth } from '../auth/AuthContext'
import { googleConfigurado } from '../auth/googleClient'
import { BolhasIcon, AgendaIcon, PerfilIcon } from '../icons/NavIcons'

/* ============================================================
   Tela de entrada / inscrição de pessoa (o caminho "Cadastre-se" da
   Página Inicial — ver Splash.jsx). Google continua sendo o jeito
   principal: o e-mail já chega verificado, ninguém precisa inventar
   senha, e é a mesma conta que autoriza a agenda depois. E-mail
   avulso é o caminho alternativo pra quem não quer usar o Google —
   sem verificação nenhuma por enquanto, então só serve pra navegar o
   app (ver Não esquecer.md, item de segurança).
   ============================================================ */

const beneficios = [
  { Icon: PerfilIcon, texto: 'Seu e-mail chega verificado pelo Google — menos perfil falso na sua bolha.' },
  { Icon: AgendaIcon, texto: 'Dá pra trazer sua agenda do Google depois, sem cadastrar nada de novo.' },
  { Icon: BolhasIcon, texto: 'A gente nunca posta nada no seu nome. Só lemos nome, e-mail e foto.' },
]

function emailValido(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export default function Entrar({ modo = 'cadastro', onVoltar }) {
  const ehLogin = modo === 'login'
  const { entrarComGoogle, entrarComEmail, entrarEmModoDemo, erro, setErro } = useAuth()
  const [email, setEmail] = useState('')

  const aoReceberCredencial = useCallback((credential) => entrarComGoogle(credential), [entrarComGoogle])
  const aoFalhar = useCallback((mensagem) => setErro(mensagem), [setErro])

  function aoContinuarComEmail() {
    const v = email.trim()
    if (!emailValido(v)) { setErro('Isso não parece um e-mail válido.'); return }
    setErro('')
    entrarComEmail(v)
  }

  return (
    <Moldura>
      <div className="rolagem-invisivel" style={{ flex: 1, overflowY: 'auto', padding: '30px 22px 28px', display: 'flex', flexDirection: 'column' }}>
        {onVoltar && <button onClick={onVoltar} style={backBtn}>‹</button>}

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 26 }}>
          <BubbleLogo height={46} />
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 25, lineHeight: 1.2, marginBottom: 8 }}>
          {ehLogin ? 'Que bom te ver de novo' : 'Entre na sua bolha'}
        </h1>
        <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-muted)', marginBottom: 22 }}>
          {ehLogin
            ? 'Entre com a mesma conta Google ou e-mail que você já usa no Bolha.'
            : 'Cadastre-se com sua conta do Google ou só com seu e-mail. Sem senha nova pra inventar.'}
        </p>

        <div style={{
          padding: 18, borderRadius: 20,
          background: 'var(--surface)', border: '1px solid var(--line)', marginBottom: 18,
        }}>
          <GoogleSignInButton onCredencial={aoReceberCredencial} onErro={aoFalhar} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
            <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>ou</span>
            <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') aoContinuarComEmail() }}
              placeholder="seu@email.com"
              type="email"
              style={inputStyle}
            />
            <button onClick={aoContinuarComEmail} style={emailBtn}>Continuar</button>
          </div>

          {erro && (
            <div style={{
              marginTop: 14, fontSize: 12.5, lineHeight: 1.45, color: 'var(--pink)',
              padding: '10px 12px', borderRadius: 12,
              background: 'rgba(201,142,166,0.12)', border: '1px solid rgba(201,142,166,0.4)',
            }}>
              {erro}
            </div>
          )}

          <p style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--text-muted)', marginTop: 14, textAlign: 'center' }}>
            Ao entrar você concorda com os termos de uso e a política de
            privacidade do Bolha.
          </p>
        </div>

        {!ehLogin && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginBottom: 22 }}>
            {beneficios.map(({ Icon, texto }) => (
              <div key={texto} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--sea)', flexShrink: 0, marginTop: 1 }}>
                  <Icon size={18} />
                </span>
                <span style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--text-muted)' }}>{texto}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 10 }}>
          <button onClick={entrarEmModoDemo} style={{
            width: '100%', padding: 12, borderRadius: 13, cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', border: '1px dashed var(--line)',
            color: 'var(--text-muted)', fontSize: 12.5, fontWeight: 600,
          }}>
            Só quero dar uma olhada (modo demonstração)
          </button>
          <p style={{ fontSize: 10.5, lineHeight: 1.5, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
            {googleConfigurado
              ? 'No modo demonstração nada é salvo e a agenda do Google fica desligada.'
              : 'O login do Google ainda não foi configurado neste computador — por enquanto, use a demonstração.'}
          </p>
        </div>
      </div>
    </Moldura>
  )
}

const backBtn = {
  width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
  border: '1px solid var(--line)', cursor: 'pointer', color: 'var(--text)', fontSize: 16, marginBottom: 16, flexShrink: 0,
}

const inputStyle = {
  flex: 1, padding: '11px 12px', borderRadius: 12, fontSize: 13.5,
  background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)', color: 'var(--text)', outline: 'none',
}

const emailBtn = {
  padding: '0 16px', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 13, flexShrink: 0,
  background: 'rgba(255,255,255,0.08)', border: '1px solid var(--line)', color: 'var(--text)',
}
