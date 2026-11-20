create type public.book_status as enum ('unread', 'reading', 'read');

alter table public.books
  add column status public.book_status not null default 'unread',
  -- Null means "not rated", which is different from a 0-star rating.
  add column rating numeric(2, 1) check (
    rating between 0 and 5 and rating * 2 = floor(rating * 2)
  ),
  alter column year drop not null,
  alter column page_count drop not null;
