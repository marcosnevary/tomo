alter table public.books
  add column cover_url text check (cover_url ~ '^https?://');
