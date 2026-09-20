// Catálogo de experiências dos parceiros — o "cardápio" que uma
// empresa cadastrada em Bolha Experiência (src/pages/Parceiro.jsx)
// vai poder montar sozinha quando existir um painel de verdade (ver
// Não esquecer.md). Por enquanto é dado de exemplo, no molde do que
// foi descrito pro Paintball:
//
//   experiência (Paintball) -> produtos (Cenário Rio, Sampa...)
//     -> pacotes (quantidade de bolinhas, preço POR PESSOA)
//
// A pessoa escolhe um produto e um pacote pra bolha inteira — todo
// mundo que for leva o mesmo pacote — e informa quantas pessoas vão.
// O valor total é `precoPorPessoa * quantidade` (ver
// src/components/ReservaExperienciaSheet.jsx).
export const experienciasParceiro = [
  {
    id: 'paintball-paintwar',
    empresa: 'Arena PaintWar',
    categoria: 'esporte',
    titulo: 'Paintball',
    produtos: [
      {
        id: 'cenario-rio', nome: 'Cenário Rio', cidade: 'Rio de Janeiro, RJ',
        pacotes: [
          { id: 'p200', bolinhas: 200, precoPorPessoa: 150 },
          { id: 'p300', bolinhas: 300, precoPorPessoa: 180 },
          { id: 'p600', bolinhas: 600, precoPorPessoa: 300 },
          { id: 'p700', bolinhas: 700, precoPorPessoa: 330 },
        ],
      },
      {
        id: 'cenario-sampa', nome: 'Cenário Sampa', cidade: 'São Paulo, SP',
        pacotes: [
          { id: 'p200', bolinhas: 200, precoPorPessoa: 150 },
          { id: 'p300', bolinhas: 300, precoPorPessoa: 180 },
          { id: 'p600', bolinhas: 600, precoPorPessoa: 300 },
          { id: 'p700', bolinhas: 700, precoPorPessoa: 330 },
        ],
      },
      {
        id: 'cenario-blangadesh', nome: 'Cenário Blangadesh', cidade: 'em breve',
        pacotes: [
          { id: 'p200', bolinhas: 200, precoPorPessoa: 150 },
          { id: 'p300', bolinhas: 300, precoPorPessoa: 180 },
          { id: 'p600', bolinhas: 600, precoPorPessoa: 300 },
          { id: 'p700', bolinhas: 700, precoPorPessoa: 330 },
        ],
      },
    ],
  },
]
