import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatarCNPJ, cnpjEhValido } from '../utils/cnpj'
import { lerIdToken } from '../auth/googleClient'
import BubbleLogo from '../components/BubbleLogo'
import GoogleSignInButton from '../components/GoogleSignInButton'
import Moldura from '../components/Moldura'

const CHAVE = 'bolha.cadastrosEmpresa'

// Ainda não existe backend nem conta de empresa de verdade (ver Não
// esquecer.md) — o cadastro fica guardado só neste navegador por
// enquanto. Quando existir uma API de verdade, essa função é o único
// lugar que muda.
function salvarCadastro(cadastro) {
  try {
    const atuais = JSON.parse(localStorage.getItem(CHAVE) || '[]')
    localStorage.setItem(CHAVE, JSON.stringify([...atuais, cadastro]))
  } catch {
    // Navegador anônimo ou armazenamento bloqueado: o cadastro desta
    // sessão ainda funciona, só não sobrevive a um recarregamento.
  }
}

function emailValido(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

const formVazio = { nome: '', cnpj: '', cidade: '', descricao: '' }

/* ============================================================
   Bolha Experiência — cadastro de parceiro, no molde "Airbnb pra
   experiências": primeiro a empresa se identifica (Google ou e-mail,
   igual ao cadastro de pessoa em Entrar.jsx — não existe conta de
   empresa separada ainda, isso é só quem está preenchendo), depois
   vem o formulário curto (nome, CNPJ/MEI, cidade, descrição). Rota de
   nível raiz (ver App.jsx e Splash.jsx): não exige login de pessoa
   física.

   De propósito SEM catálogo/pacotes de preço aqui dentro — isso é
   coisa de um painel de parceiro de verdade, que ainda não existe
   (ver Não esquecer.md, item 6). Esse formulário é só a inscrição;
   montar o catálogo é uma etapa separada, depois que o cadastro for
   aprovado.
   ============================================================ */
export default function Parceiro() {
  const navigate = useNavigate()
  const [conta, setConta] = useState(null)
  const [erroLogin, setErroLogin] = useState('')
  const [email, setEmail] = useState('')

  const [form, setForm] = useState(formVazio)
  const [erro, setErro] = useState('')
  const [enviado, setEnviado] = useState(false)

  function aoReceberCredencialGoogle(credential) {
    const dados = lerIdToken(credential)
    if (!dados?.email) { setErroLogin('O Google respondeu, mas sem e-mail. Tente de novo.'); return }
    setErroLogin('')
    setConta({ provedor: 'google', email: dados.email, nome: dados.name || dados.email, foto: dados.picture || '' })
  }

  function aoContinuarComEmail() {
    const v = email.trim()
    if (!emailValido(v)) { setErroLogin('Isso não parece um e-mail válido.'); return }
    setErroLogin('')
    setConta({ provedor: 'email', email: v, nome: v.split('@')[0], foto: '' })
  }

  function enviar() {
    if (!form.nome.trim() || !cnpjEhValido(form.cnpj) || !form.cidade.trim() || !form.descricao.trim()) {
      setErro('Preenche o nome do negócio, um CNPJ/MEI completo, a cidade e a descrição da experiência.')
      return
    }
    setErro('')
    salvarCadastro({ ...form, contaEmail: conta.email, contaProvedor: conta.provedor, enviadoEm: new Date().toISOString() })
    setEnviado(true)
  }

  function recomecar() {
    setForm(formVazio)
    setEnviado(false)
  }

  return (
    <Moldura>
      <div className="rolagem-invisivel" style={{ flex: 1, overflowY: 'auto', padding: '30px 22px 28px' }}>
        <button onClick={() => navigate('/')} style={backBtn}>‹</button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
          <BubbleLogo height={36} />
        </div>

        {!conta ? (
          <>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>Seja parceiro Bolha</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 22 }}>
              Primeiro identifica sua empresa com Google ou e-mail — é só pra saber quem está
              cadastrando, ainda não existe um painel de parceiro de verdade pra voltar depois
              (ver Não esquecer.md).
            </p>

            <div style={{ padding: 18, borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--line)' }}>
              <GoogleSignInButton onCredencial={aoReceberCredencialGoogle} onErro={setErroLogin} />

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
                  placeholder="email@suaempresa.com"
                  type="email"
                  style={inputStyle}
                />
                <button onClick={aoContinuarComEmail} style={emailBtn}>Continuar</button>
              </div>

              {erroLogin && (
                <div style={{
                  marginTop: 14, fontSize: 12.5, lineHeight: 1.45, color: 'var(--pink)',
                  padding: '10px 12px', borderRadius: 12,
                  background: 'rgba(201,142,166,0.12)', border: '1px solid rgba(201,142,166,0.4)',
                }}>
                  {erroLogin}
                </div>
              )}
            </div>
          </>
        ) : enviado ? (
          <>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>Cadastro enviado ✓</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 20 }}>
              {form.nome} vai passar pela revisão do time do Bolha. Depois disso vem a próxima
              etapa: montar o catálogo de experiências com pacotes de preço (tipo o exemplo do
              Paintball) e divulgar promoções — isso ainda está por vir. Por enquanto o cadastro
              fica guardado só neste navegador.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={recomecar} style={secondaryBtn}>Cadastrar outro negócio</button>
              <button onClick={() => navigate('/')} style={{ ...primaryBtn, flex: 1 }}>Voltar ao início</button>
            </div>
          </>
        ) : (
          <>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>Bolha Experiência</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 22 }}>
              Cadastrando como <strong style={{ color: 'var(--text)' }}>{conta.email}</strong>. Agora conta o negócio
              e o que ele oferece — bolhas de pessoas com esse interesse em comum vão poder
              descobrir e reservar direto por aqui, tipo um Airbnb de experiências.
            </p>

            <Campo label="Nome do negócio">
              <input
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                placeholder="Ex: Estúdio Barro & Fogo"
                style={inputStyle}
              />
            </Campo>

            <Campo label="CNPJ ou MEI">
              <input
                value={form.cnpj}
                onChange={e => setForm(f => ({ ...f, cnpj: formatarCNPJ(e.target.value) }))}
                placeholder="00.000.000/0000-00"
                inputMode="numeric"
                style={inputStyle}
              />
            </Campo>

            <Campo label="Cidade">
              <input
                value={form.cidade}
                onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))}
                placeholder="Ex: São Paulo, SP"
                style={inputStyle}
              />
            </Campo>

            <Campo label="Descreva a experiência que você oferece">
              <textarea
                value={form.descricao}
                onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                rows={4}
                placeholder="Ex: aula de cerâmica de 2h pra grupos de até 8 pessoas, material incluso."
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />
            </Campo>

            {erro && (
              <div style={{
                fontSize: 12.5, color: 'var(--pink)', padding: '10px 12px', borderRadius: 12,
                background: 'rgba(201,142,166,0.12)', border: '1px solid rgba(201,142,166,0.4)', marginBottom: 16,
              }}>
                {erro}
              </div>
            )}

            <button onClick={enviar} style={primaryBtn}>Enviar cadastro</button>
          </>
        )}
      </div>
    </Moldura>
  )
}

function Campo({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  )
}

const inputStyle = {
  flex: 1, width: '100%', padding: '12px 14px', borderRadius: 13, fontSize: 13.5,
  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', outline: 'none', color: 'var(--text)',
}

const backBtn = {
  width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
  border: '1px solid var(--line)', cursor: 'pointer', color: 'var(--text)', fontSize: 16, marginBottom: 16,
}

const primaryBtn = {
  width: '100%', border: 'none', borderRadius: 14, padding: '14px 18px',
  fontWeight: 600, fontSize: 14.5, cursor: 'pointer',
  background: 'linear-gradient(90deg, var(--sea), #0f6f66)', color: '#052e2a',
}

const secondaryBtn = {
  padding: '12px 18px', borderRadius: 14, cursor: 'pointer', fontWeight: 600, fontSize: 13.5,
  background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)', color: 'var(--text)', flexShrink: 0,
}

const emailBtn = {
  padding: '0 16px', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 13, flexShrink: 0,
  background: 'rgba(255,255,255,0.08)', border: '1px solid var(--line)', color: 'var(--text)',
}
