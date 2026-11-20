export type Book = {
  id: string
  title: string
  author: string
  year: number
  pageCount: number
  coverUrl?: string
}

export type NewBook = Omit<Book, "id">
