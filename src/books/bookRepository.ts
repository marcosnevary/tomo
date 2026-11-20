import type { Book, NewBook } from "@/books/book"
import type { Tables } from "@/lib/database.types"
import { supabase } from "@/lib/supabase"

function toBook(row: Tables<"books">): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    year: row.year,
    pageCount: row.page_count,
    coverUrl: row.cover_url ?? undefined,
  }
}

export async function listBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select()
    .order("created_at")
  if (error) throw error
  return data.map(toBook)
}

export async function addBook(newBook: NewBook): Promise<void> {
  const { error } = await supabase.from("books").insert({
    title: newBook.title,
    author: newBook.author,
    year: newBook.year,
    page_count: newBook.pageCount,
    cover_url: newBook.coverUrl ?? null,
  })
  if (error) throw error
}
