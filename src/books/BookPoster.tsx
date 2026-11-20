import { cn } from "cn"
import type { Book } from "@/books/book"

type BookPosterProps = {
  book: Book
}

function BookPoster({ book }: BookPosterProps) {
  const hasCover = Boolean(book.coverUrl)

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
        <p className="text-xs opacity-70">
          {book.year} · {book.pageCount} pages
        </p>
      </div>
    </article>
  )
}

export { BookPoster }
