'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

const items = [
  { href: '/home', label: 'Home', icon: '🏠' },
  { href: '/discover', label: 'Find', icon: '✨' },
  { href: '/review/new', label: 'Spill', icon: '+', prominent: true },
  { href: '/map', label: 'Map', icon: '🗺' },
  { href: '/profile/kelvin', label: 'You', icon: '☺' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-border bg-paper/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      aria-label="Mobile"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 gap-1 py-2">
        {items.map((item) => {
          const active =
            item.href === '/home'
              ? pathname === '/home'
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          if (item.prominent) {
            return (
              <li key={item.href} className="flex justify-center">
                <Link
                  href={item.href}
                  className="flex -mt-5 h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-border bg-lime font-display text-2xl font-black shadow-chunky"
                  aria-label={item.label}
                >
                  {item.icon}
                </Link>
              </li>
            );
          }

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 font-display text-[10px] font-bold uppercase tracking-wide',
                  active ? 'text-purple' : 'text-muted'
                )}
              >
                <span className="text-lg" aria-hidden>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
