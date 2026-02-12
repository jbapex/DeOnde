# DeOnde – CRM na versão do cliente

Sistema **totalmente independente**: CRM na versão do cliente (login, leads, contatos, canais WhatsApp, automações, vendas). Não depende do Planeje nem de nenhum outro sistema.

- **Banco e auth:** use um **projeto Supabase novo** (URL e anon key no `.env`).
- **Dados:** só os dados desse projeto; nada é puxado de outro app.
- Repositório: [github.com/jbapex/DeOnde](https://github.com/jbapex/DeOnde)

## Pré-requisitos

- Node 18+
- Conta Supabase

## Setup

1. Crie um **novo** projeto em [Supabase](https://supabase.com) (só para o DeOnde; não use o projeto de outro sistema).
2. Rode as migrations em `supabase/migrations/` na ordem do nome (SQL Editor ou CLI), para criar `clientes`, `profiles`, leads, etc.
3. Copie `.env.example` para `.env` e preencha com a **URL e a anon key desse projeto** (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). O app não usa nenhum outro backend.
4. `npm install` e `npm run dev`.
5. Faça deploy das Edge Functions **nesse** projeto: `supabase functions deploy uazapi-inbox-webhook`, `create-lead-from-contact`, `apicebot-inbox-webhook`.

## Migrations

As migrations em `supabase/migrations/` devem ser aplicadas em ordem cronológica (nome do arquivo). O CRM depende de `clientes` e `profiles` – se seu projeto ainda não tiver essas tabelas, crie-as antes (ex.: `clientes` com `id`, `empresa`; `profiles` com `id`, `cliente_id`, `role`, vinculado a `auth.users`).
