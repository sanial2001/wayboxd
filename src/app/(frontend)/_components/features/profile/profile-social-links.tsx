function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

type SocialKind = 'instagram' | 'x' | 'youtube' | 'link';

function kindFromUrl(url: string, forced?: SocialKind): SocialKind {
  if (forced) {
    return forced;
  }
  const host = hostFromUrl(url);
  if (host === 'instagram.com') {
    return 'instagram';
  }
  if (host === 'x.com' || host === 'twitter.com') {
    return 'x';
  }
  if (host === 'youtube.com' || host === 'youtu.be' || host === 'm.youtube.com') {
    return 'youtube';
  }
  return 'link';
}

function labelForKind(kind: SocialKind): string {
  if (kind === 'instagram') {
    return 'Instagram';
  }
  if (kind === 'x') {
    return 'X';
  }
  if (kind === 'youtube') {
    return 'YouTube';
  }
  return 'Website';
}

function SocialIcon({ kind }: { kind: SocialKind }) {
  if (kind === 'instagram') {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </svg>
    );
  }

  if (kind === 'x') {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M3.4 3.5h4.3l4.1 5.8 4.7-5.8h3.9l-6.7 8.2 7 8.8h-4.4l-4.5-6.3-5.2 6.3H3.4l7.1-8.6L3.4 3.5Z" />
      </svg>
    );
  }

  if (kind === 'youtube') {
    return (
      <svg aria-hidden viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
        <path d="M23.5 7.2a3.2 3.2 0 0 0-2.2-2.3C19.3 4.4 12 4.4 12 4.4s-7.3 0-9.3.5A3.2 3.2 0 0 0 .5 7.2 33 33 0 0 0 0 12a33 33 0 0 0 .5 4.8 3.2 3.2 0 0 0 2.2 2.3c2 .5 9.3.5 9.3.5s7.3 0 9.3-.5a3.2 3.2 0 0 0 2.2-2.3A33 33 0 0 0 24 12a33 33 0 0 0-.5-4.8ZM9.8 15.5v-7l6.2 3.5-6.2 3.5Z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.5.4l1.9-1.9a5 5 0 0 0-7.1-7.1L11 5.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.4L4.6 12.5a5 5 0 0 0 7.1 7.1L13 18.3" />
    </svg>
  );
}

export function ProfileSocialLinks({
  instagramProfileUrl,
  xProfileUrl,
  otherProfileUrl,
}: {
  instagramProfileUrl: string | null;
  xProfileUrl: string | null;
  otherProfileUrl: string | null;
}) {
  const links = [
    instagramProfileUrl
      ? { href: instagramProfileUrl, kind: kindFromUrl(instagramProfileUrl, 'instagram') }
      : null,
    xProfileUrl ? { href: xProfileUrl, kind: kindFromUrl(xProfileUrl, 'x') } : null,
    otherProfileUrl ? { href: otherProfileUrl, kind: kindFromUrl(otherProfileUrl) } : null,
  ].filter((link): link is { href: string; kind: SocialKind } => link !== null);

  if (links.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labelForKind(link.kind)}
            title={labelForKind(link.kind)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border-[2.5px] border-border bg-paper text-ink shadow-chunky-sm transition hover:-translate-y-0.5 hover:bg-lime"
          >
            <SocialIcon kind={link.kind} />
          </a>
        </li>
      ))}
    </ul>
  );
}
