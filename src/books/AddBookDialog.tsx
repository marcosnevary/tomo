import { useState } from "react"
import { BookForm, BookFormSkeleton } from "@/books/BookForm"
import {
  useAddBook,
  useBookDetails,
  useFetchBookDetails,
} from "@/books/bookQueries"
import { BookSearch } from "@/books/BookSearch"
import type { BookSearchResult } from "@/books/searchBooks"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
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
  const fetchBookDetails = useFetchBookDetails()

  // The toast answers the reader's choice, so it lives in this handler instead of an effect watching the query.
  async function select(result: BookSearchResult) {
    setSelected(result)
    if (result.source !== "appleBooks") return
    try {
      const message = missingDetailsMessage(await fetchBookDetails(result))
      if (message) {
        toast.info(message, { description: fillInDescription })
      }
    } catch {
      toast.error("Couldn't load the year and page count", {
        description: fillInDescription,
      })
    }
  }

  return (
    <>
      <BookSearch onSelect={select} />
      <div className="border-t pt-4">
        {details.isFetching ? (
          <BookFormSkeleton />
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

const fillInDescription = "Fill them in if you know them."

/** "Year and page count not found", naming only the details Open Library didn't have. */
function missingDetailsMessage({ year, pageCount }: BookSearchResult) {
  const missing = [
    year === undefined && "year",
    pageCount === undefined && "page count",
  ].filter((label) => label !== false)
  if (missing.length === 0) return undefined
  const labels = missing.join(" and ")
  return `${labels[0].toUpperCase()}${labels.slice(1)} not found`
}

export { AddBookDialog }
