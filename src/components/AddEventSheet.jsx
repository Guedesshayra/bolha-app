import { useState } from 'react'

const sourceMap = { pessoal: 'compromisso pessoal', bolha: 'evento de uma bolha', date: 'date 1 pra 1', perto: 'sugestão perto de você' }

function emailValido(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

const vazio = {
  tipoItem: 'evento', title: '', hh: '18:00', categoria: 'pessoal', privacy: 'privado',
  modoLocal: 'presencial', local: '', emailAtual: '', convidados: [],
}

// Estrutura inspirada no "Criar evento" da Agenda do Google: título em
// destaque, tipo (evento ou só um lembrete), horário, local
// (presencial ou online) e convidados por e-mail — pra quem usa o
// Bolha como agenda de compromissos de verdade, não só como feed.
export default function AddEventSheet({ open, onClose, onSave }) {
  const [campo, setCampo] = useState(vazio)
  const set = (chave) => (valor) => setCampo(c => ({ ...c, [chave]: valor }))

  if (!open) return null

  const { tipoItem, title, hh, categoria, privacy, modoLocal, local, emailAtual, convidados } = campo

  function adicionarConvidado() {
    const v = emailAtual.trim()
    if (!v) return
    if (!emailValido(v)) { alert('Isso não parece um e-mail válido.'); return }
    setCampo(c => ({
      ...c,
      emailAtual: '',
      convidados: c.convidados.includes(v) ? c.convidados : [...c.convidados, v],
    }))
  }

  function removerConvidado(email) {
    setCampo(c => ({ ...c, convidados: c.convidados.filter(x => x !== email) }))
  }

  function handleSave() {
    if (!title.trim()) { alert('Dá um título pro evento primeiro'); return }

    if (tipoItem === 'lembrete') {
      onSave({ hh, title, source: 'lembrete pessoal', zone: 'pessoal', sponsor: false, privacy: 'privado', status: 'confirmado', lembrete: true })
    } else {
      onSave({
        hh, title, source: sourceMap[categoria], zone: categoria, sponsor: false, privacy,
        status: categoria === 'perto' ? 'sugestao' : 'confirmado',
        local: local.trim() ? { modo: modoLocal, valor: local.trim() } : null,
        convidados,
      })
    }
    setCampo(vazio)
  }

  function fechar() {
    setCampo(vazio)
    onClose()
  }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && fechar()}
      style={{ position: 'absolute', inset: 0, background: 'rgba(4,9,20,0.62)', zIndex: 70, display: 'flex', alignItems: 'flex-end' }}
    >
      <div className="rolagem-invisivel" style={{
        width: '100%', background: 'var(--panel)', borderRadius: '22px 22px 0 0',
        padding: '20px 20px calc(24px + env(safe-area-inset-bottom))', border: '1px solid var(--line)',
        maxHeight: '86vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {[['evento', 'Evento'], ['lembrete', 'Lembrete']].map(([val, label]) => (
            <button key={val} onClick={() => set('tipoItem')(val)} style={{
              flex: 1, padding: '9px 6px', borderRadius: 12, border: '1px solid var(--line)', cursor: 'pointer',
              background: tipoItem === val ? 'var(--sea)' : 'rgba(255,255,255,0.04)',
              color: tipoItem === val ? '#052e2a' : 'var(--text-muted)', fontSize: 12.5, fontWeight: 600,
            }}>{label}</button>
          ))}
        </div>

        <input
          value={title} onChange={e => set('title')(e.target.value)}
          placeholder={tipoItem === 'lembrete' ? 'Ex.: Ligar pro dentista' : 'Ex.: Café com o Bruno'}
          style={{
            ...inputStyle, fontSize: 17, fontWeight: 600, padding: '10px 4px 12px', border: 'none',
            borderBottom: '1px solid var(--line)', borderRadius: 0, marginBottom: 18, background: 'transparent',
          }}
        />

        <Row icon="🕐">
          <input type="time" value={hh} onChange={e => set('hh')(e.target.value)} style={inputStyle} />
        </Row>

        {tipoItem === 'evento' && (
          <>
            <Row icon="📍">
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                {[['presencial', 'Presencial'], ['online', 'Online']].map(([val, label]) => (
                  <button key={val} onClick={() => set('modoLocal')(val)} style={{
                    flex: 1, padding: '9px 6px', borderRadius: 10, border: '1px solid var(--line)', cursor: 'pointer',
                    background: modoLocal === val ? 'rgba(46,196,182,0.16)' : 'rgba(255,255,255,0.04)',
                    color: modoLocal === val ? 'var(--sea)' : 'var(--text-muted)', fontSize: 12, fontWeight: 600,
                  }}>{label}</button>
                ))}
              </div>
              <input
                value={local} onChange={e => set('local')(e.target.value)}
                placeholder={modoLocal === 'online' ? 'Link da chamada (Meet, Zoom...)' : 'Endereço ou nome do lugar'}
                style={inputStyle}
              />
            </Row>

            <Row icon="👥">
              <div style={{ display: 'flex', gap: 8, marginBottom: convidados.length ? 8 : 0 }}>
                <input
                  value={emailAtual} onChange={e => set('emailAtual')(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); adicionarConvidado() } }}
                  placeholder="E-mail de quem você quer chamar"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button onClick={adicionarConvidado} style={botaoFantasmaPequeno}>Adicionar</button>
              </div>
              {convidados.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {convidados.map(email => (
                    <span key={email} className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      {email}
                      <button
                        onClick={() => removerConvidado(email)} aria-label={`Remover ${email}`}
                        style={{ border: 'none', background: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 14, lineHeight: 1 }}
                      >×</button>
                    </span>
                  ))}
                </div>
              )}
            </Row>

            <Field label="Tipo">
              <select value={categoria} onChange={e => set('categoria')(e.target.value)} style={inputStyle}>
                <option value="pessoal">Pessoal (só seu)</option>
                <option value="bolha">Compromisso de uma bolha</option>
                <option value="date">Date 1 pra 1</option>
                <option value="perto">Perto de você (sugestão)</option>
              </select>
            </Field>

            <Field label="Quem pode ver esse evento na sua agenda?">
              <div style={{ display: 'flex', gap: 8 }}>
                {[['privado', '🔒 Só você vê'], ['publico', '🌍 Visível pra quem quer te conhecer']].map(([val, label]) => (
                  <button key={val} onClick={() => set('privacy')(val)} style={{
                    flex: 1, padding: '11px 6px', borderRadius: 12, border: '1px solid var(--line)',
                    background: privacy === val ? 'var(--sea)' : 'rgba(255,255,255,0.04)',
                    color: privacy === val ? '#052e2a' : 'var(--text-muted)',
                    fontSize: 11.5, fontWeight: 600, cursor: 'pointer', lineHeight: 1.3,
                  }}>{label}</button>
                ))}
              </div>
            </Field>
          </>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button onClick={fechar} style={{ flex: 1, border: '1px solid var(--line)', borderRadius: 14, padding: '13px 18px', fontWeight: 600, fontSize: 14.5, cursor: 'pointer', background: 'rgba(255,255,255,0.07)', color: 'var(--text)' }}>Cancelar</button>
          <button onClick={handleSave} style={{ flex: 1, border: 'none', borderRadius: 14, padding: '13px 18px', fontWeight: 600, fontSize: 14.5, cursor: 'pointer', background: 'linear-gradient(90deg, var(--sea), #0f6f66)', color: '#052e2a' }}>
            {tipoItem === 'lembrete' ? 'Salvar lembrete' : 'Salvar evento'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ icon, children }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
      <div style={{ width: 20, flexShrink: 0, textAlign: 'center', fontSize: 15, color: 'var(--text-muted)', marginTop: 9 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'block', fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '11px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)',
  border: '1px solid var(--line)', color: 'var(--text)', fontSize: 14,
}

const botaoFantasmaPequeno = {
  padding: '0 14px', borderRadius: 12, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
  background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)', color: 'var(--text)', flexShrink: 0,
}
