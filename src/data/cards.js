// Cartas do feed de descoberta. Em produção isso vem de uma API
// (Supabase/Firebase), mas por enquanto é um array fixo — dá pra
// trocar por dados reais sem mudar o componente que renderiza isso.
//
// `avatares` e `pessoas` alimentam a pilha de rostinhos do cartão:
// mostramos as iniciais de quem já está lá e o "+N" do resto.
export const cards = [
  {
    kind: 'Bolha', dot: 'var(--lavender)', pop: true, sponsor: false,
    title: 'Fé sem Fronteiras', meta: 'São Paulo, SP · 34 pessoas',
    bio: 'Evangélicos e pessoas LGBTQIA+ que decidiram se sentar pra conversar de verdade, sem converter nem provar nada — só entender.',
    tags: ['Fé', 'Diálogo', 'LGBTQIA+'], action: 'Entrar na bolha',
    avatares: ['M', 'T', 'L'], pessoas: 34,
  },
  {
    kind: 'Pessoa', dot: 'var(--sea)', pop: true, sponsor: false,
    title: 'Marina, 27', meta: 'a 2 km · toca na banda da igreja',
    bio: 'Curiosa sobre a bolha LGBT+ do bairro — quero entender antes de opinar. Café, violão e filme de terror ruim.',
    tags: ['Fé', 'Música'], action: 'Curtir',
    objetivos: ['amizade', 'clube'], gostos: ['musica', 'gastronomia'],
  },
  {
    kind: 'Pessoa', dot: 'var(--sea)', pop: false, sponsor: false,
    title: 'Rafael, 32', meta: 'a 5 km · engenheiro, ama trilha',
    bio: 'Mudei de cidade ano passado e ainda não achei minha turma. Procurando alguém pra construir algo sério, sem pressa.',
    tags: ['Trilha', 'Vinho'], action: 'Curtir',
    objetivos: ['relacionamento'], gostos: ['aventuras', 'viagem'],
  },
  {
    kind: 'Atividade', dot: 'var(--teal)', pop: false, sponsor: false,
    title: 'Yoga no Ibirapuera', meta: 'domingo, 8h · bolha Respira SP',
    bio: 'Aula aberta pra qualquer nível, ao ar livre. Quem não tiver tapete, a bolha empresta.',
    tags: ['Yoga', 'Ar livre'], action: 'Participar',
    avatares: ['R', 'J', 'P'], pessoas: 12,
  },
  {
    kind: 'Oficina patrocinada', dot: 'var(--sea)', pop: false, sponsor: true,
    title: 'Aula de Cerâmica', meta: 'Estúdio Barro & Fogo · parceiro Bolha',
    bio: 'Experiência de 2h pra grupos de até 8 pessoas. Reserve pela bolha e leve seu grupo.',
    tags: ['Arte', 'Grupo', 'Presencial'], action: 'Reservar',
    avatares: ['C', 'A'], pessoas: 6,
  },
  {
    // `experienciaId` liga esse card ao catálogo de verdade em
    // src/data/experienciasParceiro.js — é o que abre o fluxo de
    // reserva com produto (cenário) e pacote (ver Feed.jsx).
    kind: 'Oficina patrocinada', dot: 'var(--sea)', pop: false, sponsor: true,
    title: 'Tarde de Paintball', meta: 'Arena PaintWar · parceiro Bolha',
    bio: 'Escolha o cenário e o pacote de bolinhas — dá pra fechar pra bolha inteira de uma vez.',
    tags: ['Aventura', 'Grupo', 'Presencial'], action: 'Reservar',
    experienciaId: 'paintball-paintwar',
  },
]
