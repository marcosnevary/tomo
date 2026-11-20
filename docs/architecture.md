# Architecture

Tomo is a web app where readers log their readings. It is a single-page app that talks directly to Supabase: readers sign in with Google and their books are stored in Postgres.

## Stack

| Concern                   | Choice                                       |
| ------------------------- | -------------------------------------------- |
| Runtime / package manager | Node + pnpm                                  |
| Dev server and build      | Vite                                         |
| UI                        | React + TypeScript                           |
| Styling                   | Tailwind CSS v4                              |
| Components                | shadcn/ui on Base UI, Nova preset            |
| Lint / format             | ESLint + Prettier (with Tailwind class sort) |
| Backend                   | Supabase (Postgres + Auth)                   |
| Server state              | TanStack Query                               |

## How it fits together

- **Theme.** Tailwind v4 is configured in CSS, not in a JS config file. `src/index.css` holds the design tokens as CSS variables (light values in `:root`, dark in `.dark`) and maps them to Tailwind classes through `@theme inline`. Changing a color app-wide means changing one variable there.
- **Components.** The shadcn CLI copies component source into `src/components/ui/`; the project owns that code. New components are added with `pnpm dlx shadcn@latest add <name>`, which reads `components.json`.
- **Import alias.** `@/` points to `src/`. It is declared twice because two tools resolve imports: TypeScript (`paths` in `tsconfig.json` and `tsconfig.app.json`) and Vite (`resolve.alias` in `vite.config.ts`).
- **Authentication.** `useSession` subscribes to Supabase auth state; `App` shows the login screen while there is no session and the books screen once there is. Google sign-in uses Supabase's OAuth flow: the browser goes to Google, then to Supabase's callback, then back to the app's origin, where supabase-js stores the session in `localStorage`. Google credentials live in the Supabase dashboard, not in the app.
- **Data access.** Screens never call Supabase directly for data. `src/books/bookRepository.ts` holds the queries and maps database rows (`page_count`) to app types (`pageCount`); `src/books/bookQueries.ts` wraps them in TanStack Query hooks. Adding a book invalidates the `books` query so the list refetches. Signing out clears the query cache.
- **Access control.** The Supabase publishable key ships in the frontend by design; what a reader can see is enforced by Postgres Row Level Security. Each book row has a `user_id` that defaults to `auth.uid()`, and the policies only let a signed-in reader select and insert their own rows.
- **Schema.** The database schema lives in `supabase/migrations/` and is applied to the hosted project with the Supabase CLI (`supabase db push --remote`). `src/lib/database.types.ts` is generated from the linked project with `pnpm db:types` and types every Supabase query.

## Data model

- **Book** (`books` table). `title`, `author`, `year` and `pageCount`, all required; `year` and `pageCount` are integers, `pageCount` is at least 1 and the title and author cannot be blank. The database generates the `id` and enforces the rules with check constraints; the add-book form repeats them with native HTML validation so most mistakes never reach the server. Each book belongs to one reader (`user_id`).

## Decisions

- **Vite SPA over Next.js.** Next.js brings server components, caching and server routes all at once; Vite keeps the client/server split explicit while the focus is learning React.
- **pnpm + Node over Bun.** pnpm blocks phantom dependencies and install scripts by default. Bun's main strengths (fast runtime, bundler, test runner) would go unused here, and Node + Vite has far more learning material and makes errors easier to isolate.
- **Vitest for tests, added with the first test.** It reuses `vite.config.ts` (plugins, alias), so tests and the app share one configuration; `bun test` would need its own.
- **Supabase as the backend.** It provides Postgres, auth and cross-device sync without writing a server. Browser-only storage (IndexedDB) would keep data on a single device; a custom backend would double the work.
- **Frontend first, Supabase later.** The first screen was built against in-memory state so the data model emerged from use; the repository module arrived together with Supabase.
- **TanStack Query for server state.** The book list is a copy of data that lives in Postgres; TanStack Query handles loading, errors and refetching after a change, which `useEffect` + `useState` would need by hand.
- **Supabase CLI migrations, CLI installed with Homebrew.** Migrations keep the schema versioned next to the code that depends on it. Installing the CLI as an npm dev dependency would need its install script allowed, which pnpm blocks by default.
- **Generated database types.** Types come from the real schema, so a renamed column breaks the build instead of failing at runtime.
- **Libraries added on demand.** Routing (React Router), forms (React Hook Form + Zod) and server state (TanStack Query) are added when first needed, so each one's purpose is clear.
- **Base UI and the Nova preset.** Both are shadcn's current defaults, so the official docs match the project. Visual identity is deferred; `shadcn apply <code> --only theme` changes the theme later without reinstalling components.
- **Prettier with `semi: false`.** It matches the style of shadcn-generated code, so adding components does not cause formatting churn.
- **No `eslint-config-prettier`.** The enabled ESLint configs contain no formatting rules, so there is nothing to conflict with Prettier.
- **`react-refresh/only-export-components` is off in `src/components/ui/`.** shadcn files export style variants (e.g. `buttonVariants`) next to components, and splitting them would fight the CLI on every `add`. The cost is a full page reload instead of Fast Refresh when editing those files.
- **`paths` without `baseUrl`.** `baseUrl` is deprecated in TypeScript 6, and `paths` resolves relative to the tsconfig file on its own.
