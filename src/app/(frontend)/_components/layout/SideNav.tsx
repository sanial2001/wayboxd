'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import {
  HomeNavIcon,
  isAppNavItemActive,
  ProfileNavIcon,
  SignOutNavIcon,
} from '@/components/layout/app-nav';
import { Logo } from '@/components/layout/Logo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function SideNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const username = session?.userDetails?.username;
  const profileHref = username ? `/profile/${username}` : '/settings/profile';
  const homeActive = isAppNavItemActive('home', pathname);
  const profileActive = isAppNavItemActive('profile', pathname);

  return (
    <aside className="sticky top-0 hidden h-dvh w-[72px] shrink-0 flex-col items-center border-r border-border/80 bg-paper py-6 lg:flex">
      <Logo href="/home" showWordmark={false} className="mb-8" />

      <nav aria-label="App" className="flex flex-1 flex-col items-center">
        <ul className="flex flex-col items-center gap-5">
          <li>
            <Link
              href="/home"
              aria-label="Home"
              title="Home"
              aria-current={homeActive ? 'page' : undefined}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-ink transition hover:bg-surface-2"
            >
              <HomeNavIcon className="h-7 w-7" filled={homeActive} />
            </Link>
          </li>
          <li>
            <Link
              href={profileHref}
              aria-label="Profile"
              title="Profile"
              aria-current={profileActive ? 'page' : undefined}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-ink transition hover:bg-surface-2"
            >
              <ProfileNavIcon className="h-7 w-7" filled={profileActive} />
            </Link>
          </li>
        </ul>

        <div className="mt-auto flex flex-col items-center gap-4">
          <ThemeToggle className="border-transparent bg-transparent p-2 shadow-none hover:translate-y-0 hover:bg-surface-2" />
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            aria-label="Sign out"
            title="Sign out"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-muted transition hover:bg-surface-2 hover:text-ink"
          >
            <SignOutNavIcon className="h-6 w-6" />
          </button>
        </div>
      </nav>
    </aside>
  );
}
