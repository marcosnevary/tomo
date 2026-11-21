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
- **Book form.** `BookForm` holds the fields and their validation once; the add dialog puts the Open Library search above it, and the edit dialog opens it with the book's current values. Clicking a poster, or pressing Enter on it, opens the edit dialog, which also holds the Delete button; deleting asks for confirmation first because it cannot be undone. The status is picked from a segmented control. The rating is picked by clicking the left or right half of a star, and an × button next to them sets it back to not rated. Both are hidden native radio buttons under the styling, so arrow keys step through the values. Typing a current page (or changing the page count) sets the status it implies, through `statusForCurrentPage`: page 0 → Unread, the last page → Read, anything in between → Reading. The reader can still pick another status before saving; picking a status never changes the current page.
- **Data access.** Screens never call Supabase directly for data. `src/books/bookRepository.ts` holds the queries and maps database rows (`page_count`) to app types (`pageCount`); `src/books/bookQueries.ts` wraps them in TanStack Query hooks. Adding, editing or deleting a book invalidates the `books` query (through one shared mutation hook) so the list refetches. Signing out clears the query cache.
- **Access control.** The Supabase publishable key ships in the frontend by design; what a reader can see is enforced by Postgres Row Level Security. Each book row has a `user_id` that defaults to `auth.uid()`, and the policies only let a signed-in reader select, insert, update and delete their own rows. The update policy checks `user_id` both before (`using`) and after (`with check`) the change, so a reader cannot move a book to another account. Supabase grants table privileges to signed-in users by default, so the policies are what actually restrict access. A request with no matching policy is not rejected: it just affects zero rows. That is why `updateBook` and `deleteBook` ask for the affected row count and treats zero as an error, instead of reporting a silent success.
- **Schema.** The database schema lives in `supabase/migrations/` and is applied to the hosted project with the Supabase CLI (`supabase db push --remote`). `src/lib/database.types.ts` is generated from the linked project with `pnpm db:types` and types every Supabase query.

## Data model

- **Book** (`books` table). `title`, `author` and `status` are required; the title and author cannot be blank. `year` and `pageCount` are optional integers, and `pageCount` is at least 1 when present. `status` is the `book_status` enum (`unread`, `reading`, `read`) and defaults to `unread`. `rating` is optional and goes from 0.5 to 5 in half-star steps; it is a nullable `numeric(2,1)`, and null means "not rated". There is no 0-star rating: the lowest a reader can give is half a star. The database generates the `id` and enforces the rules with check constraints; the book form repeats them with native HTML validation and offers status and rating as fixed options, so most mistakes never reach the server. Nullable columns become optional (`undefined`) fields in the app, and an empty number input is saved as missing rather than 0. Each book belongs to one reader (`user_id`). `coverUrl` (`cover_url`) is optional and must be an `http(s)` URL: a link to an image hosted elsewhere, usually Open Library; the app does not store the image itself. A book without a cover is shown as a placeholder with its title and author. `currentPage` (`current_page`) is optional and goes from 0 to `pageCount`; null means the reader isn't tracking progress, which is different from page 0. The range check is skipped when there is no page count. Every poster shows the status; the rating appears as stars with the other details.

## External integrations

- **Open Library** (`src/books/openLibrary.ts`). The add-book dialog searches `openlibrary.org/search.json` by title, with no API key, through the `useBookSearch` query hook. A chosen result pre-fills the form: `author_name[0]` → author, `first_publish_year` → year, `number_of_pages_median` → pages, and `cover_i` becomes a `covers.openlibrary.org/b/id/<cover_i>-L.jpg` cover URL. Any of these can be missing, so the reader completes or edits the fields before saving. The raw API types stay inside that module; the rest of the app only sees `BookSearchResult`, which uses the `Book` field names.

## Decisions

- **Vite SPA over Next.js.** Next.js brings server components, caching and server routes all at once; Vite keeps the client/server split explicit while the focus is learning React.
- **pnpm + Node over Bun.** pnpm blocks phantom dependencies and install scripts by default. Bun's main strengths (fast runtime, bundler, test runner) would go unused here, and Node + Vite has far more learning material and makes errors easier to isolate.
- **Vitest for tests, added with the first test.** It reuses `vite.config.ts` (plugins, alias), so tests and the app share one configuration; `bun test` would need its own.
- **Supabase as the backend.** It provides Postgres, auth and cross-device sync without writing a server. Browser-only storage (IndexedDB) would keep data on a single device; a custom backend would double the work.
- **Frontend first, Supabase later.** The first screen was built against in-memory state so the data model emerged from use; the repository module arrived together with Supabase.
- **TanStack Query for server state.** The book list is a copy of data that lives in Postgres; TanStack Query handles loading, errors and refetching after a change, which `useEffect` + `useState` would need by hand.
- **Supabase CLI migrations, CLI installed with Homebrew.** Migrations keep the schema versioned next to the code that depends on it. Installing the CLI as an npm dev dependency would need its install script allowed, which pnpm blocks by default.
- **Generated database types.** Types come from the real schema, so a renamed column breaks the build instead of failing at runtime.
- **Open Library over Google Books.** It needs no key and has no daily quota, and its covers come in large sizes. Its coverage of Brazilian editions is weaker; the editable cover URL and form fields cover the gaps.
- **Cover as a URL, not an upload.** A link fits a text column and needs no storage; uploads would need Supabase Storage and its own access rules, which can come when readers need covers Open Library lacks.
- **Libraries added on demand.** Routing (React Router), forms (React Hook Form + Zod) and server state (TanStack Query) are added when first needed, so each one's purpose is clear.
- **Status as a Postgres enum.** `pnpm db:types` turns it into a TypeScript union and a `Constants` list the form reads its options from, so the allowed values are declared once, in the migration. A text column with a check constraint would need the union written by hand.
- **Base UI and the Nova preset.** Both are shadcn's current defaults, so the official docs match the project. Visual identity is deferred; `shadcn apply <code> --only theme` changes the theme later without reinstalling components.
- **Prettier with `semi: false`.** It matches the style of shadcn-generated code, so adding components does not cause formatting churn.
- **No `eslint-config-prettier`.** The enabled ESLint configs contain no formatting rules, so there is nothing to conflict with Prettier.
- **`react-refresh/only-export-components` is off in `src/components/ui/`.** shadcn files export style variants (e.g. `buttonVariants`) next to components, and splitting them would fight the CLI on every `add`. The cost is a full page reload instead of Fast Refresh when editing those files.
- **`paths` without `baseUrl`.** `baseUrl` is deprecated in TypeScript 6, and `paths` resolves relative to the tsconfig file on its own.
