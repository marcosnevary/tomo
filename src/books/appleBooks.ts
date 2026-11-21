import type { BookSearchResult } from "@/books/searchBooks"

type AppleBooksResult = {
  trackId: number
  trackName: string
  artistName: string
  artworkUrl100?: string
}

type AppleBooksSearchResponse = {
  results: AppleBooksResult[]
}

const SEARCH_URL = "https://itunes.apple.com/search"

/** Searches Apple Books ebooks; each result is the edition whose title matches the search, in any language. */
export async function searchAppleBooks(
  title: string,
): Promise<BookSearchResult[]> {
  const params = new URLSearchParams({
    term: title,
    media: "ebook",
    // A store, not a language: the Brazilian store sells editions in Portuguese, English, Spanish and more.
    country: "br",
    limit: "20",
  })
  const response = await fetch(`${SEARCH_URL}?${params}`)
  if (!response.ok) {
    throw new Error(`Apple Books search failed: ${response.status}`)
  }
  const data: AppleBooksSearchResponse = await response.json()
  return data.results.map(toBookSearchResult)
}

function toBookSearchResult(result: AppleBooksResult): BookSearchResult {
  // Apple joins authors and translators in one string, in no fixed order.
  const contributors = result.artistName.split(/, | & /)
  return {
    source: "appleBooks",
    key: String(result.trackId),
    title: result.trackName,
    author: contributors[0],
    contributors,
    coverUrl:
      result.artworkUrl100 === undefined
        ? undefined
        : largeArtworkUrl(result.artworkUrl100),
  }
}

/**
 * The API only lists small artwork, but the last path segment sets the size the image server
 * renders: `bb` fits the image inside the box, keeping the cover's aspect ratio.
 */
function largeArtworkUrl(artworkUrl: string) {
  return artworkUrl.replace(/\/[^/]+$/, "/600x900bb.jpg")
}
