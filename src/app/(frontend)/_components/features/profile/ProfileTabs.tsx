import Link from 'next/link';
import { cn } from '@/lib/cn';

export type ProfileSection = 'trips' | 'reviews';

type ProfileTabsProps = {
  username: string;
  section: ProfileSection;
};

const tabs: { section: ProfileSection; label: string; href: (username: string) => string }[] = [
  {
    section: 'trips',
    label: 'Trips',
    href: (username) => `/profile/${username}`,
  },
  {
    section: 'reviews',
    label: 'Reviews',
    href: (username) => `/profile/${username}/reviews`,
  },
];

export function ProfileTabs({ username, section }: ProfileTabsProps) {
  return (
    <nav aria-label="Profile sections" className="grid grid-cols-2 border-b-[3px] border-border">
      {tabs.map((tab) => {
        const active = tab.section === section;
        return (
          <Link
            key={tab.section}
            href={tab.href(username)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              '-mb-[3px] border-b-[3px] py-3 text-center font-display text-sm font-bold uppercase tracking-[0.16em]',
              active ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
