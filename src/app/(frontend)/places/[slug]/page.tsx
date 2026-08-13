import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PlaceHero } from '@/components/features/places/PlaceHero';
import { ReviewCard } from '@/components/features/places/ReviewCard';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getPlace, getReviewsForPlace, places } from '@/data/mock';

type Props = PageProps<'/places/[slug]'>;

export function generateStaticParams() {
  return places.map((place) => ({ slug: place.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) return { title: 'This place ghosted us' };
  return {
    title: place.name,
    description: `The internet's unfiltered take on ${place.name} in ${place.city}.`,
  };
}

const filters = ['Top', 'Recent', 'Funny', 'Helpful', 'Critical', 'Photos'] as const;

export default async function PlacePage({ params }: Props) {
  const { slug } = await params;
  const place = getPlace(slug);
  if (!place) notFound();

  const placeReviews = getReviewsForPlace(place.slug);

  return (
    <Container className="space-y-10 py-8 sm:py-10">
      <PlaceHero place={place} />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <section>
          <SectionHeader
            title="What people actually think"
            description="Not star averages. Actual humans with feelings and camera rolls."
          />

          <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Review filters">
            {filters.map((filter, i) => (
              <button
                key={filter}
                type="button"
                className={`rounded-full border-[2.5px] border-border px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wide ${
                  i === 0 ? 'bg-lime shadow-chunky-sm' : 'bg-surface hover:bg-surface-2'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {placeReviews.length === 0 ? (
            <EmptyState
              title="Nobody's spilled the tea yet."
              description="Be the brave first person to say the quiet part out loud."
            />
          ) : (
            <div className="space-y-5">
              {placeReviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} tilt={i % 2 === 0 ? 'left' : 'right'} />
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="space-y-4">
            <h2 className="font-display text-xl font-extrabold uppercase">The practical bits</h2>
            <p className="text-sm text-muted">
              Useful info for after you&apos;ve already decided you&apos;re going.
            </p>
            <dl className="space-y-3 text-sm">
              <InfoRow label="Where even is it" value={`${place.city}, ${place.country}`} />
              {place.bestTime ? (
                <InfoRow label="Best time to roll up" value={place.bestTime} />
              ) : null}
              {place.priceRange ? <InfoRow label="Wallet damage" value={place.priceRange} /> : null}
              {place.hours ? <InfoRow label="When it's alive" value={place.hours} /> : null}
              {place.website ? (
                <div>
                  <dt className="font-display text-xs font-bold uppercase text-muted">
                    Official site
                  </dt>
                  <dd>
                    <a
                      href={place.website}
                      className="font-medium underline decoration-[3px] underline-offset-2"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Peek behind the curtain
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
            {place.categories?.length ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {place.categories.map((cat) => (
                  <Badge key={cat} tone="tangerine">
                    {cat}
                  </Badge>
                ))}
              </div>
            ) : null}
          </Card>

          <Card className="overflow-hidden !p-0">
            <div
              className="flex aspect-square flex-col items-center justify-center gap-2 bg-sky/40 p-4 text-center font-display font-black uppercase"
              role="img"
              aria-label={`Map preview for ${place.name}`}
            >
              <span className="text-3xl" aria-hidden>
                🗺
              </span>
              <span className="text-lg">Map tease</span>
              <span className="max-w-[12rem] text-xs font-sans font-medium normal-case tracking-normal text-muted">
                Full map coming. For now, vibe with the imaginary pin.
              </span>
            </div>
          </Card>
        </aside>
      </div>
    </Container>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-display text-xs font-bold uppercase text-muted">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
