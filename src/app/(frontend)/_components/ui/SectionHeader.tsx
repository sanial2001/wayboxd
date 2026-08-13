import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
  children?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between',
        className
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-2 font-display text-xs font-bold uppercase tracking-[0.18em] text-purple">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {description ? <p className="mt-2 text-muted">{description}</p> : null}
        {children}
      </div>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="shrink-0 font-display text-sm font-bold uppercase tracking-wide underline decoration-[3px] underline-offset-4 hover:text-purple"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
