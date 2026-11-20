-- The lowest rating is half a star; a book the reader hasn't rated keeps a null rating.
alter table public.books
  drop constraint books_rating_check,
  add constraint books_rating_check check (
    rating between 0.5 and 5 and rating * 2 = floor(rating * 2)
  );
