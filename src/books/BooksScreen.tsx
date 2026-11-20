import { useQueryClient } from "@tanstack/react-query"
import { AddBookDialog } from "@/books/AddBookDialog"
import { useBooks } from "@/books/bookQueries"
import { BookList } from "@/books/BookList"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

function BooksScreen() {
  const books = useBooks()
  const queryClient = useQueryClient()

  async function signOut() {
    await supabase.auth.signOut()
    // The cache holds this reader's books; the next one to sign in must not see them.
    queryClient.clear()
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">My books</h1>
        <div className="flex gap-2">
          <AddBookDialog />
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </header>
      {books.isPending && (
        <p className="text-sm text-muted-foreground">Loading books…</p>
      )}
      {books.isError && (
        <p className="text-sm text-destructive">Could not load your books.</p>
      )}
      {books.isSuccess && <BookList books={books.data} />}
    </main>
  )
}

export { BooksScreen }
