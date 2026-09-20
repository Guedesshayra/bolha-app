import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { conversations } from '../data/conversas'
import { postsDaBolha, adicionarPost, adicionarComentario } from '../data/mural'

/* ============================================================
   Uma conversa 1 pra 1 é só chat. Uma bolha (grupo) é chat + Mural —
   o mural é a parte "comunidade": os participantes postam fotos,
   avisos e comentários sobre aquela bolha (tipo uma comunidade de
   Orkut), separado da conversa corrida do chat. Por isso a bolha
   abre direto no Mural: é a parte nova que esse tipo de conversa tem
   e a 1 pra 1 não tem.
   ============================================================ */
export default function ConversaThread() {
  const { id } = useParams()
  const navigate = useNavigate()
  const conv = conversations[id]
  const ehBolha = conv?.type === 'bolha'
  const [aba, setAba] = useState(ehBolha ? 'mural' : 'conversa')

  useEffect(() => {
    if (conv) conv.unread = false
  }, [conv])

  if (!conv) return <div style={{ padding: 20 }}>Conversa não encontrada.</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 18px 14px', borderBottom: ehBolha ? 'none' : '1px solid var(--line)', flexShrink: 0 }}>
        <button onClick={() => navigate('/conversas')} style={{
          width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
          border: '1px solid var(--line)', cursor: 'pointer', color: 'var(--text)', fontSize: 16,
        }}>‹</button>
        <div style={{
          width: 38, height: 38, borderRadius: '50%', background: conv.color, color: '#0a1730',
          fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
        }}>{conv.icon}</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>{conv.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{conv.sub}</div>
        </div>
      </div>

      {ehBolha && (
        <div style={{ display: 'flex', gap: 8, padding: '0 18px 12px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
          <AbaBtn ativo={aba === 'mural'} onClick={() => setAba('mural')}>Mural</AbaBtn>
          <AbaBtn ativo={aba === 'conversa'} onClick={() => setAba('conversa')}>Conversa</AbaBtn>
        </div>
      )}

      {ehBolha && aba === 'mural' ? (
        <Mural bolhaId={id} />
      ) : (
        <Chat conv={conv} />
      )}
    </div>
  )
}

function AbaBtn({ ativo, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 4px', border: 'none', background: 'none', cursor: 'pointer',
      fontSize: 13, fontWeight: 600, color: ativo ? 'var(--sea)' : 'var(--text-muted)',
      borderBottom: `2px solid ${ativo ? 'var(--sea)' : 'transparent'}`,
    }}>
      {children}
    </button>
  )
}

function Chat({ conv }) {
  const [messages, setMessages] = useState(conv.messages)
  const [text, setText] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  function send() {
    const t = text.trim()
    if (!t) return
    conv.messages.push({ from: 'me', text: t })
    setMessages([...conv.messages])
    setText('')
    // resposta automática só pra sentir a experiência de troca de mensagem
    setTimeout(() => {
      conv.messages.push({ from: 'them', text: 'Combinado! 🙌' })
      setMessages([...conv.messages])
    }, 900)
  }

  return (
    <>
      <div ref={scrollRef} className="rolagem-invisivel" style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            maxWidth: '76%', padding: '10px 13px', borderRadius: 16, fontSize: 13.5, lineHeight: 1.4,
            alignSelf: m.from === 'me' ? 'flex-end' : 'flex-start',
            background: m.from === 'me' ? 'linear-gradient(120deg, var(--sea), #0f6f66)' : 'rgba(255,255,255,0.07)',
            color: m.from === 'me' ? '#052e2a' : 'var(--text)',
            border: m.from === 'me' ? 'none' : '1px solid var(--line)',
            borderBottomRightRadius: m.from === 'me' ? 5 : 16,
            borderBottomLeftRadius: m.from === 'me' ? 16 : 5,
            fontWeight: m.from === 'me' ? 500 : 400,
          }}>{m.text}</div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 9, padding: '12px 14px calc(14px + env(safe-area-inset-bottom))', borderTop: '1px solid var(--line)', flexShrink: 0 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Escreva uma mensagem…"
          style={{ flex: 1, padding: '11px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)', color: 'var(--text)', fontSize: 13.5 }}
        />
        <button onClick={send} style={{
          width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--sea), #0f6f66)',
          border: 'none', cursor: 'pointer', color: '#052e2a', fontWeight: 700, flexShrink: 0,
        }}>➤</button>
      </div>
    </>
  )
}

function Mural({ bolhaId }) {
  const [posts, setPosts] = useState(() => postsDaBolha(bolhaId))
  const [texto, setTexto] = useState('')
  const [imagemDataUrl, setImagemDataUrl] = useState(null)
  const fileRef = useRef(null)

  function aoEscolherImagem(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const leitor = new FileReader()
    leitor.onload = () => setImagemDataUrl(leitor.result)
    leitor.readAsDataURL(file)
  }

  function publicar() {
    if (!texto.trim() && !imagemDataUrl) return
    adicionarPost(bolhaId, {
      id: 'p' + Date.now(), autor: 'Você', avatar: 'V', quando: 'agora',
      texto: texto.trim(), imagemDataUrl, comentarios: [],
    })
    setPosts(postsDaBolha(bolhaId))
    setTexto('')
    setImagemDataUrl(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function comentar(postId, textoComentario) {
    adicionarComentario(bolhaId, postId, { autor: 'Você', texto: textoComentario })
    setPosts(postsDaBolha(bolhaId))
  }

  return (
    <div className="rolagem-invisivel" style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
      <div style={{ marginBottom: 16, padding: 14, borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--line)' }}>
        <textarea
          value={texto}
          onChange={e => setTexto(e.target.value)}
          rows={2}
          placeholder="Compartilhe algo com a bolha…"
          style={{
            width: '100%', padding: '9px 4px', border: 'none', background: 'transparent', color: 'var(--text)',
            fontSize: 13.5, fontFamily: 'inherit', resize: 'vertical', outline: 'none',
          }}
        />
        {imagemDataUrl && (
          <img src={imagemDataUrl} alt="" style={{ width: '100%', borderRadius: 12, marginTop: 6, marginBottom: 2 }} />
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <button onClick={() => fileRef.current?.click()} style={ghostBtn}>📷 Foto</button>
          <input ref={fileRef} type="file" accept="image/*" onChange={aoEscolherImagem} style={{ display: 'none' }} />
          <button onClick={publicar} style={publicarBtn}>Publicar</button>
        </div>
      </div>

      {posts.length === 0 && (
        <p style={{ fontSize: 12.5, color: 'var(--text-muted)', textAlign: 'center', marginTop: 20 }}>
          Ainda ninguém postou nada por aqui.
        </p>
      )}

      {posts.map(post => <PostCard key={post.id} post={post} onComentar={(t) => comentar(post.id, t)} />)}
    </div>
  )
}

function PostCard({ post, onComentar }) {
  const [comentario, setComentario] = useState('')

  function enviarComentario() {
    const t = comentario.trim()
    if (!t) return
    onComentar(t)
    setComentario('')
  }

  return (
    <div style={{ marginBottom: 14, padding: 14, borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <span style={{
          width: 32, height: 32, borderRadius: '50%', background: 'var(--sea)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#052e2a',
        }}>{post.avatar}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{post.autor}</div>
          <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{post.quando}</div>
        </div>
      </div>

      {post.texto && <p style={{ fontSize: 13.5, lineHeight: 1.5, marginBottom: post.imagemDataUrl ? 10 : 8 }}>{post.texto}</p>}
      {post.imagemDataUrl && <img src={post.imagemDataUrl} alt="" style={{ width: '100%', borderRadius: 12, marginBottom: 10 }} />}

      {post.comentarios.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
          {post.comentarios.map((c, i) => (
            <div key={i} style={{ fontSize: 12.5, lineHeight: 1.4 }}>
              <strong>{c.autor}:</strong> {c.texto}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && enviarComentario()}
          placeholder="Comentar…"
          style={{ flex: 1, padding: '8px 12px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)', color: 'var(--text)', fontSize: 12.5 }}
        />
      </div>
    </div>
  )
}

const ghostBtn = {
  padding: '7px 12px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600,
  background: 'rgba(255,255,255,0.06)', border: '1px solid var(--line)', color: 'var(--text-muted)',
}

const publicarBtn = {
  padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
  background: 'linear-gradient(90deg, var(--sea), #0f6f66)', border: 'none', color: '#052e2a',
}
