'use client';

import { useEffect, useId, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | 'hero';

type AvatarProps = {
  src?: string | null;
  alt: string;
  size?: AvatarSize;
  href?: string;
  preview?: boolean;
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

export function Avatar({ src, alt, size = 'md', href, preview = false, className }: AvatarProps) {
  const [previewOpen, setPreviewOpen] = useState(false);

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

  if (preview) {
    return (
      <>
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          aria-label={`View ${alt}'s photo`}
          className="inline-block shrink-0 cursor-pointer rounded-full"
        >
          {content}
        </button>
        <AvatarPreview
          src={src}
          alt={alt}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      </>
    );
  }

  return content;
}

function AvatarPreview({
  src,
  alt,
  open,
  onClose,
}: {
  src?: string | null;
  alt: string;
  open: boolean;
  onClose: () => void;
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/80 p-6">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer"
        aria-label="Close photo"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="pointer-events-none relative z-10"
      >
        <h2 id={titleId} className="sr-only">
          {alt}
        </h2>
        <div className="relative h-[min(28rem,calc(100vw-3rem))] w-[min(28rem,calc(100vw-3rem))] overflow-hidden rounded-full border-[4px] border-paper/20 bg-surface-2 shadow-chunky-lg">
          {src ? (
            <Image src={src} alt={alt} fill className="object-cover" sizes="448px" priority />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-display text-7xl font-black uppercase text-ink">
              {initialsFromAlt(alt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
