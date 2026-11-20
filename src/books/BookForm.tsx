import { useState, type FormEvent, type ReactNode } from "react"
import {
  bookStatuses,
  bookStatusLabels,
  type BookStatus,
  type NewBook,
} from "@/books/book"
import { StarRatingInput } from "@/books/StarRatingInput"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SegmentedControl } from "@/components/SegmentedControl"

type BookFormProps = {
  initialBook?: Partial<NewBook>
  submitLabel: string
  pendingLabel: string
  isPending: boolean
  isError: boolean
  onSubmit: (book: NewBook) => void
  /** Extra buttons placed before Cancel, e.g. Delete in the edit dialog. */
  extraActions?: ReactNode
}

/** The fields are uncontrolled, so a new `initialBook` only shows up when the form is remounted with a new `key`. */
function BookForm({
  initialBook,
  submitLabel,
  pendingLabel,
  isPending,
  isError,
  onSubmit,
  extraActions,
}: BookFormProps) {
  const [coverUrl, setCoverUrl] = useState(initialBook?.coverUrl ?? "")

  // onSubmit instead of a form action: an action resets the form when it finishes,
  // which would wipe what the reader typed if saving fails.
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onSubmit({
      title: String(formData.get("title")).trim(),
      author: String(formData.get("author")).trim(),
      year: optionalNumber(formData.get("year")),
      pageCount: optionalNumber(formData.get("pageCount")),
      coverUrl: coverUrl.trim() || undefined,
      rating: optionalNumber(formData.get("rating")),
      status: formData.get("status") as BookStatus,
    })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
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
          defaultValue={initialBook?.title}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          name="author"
          defaultValue={initialBook?.author}
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
          defaultValue={initialBook?.year}
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
          defaultValue={initialBook?.pageCount}
        />
      </div>
      <SegmentedControl
        label="Status"
        name="status"
        options={bookStatuses.map((status) => ({
          value: status,
          label: bookStatusLabels[status],
        }))}
        defaultValue={initialBook?.status ?? "unread"}
      />
      <StarRatingInput name="rating" defaultValue={initialBook?.rating} />
      {isError && (
        <p className="text-sm text-destructive">
          Could not save the book. Please try again.
        </p>
      )}
      <DialogFooter>
        {extraActions}
        <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}

// An empty number input submits "", and Number("") would turn it into 0.
function optionalNumber(value: FormDataEntryValue | null) {
  return value ? Number(value) : undefined
}

export { BookForm }
