import type { Metadata } from 'next';
import { ReviewComposer } from '@/components/features/reviews/ReviewComposer';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Spill a take',
};

export default function NewReviewPage() {
  return (
    <Container className="py-8 sm:py-10">
      <ReviewComposer />
    </Container>
  );
}
