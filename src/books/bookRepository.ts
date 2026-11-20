import type { Book, NewBook } from "@/books/book"
import type { Tables, TablesInsert } from "@/lib/database.types"
import { supabase } from "@/lib/supabase"

function toBook(row: Tables<"books">): Book {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    year: row.year ?? undefined,
    pageCount: row.page_count ?? undefined,
    coverUrl: row.cover_url ?? undefined,
    rating: row.rating ?? undefined,
    status: row.status,
  }
}

function toRow(book: NewBook): TablesInsert<"books"> {
  return {
    title: book.title,
    author: book.author,
    year: book.year ?? null,
    page_count: book.pageCount ?? null,
    cover_url: book.coverUrl ?? null,
    rating: book.rating ?? null,
    status: book.status,
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
  const { error } = await supabase.from("books").insert(toRow(newBook))
  if (error) throw error
}

export async function updateBook(book: Book): Promise<void> {
  const { error, count } = await supabase
    .from("books")
    .update(toRow(book), { count: "exact" })
    .eq("id", book.id)
  if (error) throw error
  // Row Level Security hides rows instead of rejecting the request, so an update
  // the reader may not make "succeeds" while changing nothing.
  if (count === 0) throw new Error(`Book ${book.id} was not updated`)
}

export async function deleteBook(id: string): Promise<void> {
  const { error, count } = await supabase
    .from("books")
    .delete({ count: "exact" })
    .eq("id", id)
  if (error) throw error
  // Same as updateBook: a delete blocked by Row Level Security removes nothing without failing.
  if (count === 0) throw new Error(`Book ${id} was not deleted`)
}
