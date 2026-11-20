import { useState, type FormEvent } from "react"
import { useAddBook } from "@/books/bookQueries"
import { BookSearch } from "@/books/BookSearch"
import type { BookSearchResult } from "@/books/openLibrary"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  const [coverUrl, setCoverUrl] = useState("")

  function selectResult(result: BookSearchResult) {
    setSelected(result)
    setCoverUrl(result.coverUrl ?? "")
  }

  // onSubmit instead of a form action: an action resets the form when it finishes,
  // which would wipe what the reader typed if saving fails.
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    addBook.mutate(
      {
        title: String(formData.get("title")).trim(),
        author: String(formData.get("author")).trim(),
        year: Number(formData.get("year")),
        pageCount: Number(formData.get("pageCount")),
        coverUrl: coverUrl.trim() || undefined,
      },
      { onSuccess: onAdded },
    )
  }

  return (
    <>
      <BookSearch onSelect={selectResult} />
      <form
        key={selected?.key}
        onSubmit={submit}
        className="flex flex-col gap-4 border-t pt-4"
      >
        <div className="flex gap-4">
          <div className="aspect-[2/3] w-20 shrink-0 overflow-hidden rounded-md bg-muted">
            {coverUrl && (
              <img
                src={coverUrl}
                alt="Cover preview"
                className="size-full object-cover"
              />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Label htmlFor="coverUrl">Cover URL</Label>
            <Input
              id="coverUrl"
              name="coverUrl"
              type="url"
              value={coverUrl}
              onChange={(event) => setCoverUrl(event.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={selected?.title}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            name="author"
            defaultValue={selected?.author}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            name="year"
            type="number"
            step={1}
            defaultValue={selected?.year}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="pageCount">Pages</Label>
          <Input
            id="pageCount"
            name="pageCount"
            type="number"
            step={1}
            min={1}
            defaultValue={selected?.pageCount}
            required
          />
        </div>
        {addBook.isError && (
          <p className="text-sm text-destructive">
            Could not save the book. Please try again.
          </p>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button type="submit" disabled={addBook.isPending}>
            {addBook.isPending ? "Adding…" : "Add"}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}

export { AddBookDialog }
