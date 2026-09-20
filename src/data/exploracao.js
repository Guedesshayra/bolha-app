// O "outro lado" do Feed: bolhas de assuntos que a pessoa nunca
// clicou, o oposto do que o algoritmo normal sugeriria. É isso que
// aparece depois de "Estourar a bolha". Em produção esse conjunto
// viria de um algoritmo que pega o inverso das tags/interesses da
// pessoa; aqui é uma lista fixa de exemplo.
//
// `top`/`left` são porcentagem da área de exploração, `diam` é o
// diâmetro em px — posições escolhidas à mão pra ficarem espalhadas
// tipo bolhas boiando, sem estourar da tela.
export const bolhasDeFora = [
  {
    id: 'clube-livro', name: 'Clube do Livro Insônia', icon: '📚',
    color: 'rgba(167,155,209,0.9)', members: 41, diam: 118, top: 6, left: 12,
    bio: 'Um livro por mês, sem crítica literária chata — só gente que gosta de discutir até tarde da noite.',
  },
  {
    id: 'surf-maresias', name: 'Surf Maresias', icon: '🏄',
    color: 'rgba(95,179,173,0.9)', members: 63, diam: 138, top: 44, left: 4,
    bio: 'Saídas de fim de semana pra Maresias. Do iniciante que nunca ficou em pé ao avançado.',
  },
  {
    id: 'rave-amanhecer', name: 'Rave Amanhecer', icon: '🌀',
    color: 'rgba(46,196,182,0.9)', members: 128, diam: 90, top: 2, left: 60,
    bio: 'Festas eletrônicas ao ar livre em SP. Line-up underground, do pôr do sol ao nascer do sol.',
  },
  {
    id: 'funk-de-raiz', name: 'Funk de Raiz', icon: '🔊',
    color: 'rgba(201,142,166,0.9)', members: 87, diam: 104, top: 26, left: 64,
    bio: 'Bailes, playlists e história do funk carioca — pra quem quer entender antes de julgar.',
  },
  {
    id: 'skate-noturno', name: 'Skate Noturno', icon: '🛹',
    color: 'rgba(95,179,173,0.9)', members: 29, diam: 68, top: 62, left: 58,
    bio: 'Rolês de skate à noite pela cidade, ritmo tranquilo — todo mundo espera todo mundo.',
  },
  {
    id: 'kpop-sp', name: 'K-pop SP', icon: '🎤',
    color: 'rgba(167,155,209,0.9)', members: 156, diam: 106, top: 64, left: 18,
    bio: 'Coreografias, fã-clubes e encontro pra assistir comeback juntas.',
  },
  {
    id: 'vinil-e-jazz', name: 'Vinil & Jazz', icon: '🎷',
    color: 'rgba(46,196,182,0.9)', members: 18, diam: 54, top: 20, left: 40,
    bio: 'Sessões de escuta de vinil sem pressa, num bar pequeno na Vila Madalena.',
  },
]
