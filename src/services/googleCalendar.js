import { GOOGLE_CLIENT_ID, carregarGoogle, googleConfigurado } from '../auth/googleClient'
import { fmt } from '../utils/date'

/* ============================================================
   Agenda do Google dentro do Bolha.

   A API do Google Calendar é gratuita (cota de uso generosa, sem
   cartão de crédito). O caminho é:

     1. pedir autorização -> o Google devolve um access token
     2. chamar a API REST com esse token -> devolve os eventos
     3. traduzir os eventos pro formato do Bolha

   Pedimos só o escopo `calendar.readonly`: o Bolha LÊ a agenda, nunca
   escreve nem apaga nada. É o menor acesso que resolve, e o usuário vê
   isso escrito na tela de autorização do Google.
   ============================================================ */

export const ESCOPO_AGENDA = 'https://www.googleapis.com/auth/calendar.readonly'

const CHAVE_TOKEN = 'bolha.tokenAgendaGoogle'
const API = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'

// O token fica em sessionStorage (morre ao fechar a aba), não em
// localStorage: é uma chave de acesso, não uma preferência.
function guardarToken(accessToken, duracaoEmSegundos) {
  try {
    sessionStorage.setItem(
      CHAVE_TOKEN,
      JSON.stringify({ accessToken, expiraEm: Date.now() + duracaoEmSegundos * 1000 })
    )
  } catch {
    // Sem armazenamento o app só vai pedir autorização de novo depois.
  }
}

/** Token ainda válido, ou null. Deixa 1 minuto de folga antes de expirar. */
export function tokenDaAgenda() {
  try {
    const bruto = sessionStorage.getItem(CHAVE_TOKEN)
    if (!bruto) return null
    const { accessToken, expiraEm } = JSON.parse(bruto)
    if (!accessToken || expiraEm < Date.now() + 60_000) return null
    return accessToken
  } catch {
    return null
  }
}

export function esquecerAcessoAgenda() {
  try {
    sessionStorage.removeItem(CHAVE_TOKEN)
  } catch {
    // Nada a limpar.
  }
}

/**
 * Abre a janelinha do Google pedindo permissão de leitura da agenda.
 * Se a pessoa já autorizou nessa sessão, resolve na hora.
 */
export async function pedirAcessoAgenda() {
  if (!googleConfigurado) {
    throw new Error('Falta configurar o VITE_GOOGLE_CLIENT_ID. Veja o GOOGLE-SETUP.md.')
  }

  const jaTem = tokenDaAgenda()
  if (jaTem) return jaTem

  const google = await carregarGoogle()

  return new Promise((resolve, reject) => {
    const cliente = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: ESCOPO_AGENDA,
      callback: (resposta) => {
        if (resposta.error || !resposta.access_token) {
          reject(new Error('O Google não liberou o acesso à agenda.'))
          return
        }
        guardarToken(resposta.access_token, Number(resposta.expires_in) || 3600)
        resolve(resposta.access_token)
      },
      error_callback: (erro) => {
        const fechou = erro?.type === 'popup_closed'
        reject(new Error(fechou
          ? 'A janela do Google foi fechada antes de autorizar.'
          : 'Não deu pra autorizar o acesso à agenda.'))
      },
    })

    cliente.requestAccessToken()
  })
}

/**
 * Busca os eventos do calendário principal num intervalo de datas.
 * `singleEvents` faz o Google já expandir eventos que se repetem
 * (toda terça, todo mês...) em ocorrências soltas — bem mais simples
 * do que a gente calcular a repetição na mão.
 */
export async function buscarEventos(accessToken, { de, ate }) {
  const url = new URL(API)
  url.searchParams.set('timeMin', de.toISOString())
  url.searchParams.set('timeMax', ate.toISOString())
  url.searchParams.set('singleEvents', 'true')
  url.searchParams.set('orderBy', 'startTime')
  url.searchParams.set('maxResults', '250')

  const resposta = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })

  if (resposta.status === 401 || resposta.status === 403) {
    esquecerAcessoAgenda()
    throw new Error('A autorização do Google expirou. Conecte a agenda de novo.')
  }
  if (!resposta.ok) {
    throw new Error('O Google não respondeu como esperado (erro ' + resposta.status + ').')
  }

  const dados = await resposta.json()
  return dados.items || []
}

// '2026-09-18' vira 18/09/2026 no fuso local. Usar `new Date(texto)`
// direto interpreta como UTC e joga o evento pro dia anterior no Brasil.
function dataDoDiaTodo(texto) {
  const [a, m, d] = texto.split('-').map(Number)
  return new Date(a, m - 1, d)
}

/**
 * Traduz o formato do Google pro formato que a Agenda do Bolha usa,
 * já agrupado por dia (as chaves são 'AAAA-MM-DD').
 *
 * Todo evento importado entra como "pessoal" e "privado": veio da
 * agenda particular da pessoa, então ninguém mais no Bolha vê.
 */
export function paraEventosDoBolha(itens) {
  const porDia = {}

  for (const item of itens) {
    if (item.status === 'cancelled') continue

    const inicio = item.start || {}
    const diaTodo = Boolean(inicio.date)
    const quando = diaTodo ? dataDoDiaTodo(inicio.date) : new Date(inicio.dateTime)
    if (Number.isNaN(quando.getTime())) continue

    const chave = fmt(quando)
    const hh = diaTodo
      ? 'dia'
      : `${String(quando.getHours()).padStart(2, '0')}:${String(quando.getMinutes()).padStart(2, '0')}`

    porDia[chave] = porDia[chave] || []
    porDia[chave].push({
      hh,
      title: item.summary || '(sem título)',
      source: item.location ? `Google Agenda · ${item.location}` : 'Google Agenda',
      zone: 'pessoal',
      sponsor: false,
      privacy: 'privado',
      status: 'confirmado',
      origem: 'google',
      idGoogle: item.id,
      link: item.htmlLink || '',
      diaTodo,
    })
  }

  for (const chave of Object.keys(porDia)) {
    porDia[chave].sort(porHorario)
  }

  return porDia
}

// Evento de dia inteiro não tem hora, então vai pro topo do dia;
// o resto segue a ordem do relógio.
function porHorario(a, b) {
  if (a.diaTodo && !b.diaTodo) return -1
  if (!a.diaTodo && b.diaTodo) return 1
  return a.hh.localeCompare(b.hh)
}

/** Junta os eventos do Bolha com os importados, sem perder nenhum lado. */
export function juntarEventos(doBolha, doGoogle) {
  const todos = { ...doBolha }

  for (const [chave, lista] of Object.entries(doGoogle)) {
    todos[chave] = [...(todos[chave] || []), ...lista].sort(porHorario)
  }

  return todos
}

export function contarEventos(porDia) {
  return Object.values(porDia).reduce((total, lista) => total + lista.length, 0)
}
