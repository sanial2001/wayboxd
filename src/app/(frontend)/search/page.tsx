import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchExperience } from '@/components/features/search/SearchExperience';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Search',
};

export default function SearchPage() {
  return (
    <Container className="py-8 sm:py-10">
      <Suspense
        fallback={
          <p className="font-display text-lg font-bold uppercase">Warming up the search radar…</p>
        }
      >
        <SearchExperience />
      </Suspense>
    </Container>
  );
}
