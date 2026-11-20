create table public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (length(trim(title)) > 0),
  author text not null check (length(trim(author)) > 0),
  year integer not null,
  page_count integer not null check (page_count >= 1),
  created_at timestamptz not null default now()
);

create index books_user_id_idx on public.books (user_id);

alter table public.books enable row level security;

grant select, insert on public.books to authenticated;

-- auth.uid() is wrapped in a select so Postgres evaluates it once per query instead of once per row.
create policy "Users can read their own books"
  on public.books for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own books"
  on public.books for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
