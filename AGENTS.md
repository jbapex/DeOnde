# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
DeOnde CRM — standalone React SPA (Vite 4 + React 18) backed by Supabase (PostgreSQL, Auth, Edge Functions, Realtime). See `README.md` for general setup. The app uses `HashRouter`, so URLs are `/#/login-cliente`, `/#/crm/leads`, etc.

### Running the dev server
```
npm run dev          # Vite on port 3003
npm run build        # production build
```

### Supabase local development
Docker and the Supabase CLI must be installed. Then:
```
sudo dockerd &>/tmp/dockerd.log &   # start Docker daemon if not running
sudo supabase start                  # pulls images, runs all services, applies migrations
```
After `supabase start`, get credentials with `supabase status -o env` and create `.env`:
```
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<ANON_KEY from supabase status>
```

### Known schema issues (local dev)
1. **Infinite RLS recursion on `profiles`**: The `profiles_select_by_cliente` policy references the `profiles` table itself. Fix it after `supabase start`:
   ```sql
   CREATE OR REPLACE FUNCTION public.get_my_cliente_id()
   RETURNS uuid LANGUAGE sql SECURITY DEFINER STABLE AS $$
     SELECT cliente_id FROM public.profiles WHERE id = auth.uid();
   $$;
   DROP POLICY IF EXISTS "profiles_select_by_cliente" ON public.profiles;
   CREATE POLICY "profiles_select_by_cliente" ON public.profiles FOR SELECT
     USING (cliente_id = public.get_my_cliente_id());
   ```

2. **Missing columns on `profiles`**: The app queries `full_name` and `avatar_url` on `profiles` (via the `responsavel` join on leads). Add them:
   ```sql
   ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
   ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
   ```

Run these SQL statements via `sudo docker exec -i supabase_db_workspace psql -U postgres -d postgres`.

### Seeding test data
After applying the schema fixes, create a test user and tenant:
```bash
ANON_KEY="$(sudo supabase status -o env 2>/dev/null | grep ANON_KEY | cut -d'"' -f2)"
# 1. Sign up a user
curl -X POST "http://127.0.0.1:54321/auth/v1/signup" \
  -H "apikey: $ANON_KEY" -H "Content-Type: application/json" \
  -d '{"email":"test@deonde.com","password":"test1234"}'
# 2. Create a cliente (tenant) and link the profile using the SERVICE_ROLE_KEY
SERVICE_KEY="$(sudo supabase status -o env 2>/dev/null | grep SERVICE_ROLE_KEY | cut -d'"' -f2)"
# (use the REST API to insert into clientes and patch profiles)
```

### No lint or test framework
The project has no ESLint config and no automated test suite. Validate changes with `npm run build`.

### Login flow caveat
`ClientLogin.jsx` redirects to `/cliente/support` after login. This route doesn't exist but is caught by the wildcard route and redirected to `/crm/leads`. For `cliente`-role users, a `useEffect` handles the redirect after the profile loads. For `admin`/`superadmin` users, the immediate redirect races with the auth state update but eventually works via the same catch-all mechanism.
