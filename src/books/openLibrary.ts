import type { BookSearchResult } from "@/books/searchBooks"

type OpenLibraryDoc = {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  number_of_pages_median?: number
  cover_i?: number
}

type OpenLibrarySearchResponse = {
  docs: OpenLibraryDoc[]
}

const SEARCH_URL = "https://openlibrary.org/search.json"
const SEARCH_FIELDS = [
  "key",
  "title",
  "author_name",
  "first_publish_year",
  "number_of_pages_median",
  "cover_i",
]

export async function searchOpenLibrary(
  title: string,
): Promise<BookSearchResult[]> {
  const params = new URLSearchParams({
    // `q` instead of `title`: it also matches translated edition titles and returns their work.
    q: title,
    fields: SEARCH_FIELDS.join(","),
    limit: "10",
  })
  const response = await fetch(`${SEARCH_URL}?${params}`)
  if (!response.ok) {
    throw new Error(`Open Library search failed: ${response.status}`)
  }
  const data: OpenLibrarySearchResponse = await response.json()
  return data.docs.map(toBookSearchResult)
}

function toBookSearchResult(doc: OpenLibraryDoc): BookSearchResult {
  return {
    source: "openLibrary",
    key: doc.key,
    title: doc.title,
    author: doc.author_name?.[0],
    contributors: doc.author_name ?? [],
    year: doc.first_publish_year,
    pageCount: doc.number_of_pages_median,
    coverUrl:
      doc.cover_i === undefined
        ? undefined
        : `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`,
  }
}
