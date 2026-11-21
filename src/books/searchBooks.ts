import { searchAppleBooks } from "@/books/appleBooks"
import type { Book } from "@/books/book"
import { searchOpenLibrary } from "@/books/openLibrary"

export type BookSearchResult = Partial<Omit<Book, "id">> & {
  /** Apple Books results still lack the year and page count, which `addOpenLibraryDetails` fills in. */
  source: "appleBooks" | "openLibrary"
  key: string
  title: string
  /** Every name the source lists for the book; Apple Books mixes translators in with the authors. */
  contributors: string[]
}

/**
 * Apple Books editions, so the results come in the language of the search. Open Library only
 * answers when Apple Books has nothing, since it always returns the original title.
 */
export async function searchBooks(title: string): Promise<BookSearchResult[]> {
  const appleBooks = await searchAppleBooks(title).catch(
    (): BookSearchResult[] => [],
  )
  return appleBooks.length > 0 ? appleBooks : searchOpenLibrary(title)
}

/**
 * Takes the author, year and page count from the Open Library work behind an Apple Books edition.
 * Open Library finds a work from a translated title, and the work is the one sharing a surname
 * with the edition's contributors, which also tells the author apart from the translators.
 */
export async function addOpenLibraryDetails(
  result: BookSearchResult,
): Promise<BookSearchResult> {
  const works = await searchOpenLibrary(withoutEditionNote(result.title))
  const surnames = result.contributors.map(surname)
  for (const work of works) {
    const author = work.contributors.find((name) =>
      surnames.includes(surname(name)),
    )
    if (author) {
      return {
        ...result,
        author,
        year: work.year,
        pageCount: work.pageCount,
      }
    }
  }
  return result
}

/** "Torto Arado (Prémio LeYa 2018)" → "Torto Arado": Open Library doesn't know store edition notes. */
function withoutEditionNote(title: string) {
  return title.replace(/\s*\([^)]*\)\s*$/, "")
}

/** The last word without accents or case, so "J.K. Rowling" and "J. K. Rowling" match. */
function surname(name: string) {
  return (
    name
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .match(/[\p{L}\p{N}]+/gu)
      ?.at(-1) ?? ""
  )
}
