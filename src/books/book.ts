export type Book = {
  id: string
  title: string
  author: string
  year: number
  pageCount: number
}

export type NewBook = Omit<Book, "id">
