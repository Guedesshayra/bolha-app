// Conversas guardadas num objeto simples por enquanto. Isso é só
// pra prototipagem — quando o chat virar de verdade, isso some e
// vira mensagens vindas de um servidor em tempo real (ex.: Supabase
// Realtime), e as telas praticamente não mudam.
export const conversations = {
  p1: { type: 'pessoa', name: 'Marina', sub: 'Fé sem Fronteiras', icon: 'M', color: 'var(--sea)', time: '5min', unread: true,
    messages: [
      { from: 'them', text: 'Oi! Vi que você também tá na Fé sem Fronteiras' },
      { from: 'me', text: 'Oi Marina! To sim, curtindo bastante' },
    ] },
  b1: { type: 'bolha', name: 'Fé sem Fronteiras', sub: '34 pessoas', icon: '🫂', color: 'var(--lavender)', time: 'agora', unread: true,
    messages: [
      { from: 'them', text: 'Marina: alguém vai na roda de conversa hoje às 19h?' },
      { from: 'me', text: 'Eu vou! Bora' },
    ] },
  p2: { type: 'pessoa', name: 'Thiago', sub: 'a 5 km', icon: 'T', color: 'var(--pink)', time: '3d', unread: false,
    messages: [
      { from: 'me', text: 'Bora marcar a primeira aula de surf?' },
      { from: 'them', text: 'Bora! Vou provavelmente cair muito haha' },
    ] },
  b2: { type: 'bolha', name: 'Respira SP', sub: '58 pessoas', icon: '🧘', color: 'var(--teal)', time: '2h', unread: false,
    messages: [
      { from: 'me', text: 'Consegui um tapete extra pro sábado' },
      { from: 'them', text: 'Rafa: perfeito, te vejo lá!' },
    ] },
  b5: { type: 'bolha', name: 'Rock & Crossfit Clube', sub: '47 pessoas', icon: '🏋️', color: 'var(--sea)', time: '1d', unread: false,
    messages: [
      { from: 'them', text: 'Gabriel: aula experimental confirmada pra sexta!' },
    ] },
}

export const conversationOrder = ['p1', 'b1', 'p2', 'b2', 'b5']
