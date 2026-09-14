import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero';

type AvatarProps = {
  src?: string | null;
  alt: string;
  size?: AvatarSize;
  href?: string;
  className?: string;
};

const sizes: Record<AvatarSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-11 w-11',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
  hero: 'h-28 w-28 sm:h-32 sm:w-32',
};

const imageSizes: Record<AvatarSize, string> = {
  sm: '32px',
  md: '44px',
  lg: '64px',
  xl: '96px',
  hero: '128px',
};

function initialsFromAlt(alt: string): string {
  const cleaned = alt.replace(/^@/, '').trim();
  if (!cleaned) {
    return '?';
  }
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}

export function Avatar({ src, alt, size = 'md', href, className }: AvatarProps) {
  const content = (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-[3px] border-border bg-surface-2 shadow-chunky-sm',
        sizes[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={imageSizes[size]}
          {...(size === 'hero' ? { priority: true } : {})}
        />
      ) : (
        <span
          className="font-display text-sm font-black uppercase text-ink sm:text-base"
          aria-hidden
        >
          {initialsFromAlt(alt)}
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block shrink-0" aria-label={alt}>
        {content}
      </Link>
    );
  }

  return content;
}
