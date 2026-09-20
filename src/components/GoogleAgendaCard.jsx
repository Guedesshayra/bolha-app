import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { googleConfigurado } from '../auth/googleClient'
import {
  buscarEventos,
  contarEventos,
  esquecerAcessoAgenda,
  paraEventosDoBolha,
  pedirAcessoAgenda,
  tokenDaAgenda,
} from '../services/googleCalendar'
import { addDays } from '../utils/date'
import { AgendaIcon } from '../icons/NavIcons'

/* ============================================================
   O ícone "traga sua agenda do Google" que aparece na Agenda.

   Antes era um cartão grande explicando tudo em texto; agora é só o
   ícone — clicar nele já abre o login do Google. O estado (conectado,
   carregando, com erro) aparece na cor do ícone e no `title` (dica ao
   passar o mouse / leitor de tela), não em texto solto na tela.

   Puxa uma janela larga de datas de uma vez (um mês pra trás, seis
   meses pra frente) em vez de buscar mês a mês: é uma chamada só, e a
   pessoa pode navegar o calendário inteiro sem esperar carregamento.
   ============================================================ */

const DIAS_PARA_TRAS = 30
const DIAS_PARA_FRENTE = 180

export default function GoogleAgendaCard({ onEventos }) {
  const { usuario } = useAuth()
  const contaDemo = usuario?.provedor !== 'google'

  const [estado, setEstado] = useState('desconectado') // desconectado | carregando | conectado | erro
  const [mensagem, setMensagem] = useState('')
  const [quantos, setQuantos] = useState(0)

  // `vivo` evita atualizar o estado de um cartão que já saiu da tela.
  // Ele é religado a cada montagem porque, em desenvolvimento, o React
  // monta -> desmonta -> monta de novo pra detectar erros.
  const vivo = useRef(true)
  useEffect(() => {
    vivo.current = true
    return () => { vivo.current = false }
  }, [])

  const sincronizar = useCallback(async () => {
    setEstado('carregando')
    setMensagem('')

    try {
      const token = await pedirAcessoAgenda()
      const hoje = new Date()
      const itens = await buscarEventos(token, {
        de: addDays(hoje, -DIAS_PARA_TRAS),
        ate: addDays(hoje, DIAS_PARA_FRENTE),
      })

      const porDia = paraEventosDoBolha(itens)
      if (!vivo.current) return

      onEventos(porDia)
      setQuantos(contarEventos(porDia))
      setEstado('conectado')
    } catch (erro) {
      if (!vivo.current) return
      setMensagem(erro.message)
      setEstado('erro')
      alert(erro.message)
    }
  }, [onEventos])

  // Se a pessoa já autorizou nessa sessão, sincroniza sozinho ao abrir
  // a Agenda — sem abrir janela nenhuma do Google. O `jaTentou` segura
  // a montagem dupla do modo de desenvolvimento.
  const jaTentou = useRef(false)
  useEffect(() => {
    if (jaTentou.current || !googleConfigurado || contaDemo) return
    if (!tokenDaAgenda()) return
    jaTentou.current = true
    sincronizar()
  }, [contaDemo, sincronizar])

  function desconectar() {
    esquecerAcessoAgenda()
    onEventos({})
    setQuantos(0)
    setMensagem('')
    setEstado('desconectado')
  }

  const conectado = estado === 'conectado'
  const desabilitado = !googleConfigurado || contaDemo || estado === 'carregando'

  function aoClicar() {
    if (desabilitado) return
    if (conectado) desconectar()
    else sincronizar()
  }

  let titulo = 'Conectar Google Agenda'
  if (!googleConfigurado) titulo = 'Login do Google ainda não configurado neste computador'
  else if (contaDemo) titulo = 'Disponível só pra quem entrou com a conta do Google'
  else if (estado === 'carregando') titulo = 'Conversando com o Google…'
  else if (estado === 'erro') titulo = (mensagem || 'Não deu pra conectar') + ' — toca pra tentar de novo'
  else if (conectado) titulo = `Google Agenda conectado — ${quantos} ${quantos === 1 ? 'compromisso importado' : 'compromissos importados'}. Toca pra desconectar.`

  return (
    <button
      onClick={aoClicar}
      disabled={desabilitado}
      title={titulo}
      aria-label={titulo}
      style={{
        position: 'relative', width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: desabilitado ? 'default' : 'pointer', opacity: desabilitado ? 0.45 : 1,
        background: conectado ? 'rgba(95,179,173,0.14)' : estado === 'erro' ? 'rgba(201,142,166,0.14)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${conectado ? 'rgba(95,179,173,0.45)' : estado === 'erro' ? 'rgba(201,142,166,0.45)' : 'var(--line)'}`,
        color: conectado ? 'var(--teal)' : estado === 'erro' ? 'var(--pink)' : 'var(--text-muted)',
      }}
    >
      <AgendaIcon size={18} />
      {conectado && quantos > 0 && (
        <span style={{
          position: 'absolute', top: -3, right: -3, minWidth: 15, height: 15, padding: '0 3px', borderRadius: 999,
          background: 'var(--teal)', color: '#0a1730', fontSize: 9, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--deep)',
        }}>{quantos > 99 ? '99+' : quantos}</span>
      )}
    </button>
  )
}
