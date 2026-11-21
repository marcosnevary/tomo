import {
  queryOptions,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import {
  addBook,
  deleteBook,
  listBooks,
  updateBook,
} from "@/books/bookRepository"
import {
  addOpenLibraryDetails,
  searchBooks,
  type BookSearchResult,
} from "@/books/searchBooks"

const booksQueryKey = ["books"]

export function useBooks() {
  return useQuery({ queryKey: booksQueryKey, queryFn: listBooks })
}

/** Every change to a book refetches the list, so the posters show what the database now holds. */
function useBooksMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<void>,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: booksQueryKey }),
  })
}

export function useAddBook() {
  return useBooksMutation(addBook)
}

export function useUpdateBook() {
  return useBooksMutation(updateBook)
}

export function useDeleteBook() {
  return useBooksMutation(deleteBook)
}

export function useBookSearch(title: string) {
  return useQuery({
    queryKey: ["bookSearch", title],
    queryFn: () => searchBooks(title),
    enabled: title !== "",
    // Search results barely change; refetching on every window focus would only repeat the request.
    staleTime: Infinity,
  })
}

function bookDetailsOptions(result: BookSearchResult | undefined) {
  return queryOptions({
    queryKey: ["bookDetails", result?.key],
    queryFn:
      result?.source === "appleBooks"
        ? () => addOpenLibraryDetails(result)
        : skipToken,
    staleTime: Infinity,
  })
}

/** The Open Library details of a chosen Apple Books result; other results are already complete. */
export function useBookDetails(result: BookSearchResult | undefined) {
  return useQuery(bookDetailsOptions(result))
}

/** Fetches the same details imperatively, so an event handler can react to the outcome; it shares the cache and the in-flight request with `useBookDetails`. */
export function useFetchBookDetails() {
  const queryClient = useQueryClient()
  return (result: BookSearchResult) =>
    queryClient.fetchQuery(bookDetailsOptions(result))
}
