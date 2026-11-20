import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addBook,
  deleteBook,
  listBooks,
  updateBook,
} from "@/books/bookRepository"
import { searchBooks } from "@/books/openLibrary"

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
