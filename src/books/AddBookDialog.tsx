import { useState } from "react"
import { BookForm } from "@/books/BookForm"
import { useAddBook } from "@/books/bookQueries"
import { BookSearch } from "@/books/BookSearch"
import type { BookSearchResult } from "@/books/openLibrary"
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

  return (
    <>
      <BookSearch onSelect={setSelected} />
      <div className="border-t pt-4">
        <BookForm
          key={selected?.key}
          initialBook={selected}
          submitLabel="Add"
          pendingLabel="Adding…"
          isPending={addBook.isPending}
          isError={addBook.isError}
          onSubmit={(newBook) =>
            addBook.mutate(newBook, { onSuccess: onAdded })
          }
        />
      </div>
    </>
  )
}

export { AddBookDialog }
