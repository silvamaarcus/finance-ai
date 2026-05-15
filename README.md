# Finance AI 💰

O **Finance AI** é uma aplicação web de gerenciamento financeiro pessoal com inteligência artificial integrada. Com ela, o usuário pode:

- Cadastrar e gerenciar transações financeiras (receitas, despesas e investimentos)
- Visualizar um **dashboard interativo** com gráficos, resumos e indicadores mensais
- Obter **relatórios gerados por IA** (via Groq) com insights personalizados sobre suas finanças
- Assinar um **plano premium** via Stripe para desbloquear recursos avançados (como os relatórios de IA)
- Autenticar-se de forma segura com **Clerk** (login social, e-mail, etc.)

O banco de dados é hospedado no **Neon** (PostgreSQL serverless), gerenciado pelo **Prisma ORM**.

---

## Sumário

- [Finance AI 💰](#finance-ai-)
  - [Sumário](#sumário)
  - [Clonando o repositório](#clonando-o-repositório)
  - [Dependências](#dependências)
    - [Dependências de produção](#dependências-de-produção)
    - [Dependências de desenvolvimento](#dependências-de-desenvolvimento)
  - [Arquitetura do projeto (Next.js)](#arquitetura-do-projeto-nextjs)
    - [Convenções de nomenclatura no Next.js App Router](#convenções-de-nomenclatura-no-nextjs-app-router)
    - [Estrutura](#estrutura)
  - [Variáveis de ambiente](#variáveis-de-ambiente)
  - [Serviços externos — como se cadastrar](#serviços-externos--como-se-cadastrar)
    - [🗄️ Neon (banco de dados PostgreSQL serverless)](#️-neon-banco-de-dados-postgresql-serverless)
    - [🔐 Clerk (autenticação)](#-clerk-autenticação)
    - [💳 Stripe (pagamentos)](#-stripe-pagamentos)
    - [🤖 Groq (IA — geração de relatórios)](#-groq-ia--geração-de-relatórios)
  - [Rodando o projeto](#rodando-o-projeto)
    - [Pré-requisitos](#pré-requisitos)
    - [Passo a passo](#passo-a-passo)
  - [Scripts disponíveis](#scripts-disponíveis)
  - [Stripe CLI](#stripe-cli)

---

## Clonando o repositório

```bash
git clone https://github.com/silvamaarcus/finance-ai.git
cd finance-ai
npm install
```

---

## Dependências

### Dependências de produção

| Pacote                      | O que faz                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| `next` (14)                 | Framework React para aplicações web fullstack com suporte a SSR, SSG e Server Components |
| `react` / `react-dom`       | Biblioteca base para construção de interfaces declarativas                               |
| `@clerk/nextjs`             | Autenticação completa (login, registro, sessões) integrada ao Next.js                    |
| `@clerk/themes`             | Temas visuais para os componentes de UI do Clerk (ex: tema dark)                         |
| `prisma` / `@prisma/client` | ORM para TypeScript; define o schema do banco e gera o client tipado                     |
| `groq-sdk`                  | SDK oficial do Groq para chamadas à API de IA (geração de relatórios financeiros)        |
| `openai`                    | SDK da OpenAI (utilizado como alternativa ou complemento ao Groq)                        |
| `stripe`                    | SDK server-side do Stripe para criação de checkouts e webhooks                           |
| `@stripe/stripe-js`         | SDK client-side do Stripe para redirecionamento ao checkout no browser                   |
| `zod`                       | Validação e parsing de schemas em TypeScript (formulários, server actions)               |
| `react-hook-form`           | Gerenciamento de estado de formulários com alta performance                              |
| `@hookform/resolvers`       | Integração entre o React Hook Form e validadores como Zod                                |
| `recharts`                  | Biblioteca de gráficos declarativos baseada em SVG para React                            |
| `@tanstack/react-table`     | Tabela headless e extensível para React (usada na listagem de transações)                |
| `date-fns`                  | Utilitários para manipulação e formatação de datas                                       |
| `react-day-picker`          | Componente de calendário para seleção de datas                                           |
| `react-number-format`       | Formatação de inputs numéricos (ex: valores monetários em R$)                            |
| `react-markdown`            | Renderiza Markdown como componentes React (exibe relatórios de IA)                       |
| `lucide-react`              | Biblioteca de ícones SVG para React                                                      |
| `clsx`                      | Utilitário para composição condicional de classes CSS                                    |
| `class-variance-authority`  | Criação de variantes de componentes com classes Tailwind                                 |
| `tailwind-merge`            | Mescla classes Tailwind sem conflitos                                                    |
| `tailwindcss-animate`       | Plugin de animações para Tailwind CSS                                                    |
| `@tailwindcss/typography`   | Plugin que adiciona estilos tipográficos para conteúdo Markdown/HTML                     |
| `@radix-ui/*`               | Primitivos de UI acessíveis e sem estilo (Dialog, Select, Popover, Tooltip, etc.)        |

### Dependências de desenvolvimento

| Pacote                                     | O que faz                                                     |
| ------------------------------------------ | ------------------------------------------------------------- |
| `typescript`                               | Superset tipado do JavaScript                                 |
| `eslint` / `eslint-config-next`            | Linter para garantir qualidade do código                      |
| `eslint-plugin-simple-import-sort`         | Ordena imports automaticamente                                |
| `prettier` / `prettier-plugin-tailwindcss` | Formatador de código; ordena classes Tailwind automaticamente |
| `husky`                                    | Executa scripts em hooks do Git (ex: lint antes do commit)    |
| `lint-staged`                              | Roda linters apenas nos arquivos modificados no commit        |
| `git-commit-msg-linter`                    | Valida mensagens de commit (ex: padrão Conventional Commits)  |
| `postcss`                                  | Processador de CSS (necessário para o Tailwind)               |
| `@types/*`                                 | Tipagens TypeScript para Node.js, React, React DOM            |

---

## Arquitetura do projeto (Next.js)

### Convenções de nomenclatura no Next.js App Router

No Next.js com App Router, o nome das pastas dentro de `app/` tem um significado especial:

| Convenção                    | Exemplo        | O que significa                                                                                                                                                    |
| ---------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Pasta simples**            | `login/`       | Cria uma rota acessível em `/login`. Qualquer arquivo `page.tsx` dentro dela vira uma página pública.                                                              |
| **Prefixo `_`** (underscore) | `_components/` | **Pasta privada** — o Next.js ignora completamente para roteamento. Usada para organizar código (componentes, utilitários, actions) sem criar rotas.               |
| **Parênteses**               | `(home)/`      | **Route Group** — agrupa rotas sem afetar a URL. Serve para organizar visualmente e compartilhar layouts sem adicionar segmento na URL. A rota continua sendo `/`. |

### Estrutura

```
app/
├── layout.tsx                  # Layout raiz: define fontes, ClerkProvider e estrutura HTML global
├── globals.css                 # Estilos globais e variáveis CSS do Tailwind
│
├── _actions/                   # [PRIVADA] Server Actions globais reutilizáveis
│   └── upsert-transaction/     # Action para criar ou editar uma transação
│       ├── index.ts            # Lógica da action (validação + chamada ao banco)
│       └── schema.ts           # Schema Zod para validar os dados da transação
│
├── _components/                # [PRIVADA] Componentes globais reutilizáveis em todo o app
│   ├── navbar.tsx              # Barra de navegação principal
│   ├── add-transaction-button.tsx   # Botão que abre o modal de nova transação
│   ├── money-input.tsx         # Input formatado para valores monetários (R$)
│   ├── upsert-transaction-dialog.tsx # Modal de criar/editar transação
│   └── ui/                     # Componentes de UI base (shadcn/ui): Button, Card, Dialog, etc.
│
├── _constants/                 # [PRIVADA] Constantes reutilizáveis (ex: labels de categorias)
│   └── transactions.ts
│
├── _data/                      # [PRIVADA] Funções de busca de dados no banco (server-side)
│   ├── get-dashboard/          # Busca todos os dados do dashboard (totais, gráficos, etc.)
│   ├── get-current-month-transactions/ # Conta transações do mês atual
│   └── can-user-add-transaction/       # Verifica limite de transações do plano básico
│
├── _lib/                       # [PRIVADA] Configurações de bibliotecas
│   ├── prisma.ts               # Instância singleton do Prisma Client
│   └── utils.ts                # Utilitário `cn()` para mesclagem de classes Tailwind
│
├── _utils/                     # [PRIVADA] Funções utilitárias (ex: formatação de moeda)
│   └── currency.ts
│
├── (home)/                     # [ROUTE GROUP] Dashboard principal — rota: /
│   ├── page.tsx                # Página do dashboard com gráficos e resumo mensal
│   ├── _actions/               # Server Actions exclusivas do dashboard
│   │   └── generate-ai-report/ # Gera relatório financeiro com IA via Groq
│   └── _components/            # Componentes exclusivos do dashboard
│       ├── summary-cards.tsx        # Cards de resumo (receitas, despesas, investimentos)
│       ├── transactions-pie-chart.tsx # Gráfico de pizza por tipo de transação
│       ├── expenses-per-category.tsx  # Gastos por categoria
│       ├── last-transactions.tsx      # Lista das últimas transações
│       ├── ai-report-button.tsx       # Botão e modal do relatório de IA
│       └── time-select.tsx            # Seletor de mês para filtrar o dashboard
│
├── api/
│   └── webhooks/
│       └── stripe/
│           └── route.ts        # Webhook do Stripe: processa eventos de pagamento/assinatura
│
├── login/                      # Rota: /login — Página de autenticação (Clerk)
│   └── page.tsx
│
├── subscription/               # Rota: /subscription — Página de planos (Básico vs. Premium)
│   ├── page.tsx
│   ├── _actions/
│   │   └── create-stripe-checkout/ # Cria sessão de checkout no Stripe
│   └── _components/
│       └── acquire-plan-button.tsx # Botão de assinatura do plano premium
│
└── transactions/               # Rota: /transactions — Listagem e gerenciamento de transações
    ├── page.tsx
    ├── _columns/               # Definição das colunas da tabela (TanStack Table)
    └── _components/
        ├── edit-transaction-button.tsx # Botão de editar transação
        └── type-badge.tsx              # Badge colorido por tipo (receita/despesa/investimento)

prisma/
├── schema.prisma               # Schema do banco de dados (tabela Transaction + enums)
└── migrations/                 # Histórico de migrações do banco

middleware.ts                   # Middleware global: protege rotas com Clerk (autenticação)
docker-compose.yml              # Sobe um banco PostgreSQL local para desenvolvimento
```

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
# Banco de dados (Neon ou Docker local)
DATABASE_URL=""

# Clerk — Autenticação
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""

# URLs de redirecionamento do Clerk
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/login"

# Stripe — Pagamentos
STRIPE_PREMIUM_PLAN_PRICE_ID=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

# Groq — IA
GROQ_API_KEY=""

# URL da aplicação
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Serviços externos — como se cadastrar

### 🗄️ Neon (banco de dados PostgreSQL serverless)

1. Acesse [neon.tech](https://neon.tech) e clique em **Sign Up**
2. Crie um projeto novo (escolha a região mais próxima)
3. No painel, vá em **Connection Details** e copie a **Connection String**
4. Vá em Project settings → manage → Compute defaults e diminua o valor do processamento para o mínimo (ex: 0.1 vCPU) para evitar custos desnecessários durante o desenvolvimento
5. Cole o valor em `DATABASE_URL` no seu `.env`

> **Dica:** Para desenvolvimento local, você também pode usar o `docker-compose.yml` incluído no projeto. Basta rodar `docker compose up -d` e usar `DATABASE_URL="postgresql://postgres:password@localhost:5432/finance-ai"`.

---

### 🔐 Clerk (autenticação)

1. Acesse [clerk.com](https://clerk.com) e clique em **Sign Up**
2. Crie uma nova **Application** (dê um nome ao app, ex: "Finance AI")
3. Escolha os métodos de login desejados (Google, e-mail, GitHub, etc.)
4. No painel, vá em **API Keys** e copie:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
5. Cole os valores no `.env`

---

### 💳 Stripe (pagamentos)

1. Acesse [stripe.com](https://stripe.com) e clique em **Start now**
2. Complete o cadastro e acesse o **Dashboard**
3. No menu lateral, vá em **Developers → API Keys** e copie:
   - `STRIPE_SECRET_KEY` (Secret key)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Publishable key)
4. Para criar o produto premium:
   - Vá em **Product catalog → Add product**
   - Crie um produto com preço recorrente (ex: R$ 19,90/mês)
   - Copie o **Price ID** (começa com `price_...`) e cole em `STRIPE_PREMIUM_PLAN_PRICE_ID`
5. O `STRIPE_WEBHOOK_SECRET` é gerado ao configurar o Stripe CLI (veja a seção abaixo)

---

### 🤖 Groq (IA — geração de relatórios)

1. Acesse [console.groq.com](https://console.groq.com) e crie uma conta
2. No painel, vá em **API Keys → Create API Key**
3. Copie a chave gerada e cole em `GROQ_API_KEY` no `.env`

---

## Rodando o projeto

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker (opcional, para banco local)

### Passo a passo

```bash
# 1. Instalar dependências
npm install

# 2. Subir banco de dados local (opcional, use Neon se preferir)
docker compose up -d

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Preencha o .env com as credenciais dos serviços externos

# 4. Rodar as migrações do banco
npx prisma migrate dev

# 5. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## Scripts disponíveis

| Script            | Comando                 | O que faz                                                  |
| ----------------- | ----------------------- | ---------------------------------------------------------- |
| Desenvolvimento   | `npm run dev`           | Inicia o servidor Next.js em modo de desenvolvimento       |
| Build             | `npm run build`         | Compila o projeto para produção                            |
| Produção          | `npm run start`         | Inicia o servidor em modo de produção                      |
| Lint              | `npm run lint`          | Verifica problemas de código com ESLint                    |
| Lint + Fix        | `npm run lint:fix`      | Corrige problemas de lint automaticamente                  |
| Format            | `npm run format`        | Formata todo o código com Prettier                         |
| Stripe (webhooks) | `npm run stripe:listen` | Escuta eventos do Stripe e encaminha para o servidor local |

---

## Stripe CLI

Para testar pagamentos localmente, é necessário instalar o **Stripe CLI** e rodar o listener de webhooks.

> 📖 **Instalação:** Siga o guia oficial de acordo com seu sistema operacional:
> [https://docs.stripe.com/stripe-cli](https://docs.stripe.com/stripe-cli)

Após instalar, autentique-se:

```bash
stripe login
```

Em seguida, rode o listener de webhooks para encaminhar eventos do Stripe ao seu servidor local. Você pode usar o script incluído no projeto:

```bash
npm run stripe:listen
# equivale a:
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

O terminal exibirá um **Webhook signing secret** (começa com `whsec_...`). Copie esse valor e cole em `STRIPE_WEBHOOK_SECRET` no seu `.env`.
