import { XIcon } from "lucide-react"
import { useState, type ReactNode } from "react"
import { ratings } from "@/books/book"
import { RatingStars } from "@/books/RatingStars"

type StarRatingInputProps = {
  name: string
  defaultValue?: number
}

const focusRing =
  "rounded-md has-focus-visible:ring-3 has-focus-visible:ring-ring/50"

/**
 * Each rating is a native radio button, hidden behind the stars. The checked one is
 * submitted under `name` like any other field, and arrow keys move between ratings.
 */
function StarRatingInput({ name, defaultValue }: StarRatingInputProps) {
  const [rating, setRating] = useState(defaultValue)
  const [hoveredRating, setHoveredRating] = useState<number>()
  const shownRating = hoveredRating ?? rating

  function option(
    value: number | undefined,
    content: ReactNode,
    className: string,
  ) {
    return (
      <label
        key={value ?? "none"}
        className={`cursor-pointer ${className}`}
        onMouseEnter={() => setHoveredRating(value)}
        onMouseLeave={() => setHoveredRating(undefined)}
      >
        <input
          type="radio"
          name={name}
          value={value ?? ""}
          checked={rating === value}
          onChange={() => setRating(value)}
          className="sr-only"
        />
        {content}
      </label>
    )
  }

  return (
    <fieldset>
      <legend className="mb-2 text-sm leading-none font-medium">Rating</legend>
      <div className="flex items-center gap-3">
        <div className={`relative ${focusRing}`}>
          <div aria-hidden>
            <RatingStars rating={shownRating ?? 0} size="lg" />
          </div>
          {/* One clickable half per half star, laid over the stars. */}
          <div className="absolute inset-0 grid grid-cols-10">
            {ratings.map((value) =>
              option(
                value,
                <span className="sr-only">{formatRating(value)}</span>,
                "",
              ),
            )}
          </div>
        </div>
        {option(
          undefined,
          <>
            <XIcon aria-hidden className="size-4" />
            <span className="sr-only">Clear rating</span>
          </>,
          `ml-auto p-1 text-muted-foreground hover:text-foreground ${focusRing}`,
        )}
      </div>
    </fieldset>
  )
}

function formatRating(rating: number) {
  return rating === 1 ? "1 star" : `${rating} stars`
}

export { StarRatingInput }
