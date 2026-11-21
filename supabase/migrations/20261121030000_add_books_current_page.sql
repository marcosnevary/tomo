-- Null means the reader isn't tracking progress, which is different from page 0.
-- The table check passes when page_count is null: a null comparison doesn't fail a check.
alter table public.books
  add column current_page integer check (current_page >= 0),
  add constraint books_current_page_within_page_count check (current_page <= page_count);
