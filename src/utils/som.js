// Som sintético do "PLOC" ao estourar a bolha — gerado por código via
// Web Audio API, sem depender de nenhum arquivo de áudio. Precisa ser
// chamado direto dentro do clique do usuário (é o que o Feed faz),
// senão o navegador bloqueia o áudio pela política de autoplay.
let contexto

export function tocarPloc() {
  try {
    if (!contexto) contexto = new (window.AudioContext || window.webkitAudioContext)()
    if (contexto.state === 'suspended') contexto.resume()

    const agora = contexto.currentTime

    // O estouro em si: um tom que sobe rápido e cai, como uma bolha
    // de sabão que arrebenta.
    const osc = contexto.createOscillator()
    const ganho = contexto.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(180, agora)
    osc.frequency.exponentialRampToValueAtTime(820, agora + 0.07)
    osc.frequency.exponentialRampToValueAtTime(260, agora + 0.16)
    ganho.gain.setValueAtTime(0.0001, agora)
    ganho.gain.exponentialRampToValueAtTime(0.5, agora + 0.02)
    ganho.gain.exponentialRampToValueAtTime(0.0001, agora + 0.22)
    osc.connect(ganho)
    ganho.connect(contexto.destination)
    osc.start(agora)
    osc.stop(agora + 0.24)

    // Um chiado curto de ruído por baixo do tom, só pra dar corpo ao
    // estouro — uma bolha pura soa só como apito, não como "ploc".
    const duracaoRuido = 0.12
    const buffer = contexto.createBuffer(1, contexto.sampleRate * duracaoRuido, contexto.sampleRate)
    const dados = buffer.getChannelData(0)
    for (let i = 0; i < dados.length; i++) {
      dados[i] = (Math.random() * 2 - 1) * (1 - i / dados.length)
    }
    const ruido = contexto.createBufferSource()
    ruido.buffer = buffer
    const ganhoRuido = contexto.createGain()
    ganhoRuido.gain.setValueAtTime(0.18, agora)
    ganhoRuido.gain.exponentialRampToValueAtTime(0.0001, agora + duracaoRuido)
    ruido.connect(ganhoRuido)
    ganhoRuido.connect(contexto.destination)
    ruido.start(agora)
  } catch {
    // Sem Web Audio (navegador antigo, aba em segundo plano etc.) —
    // a transição visual continua funcionando sem o som.
  }
}
