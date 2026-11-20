import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addBook, listBooks } from "@/books/bookRepository"

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
