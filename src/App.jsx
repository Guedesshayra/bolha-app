import { useState } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Moldura from './components/Moldura'
import TopBar from './components/TopBar'
import BottomNav from './components/BottomNav'
import Splash from './pages/Splash'
import Entrar from './pages/Entrar'
import Objetivo from './pages/Objetivo'
import Gostos from './pages/Gostos'
import Feed from './pages/Feed'
import Estourar from './pages/Estourar'
import Agenda from './pages/Agenda'
import Conversas from './pages/Conversas'
import ConversaThread from './pages/ConversaThread'
import Perfil from './pages/Perfil'
import Parceiro from './pages/Parceiro'

function Shell() {
  const { pathname } = useLocation()
  // Na conversa individual e na tela de "Estourar a bolha", escondemos
  // a barra de baixo e o topo — no "Estourar" é pra dar a sensação de
  // ter saído do app normal por um instante. `/parceiro` não entra
  // mais aqui: virou rota de nível raiz (ver App), porque agora
  // precisa ser acessível antes de logar como pessoa.
  const isFocused = /^\/conversas\/.+/.test(pathname) || pathname === '/estourar-bolha'

  return (
    <Moldura>
      {!isFocused && <TopBar />}
      <div className="rolagem-invisivel" style={{ flex: 1, overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/estourar-bolha" element={<Estourar />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/conversas" element={<Conversas />} />
          <Route path="/conversas/:id" element={<ConversaThread />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/perfil/objetivos" element={<Objetivo modo="editar" />} />
          <Route path="/perfil/gostos" element={<Gostos modo="editar" />} />
        </Routes>
      </div>
      {!isFocused && <BottomNav />}
    </Moldura>
  )
}

// Enquanto ninguém entrou, a primeira coisa que aparece é o Splash
// (logo andando pela tela + botões). "Cadastre-se" e "Login" trocam
// pra Entrar.jsx aqui mesmo, sem navegação de rota de verdade — a
// tela é a mesma nos dois casos (o app não distingue conta nova de
// conta existente, é tudo Google/e-mail), só muda o texto conforme o
// modo, pra parecer familiar (quem já tem conta não precisa ler o
// discurso de boas-vindas de novo).
function EntradaNaoLogada() {
  const [tela, setTela] = useState('splash')
  return tela === 'splash'
    ? <Splash onCadastro={() => setTela('cadastro')} onLogin={() => setTela('login')} />
    : <Entrar modo={tela} onVoltar={() => setTela('splash')} />
}

// Depois de entrar, falta responder "o que você busca no Bolha" e "do
// que você gosta" antes de liberar o resto do app — sem a primeira o
// filtro de compatibilidade (src/utils/compatibilidade.js) não tem o
// que comparar, e sem a segunda o Feed não tem como ranquear por
// gosto em comum.
function Portao() {
  const { usuario } = useAuth()
  if (!usuario) return <EntradaNaoLogada />
  if (!usuario.objetivos?.length) return <Objetivo />
  if (!usuario.gostos?.length) return <Gostos />
  return <Shell />
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        {/* `/parceiro` (Bolha Experiência) fica fora do portão de login
            de pessoa física de propósito — no Splash (Página Inicial),
            "Cadastre-se" e "Seja parceiro" já são dois caminhos
            separados desde a primeira tela, então uma empresa não
            precisa logar como pessoa física pra se cadastrar. */}
        <Routes>
          <Route path="/parceiro" element={<Parceiro />} />
          <Route path="/*" element={<Portao />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
