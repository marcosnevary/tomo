import { Star, StarHalf } from "lucide-react"
import { maxRating } from "@/books/book"

const starSizes = {
  sm: "size-3.5",
  lg: "size-6",
}

type RatingStarsProps = {
  rating: number
  size?: keyof typeof starSizes
}

function RatingStars({ rating, size = "sm" }: RatingStarsProps) {
  const stars = Array.from({ length: maxRating }, (_, index) => index + 1)

  return (
    <p
      role="img"
      aria-label={`Rated ${rating} out of ${maxRating}`}
      className="flex gap-0.5"
    >
      {stars.map((star) => (
        // The empty outline is always drawn; a full or half star is laid over it.
        <span key={star} className={`relative ${starSizes[size]}`}>
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
