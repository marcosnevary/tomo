import {
  bookStatusLabels,
  readingProgress,
  type Book,
  type BookStatus,
} from "@/books/book"
import { EditBookDialog } from "@/books/EditBookDialog"
import { Badge } from "@/components/ui/badge"

type BookPosterProps = {
  book: Book
}

const statusBadgeColors: Record<BookStatus, string> = {
  unread: "bg-secondary text-secondary-foreground",
  reading: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  read: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
}

/** The cover opens the edit dialog; the status line below it is not clickable. */
function BookPoster({ book }: BookPosterProps) {
  const progress = readingProgress(book)

  return (
    <article className="flex flex-col gap-2">
      <EditBookDialog book={book} />
      <div className="flex items-center justify-between gap-2">
        <Badge className={statusBadgeColors[book.status]}>
          {bookStatusLabels[book.status]}
        </Badge>
        {progress !== undefined && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {progress}%
          </span>
        )}
      </div>
    </article>
  )
}

export { BookPoster }
