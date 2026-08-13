import type { Metadata } from 'next';
import { ListCard } from '@/components/features/lists/ListCard';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { lists } from '@/data/mock';

export const metadata: Metadata = {
  title: 'Lists',
};

export default function ListsPage() {
  return (
    <Container className="space-y-8 py-8 sm:py-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Lists with attitude
          </h1>
          <p className="mt-3 text-muted">
            Ranked, curated, and just unhinged enough to trust. Steal them. Remix them. Start a
            rivalry.
          </p>
        </div>
        <Button variant="lime" size="sm">
          Start a list
        </Button>
      </header>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {lists.map((list, i) => (
          <ListCard key={list.id} list={list} tilt={i % 2 === 0 ? 'left' : 'right'} />
        ))}
      </div>
    </Container>
  );
}
