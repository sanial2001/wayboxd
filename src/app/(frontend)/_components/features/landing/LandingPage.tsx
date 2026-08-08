import Image from 'next/image';
import { PlaceCard } from '@/components/features/places/PlaceCard';
import { ReviewCard } from '@/components/features/places/ReviewCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Stamp } from '@/components/ui/Stamp';
import { places, reviews } from '@/data/mock';

const pillars = [
  {
    stamp: 'Places',
    title: 'The object',
    body: 'A café. A coastline. A loud brewery. Places are what we gather around — not flights, not deals, not checklists.',
    tone: 'bg-lime',
  },
  {
    stamp: 'People',
    title: 'The perspective',
    body: "Follow travelers whose taste you trust. Skip the influencers. Collect the friends you haven't met yet.",
    tone: 'bg-sky',
  },
  {
    stamp: 'Opinions',
    title: 'The content',
    body: 'Reviews that read like group-chat essays. Ratings optional. Personality mandatory.',
    tone: 'bg-pink',
  },
] as const;

const notThis = [
  'Not a booking portal',
  'Not an itinerary factory',
  'Not Google Maps with vibes',
  'Not Tripadvisor in nicer fonts',
];

export function LandingPage() {
  const sampleReviews = reviews.slice(0, 2);
  const samplePlaces = places.slice(0, 3);

  return (
    <div className="overflow-x-hidden">
      <section className="relative border-b-[3px] border-border">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=2000&h=1200&fit=crop"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/75 to-ink/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20" />
        </div>

        <Container className="relative flex min-h-[88vh] flex-col justify-end py-14 sm:py-20">
          <div className="absolute right-4 top-8 hidden sm:block md:right-8">
            <Stamp className="border-lime text-lime">Unofficial personality</Stamp>
          </div>
          <div className="absolute left-4 top-24 hidden rotate-[-8deg] md:block">
            <Stamp className="border-white text-white">Not a booking site</Stamp>
          </div>

          <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-lime">
            WayBoxd · Letterboxd for places
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-black uppercase leading-[0.92] tracking-tight text-white text-balance sm:text-7xl lg:text-8xl">
            Go somewhere.
            <br />
            <span className="text-lime">Have an opinion.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/85 sm:text-xl">
            A social scrapbook for places — built by people who actually went, felt something, and
            refuse to leave a polite three-star review.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/home" variant="lime" size="lg">
              Enter the scrapbook
            </Button>
            <Button href="/places" variant="secondary" size="lg" className="!bg-white/95">
              Peek at places
            </Button>
          </div>
        </Container>
      </section>

      <Container className="space-y-20 py-16 sm:space-y-24 sm:py-24">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-purple">
              What even is this
            </p>
            <h2 className="mt-3 font-display text-4xl font-black uppercase leading-tight tracking-tight text-balance sm:text-5xl">
              Places are better when you know what people{' '}
              <span className="highlighter">actually</span> think.
            </h2>
            <p className="mt-5 max-w-xl text-lg text-muted">
              WayBoxd is where travelers dump their honest takes — the crowded sunsets, the
              aggressively loud bars, the tiny ramen shops that somehow own your memory for weeks.
            </p>
            <p className="mt-4 max-w-xl text-muted">
              Discover places. Follow taste. Steal lists. Argue in the comments. Then go write your
              own official opinion.
            </p>
          </div>
          <Card className="relative space-y-4 bg-purple text-white motion-safe:rotate-1">
            <Stamp className="absolute -right-2 -top-3 border-lime text-lime">Core loop</Stamp>
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-lime">
              Place → People → Opinions
            </p>
            <ol className="space-y-4 font-display text-2xl font-black uppercase leading-tight sm:text-3xl">
              <li>1. Find a place</li>
              <li>2. Read the humans</li>
              <li>3. Trust someone&apos;s taste</li>
              <li>4. Spill your own take</li>
            </ol>
          </Card>
        </section>

        <section>
          <div className="mb-8 max-w-2xl">
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-purple">
              The three ingredients
            </p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
              Not utility. Culture.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {pillars.map((pillar, i) => (
              <Card
                key={pillar.title}
                tilt={i === 1 ? 'right' : i === 2 ? 'left' : false}
                className="space-y-3"
              >
                <span
                  className={`inline-flex rounded-full border-[2.5px] border-border px-3 py-1 font-display text-xs font-bold uppercase ${pillar.tone}`}
                >
                  {pillar.stamp}
                </span>
                <h3 className="font-display text-2xl font-extrabold uppercase">{pillar.title}</h3>
                <p className="text-muted">{pillar.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border-[3px] border-border bg-surface p-6 shadow-chunky-lg sm:p-10">
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-coral">
            Explicitly not
          </p>
          <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
            If you wanted a booking site, you&apos;d already be on one.
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {notThis.map((item) => (
              <li
                key={item}
                className="rounded-2xl border-[2.5px] border-border bg-surface-2 px-4 py-3 font-display text-sm font-bold uppercase"
              >
                ✕ {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-muted">
            We&apos;re building a culture around places — like Letterboxd, but your
            &ldquo;films&rdquo; are cities, cafés, coastlines, and nights you still talk about.
          </p>
        </section>

        <section>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-purple">
                A taste of the feed
              </p>
              <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
                People have opinions.
              </h2>
              <p className="mt-2 text-muted">
                This is what it looks like when reviews behave like social posts, not directory
                rows.
              </p>
            </div>
            <Button href="/home" variant="secondary" size="sm">
              Open the full feed
            </Button>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {sampleReviews.map((review, i) => (
              <ReviewCard key={review.id} review={review} tilt={i % 2 === 0 ? 'left' : 'right'} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-8 max-w-2xl">
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-purple">
              Places people can&apos;t shut up about
            </p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
              The scrapbook starts here
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {samplePlaces.map((place, i) => (
              <PlaceCard
                key={place.id}
                place={place}
                featured={i === 0}
                tilt={i === 1 ? 'right' : i === 2 ? 'left' : false}
              />
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2rem] border-[3px] border-border bg-purple p-8 text-white shadow-chunky-lg sm:p-14">
          <div className="absolute -right-4 top-8 hidden sm:block">
            <Stamp className="border-lime text-lime">Your move</Stamp>
          </div>
          <div className="absolute -left-2 bottom-10 hidden rotate-[-10deg] md:block">
            <Stamp className="border-sun text-sun">Go on then</Stamp>
          </div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-lime">
            Final boss copy
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Go somewhere.
            <br />
            Have an opinion.
          </h2>
          <p className="mt-5 max-w-xl text-lg text-white/85">
            Found a place worth talking about? The scrapbook is waiting. Loud takes preferred.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/home" variant="lime" size="lg">
              Enter WayBoxd
            </Button>
            <Button href="/review/new" variant="secondary" size="lg" className="!bg-white/95">
              Spill a take →
            </Button>
          </div>
        </section>
      </Container>

      <footer className="border-t-[3px] border-border py-8">
        <Container className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-sm font-bold uppercase tracking-wide">
            WayBoxd · Real places. Loud opinions.
          </p>
          <p className="text-sm text-muted">Built like a travel scrapbook. Not a spreadsheet.</p>
        </Container>
      </footer>
    </div>
  );
}
