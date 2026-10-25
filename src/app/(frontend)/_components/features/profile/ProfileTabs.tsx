import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ProfileSection = 'trips' | 'reviews';

type ProfileTabsProps = {
  username: string;
  section: ProfileSection;
};

const tabs: {
  section: ProfileSection;
  label: string;
  href: (username: string) => string;
  icon: () => ReactNode;
}[] = [
  {
    section: 'trips',
    label: 'Trips',
    href: (username) => `/profile/${username}`,
    icon: TripsTabIcon,
  },
  {
    section: 'reviews',
    label: 'Reviews',
    href: (username) => `/profile/${username}/reviews`,
    icon: ReviewsTabIcon,
  },
];

export function ProfileTabs({ username, section }: ProfileTabsProps) {
  return (
    <nav aria-label="Profile sections" className="mt-4 border-t border-border/30">
      <div className="grid grid-cols-2">
        {tabs.map((tab) => {
          const active = tab.section === section;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.section}
              href={tab.href(username)}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex h-14 items-center justify-center',
                active ? 'text-ink' : 'text-muted hover:text-ink'
              )}
            >
              <Icon />
              {active ? (
                <span className="absolute bottom-0 h-[2px] w-8 bg-ink" aria-hidden />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function TripsTabIcon() {
  const offsets = [2, 9.5, 17];
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      {offsets.flatMap((x) =>
        offsets.map((y) => <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" rx="1" />)
      )}
    </svg>
  );
}

function ReviewsTabIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M5 7h14" />
      <path d="M5 12h14" />
      <path d="M5 17h9" />
    </svg>
  );
}
