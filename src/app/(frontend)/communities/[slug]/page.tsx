import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ListCard } from '@/components/features/lists/ListCard';
import { PlaceCard } from '@/components/features/places/PlaceCard';
import { ReviewCard } from '@/components/features/places/ReviewCard';
import { PersonCard } from '@/components/features/people/PersonCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import {
  communities,
  formatMembers,
  getCommunity,
  lists,
  people,
  places,
  reviews,
} from '@/data/mock';

type Props = PageProps<'/communities/[slug]'>;

export function generateStaticParams() {
  return communities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const community = getCommunity(slug);
  if (!community) return { title: 'This club packed up' };
  return { title: community.name };
}

export default async function CommunityPage({ params }: Props) {
  const { slug } = await params;
  const community = getCommunity(slug);
  if (!community) notFound();

  return (
    <Container className="space-y-10 py-8 sm:py-10">
      <section className="overflow-hidden rounded-[2rem] border-[3px] border-border shadow-chunky-lg">
        <div className="relative aspect-[21/9] min-h-[240px]">
          <Image
            src={community.coverImage}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
            <Badge tone={community.accent}>
              {formatMembers(community.memberCount)} travelers arguing politely
            </Badge>
            <h1 className="mt-3 font-display text-4xl font-black uppercase sm:text-6xl">
              {community.name}
            </h1>
            <p className="mt-2 max-w-2xl text-white/90">{community.description}</p>
            <Button variant="lime" size="sm" className="mt-5">
              Join the club
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-10">
          <Card className="bg-sun/40">
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-ink">
              Tonight&apos;s prompt
            </p>
            <p className="mt-2 font-display text-2xl font-extrabold uppercase leading-tight">
              What place surprised you the most this year?
            </p>
            <Button variant="secondary" size="sm" className="mt-4">
              Drop your answer
            </Button>
          </Card>

          <section>
            <SectionHeader
              title="Takes going viral"
              description="The reviews currently circulating in the group chat."
            />
            <div className="space-y-4">
              {reviews.slice(0, 3).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeader
              title="Places the club won't shut up about"
              description="Peer pressure, but make it geographic."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {places.slice(0, 4).map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section>
            <SectionHeader title="Usual suspects" className="mb-4" />
            <div className="space-y-3">
              {people.slice(0, 3).map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          </section>
          <section>
            <SectionHeader title="Lists from the clubhouse" className="mb-4" />
            <div className="space-y-4">
              {lists.slice(0, 2).map((list) => (
                <ListCard key={list.id} list={list} />
              ))}
            </div>
          </section>
        </aside>
      </div>
    </Container>
  );
}
