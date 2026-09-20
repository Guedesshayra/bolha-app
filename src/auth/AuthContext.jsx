import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { lerIdToken } from './googleClient'
import { esquecerAcessoAgenda } from '../services/googleCalendar'

/* ============================================================
   Quem está usando o app agora.

   Por enquanto a "conta" mora só no navegador (localStorage). Quando
   entrar um backend, esse arquivo é o único lugar que muda: o resto do
   app só conhece `useAuth()`.
   ============================================================ */

const CHAVE = 'bolha.usuario'
const AuthContext = createContext(null)

function lerGuardado() {
  try {
    const bruto = localStorage.getItem(CHAVE)
    return bruto ? JSON.parse(bruto) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(lerGuardado)
  const [erro, setErro] = useState('')

  useEffect(() => {
    try {
      if (usuario) localStorage.setItem(CHAVE, JSON.stringify(usuario))
      else localStorage.removeItem(CHAVE)
    } catch {
      // Navegador anônimo ou armazenamento bloqueado: o app funciona
      // igual, só não lembra do login na próxima visita.
    }
  }, [usuario])

  const entrarComGoogle = useCallback((credential) => {
    const dados = lerIdToken(credential)

    if (!dados?.email) {
      setErro('O Google respondeu, mas sem e-mail. Tente de novo.')
      return
    }
    if (dados.email_verified === false) {
      setErro('Esse e-mail do Google ainda não foi verificado. Confirme o e-mail na sua conta Google e tente de novo.')
      return
    }

    setErro('')
    setUsuario({
      provedor: 'google',
      email: dados.email,
      nome: dados.given_name || dados.name || dados.email.split('@')[0],
      nomeCompleto: dados.name || '',
      foto: dados.picture || '',
      entrouEm: new Date().toISOString(),
    })
  }, [])

  // Cadastro sem Google, só com e-mail — sem verificação nenhuma por
  // enquanto (ninguém confere se a pessoa é dona desse e-mail). Serve
  // pra navegar o app; virar login de verdade depende de existir
  // backend (ver Não esquecer.md).
  const entrarComEmail = useCallback((email) => {
    setErro('')
    setUsuario({
      provedor: 'email',
      email,
      nome: email.split('@')[0],
      nomeCompleto: '',
      foto: '',
      entrouEm: new Date().toISOString(),
    })
  }, [])

  const entrarEmModoDemo = useCallback(() => {
    setErro('')
    setUsuario({
      provedor: 'demo',
      email: 'marina@exemplo.com',
      nome: 'Marina',
      nomeCompleto: 'Marina (conta de demonstração)',
      foto: '',
      entrouEm: new Date().toISOString(),
    })
  }, [])

  const definirObjetivos = useCallback((objetivos) => {
    setUsuario(u => (u ? { ...u, objetivos } : u))
  }, [])

  const definirGostos = useCallback((gostos) => {
    setUsuario(u => (u ? { ...u, gostos } : u))
  }, [])

  const sair = useCallback(() => {
    // Sem isso o Google faz login automático na próxima visita e
    // parece que o "Sair" não funcionou.
    try {
      window.google?.accounts?.id?.disableAutoSelect?.()
    } catch {
      // Se o script do Google nem carregou, não há o que desligar.
    }
    esquecerAcessoAgenda()
    setUsuario(null)
    setErro('')
  }, [])

  const valor = useMemo(
    () => ({ usuario, erro, setErro, entrarComGoogle, entrarComEmail, entrarEmModoDemo, definirObjetivos, definirGostos, sair }),
    [usuario, erro, entrarComGoogle, entrarComEmail, entrarEmModoDemo, definirObjetivos, definirGostos, sair]
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>.')
  return ctx
}
