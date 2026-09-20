# Ligando o Google no Bolha

O app usa o Google pra duas coisas, e as duas saem do **mesmo** cadastro:

1. **Inscrição e login** — a pessoa entra com o e-mail do Google, que já chega verificado.
2. **Agenda** — com autorização da pessoa, o Bolha lê os compromissos do Google Agenda dela.

Tudo isso é **gratuito** e **não pede cartão de crédito**. A cota da API do
Google Calendar é de 1.000.000 de chamadas por dia — muito acima do que um
app em desenvolvimento gasta.

Enquanto você não fizer esse cadastro, o app continua rodando: a tela de
entrada mostra o botão **"Só quero dar uma olhada (modo demonstração)"** e a
Agenda avisa que a parte do Google está desligada.

---

## Passo a passo (uns 10 minutos, uma vez só)

### 1. Crie um projeto no Google Cloud

1. Abra <https://console.cloud.google.com/>
2. No topo da página, clique no seletor de projeto → **Novo projeto**
3. Nome: `Bolha` → **Criar**
4. Espere alguns segundos e selecione o projeto recém-criado

### 2. Ligue a API do Google Agenda

1. Menu lateral → **APIs e serviços** → **Biblioteca**
2. Busque por `Google Calendar API`
3. Abra o resultado e clique em **Ativar**

### 3. Configure a tela de consentimento

É a telinha que a pessoa vê quando o Google pergunta "você autoriza o Bolha a…".

1. **APIs e serviços** → **Tela de permissão OAuth**
2. Tipo de usuário: **Externo** → **Criar**
3. Preencha:
   - Nome do app: `Bolha`
   - E-mail de suporte: o seu
   - E-mail do desenvolvedor: o seu
4. Em **Escopos**, clique em **Adicionar ou remover escopos** e marque:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `.../auth/calendar.readonly` ← esse é o da agenda, só leitura
5. Em **Usuários de teste**, adicione o seu próprio e-mail do Google
   (e o de qualquer pessoa que for testar o app antes da publicação)
6. Salve

> **Sobre o aviso de "app não verificado":** enquanto o projeto estiver em
> modo de teste, o Google mostra uma tela amarela de alerta pra quem entrar.
> É normal e só some quando o app é submetido à verificação do Google — o que
> só vale a pena fazer perto do lançamento de verdade.

### 4. Crie o Client ID

1. **APIs e serviços** → **Credenciais** → **Criar credenciais** → **ID do cliente OAuth**
2. Tipo de aplicativo: **Aplicativo da Web**
3. Nome: `Bolha web`
4. Em **Origens JavaScript autorizadas**, adicione exatamente estas duas:
   ```
   http://localhost:5173
   http://127.0.0.1:5173
   ```
5. **Redirecionamentos autorizados**: pode deixar vazio. O Bolha usa o fluxo
   que abre uma janelinha do Google e volta sozinho, sem redirecionar a página.
6. **Criar** → copie o **ID do cliente** (termina em `.apps.googleusercontent.com`)

### 5. Coloque o ID no app

Na pasta `Aplicativo`, crie um arquivo chamado `.env` (é só copiar o
`.env.example` e renomear) com esta linha:

```
VITE_GOOGLE_CLIENT_ID=1234567890-abcdefg.apps.googleusercontent.com
```

Pare o servidor (`Ctrl+C` no terminal) e rode `npm run dev` de novo. O Vite
só lê o `.env` quando inicia.

Pronto: a tela de entrada passa a mostrar o botão azul do Google, e na Agenda
aparece o botão **Conectar Google Agenda**.

---

## Quando publicar em outro endereço

Toda vez que o app passar a rodar num domínio novo (Vercel, Netlify, domínio
próprio), volte em **Credenciais** → o seu Client ID → e adicione o novo
endereço em **Origens JavaScript autorizadas**. Sem isso o botão do Google
simplesmente não aparece, sem erro visível na tela.

---

## Problemas comuns

| O que acontece | Quase sempre é isso |
| --- | --- |
| O botão azul do Google não aparece | O `.env` não foi lido — confira o nome do arquivo e reinicie o `npm run dev` |
| Erro `origin_mismatch` ou o botão some | O endereço da barra não está na lista de origens autorizadas. `localhost` e `127.0.0.1` contam como endereços **diferentes** |
| "Acesso bloqueado: o app não concluiu a verificação" | Seu e-mail não está em **Usuários de teste** na tela de consentimento |
| A agenda conecta, mas vem vazia | O app lê o calendário **principal** da conta, de 1 mês atrás até 6 meses à frente |
| Depois de um tempo pede autorização de novo | Normal: a chave de acesso à agenda dura cerca de 1 hora e não é guardada entre sessões, de propósito |

---

## O que falta pra virar login "de verdade"

Hoje a conta mora só no navegador (`localStorage`), e o crachá que o Google
devolve é lido sem conferir a assinatura. Isso é suficiente pra desenvolver,
mas **não** é suficiente pra produção: no navegador dá pra forjar esse dado.

Quando entrar um backend (o Supabase é o caminho mais curto, e o login com
Google já vem pronto lá), é ele quem passa a validar o token do Google e criar
a conta. O resto do app não muda: tudo que fala de usuário passa por
`src/auth/AuthContext.jsx`.
