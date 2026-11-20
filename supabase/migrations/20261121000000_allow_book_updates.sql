grant update on public.books to authenticated;

-- using picks which rows a reader may change; with check stops them from handing a book to someone else.
create policy "Users can update their own books"
  on public.books for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
