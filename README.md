# Bolha — projeto inicial

Esse é o pulo do protótipo em HTML pra um projeto de React de verdade,
que roda no seu computador e é o ponto de partida pra virar um app publicável.

## O que já existe aqui

- Um app em **React + Vite** (o jeito mais rápido de rodar React sem configurar nada na mão)
- Navegação entre 5 telas com **react-router-dom** (Feed, Bolhas, Agenda, Conversas, Perfil)
- **Entrada com conta Google**: a inscrição é feita com o e-mail do Google, que já chega
  verificado. Sem senha nova pra inventar. Tem também um modo demonstração pra navegar
  sem configurar nada.
- **Agenda do Google importada** pra dentro da Agenda do Bolha (só leitura), pra os
  compromissos pessoais aparecerem junto com os da bolha
- Tela de **Feed**: cartões de descoberta com o botão "Estourar a bolha" filtrando o conteúdo
- **Agenda** completa: carrossel em destaque, calendário do mês, painel do dia e criação de evento
- Telas de **Bolhas**, **Conversas**, **Perfil** e o fluxo de **Parceiro**
- Ícones próprios da barra de baixo em `src/icons/NavIcons.jsx` — todos no mesmo traço
- O **logo do Bolha** como componente React (`src/components/BubbleLogo.jsx`)
- As cores, fontes e variáveis de design em um lugar só (`src/styles/tokens.css`)

## Como rodar no seu computador

Você precisa ter o **Node.js** instalado (baixe em nodejs.org, versão 20 ou mais recente).

1. Abra o terminal nesta pasta
2. Rode:
   ```
   npm install
   npm run dev
   ```
3. Abra o link que aparecer no terminal (geralmente `http://localhost:5173`)

Toda vez que você salvar um arquivo, a tela atualiza sozinha — não precisa recarregar.

### Pra ligar o login e a agenda do Google

Precisa de um Client ID gratuito do Google, criado uma vez só.
O passo a passo está em **[GOOGLE-SETUP.md](GOOGLE-SETUP.md)**.

Sem esse cadastro o app roda normalmente, só que em modo demonstração:
a tela de entrada não mostra o botão do Google e a Agenda avisa que a
sincronização está desligada.

## Estrutura de pastas

```
src/
  auth/           -> login: quem está usando o app e como ele entrou
  components/     -> peças reutilizáveis (logo, barra de baixo, topo, calendário)
  data/           -> dados de exemplo (depois isso vira chamadas de API)
  icons/          -> ícones desenhados à mão em SVG
  pages/          -> uma tela = um arquivo (Feed, Bolhas, Agenda...)
  services/       -> conversas com APIs de fora (hoje: Google Agenda)
  styles/         -> cores, fontes e variáveis do design
  utils/          -> funções pequenas de apoio (datas)
  App.jsx         -> onde as rotas (telas) são ligadas e o login é exigido
  main.jsx        -> ponto de entrada do app
```

## Próximos passos sugeridos, em ordem

1. **Escolher um backend**: recomendo Supabase (grátis pra começar, banco de dados +
   login com Google prontos). Hoje a conta só existe no navegador, e o crachá do
   Google é lido sem conferir a assinatura — isso precisa virar responsabilidade de
   um servidor antes de qualquer lançamento.
2. **Trocar `data/cards.js` e `data/bolhas.js` por dados reais** vindos do backend
3. **Gravar na agenda, não só ler**: quando alguém se inscreve num evento do Bolha,
   criar o compromisso no Google Agenda da pessoa. Isso exige trocar o escopo
   `calendar.readonly` por `calendar.events` em `src/services/googleCalendar.js`.
4. **Conversas de verdade** (mensagens em tempo real) — é a parte mais complexa
5. Só depois disso pensar em **publicar como app de verdade** (aí entra React Native,
   reaproveitando boa parte dessa lógica)
