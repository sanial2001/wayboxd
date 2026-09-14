export type AppNavItemId = 'home' | 'profile';

/** Outline when idle, solid fill when that destination is active. Reuse this for future nav icons. */
export type AppNavIconProps = {
  className?: string;
  filled?: boolean;
};

export function isAppNavItemActive(id: AppNavItemId, pathname: string, username?: string): boolean {
  if (id === 'home') {
    return pathname === '/home';
  }

  if (pathname === '/settings/profile' || pathname.startsWith('/settings/profile/')) {
    return true;
  }

  if (!username) {
    return false;
  }

  const ownProfilePath = `/profile/${username}`;
  return pathname === ownProfilePath || pathname.startsWith(`${ownProfilePath}/`);
}

export function HomeNavIcon({ className, filled = false }: AppNavIconProps) {
  if (filled) {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M12 3.1 2.8 11.2a1 1 0 0 0-.3.7V20a1.5 1.5 0 0 0 1.5 1.5h5.2V15h6.6v6.5h5.2A1.5 1.5 0 0 0 22.5 20v-8.1a1 1 0 0 0-.3-.7L12 3.1Z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10.5V20h13V10.5" />
    </svg>
  );
}

export function ProfileNavIcon({ className, filled = false }: AppNavIconProps) {
  if (filled) {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className={className} fill="currentColor">
        <circle cx="12" cy="8" r="4" />
        <path d="M4.2 21c.6-4.2 3.6-7 7.8-7s7.2 2.8 7.8 7H4.2Z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20.2c.8-3.8 3.4-6 7-6s6.2 2.2 7 6" />
    </svg>
  );
}

export function SignOutNavIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10" />
      <path d="M10 12h9" />
      <path d="M16 8.5 19.5 12 16 15.5" />
    </svg>
  );
}
