import { useState } from "react"
import type { Book } from "@/books/book"
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

type AddBookDialogProps = {
  onAdd: (book: Book) => void
}

function AddBookDialog({ onAdd }: AddBookDialogProps) {
  const [open, setOpen] = useState(false)

  function addBook(formData: FormData) {
    onAdd({
      id: crypto.randomUUID(),
      title: String(formData.get("title")),
      author: String(formData.get("author")),
      year: Number(formData.get("year")),
      pageCount: Number(formData.get("pageCount")),
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Add book</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add book</DialogTitle>
        </DialogHeader>
        <form action={addBook} className="flex flex-col gap-4">
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
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { AddBookDialog }
