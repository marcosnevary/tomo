# Architecture

Tomo is a web app where readers log their readings. It is currently a client-only single-page app with no data layer yet: books live in React state in memory and are cleared on reload.

## Stack

| Concern                   | Choice                                       |
| ------------------------- | -------------------------------------------- |
| Runtime / package manager | Node + pnpm                                  |
| Dev server and build      | Vite                                         |
| UI                        | React + TypeScript                           |
| Styling                   | Tailwind CSS v4                              |
| Components                | shadcn/ui on Base UI, Nova preset            |
| Lint / format             | ESLint + Prettier (with Tailwind class sort) |
| Backend (planned)         | Supabase                                     |

## How it fits together

- **Theme.** Tailwind v4 is configured in CSS, not in a JS config file. `src/index.css` holds the design tokens as CSS variables (light values in `:root`, dark in `.dark`) and maps them to Tailwind classes through `@theme inline`. Changing a color app-wide means changing one variable there.
- **Components.** The shadcn CLI copies component source into `src/components/ui/`; the project owns that code. New components are added with `pnpm dlx shadcn@latest add <name>`, which reads `components.json`.
- **Import alias.** `@/` points to `src/`. It is declared twice because two tools resolve imports: TypeScript (`paths` in `tsconfig.json` and `tsconfig.app.json`) and Vite (`resolve.alias` in `vite.config.ts`).
- **Data access (planned).** Screens will read and write data through a repository module, starting with in-memory data and later backed by Supabase. Access control will rely on Postgres Row Level Security; the Supabase publishable key ships in the frontend by design.

## Data model

- **Book.** `title`, `author`, `year` and `pageCount`, all required; `year` and `pageCount` are integers and `pageCount` is at least 1. Each book gets an `id` from `crypto.randomUUID()` when it is created. The rules are enforced by native HTML validation on the add-book form.

## Decisions

- **Vite SPA over Next.js.** Next.js brings server components, caching and server routes all at once; Vite keeps the client/server split explicit while the focus is learning React.
- **pnpm + Node over Bun.** pnpm blocks phantom dependencies and install scripts by default. Bun's main strengths (fast runtime, bundler, test runner) would go unused here, and Node + Vite has far more learning material and makes errors easier to isolate.
- **Vitest for tests, added with the first test.** It reuses `vite.config.ts` (plugins, alias), so tests and the app share one configuration; `bun test` would need its own.
- **Supabase as the backend.** It provides Postgres, auth and cross-device sync without writing a server. Browser-only storage (IndexedDB) would keep data on a single device; a custom backend would double the work.
- **Frontend first, Supabase later.** Building screens against in-memory data lets the data model emerge from use instead of being guessed upfront; the repository module keeps the later switch away from the UI.
- **Book state in `App` before the repository module.** With a single in-memory consumer, a repository would only add indirection; it is introduced together with Supabase.
- **Libraries added on demand.** Routing (React Router), forms (React Hook Form + Zod) and server state (TanStack Query) are added when first needed, so each one's purpose is clear.
- **Base UI and the Nova preset.** Both are shadcn's current defaults, so the official docs match the project. Visual identity is deferred; `shadcn apply <code> --only theme` changes the theme later without reinstalling components.
- **Prettier with `semi: false`.** It matches the style of shadcn-generated code, so adding components does not cause formatting churn.
- **No `eslint-config-prettier`.** The enabled ESLint configs contain no formatting rules, so there is nothing to conflict with Prettier.
- **`react-refresh/only-export-components` is off in `src/components/ui/`.** shadcn files export style variants (e.g. `buttonVariants`) next to components, and splitting them would fight the CLI on every `add`. The cost is a full page reload instead of Fast Refresh when editing those files.
- **`paths` without `baseUrl`.** `baseUrl` is deprecated in TypeScript 6, and `paths` resolves relative to the tsconfig file on its own.
