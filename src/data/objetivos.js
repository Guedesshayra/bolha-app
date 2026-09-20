// As opções de "o que você busca no Bolha". A pessoa escolhe uma ou
// mais no cadastro (ver src/pages/Objetivo.jsx). É esse campo que
// alimenta o filtro de compatibilidade (src/utils/compatibilidade.js):
// quem marca "relacionamento" só cruza com quem também marcou, mesmo
// que as duas pessoas coincidam em outros objetivos (ex: as duas
// querem um grupo pra jogar futebol).
export const objetivos = [
  { id: 'relacionamento', label: 'Encontrar um relacionamento amoroso', icon: '💛' },
  { id: 'amizade', label: 'Amizades sinceras, sem segundas intenções', icon: '🤝' },
  { id: 'grupo', label: 'Grupo de amigos', icon: '🫂' },
  { id: 'companhia', label: 'Companhia pra cinema, viagem etc.', icon: '🎬' },
  { id: 'clube', label: 'Participar de um clube (livros, futebol, moto...)', icon: '📚' },
]
