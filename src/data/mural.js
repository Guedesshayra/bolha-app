// O mural de cada bolha — posts, fotos e comentários dos
// participantes, tipo uma comunidade de Orkut. Vive dentro de
// Conversas (ver ConversaThread.jsx): não existe mais uma página
// "Bolhas" separada, abrir uma bolha na lista de Conversas já leva
// pro Mural dela.
//
// Sem backend ainda (ver Não esquecer.md), então tudo mora no
// localStorage. Os posts de exemplo abaixo são só a primeira leitura:
// no primeiro acesso de cada bolha, eles são copiados pro
// localStorage, e dali em diante essa cópia é que vale — inclusive
// pra poder comentar num post de exemplo.
const CHAVE = 'bolha.muralPosts'

const postsDeExemplo = {
  b1: [
    {
      id: 'seed-b1-1', autor: 'Marina', avatar: 'M', quando: 'ontem',
      texto: 'Foto de ontem na roda de conversa — que noite boa! 🫂', imagemDataUrl: null,
      comentarios: [{ autor: 'Thiago', texto: 'Que pena que não consegui ir, mês que vem eu tô lá!' }],
    },
    {
      id: 'seed-b1-2', autor: 'Você', avatar: 'V', quando: '3d',
      texto: 'Próximo encontro: sexta às 19h, mesmo lugar de sempre. Bora?', imagemDataUrl: null,
      comentarios: [],
    },
  ],
  b2: [
    {
      id: 'seed-b2-1', autor: 'Rafa', avatar: 'R', quando: '2h',
      texto: 'Aula de domingo confirmada, 8h no Ibirapuera. Quem não tiver tapete, a bolha empresta!', imagemDataUrl: null,
      comentarios: [],
    },
  ],
  b5: [
    {
      id: 'seed-b5-1', autor: 'Gabriel', avatar: 'G', quando: '1d',
      texto: 'Aula experimental de sexta confirmada — quem topa?', imagemDataUrl: null,
      comentarios: [{ autor: 'Você', texto: 'Eu topo!' }],
    },
  ],
}

function lerTudo() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) || '{}')
  } catch {
    return {}
  }
}

function salvarTudo(tudo) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(tudo))
  } catch {
    // Navegador anônimo, armazenamento bloqueado ou imagem grande
    // demais pro localStorage: o post desta sessão ainda aparece na
    // tela, só não sobrevive a um recarregamento.
  }
}

// Lê os posts de uma bolha, migrando o exemplo pro localStorage no
// primeiro acesso — depois disso, o localStorage é a única fonte.
export function postsDaBolha(bolhaId) {
  const tudo = lerTudo()
  if (!tudo[bolhaId]) {
    tudo[bolhaId] = (postsDeExemplo[bolhaId] || []).map(p => ({ ...p, comentarios: [...p.comentarios] }))
    salvarTudo(tudo)
  }
  return tudo[bolhaId]
}

export function adicionarPost(bolhaId, post) {
  const tudo = lerTudo()
  const atuais = tudo[bolhaId] || postsDaBolha(bolhaId)
  tudo[bolhaId] = [post, ...atuais]
  salvarTudo(tudo)
}

export function adicionarComentario(bolhaId, postId, comentario) {
  const tudo = lerTudo()
  const atuais = tudo[bolhaId] || postsDaBolha(bolhaId)
  tudo[bolhaId] = atuais.map(p => (p.id === postId ? { ...p, comentarios: [...p.comentarios, comentario] } : p))
  salvarTudo(tudo)
}
