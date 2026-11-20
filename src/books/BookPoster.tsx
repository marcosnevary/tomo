import { cn } from "cn"
import { bookStatusLabels, type Book } from "@/books/book"
import { RatingStars } from "@/books/RatingStars"
import { Badge } from "@/components/ui/badge"

type BookPosterProps = {
  book: Book
}

function BookPoster({ book }: BookPosterProps) {
  const hasCover = Boolean(book.coverUrl)
  const details = [
    book.year,
    book.pageCount === undefined ? undefined : `${book.pageCount} pages`,
  ].filter((detail) => detail !== undefined)

  return (
    // tabIndex makes the poster focusable, so keyboard and touch users (who
    // have no hover) can reveal the details too.
    <article
      tabIndex={0}
      className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-muted shadow-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {hasCover && (
        <img
          src={book.coverUrl}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105 group-focus:scale-105"
        />
      )}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end gap-1 p-3",
          hasCover &&
            "bg-black/70 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100",
        )}
      >
        <h2 className="leading-tight font-semibold">{book.title}</h2>
        <p className="text-sm opacity-80">{book.author}</p>
        {details.length > 0 && (
          <p className="text-xs opacity-70">{details.join(" · ")}</p>
        )}
        {book.rating !== undefined && <RatingStars rating={book.rating} />}
      </div>
      <Badge variant="secondary" className="absolute top-2 left-2 shadow-sm">
        {bookStatusLabels[book.status]}
      </Badge>
    </article>
  )
}

export { BookPoster }
