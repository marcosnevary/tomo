import type { Book } from "@/books/book"

type BookListProps = {
  books: Book[]
}

function BookList({ books }: BookListProps) {
  if (books.length === 0) {
    return <p className="text-sm text-muted-foreground">No books added yet.</p>
  }

  return (
    <ul className="divide-y rounded-lg border">
      {books.map((book) => (
        <li key={book.id} className="px-4 py-3">
          <p className="font-medium">{book.title}</p>
          <p className="text-sm text-muted-foreground">
            {book.author} · {book.year} · {book.pageCount} pages
          </p>
        </li>
      ))}
    </ul>
  )
}

export { BookList }
