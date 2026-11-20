import { useState, type FormEvent } from "react"
import { useAddBook } from "@/books/bookQueries"
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
  const addBook = useAddBook()

  function changeOpen(nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen) addBook.reset()
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
      },
      { onSuccess: () => setOpen(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogTrigger render={<Button />}>Add book</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add book</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="author">Author</Label>
            <Input id="author" name="author" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="year">Year</Label>
            <Input id="year" name="year" type="number" step={1} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="pageCount">Pages</Label>
            <Input
              id="pageCount"
              name="pageCount"
              type="number"
              step={1}
              min={1}
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
      </DialogContent>
    </Dialog>
  )
}

export { AddBookDialog }
