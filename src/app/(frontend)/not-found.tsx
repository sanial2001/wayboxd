import { EmptyState } from '@/components/ui/EmptyState';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Container className="py-20">
      <EmptyState
        title="This place isn't on the map yet."
        description="Either it wandered off, the URL got adventurous, or you just invented a destination. Respect."
      />
      <div className="mt-6 flex justify-center">
        <Button href="/" variant="lime">
          Take me somewhere real
        </Button>
      </div>
    </Container>
  );
}
