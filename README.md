# Planeje CRM (standalone)

CRM do cliente extraído do Planeje – leads, contatos, canais WhatsApp, automações, vendas.

## Pré-requisitos

- Node 18+
- Conta Supabase

## Setup

1. Crie um novo projeto em [Supabase](https://supabase.com).
2. Em SQL Editor, crie as tabelas base `clientes` e `profiles` (veja `supabase/migrations/README_MIGRATIONS.md` ou rode as migrations na ordem do nome).
3. Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. `npm install` e `npm run dev`.
5. Deploy das Edge Functions: `supabase functions deploy uazapi-inbox-webhook`, `create-lead-from-contact`, `apicebot-inbox-webhook`.

## Migrations

As migrations em `supabase/migrations/` devem ser aplicadas em ordem cronológica (nome do arquivo). O CRM depende de `clientes` e `profiles` – se seu projeto ainda não tiver essas tabelas, crie-as antes (ex.: `clientes` com `id`, `empresa`; `profiles` com `id`, `cliente_id`, `role`, vinculado a `auth.users`).
