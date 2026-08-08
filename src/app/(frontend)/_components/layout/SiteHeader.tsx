'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';
import { people } from '@/data/mock';

const navItems = [
  { href: '/discover', label: 'Discover' },
  { href: '/places', label: 'Places' },
  { href: '/communities', label: 'Communities' },
  { href: '/lists', label: 'Lists' },
  { href: '/map', label: 'Map' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const me = people.find((p) => p.username === 'kelvin')!;

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-border bg-paper/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <div className="flex items-center gap-6 lg:gap-10">
          <Logo href="/home" />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-xl px-3 py-2 font-display text-sm font-bold uppercase tracking-wide transition hover:bg-surface-2',
                    active && 'bg-lime shadow-chunky-sm'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Button href="/search" variant="secondary" size="sm" className="hidden sm:inline-flex">
            Hunt
          </Button>
          <Button href="/review/new" variant="lime" size="sm" className="hidden md:inline-flex">
            Spill a take
          </Button>
          <button
            type="button"
            className="relative hidden rounded-2xl border-[3px] border-border bg-surface p-2.5 shadow-chunky-sm sm:inline-flex"
            aria-label="Notifications — someone probably liked your chaos"
          >
            <span aria-hidden>🔔</span>
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-border bg-coral" />
          </button>
          <Avatar
            src={me.avatar}
            alt={`@${me.username}`}
            href={`/profile/${me.username}`}
            size="sm"
            className="hidden sm:inline-block"
          />
        </div>
      </Container>
    </header>
  );
}
