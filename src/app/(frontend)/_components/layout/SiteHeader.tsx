'use client';

import { useSession } from 'next-auth/react';
import { Logo } from '@/components/layout/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Container } from '@/components/ui/Container';

export function SiteHeader() {
  const { status } = useSession();
  const authenticated = status === 'authenticated';

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-border bg-paper/90 backdrop-blur-md lg:hidden">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo href={authenticated ? '/home' : '/'} />
        <ThemeToggle />
      </Container>
    </header>
  );
}
