'use client';

import { useAuthGate } from '@/components/auth/AuthGate';
import { Logo } from '@/components/layout/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

const previewNav = ['Discover', 'Places', 'Communities', 'Lists'] as const;

export function LandingHeader() {
  const { openAuth } = useAuthGate();

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-border bg-paper/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <div className="flex items-center gap-6 lg:gap-10">
          <Logo href="/" />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Preview">
            {previewNav.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => openAuth('signup')}
                className="rounded-xl px-3 py-2 font-display text-sm font-bold uppercase tracking-wide transition hover:bg-surface-2"
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => openAuth('signin')}
          >
            Sign in
          </Button>
          <Button type="button" variant="lime" size="sm" onClick={() => openAuth('signup')}>
            Create account
          </Button>
        </div>
      </Container>
    </header>
  );
}
