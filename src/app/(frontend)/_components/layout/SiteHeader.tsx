'use client';

import { signOut, useSession } from 'next-auth/react';
import { Logo } from '@/components/layout/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export function SiteHeader() {
  const { status } = useSession();
  const authenticated = status === 'authenticated';

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-border bg-paper/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <Logo href={authenticated ? '/home' : '/'} />

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {authenticated ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Sign out
            </Button>
          ) : status === 'loading' ? (
            <span className="font-display text-xs font-bold uppercase text-muted">…</span>
          ) : (
            <Button href="/?auth=signin" variant="secondary" size="sm">
              Sign in
            </Button>
          )}
        </div>
      </Container>
    </header>
  );
}
