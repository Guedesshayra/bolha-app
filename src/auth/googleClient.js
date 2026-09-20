/* ============================================================
   Conversa com o Google — a parte "encanamento".

   O Bolha usa o Google Identity Services (GIS), que é a biblioteca
   oficial e gratuita do Google pra login no navegador. Ela faz duas
   coisas diferentes, e é importante não confundir:

   1. LOGIN (quem é você): devolve um "ID token", um crachá assinado
      pelo Google com seu e-mail, nome e foto. É o que a inscrição usa.
   2. AUTORIZAÇÃO (o que você me deixa ler): devolve um "access token",
      uma chave temporária pra ler sua agenda. É o que a Agenda usa.

   As duas precisam do mesmo Client ID, criado no Google Cloud Console.
   O passo a passo está em GOOGLE-SETUP.md, na raiz do app.
   ============================================================ */

export const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim()

// Sem Client ID configurado o app ainda roda — só que em modo
// demonstração, sem login de verdade e sem agenda do Google.
export const googleConfigurado = GOOGLE_CLIENT_ID.length > 0

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

let carregando = null

/**
 * Carrega o script do Google uma única vez, mesmo que várias telas
 * peçam ao mesmo tempo. Devolve o objeto `window.google`.
 */
export function carregarGoogle() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Sem navegador.'))
  if (window.google?.accounts) return Promise.resolve(window.google)
  if (carregando) return carregando

  carregando = new Promise((resolve, reject) => {
    const existente = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
    const script = existente || document.createElement('script')

    script.onload = () => {
      if (window.google?.accounts) resolve(window.google)
      else reject(new Error('O Google carregou, mas de um jeito que o app não reconhece.'))
    }
    script.onerror = () => {
      carregando = null
      reject(new Error('Não deu pra carregar o login do Google. Verifique sua conexão.'))
    }

    if (!existente) {
      script.src = SCRIPT_SRC
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  }).catch((erro) => {
    carregando = null
    throw erro
  })

  return carregando
}

/**
 * Abre o "crachá" que o Google devolve no login.
 *
 * Atenção pro futuro: aqui a gente só LÊ o token, não confere a
 * assinatura. Isso basta enquanto o app é só front-end. No dia em que
 * existir um servidor (Supabase, por exemplo), é ELE quem precisa
 * validar esse token antes de criar a conta de verdade — senão dá pra
 * forjar um login no navegador.
 */
export function lerIdToken(credential) {
  if (typeof credential !== 'string') return null
  const partes = credential.split('.')
  if (partes.length !== 3) return null

  try {
    const base64 = partes[1].replace(/-/g, '+').replace(/_/g, '/')
    const completo = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    const texto = decodeURIComponent(
      atob(completo)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    )
    return JSON.parse(texto)
  } catch {
    return null
  }
}
