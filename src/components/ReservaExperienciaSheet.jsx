import { useState } from 'react'
import { experienciasParceiro } from '../data/experienciasParceiro'
import { salvarReserva } from '../data/reservas'
import { fmt } from '../utils/date'

/* ============================================================
   O motor de reserva descrito pro Paintball: a pessoa escolhe um
   produto (cenário/local) e um pacote — o pacote vale pra bolha
   inteira, não por pessoa avulsa, então todo mundo que for leva o
   mesmo combo. O total sai de `precoPorPessoa * quantidade`. Ao
   confirmar, a reserva é salva (src/data/reservas.js) e aparece na
   Agenda na próxima vez que ela for aberta (ela lê as reservas ao
   montar, igual já faz com o Google Agenda).
   ============================================================ */
export default function ReservaExperienciaSheet({ experienciaId, onClose }) {
  const experiencia = experienciasParceiro.find(e => e.id === experienciaId)
  const [produtoId, setProdutoId] = useState(experiencia?.produtos[0]?.id)
  const produto = experiencia?.produtos.find(p => p.id === produtoId)
  const [pacoteId, setPacoteId] = useState(produto?.pacotes[0]?.id)
  const [quantidade, setQuantidade] = useState(10)
  const [data, setData] = useState(fmt(new Date()))
  const [hora, setHora] = useState('15:00')
  const [confirmada, setConfirmada] = useState(false)

  if (!experiencia) return null

  const pacote = produto?.pacotes.find(p => p.id === pacoteId) || produto?.pacotes[0]
  const total = pacote ? pacote.precoPorPessoa * quantidade : 0

  function escolherProduto(id) {
    setProdutoId(id)
    setPacoteId(experiencia.produtos.find(p => p.id === id)?.pacotes[0]?.id)
  }

  function confirmar() {
    salvarReserva({
      experienciaId: experiencia.id,
      empresa: experiencia.empresa,
      experienciaTitulo: experiencia.titulo,
      produtoNome: produto.nome,
      pacoteLabel: `${pacote.bolinhas} bolinhas`,
      quantidadePessoas: quantidade,
      valorTotal: total,
      data, hora,
      criadaEm: new Date().toISOString(),
    })
    setConfirmada(true)
  }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(4,9,20,0.62)', zIndex: 90, display: 'flex', alignItems: 'flex-end' }}
    >
      <div className="rolagem-invisivel" style={{
        width: '100%', maxWidth: 468, margin: '0 auto', background: 'var(--panel)', borderRadius: '22px 22px 0 0',
        padding: '22px 20px calc(24px + env(safe-area-inset-bottom))', border: '1px solid var(--line)',
        maxHeight: '86vh', overflowY: 'auto',
      }}>
        {confirmada ? (
          <>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, marginBottom: 10 }}>Reserva confirmada ✓</h3>
            <p style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--text-muted)', marginBottom: 18 }}>
              {quantidade} pessoas · {produto.nome} · pacote {pacote.bolinhas} bolinhas · total R$ {total.toLocaleString('pt-BR')}.
              Vai aparecer na sua Agenda no dia {data.split('-').reverse().join('/')} às {hora}.
            </p>
            <button onClick={onClose} style={primaryBtn}>Fechar</button>
          </>
        ) : (
          <>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, marginBottom: 4 }}>{experiencia.titulo}</h3>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>{experiencia.empresa}</div>

            <Campo label="Cenário">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {experiencia.produtos.map(p => (
                  <Chip key={p.id} ativo={p.id === produtoId} onClick={() => escolherProduto(p.id)}>{p.nome}</Chip>
                ))}
              </div>
            </Campo>

            <Campo label="Pacote (preço por pessoa)">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {produto.pacotes.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPacoteId(p.id)}
                    aria-pressed={p.id === pacoteId}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px',
                      borderRadius: 13, cursor: 'pointer', textAlign: 'left',
                      background: p.id === pacoteId ? 'rgba(46,196,182,0.14)' : 'rgba(255,255,255,0.035)',
                      border: `1px solid ${p.id === pacoteId ? 'rgba(46,196,182,0.55)' : 'var(--line)'}`,
                    }}
                  >
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{p.bolinhas} bolinhas</span>
                    <span style={{ fontSize: 13, color: 'var(--sea)', fontWeight: 700 }}>R$ {p.precoPorPessoa}/pessoa</span>
                  </button>
                ))}
              </div>
            </Campo>

            <Campo label="Quantas pessoas vão">
              <input
                type="number" min={1} value={quantidade}
                onChange={e => setQuantidade(Math.max(1, Number(e.target.value) || 1))}
                style={inputStyle}
              />
            </Campo>

            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <Campo label="Data">
                  <input type="date" value={data} onChange={e => setData(e.target.value)} style={inputStyle} />
                </Campo>
              </div>
              <div style={{ flex: 1 }}>
                <Campo label="Horário">
                  <input type="time" value={hora} onChange={e => setHora(e.target.value)} style={inputStyle} />
                </Campo>
              </div>
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px',
              borderRadius: 14, background: 'rgba(46,196,182,0.08)', border: '1px solid rgba(46,196,182,0.35)', marginBottom: 18,
            }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Total pra {quantidade} pessoas</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--sea)' }}>R$ {total.toLocaleString('pt-BR')}</span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose} style={secondaryBtn}>Cancelar</button>
              <button onClick={confirmar} style={{ ...primaryBtn, flex: 1 }}>Confirmar reserva</button>
            </div>
          </>
        )}
      </div>
    </div>
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

function Chip({ ativo, onClick, children }) {
  return (
    <button onClick={onClick} aria-pressed={ativo} style={{
      padding: '9px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
      background: ativo ? 'rgba(46,196,182,0.16)' : 'rgba(255,255,255,0.06)',
      border: `1px solid ${ativo ? 'rgba(46,196,182,0.5)' : 'var(--line)'}`,
      color: ativo ? 'var(--sea)' : 'var(--text)',
    }}>{children}</button>
  )
}

const inputStyle = {
  width: '100%', padding: '11px 12px', borderRadius: 12, fontSize: 13.5,
  background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)', color: 'var(--text)', outline: 'none',
}

const primaryBtn = {
  border: 'none', borderRadius: 14, padding: '13px 18px', fontWeight: 600, fontSize: 14.5, cursor: 'pointer',
  background: 'linear-gradient(90deg, var(--sea), #0f6f66)', color: '#052e2a', width: '100%',
}

const secondaryBtn = {
  border: '1px solid var(--line)', borderRadius: 14, padding: '13px 18px', fontWeight: 600, fontSize: 14.5,
  cursor: 'pointer', background: 'rgba(255,255,255,0.07)', color: 'var(--text)', flexShrink: 0, minWidth: 110,
}
