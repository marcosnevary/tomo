import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addBook, listBooks, updateBook } from "@/books/bookRepository"
import { searchBooks } from "@/books/openLibrary"

const booksQueryKey = ["books"]

export function useBooks() {
  return useQuery({ queryKey: booksQueryKey, queryFn: listBooks })
}

export function useAddBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addBook,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: booksQueryKey }),
  })
}

export function useUpdateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateBook,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: booksQueryKey }),
  })
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
