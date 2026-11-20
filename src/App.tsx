import { useState } from "react"
import { AddBookDialog } from "@/books/AddBookDialog"
import type { Book } from "@/books/book"
import { BookList } from "@/books/BookList"

function App() {
  const [books, setBooks] = useState<Book[]>([])

  function addBook(book: Book) {
    setBooks((previousBooks) => [...previousBooks, book])
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My books</h1>
        <AddBookDialog onAdd={addBook} />
      </header>
      <BookList books={books} />
    </main>
  )
}

export default App
