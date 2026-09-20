// Funções de data pequenas que a Agenda usa. Nada de biblioteca
// externa por enquanto — quando a Agenda crescer, vale trocar
// isso por date-fns.
export function fmt(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(base, n) {
  const d = new Date(base)
  d.setDate(d.getDate() + n)
  return d
}

export const MONTHS = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
export const WEEKDAYS = ['domingo','segunda','terça','quarta','quinta','sexta','sábado']

export function niceDateLabel(key) {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return `${WEEKDAYS[dt.getDay()]}, ${d} de ${MONTHS[m - 1]}`
}
