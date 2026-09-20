import { useEffect, useRef, useState } from 'react'
import { GOOGLE_CLIENT_ID, carregarGoogle, googleConfigurado } from '../auth/googleClient'

/* ============================================================
   O botão oficial "Entrar com o Google".

   A gente não desenha esse botão à mão de propósito: o Google exige
   que ele use o visual oficial deles, e a própria biblioteca renderiza
   o botão certo dentro de uma <div> que a gente entrega.
   ============================================================ */

export default function GoogleSignInButton({ onCredencial, onErro, largura = 300 }) {
  const caixaRef = useRef(null)
  const [estado, setEstado] = useState(googleConfigurado ? 'carregando' : 'sem-config')

  // Guardamos os callbacks numa ref pra que o efeito rode uma única
  // vez, mesmo que a tela de cima re-renderize e passe funções novas.
  const callbacks = useRef({ onCredencial, onErro })
  callbacks.current = { onCredencial, onErro }

  useEffect(() => {
    if (!googleConfigurado) return

    let vivo = true

    carregarGoogle()
      .then((google) => {
        if (!vivo || !caixaRef.current) return

        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (resposta) => callbacks.current.onCredencial?.(resposta.credential),
          auto_select: false,
          cancel_on_tap_outside: true,
        })

        google.accounts.id.renderButton(caixaRef.current, {
          type: 'standard',
          theme: 'filled_blue',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          logo_alignment: 'left',
          locale: 'pt-BR',
          width: largura,
        })

        setEstado('pronto')
      })
      .catch((erro) => {
        if (!vivo) return
        setEstado('erro')
        callbacks.current.onErro?.(erro.message)
      })

    return () => { vivo = false }
  }, [largura])

  if (estado === 'sem-config') {
    return (
      <div style={avisoStyle}>
        <strong style={{ display: 'block', marginBottom: 4, color: 'var(--sea)' }}>
          Login do Google ainda não configurado
        </strong>
        Crie um Client ID no Google Cloud e coloque em <code style={codeStyle}>Aplicativo/.env</code>.
        O passo a passo está no arquivo <code style={codeStyle}>GOOGLE-SETUP.md</code>.
      </div>
    )
  }

  if (estado === 'erro') {
    return <div style={avisoStyle}>Não deu pra carregar o botão do Google. Verifique sua conexão e recarregue a página.</div>
  }

  return (
    <div style={{ minHeight: 44, display: 'flex', justifyContent: 'center' }}>
      <div ref={caixaRef} />
      {estado === 'carregando' && (
        <span style={{ fontSize: 12.5, color: 'var(--text-muted)', alignSelf: 'center' }}>
          Carregando o Google…
        </span>
      )}
    </div>
  )
}

const avisoStyle = {
  fontSize: 12, lineHeight: 1.5, color: 'var(--text-muted)', textAlign: 'left',
  padding: '12px 14px', borderRadius: 14,
  background: 'rgba(46,196,182,0.08)', border: '1px dashed rgba(46,196,182,0.4)',
}

const codeStyle = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: 11.5, color: 'var(--text)',
  background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: 5,
}
