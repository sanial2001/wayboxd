'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { HomeNavIcon, isAppNavItemActive, ProfileNavIcon } from '@/components/layout/app-nav';
import { cn } from '@/lib/cn';

export function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const username = session?.userDetails?.username;
  const profileHref = username ? `/profile/${username}` : '/settings/profile';

  const items = [
    { id: 'home' as const, href: '/home', label: 'Home', icon: HomeNavIcon },
    { id: 'profile' as const, href: profileHref, label: 'You', icon: ProfileNavIcon },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-border bg-paper/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      aria-label="Mobile"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-2 gap-1 py-2">
        {items.map((item) => {
          const active = isAppNavItemActive(item.id, pathname, username);
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 font-display text-[10px] font-bold uppercase tracking-wide',
                  active ? 'text-ink' : 'text-muted'
                )}
              >
                <Icon className="h-6 w-6" filled={active} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
