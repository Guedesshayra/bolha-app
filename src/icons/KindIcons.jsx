import { BolhasIcon, PerfilIcon } from './NavIcons'

/* Ícones do tipo de cartão no Feed. Mesmo traço dos ícones da barra
   de baixo, pra o app inteiro parecer desenhado pela mesma mão. */

const traco = {
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const AtividadeIcon = ({ size = 16, ...rest }) => (
  <svg viewBox="0 0 24 24" fill="none" width={size} height={size} aria-hidden="true" {...rest}>
    <path d="M12 3.6c.9 3.6 2.6 5.3 6.2 6.2-3.6.9-5.3 2.6-6.2 6.2-.9-3.6-2.6-5.3-6.2-6.2 3.6-.9 5.3-2.6 6.2-6.2Z" {...traco} />
    <path d="M17.7 16.4c.4 1.5 1.1 2.2 2.6 2.6-1.5.4-2.2 1.1-2.6 2.6-.4-1.5-1.1-2.2-2.6-2.6 1.5-.4 2.2-1.1 2.6-2.6Z" {...traco} strokeWidth="1.4" />
  </svg>
)

export const ParceiroIcon = ({ size = 16, ...rest }) => (
  <svg viewBox="0 0 24 24" fill="none" width={size} height={size} aria-hidden="true" {...rest}>
    <path d="M4 9.4 5.6 4.4h12.8L20 9.4" {...traco} />
    <path d="M4 9.4a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" {...traco} />
    <path d="M5.4 11.4v6.9a1.7 1.7 0 0 0 1.7 1.7h9.8a1.7 1.7 0 0 0 1.7-1.7v-6.9" {...traco} />
  </svg>
)

// O texto de `kind` vem dos dados; a chave é o começo dele em minúsculo,
// pra "Oficina patrocinada" e "Oficina" caírem no mesmo ícone.
export const iconePorTipo = {
  bolha: BolhasIcon,
  pessoa: PerfilIcon,
  atividade: AtividadeIcon,
  oficina: ParceiroIcon,
}

export function iconeDoTipo(kind = '') {
  const primeira = kind.toLowerCase().split(' ')[0]
  return iconePorTipo[primeira] || BolhasIcon
}
