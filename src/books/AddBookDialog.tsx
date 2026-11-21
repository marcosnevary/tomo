import { useState } from "react"
import { BookForm } from "@/books/BookForm"
import { useAddBook, useBookDetails } from "@/books/bookQueries"
import { BookSearch } from "@/books/BookSearch"
import type { BookSearchResult } from "@/books/searchBooks"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function AddBookDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Add book</DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] grid-cols-1 overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add book</DialogTitle>
        </DialogHeader>
        <AddBookForm onAdded={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

type AddBookFormProps = {
  onAdded: () => void
}

function AddBookForm({ onAdded }: AddBookFormProps) {
  const addBook = useAddBook()
  const [selected, setSelected] = useState<BookSearchResult>()
  const details = useBookDetails(selected)

  return (
    <>
      <BookSearch onSelect={setSelected} />
      <div className="border-t pt-4">
        {details.isFetching ? (
          <p className="text-muted-foreground">Loading book details…</p>
        ) : (
          <BookForm
            key={selected?.key}
            // If the details fail, the form still opens with what the search result has.
            initialBook={details.data ?? selected}
            submitLabel="Add"
            pendingLabel="Adding…"
            isPending={addBook.isPending}
            isError={addBook.isError}
            onSubmit={(newBook) =>
              addBook.mutate(newBook, { onSuccess: onAdded })
            }
          />
        )}
      </div>
    </>
  )
}

export { AddBookDialog }
