import { fmt, addDays } from '../utils/date'

// Igual no protótipo: cada evento tem uma "zone" (bolha, perto,
// pessoal ou date) que decide a cor, e uma "privacy" (privado ou
// publico) que decide quem mais pode ver esse compromisso.
export function seedEvents() {
  const today = new Date()
  const events = {}
  const seed = (offset, ev) => {
    const k = fmt(addDays(today, offset))
    events[k] = events[k] || []
    events[k].push(ev)
  }

  seed(1, { hh: '19:00', title: 'Roda de conversa · Fé sem Fronteiras', source: 'Fé sem Fronteiras · Vila Madalena', zone: 'bolha', sponsor: false, privacy: 'publico', status: 'confirmado' })
  seed(2, { hh: '17:30', title: 'Corte de cabelo', source: 'compromisso pessoal', zone: 'pessoal', sponsor: false, privacy: 'privado', status: 'confirmado' })
  seed(3, { hh: '08:00', title: 'Yoga no Ibirapuera', source: 'bolha Respira SP · Ibirapuera', zone: 'bolha', sponsor: false, privacy: 'publico', status: 'confirmado' })
  seed(3, { hh: '15:00', title: 'Tarde de Paintball', source: 'Arena PaintWar · parceiro Bolha', zone: 'bolha', sponsor: true, privacy: 'publico', status: 'confirmado' })
  seed(4, { hh: '10:00', title: 'Aula de Cerâmica', source: 'Estúdio Barro & Fogo · parceiro Bolha', zone: 'bolha', sponsor: true, privacy: 'publico', status: 'confirmado' })
  seed(5, { hh: '20:30', title: 'Café com o Bruno', source: 'date 1 pra 1 · combinado pelo Bolha', zone: 'date', sponsor: false, privacy: 'privado', status: 'confirmado' })
  seed(8, { hh: '20:00', title: 'Mesa Sem Bandeira · primeiro encontro', source: 'sugestão perto de você · Pinheiros', zone: 'perto', sponsor: false, privacy: 'publico', status: 'sugestao' })
  seed(9, { hh: '09:00', title: 'Rock & Crossfit · aula experimental', source: 'sugestão perto de você · Lapa', zone: 'perto', sponsor: false, privacy: 'publico', status: 'sugestao' })

  return events
}

export const zoneColor = { bolha: 'var(--lavender)', perto: 'var(--mist)', pessoal: 'var(--teal)', date: 'var(--pink)' }
export const zoneLabel = { bolha: 'Da bolha', perto: 'Perto de você', pessoal: 'Pessoal', date: 'Date 1 pra 1' }
export const zoneTextColor = { bolha: 'var(--lavender)', perto: 'var(--mist)', pessoal: 'var(--teal)', date: 'var(--pink)' }

export const featured = [
  { dw: 'SEX', dd: '25', title: 'Aula de Surf ao Amanhecer', sub: 'com o Estúdio Maré · Maresias · a partir de R$90', cta: 'Garantir minha vaga', kind: 'surf' },
  { dw: 'DOM', dd: '21', title: 'Aula de Cerâmica', sub: 'Estúdio Barro & Fogo · a partir de R$120', cta: 'Ver convite', kind: 'ceramica' },
  { dw: 'SAB', dd: '20', title: 'Tarde de Paintball', sub: 'Arena PaintWar · desconto de grupo pra bolhas', cta: 'Chamar minha bolha', kind: 'paintball' },
]
