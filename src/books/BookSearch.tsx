import { useState, type FormEvent } from "react"
import { useBookSearch } from "@/books/bookQueries"
import type { BookSearchResult } from "@/books/searchBooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type BookSearchProps = {
  onSelect: (result: BookSearchResult) => void
}

function BookSearch({ onSelect }: BookSearchProps) {
  const [title, setTitle] = useState("")
  const search = useBookSearch(title)

  // onSubmit instead of a form action: an action resets the form when it finishes,
  // and the search term should stay visible next to its results.
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setTitle(String(new FormData(event.currentTarget).get("query")).trim())
  }

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={submit} className="flex flex-col gap-2">
        <Label htmlFor="query">Search by title</Label>
        <div className="flex gap-2">
          <Input id="query" name="query" type="search" required />
          <Button
            type="submit"
            variant="secondary"
            disabled={search.isFetching}
          >
            Search
          </Button>
        </div>
      </form>
      {search.isFetching && <p className="text-muted-foreground">Searching…</p>}
      {search.isError && (
        <p className="text-destructive">Search failed. Try again.</p>
      )}
      {search.isSuccess && search.data.length === 0 && (
        <p className="text-muted-foreground">No results.</p>
      )}
      {search.isSuccess && search.data.length > 0 && (
        <ul className="flex max-h-56 flex-col overflow-y-auto rounded-lg border">
          {search.data.map((result) => (
            <li key={result.key}>
              <button
                type="button"
                onClick={() => onSelect(result)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
              >
                <div className="aspect-[2/3] w-8 shrink-0 overflow-hidden rounded-sm bg-muted">
                  {result.coverUrl && (
                    <img
                      src={result.coverUrl}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium">{result.title}</p>
                  <p className="truncate text-muted-foreground">
                    {[result.author, result.year].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { BookSearch }
