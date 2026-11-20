grant delete on public.books to authenticated;

create policy "Users can delete their own books"
  on public.books for delete
  to authenticated
  using ((select auth.uid()) = user_id);
