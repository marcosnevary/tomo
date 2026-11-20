import type { Book } from "@/books/book"
import { useDeleteBook } from "@/books/bookQueries"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type DeleteBookButtonProps = {
  book: Book
  onDeleted: () => void
}

function DeleteBookButton({ book, onDeleted }: DeleteBookButtonProps) {
  const deleteBook = useDeleteBook()

  return (
    <AlertDialog onOpenChange={(open) => open && deleteBook.reset()}>
      <AlertDialogTrigger
        render={
          <Button type="button" variant="destructive" className="sm:mr-auto" />
        }
      >
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{book.title}”?</AlertDialogTitle>
          <AlertDialogDescription>
            The book is removed from your list. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteBook.isError && (
          <p className="text-sm text-destructive">
            Could not delete the book. Please try again.
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteBook.isPending}
            onClick={() => deleteBook.mutate(book.id, { onSuccess: onDeleted })}
          >
            {deleteBook.isPending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteBookButton }
