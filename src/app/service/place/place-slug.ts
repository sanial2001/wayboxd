import prisma from '@/app/service/_lib/prisma';

const MAX_SLUG_LENGTH = 120;

/**
 * Builds a URL slug base from place name and city, e.g. "Johnson's Cafe" + "Manali" → "johnsons-cafe-manali".
 */
export function buildPlaceSlugBase(name: string, city: string): string {
  const namePart = slugifySegment(name);
  const cityPart = slugifySegment(city);
  const combined = [namePart, cityPart].filter((part) => part.length > 0).join('-');
  return truncateSlug(combined || 'place');
}

/**
 * Returns a slug that is unique in `places`, appending -2, -3, … when the base is taken.
 */
export async function generateUniquePlaceSlug(name: string, city: string): Promise<string> {
  const base = buildPlaceSlugBase(name, city);
  const existing = await prisma.place.findUnique({
    where: { slug: base },
    select: { id: true },
  });
  if (!existing) {
    return base;
  }

  let suffix = 2;
  while (suffix < 10_000) {
    const candidate = truncateSlug(`${base}-${suffix}`);
    const taken = await prisma.place.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!taken) {
      return candidate;
    }
    suffix += 1;
  }

  return truncateSlug(`${base}-${Date.now()}`);
}

function slugifySegment(value: string): string {
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  return normalized
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function truncateSlug(slug: string): string {
  if (slug.length <= MAX_SLUG_LENGTH) {
    return slug;
  }
  const trimmed = slug.slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, '');
  return trimmed.length > 0 ? trimmed : 'place';
}
