/** `undefined` and `null` both mean no place. A present value must be a positive integer. */
export function readOptionalPlaceId(value: unknown): {
  error: string | null;
  placeId: number | null;
} {
  if (value === undefined || value === null) {
    return { error: null, placeId: null };
  }
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
    return { error: 'placeId must be a positive integer', placeId: null };
  }
  return { error: null, placeId: value };
}
