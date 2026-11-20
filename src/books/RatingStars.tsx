import { Star, StarHalf } from "lucide-react"
import { maxRating } from "@/books/book"

type RatingStarsProps = {
  rating: number
}

function RatingStars({ rating }: RatingStarsProps) {
  const stars = Array.from({ length: maxRating }, (_, index) => index + 1)

  return (
    <p
      role="img"
      aria-label={`Rated ${rating} out of ${maxRating}`}
      className="flex gap-0.5"
    >
      {stars.map((star) => (
        // The empty outline is always drawn; a full or half star is laid over it.
        <span key={star} className="relative size-3.5">
          <Star className="absolute inset-0 size-full opacity-40" />
          {rating >= star ? (
            <Star className="absolute inset-0 size-full fill-current" />
          ) : rating >= star - 0.5 ? (
            <StarHalf className="absolute inset-0 size-full fill-current" />
          ) : null}
        </span>
      ))}
    </p>
  )
}

export { RatingStars }
