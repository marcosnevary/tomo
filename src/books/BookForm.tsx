import { cn } from "cn"
import { useState, type FormEvent, type ReactNode } from "react"
import {
  bookStatuses,
  bookStatusLabels,
  statusForCurrentPage,
  type BookStatus,
  type NewBook,
} from "@/books/book"
import { StarRatingInput } from "@/books/StarRatingInput"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
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

/** The fields read `initialBook` only when they mount, so a new `initialBook` only shows up when the form is remounted with a new `key`. */
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
  // Number inputs are kept as text so an empty field stays empty instead of becoming 0.
  const [pageCount, setPageCount] = useState(
    String(initialBook?.pageCount ?? ""),
  )
  const [currentPage, setCurrentPage] = useState(
    String(initialBook?.currentPage ?? ""),
  )
  const [status, setStatus] = useState<BookStatus>(
    initialBook?.status ?? "unread",
  )

  function changeProgress(progress: {
    pageCount: string
    currentPage: string
  }) {
    setPageCount(progress.pageCount)
    setCurrentPage(progress.currentPage)
    const impliedStatus = statusForCurrentPage({
      pageCount: optionalNumber(progress.pageCount),
      currentPage: optionalNumber(progress.currentPage),
    })
    if (impliedStatus) setStatus(impliedStatus)
  }

  // onSubmit instead of a form action: an action resets the form when it finishes,
  // which would wipe what the reader typed if saving fails.
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onSubmit({
      title: String(formData.get("title")).trim(),
      author: String(formData.get("author")).trim(),
      year: optionalNumber(formData.get("year")),
      pageCount: optionalNumber(pageCount),
      currentPage: optionalNumber(currentPage),
      coverUrl: coverUrl.trim() || undefined,
      rating: optionalNumber(formData.get("rating")),
      status,
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
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="pageCount">Pages</Label>
          <Input
            id="pageCount"
            name="pageCount"
            type="number"
            step={1}
            min={1}
            value={pageCount}
            onChange={(event) =>
              changeProgress({ pageCount: event.target.value, currentPage })
            }
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="currentPage">Current page</Label>
          <Input
            id="currentPage"
            name="currentPage"
            type="number"
            step={1}
            min={0}
            max={pageCount || undefined}
            value={currentPage}
            onChange={(event) =>
              changeProgress({ pageCount, currentPage: event.target.value })
            }
          />
        </div>
      </div>
      <SegmentedControl
        label="Status"
        name="status"
        options={bookStatuses.map((bookStatus) => ({
          value: bookStatus,
          label: bookStatusLabels[bookStatus],
        }))}
        value={status}
        onValueChange={setStatus}
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

/** The form's shape while a chosen book's details load, so the dialog doesn't jump when the form arrives. */
function BookFormSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-4">
      <span className="sr-only">Loading book details…</span>
      <div className="flex gap-4">
        <Skeleton className="aspect-[2/3] w-20 shrink-0" />
        <FieldSkeleton className="flex-1" />
      </div>
      <FieldSkeleton />
      <FieldSkeleton />
      <FieldSkeleton />
      <div className="flex gap-4">
        <FieldSkeleton className="flex-1" />
        <FieldSkeleton className="flex-1" />
      </div>
      <FieldSkeleton />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-12" />
        <Skeleton className="h-6 w-32" />
      </div>
      <DialogFooter>
        <Skeleton className="h-8 w-18" />
        <Skeleton className="h-8 w-14" />
      </DialogFooter>
    </div>
  )
}

/** A label and an input, at the sizes of the real ones. */
function FieldSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Skeleton className="h-3.5 w-16" />
      <Skeleton className="h-8 w-full" />
    </div>
  )
}

export { BookForm, BookFormSkeleton }
