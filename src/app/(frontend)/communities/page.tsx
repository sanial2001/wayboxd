import type { Metadata } from 'next';
import { CommunityCard } from '@/components/features/communities/CommunityCard';
import { Container } from '@/components/ui/Container';
import { communities } from '@/data/mock';

export const metadata: Metadata = {
  title: 'Communities',
};

export default function CommunitiesPage() {
  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
          Find your travel chaos crew
        </h1>
        <p className="mt-3 text-muted">
          Clubs for people who overpack opinions and underpack patience for boring itineraries.
        </p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {communities.map((community, i) => (
          <CommunityCard
            key={community.id}
            community={community}
            tilt={i % 2 === 0 ? 'left' : 'right'}
          />
        ))}
      </div>
    </Container>
  );
}
