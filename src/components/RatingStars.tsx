import { FC } from 'react'

export const RatingStars: FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating)
  const half = rating - fullStars >= 0.5
  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {Array.from({ length: fullStars }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.939 1.468 8.25L12 18.896l-7.404 4.599 1.468-8.25L0 9.306l8.332-1.151z" />
        </svg>
      ))}
      {half && (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.939 1.468 8.25L12 18.896V.587z" />
        </svg>
      )}
    </div>
  )
}
