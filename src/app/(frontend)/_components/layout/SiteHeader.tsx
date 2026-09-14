'use client';

import { signOut, useSession } from 'next-auth/react';
import { SignOutNavIcon } from '@/components/layout/app-nav';
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
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {authenticated ? (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              aria-label="Sign out"
              title="Sign out"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border-[3px] border-border bg-surface text-ink shadow-chunky-sm transition hover:bg-surface-2"
            >
              <SignOutNavIcon className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      </Container>
    </header>
  );
}
