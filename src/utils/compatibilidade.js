// A regra que diferencia o Bolha de um app de relacionamento comum:
// quem NÃO marcou "relacionamento" no cadastro nunca pode ser
// cruzado com quem marcou — mesmo que as duas pessoas tenham outros
// objetivos em comum (ex: as duas procuram gente pro futebol). Uma
// pessoa casada buscando companhia pro esporte não pode receber
// sugestão de alguém em busca de romance só porque as duas gostam de
// bola. Ver a anotação de produto "Cadastro perfil [Usuário]".
export function saoCompativeis(objetivosA = [], objetivosB = []) {
  const aQuerRelacionamento = objetivosA.includes('relacionamento')
  const bQuerRelacionamento = objetivosB.includes('relacionamento')
  return aQuerRelacionamento === bQuerRelacionamento
}

// Objetivos que duas pessoas têm em comum — dá pra usar depois pra
// explicar por que elas foram sugeridas uma pra outra.
export function objetivosEmComum(objetivosA = [], objetivosB = []) {
  return objetivosA.filter(o => objetivosB.includes(o))
}
