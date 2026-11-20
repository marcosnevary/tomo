# Tomo

A web app where readers log their readings. See [docs/architecture.md](docs/architecture.md) for how it works.

## Getting started

Requirements: Node, pnpm and the [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase`).

```bash
pnpm install
```

### 1. Supabase project

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Copy `.env.example` to `.env.local` and fill it with the values from **Project Settings → API Keys** (publishable key) and **Project Settings → Data API** (project URL).
3. Link the CLI and apply the database migrations:

   ```bash
   supabase login
   supabase link --project-ref <project-ref>
   supabase db push --remote
   ```

4. In **Authentication → URL Configuration**, set the Site URL to `http://localhost:5173` and add `http://localhost:5173` to the redirect URLs.

### 2. Google sign-in

1. In the [Google Cloud Console](https://console.cloud.google.com/), create a project, configure the OAuth consent screen (Google Auth Platform → Branding/Audience) and add yourself as a test user.
2. Create an OAuth client of type **Web application**. Add `https://<project-ref>.supabase.co/auth/v1/callback` as an authorized redirect URI.
3. In Supabase, open **Authentication → Sign In / Providers → Google**, enable it and paste the client ID and secret.

### 3. Run

```bash
pnpm dev
```

## Scripts

| Script          | What it does                                       |
| --------------- | -------------------------------------------------- |
| `pnpm dev`      | Starts the dev server                              |
| `pnpm build`    | Type-checks and builds for production              |
| `pnpm lint`     | Runs ESLint                                        |
| `pnpm format`   | Formats with Prettier                              |
| `pnpm db:types` | Regenerates database types from the linked project |

After changing the schema, create a migration with `supabase migration new <name>`, apply it with `supabase db push --remote` and run `pnpm db:types`.
