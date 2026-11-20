import type { Book } from "@/books/book"
import { EditBookDialog } from "@/books/EditBookDialog"

type BookListProps = {
  books: Book[]
}

function BookList({ books }: BookListProps) {
  if (books.length === 0) {
    return <p className="text-sm text-muted-foreground">No books added yet.</p>
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {books.map((book) => (
        <li key={book.id}>
          <EditBookDialog book={book} />
        </li>
      ))}
    </ul>
  )
}

export { BookList }
