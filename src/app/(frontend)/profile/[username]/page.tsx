import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ListCard } from '@/components/features/lists/ListCard';
import { PlaceCard } from '@/components/features/places/PlaceCard';
import { ReviewCard } from '@/components/features/places/ReviewCard';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Stamp } from '@/components/ui/Stamp';
import { getPerson, lists, people, places, reviews } from '@/data/mock';

type Props = PageProps<'/profile/[username]'>;

const tasteEmoji: Record<string, string> = {
  Cafés: '☕',
  Mountains: '🏔️',
  Beaches: '🌊',
  Nightlife: '🌃',
  Food: '🍜',
  'Street food': '🍜',
  'Night walks': '🌃',
  Breweries: '🍻',
  'Live music': '🎵',
  Islands: '🏝️',
  Hikes: '🥾',
  'Hidden spots': '🔎',
  Markets: '🛍',
  Sunsets: '🌅',
};

export function generateStaticParams() {
  return people.map((person) => ({ username: person.username }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const person = getPerson(username);
  if (!person) return { title: 'Traveler not found (yet)' };
  return { title: `@${person.username}` };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const person = getPerson(username);
  if (!person) notFound();

  const authoredReviews = reviews.filter((r) => r.author.username === person.username);
  const authoredLists = lists.filter((l) => l.author.username === person.username);
  const favorites = places.slice(0, 4);

  return (
    <Container className="space-y-10 py-8 sm:py-10">
      <section className="grid gap-6 rounded-[2rem] border-[3px] border-border bg-surface p-6 shadow-chunky-lg sm:p-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
        <Avatar src={person.avatar} alt={`@${person.username}`} size="xl" />
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-4xl font-black uppercase tracking-tight">
              @{person.username}
            </h1>
            <Stamp>Certified wanderer</Stamp>
          </div>
          <p className="mt-2 max-w-xl text-lg text-muted">{person.bio}</p>
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Opinions" value={person.placesReviewed} />
            <Stat label="Stamps" value={person.countriesVisited} />
            <Stat label="Fans" value={person.followers} />
            <Stat label="Following" value={person.following} />
          </dl>
        </div>
        <Button variant="lime" size="sm" className="justify-self-start lg:justify-self-end">
          Follow their chaos
        </Button>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card padded={false} className="overflow-hidden">
          <div
            className="relative flex min-h-[280px] items-center justify-center bg-[radial-gradient(circle_at_40%_40%,#7047ff33,transparent_40%),radial-gradient(circle_at_70%_60%,#ff6b6b33,transparent_35%),#efe6d6] p-6"
            role="img"
            aria-label="Travel map of places visited"
          >
            <div className="text-center">
              <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-purple">
                Passport flex
              </p>
              <p className="mt-2 font-display text-3xl font-black uppercase">
                {person.countriesVisited} countries stamped
              </p>
              <p className="mt-2 text-sm text-muted">And counting. Probably.</p>
            </div>
            {favorites.slice(0, 3).map((place, i) => (
              <span
                key={place.id}
                className="absolute h-12 w-12 overflow-hidden rounded-full border-[3px] border-border shadow-chunky-sm"
                style={{ top: `${30 + i * 18}%`, left: `${20 + i * 22}%` }}
              >
                <Image src={place.image} alt="" fill className="object-cover" sizes="48px" />
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-xl font-extrabold uppercase">Taste profile</h2>
          <p className="mt-1 text-sm text-muted">What they chase. What they overpack for.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(person.taste ?? []).map((taste) => (
              <Badge key={taste} tone="sun">
                {tasteEmoji[taste] ?? '✦'} {taste}
              </Badge>
            ))}
          </div>
        </Card>
      </section>

      <section>
        <SectionHeader
          title="Places they'd defend in an argument"
          description="Favorites. Biases. Hills they're willing to die on."
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {favorites.map((place, i) => (
            <PlaceCard key={place.id} place={place} tilt={i % 2 === 0 ? 'left' : 'right'} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Filed opinions" description="The public record of their taste." />
        {authoredReviews.length ? (
          <div className="mx-auto grid max-w-3xl gap-5">
            {authoredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <Card className="text-center">
            <p className="font-display text-xl font-extrabold uppercase">
              Nobody&apos;s spilled the tea yet.
            </p>
            <p className="mt-2 text-muted">This traveler is still warming up the keyboard.</p>
          </Card>
        )}
      </section>

      <section>
        <SectionHeader title="Lists they cooked up" />
        {authoredLists.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {authoredLists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        ) : (
          <Card className="text-center">
            <p className="font-display text-xl font-extrabold uppercase">
              Lists are still on the packing list.
            </p>
            <p className="mt-2 text-muted">Give them a minute. Ranking is a lifestyle.</p>
          </Card>
        )}
      </section>
    </Container>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border-[2.5px] border-border bg-surface-2 px-3 py-2">
      <dt className="font-display text-[10px] font-bold uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="font-display text-xl font-black">{value.toLocaleString()}</dd>
    </div>
  );
}
