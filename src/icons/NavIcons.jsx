/* ============================================================
   Ícones da barra de baixo.

   Todos desenhados no mesmo viewBox de 24x24 e com a mesma
   espessura de traço, pra terem o mesmo peso visual lado a lado.
   Eles herdam a cor de quem os usa (currentColor), então a barra
   só precisa mudar a cor do link pra acender o ícone.
   ============================================================ */

const traco = {
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ size = 22, children, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size} aria-hidden="true" {...rest}>
      {children}
    </svg>
  )
}

export const FeedIcon = (props) => (
  <Svg {...props}>
    <path d="M3.6 10.3 12 3.8l8.4 6.5v8.4a1.7 1.7 0 0 1-1.7 1.7H5.3a1.7 1.7 0 0 1-1.7-1.7z" {...traco} />
    <path d="M9.6 20.4v-5.9h4.8v5.9" {...traco} />
  </Svg>
)

/* Bolhas: bolhas separadas, cada uma com seu próprio contorno e um
   respiro entre elas — nada de círculos emendados/entrelaçados.
   O riscolindo dentro da bolha maior é o brilho, pra ler como bolha
   de sabão e não como um círculo qualquer. */
export const BolhasIcon = (props) => (
  <Svg {...props}>
    <circle cx="8.7" cy="14.2" r="4.8" {...traco} />
    <path d="M6.3 12.2a3.5 3.5 0 0 1 2-2" {...traco} strokeWidth="1.4" opacity="0.7" />
    <circle cx="17" cy="8.4" r="3" {...traco} />
    <circle cx="17.9" cy="17.2" r="1.9" {...traco} />
  </Svg>
)

export const AgendaIcon = (props) => (
  <Svg {...props}>
    <rect x="3.4" y="5.3" width="17.2" height="15.3" rx="3.2" {...traco} />
    <path d="M3.4 10h17.2" {...traco} />
    <path d="M8.3 3.4v3.5" {...traco} />
    <path d="M15.7 3.4v3.5" {...traco} />
  </Svg>
)

export const ConversasIcon = (props) => (
  <Svg {...props}>
    <path
      d="M4.2 11.4c0-3.5 3.5-6.3 7.8-6.3s7.8 2.8 7.8 6.3-3.5 6.3-7.8 6.3a10.4 10.4 0 0 1-2.4-.3L5.4 19.4l1.2-3.4a5.9 5.9 0 0 1-2.4-4.6Z"
      {...traco}
    />
  </Svg>
)

export const PerfilIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="8.4" r="3.7" {...traco} />
    <path d="M4.9 20.2a7.4 7.4 0 0 1 14.2 0" {...traco} />
  </Svg>
)

/* Usado no botão "Estourar a bolha" e em qualquer lugar que precise
   do símbolo da marca em tamanho de ícone. */
export const EstourarIcon = (props) => (
  <Svg {...props}>
    <circle cx="11" cy="13" r="5.6" {...traco} />
    <path d="M8.2 10.8a4 4 0 0 1 2.3-2.3" {...traco} strokeWidth="1.4" opacity="0.7" />
    <path d="M18.6 5.4 17.4 7M20.8 8.6 18.9 9.2M18.1 12.6l1.8.7" {...traco} strokeWidth="1.5" />
  </Svg>
)
