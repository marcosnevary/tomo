import { useState } from "react"
import type { Book } from "@/books/book"
import { BookForm } from "@/books/BookForm"
import { BookPoster } from "@/books/BookPoster"
import { DeleteBookButton } from "@/books/DeleteBookButton"
import { useUpdateBook } from "@/books/bookQueries"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type EditBookDialogProps = {
  book: Book
}

function EditBookDialog({ book }: EditBookDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={`Edit ${book.title}`}
            className="group block w-full rounded-lg text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        }
      >
        <BookPoster book={book} />
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] grid-cols-1 overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit book</DialogTitle>
        </DialogHeader>
        <EditBookForm book={book} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

type EditBookFormProps = {
  book: Book
  onDone: () => void
}

// A separate component so the mutation state resets each time the dialog opens.
function EditBookForm({ book, onDone }: EditBookFormProps) {
  const updateBook = useUpdateBook()

  return (
    <BookForm
      initialBook={book}
      submitLabel="Save"
      pendingLabel="Saving…"
      isPending={updateBook.isPending}
      isError={updateBook.isError}
      extraActions={<DeleteBookButton book={book} onDeleted={onDone} />}
      onSubmit={(changes) =>
        updateBook.mutate({ ...changes, id: book.id }, { onSuccess: onDone })
      }
    />
  )
}

export { EditBookDialog }
