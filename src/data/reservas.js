// Reservas feitas em experiências de parceiro (ver
// ReservaExperienciaSheet.jsx). Ainda não existe backend (ver Não
// esquecer.md), então ficam guardadas no localStorage — e a Agenda
// (src/pages/Agenda.jsx) lê daqui pra misturar com os eventos dela
// toda vez que é montada, do mesmo jeito que já mistura com o Google.
const CHAVE = 'bolha.reservas'

export function lerReservas() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) || '[]')
  } catch {
    return []
  }
}

export function salvarReserva(reserva) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify([...lerReservas(), reserva]))
  } catch {
    // Navegador anônimo ou armazenamento bloqueado: a reserva desta
    // sessão ainda funciona, só não sobrevive a um recarregamento.
  }
}

// Formato igual ao de src/data/agenda.js, agrupado por dia, pra dar
// pra misturar direto no mapa de eventos da Agenda.
export function reservasComoEventos() {
  const porDia = {}
  for (const r of lerReservas()) {
    porDia[r.data] = porDia[r.data] || []
    porDia[r.data].push({
      hh: r.hora,
      title: `${r.experienciaTitulo} · ${r.produtoNome}`,
      source: `${r.quantidadePessoas} pessoas · pacote ${r.pacoteLabel} · ${r.empresa} · parceiro Bolha`,
      zone: 'bolha', sponsor: true, privacy: 'publico', status: 'confirmado',
    })
  }
  return porDia
}
