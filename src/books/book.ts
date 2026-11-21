import { Constants, type Enums } from "@/lib/database.types"

export type BookStatus = Enums<"book_status">

export const bookStatuses = Constants.public.Enums.book_status

export const bookStatusLabels: Record<BookStatus, string> = {
  unread: "Unread",
  reading: "Reading",
  read: "Read",
}

export const maxRating = 5

/** Ratings go from half a star to 5 stars in half-star steps; the database enforces the same rule. */
export const ratings = Array.from(
  { length: maxRating * 2 },
  (_, index) => (index + 1) / 2,
)

export type Book = {
  id: string
  title: string
  author: string
  year?: number
  pageCount?: number
  /** From 0 to `pageCount`; undefined means progress isn't tracked. */
  currentPage?: number
  coverUrl?: string
  /** Undefined means "not rated". */
  rating?: number
  status: BookStatus
}

export type NewBook = Omit<Book, "id">

type ReadingProgress = Pick<Book, "currentPage" | "pageCount">

/** The status a current page implies, or undefined when there is no current page to go by. */
export function statusForCurrentPage({
  currentPage,
  pageCount,
}: ReadingProgress): BookStatus | undefined {
  if (currentPage === undefined) return undefined
  if (currentPage === 0) return "unread"
  if (currentPage === pageCount) return "read"
  return "reading"
}
