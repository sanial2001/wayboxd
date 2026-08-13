import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PlaceCard } from '@/components/features/places/PlaceCard';
import { Avatar } from '@/components/ui/Avatar';
import { Container } from '@/components/ui/Container';
import { EmptyState } from '@/components/ui/EmptyState';
import { getList, lists } from '@/data/mock';

type Props = PageProps<'/lists/[slug]'>;

export function generateStaticParams() {
  return lists.map((list) => ({ slug: list.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const list = getList(slug);
  if (!list) return { title: 'This list went on holiday' };
  return { title: list.title };
}

export default async function ListDetailPage({ params }: Props) {
  const { slug } = await params;
  const list = getList(slug);
  if (!list) notFound();

  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <section className="overflow-hidden rounded-[2rem] border-[3px] border-border shadow-chunky-lg">
        <div className="relative aspect-[21/9] min-h-[220px]">
          <Image
            src={list.coverImage}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
            <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-lime">
              {list.placeCount} places in the plot
            </p>
            <h1 className="mt-2 max-w-4xl font-display text-3xl font-black uppercase leading-tight sm:text-5xl">
              {list.title}
            </h1>
            <p className="mt-3 max-w-2xl text-white/90">{list.description}</p>
            <div className="mt-4 flex items-center gap-2">
              <Avatar src={list.author.avatar} alt={`@${list.author.username}`} size="sm" />
              <span className="font-display text-xs font-bold uppercase">
                schemed by @{list.author.username}
              </span>
            </div>
          </div>
        </div>
      </section>

      {list.places?.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.places.map((place, i) => (
            <PlaceCard key={place.id} place={place} tilt={i % 2 === 0 ? 'left' : false} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="This list is still stretching."
          description="Places show up once the curator stops rearranging the ranking for the twelfth time."
        />
      )}
    </Container>
  );
}
