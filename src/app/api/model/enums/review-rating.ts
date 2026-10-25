export const MIN_RATING = 1;
export const MAX_RATING = 5;

export function isValidReviewRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= MIN_RATING && rating <= MAX_RATING;
}
