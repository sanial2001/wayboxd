'use client';

import { useEffect, useId } from 'react';
import Image from 'next/image';
import { TripModel } from '@/app/api/model/response/trip-model';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import {
  formatTripBadge,
  formatTripMonthYear,
  hostnameFromUrl,
  isRemoteHttpUrl,
} from '@/lib/trip-display';

type TripViewAuthor = {
  displayName: string;
  avatarUrl: string | null;
};

type TripViewModalProps = {
  trip: TripModel | null;
  author: TripViewAuthor;
  onClose: () => void;
  onEdit?: () => void;
};

export function TripViewModal({ trip, author, onClose, onEdit }: TripViewModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!trip) {
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
  }, [trip, onClose]);

  if (!trip) {
    return null;
  }

  const badge = formatTripBadge(trip.tag, trip.duration);
  const dateLabel = formatTripMonthYear(trip.tripDate);
  const host = hostnameFromUrl(trip.outboundUrl);
  const coverSrc = trip.coverImageUrl?.trim() || null;
  const byline = [`Trip by ${author.displayName}${host ? ` for ${host}` : ''}`, dateLabel]
    .filter((part) => part.length > 0)
    .join(' · ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75 p-3 sm:p-5">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close trip"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex h-[min(56rem,calc(100dvh-1.5rem))] w-full max-w-4xl flex-col overflow-hidden rounded-[1.75rem] border-[3px] border-border bg-surface shadow-chunky-lg sm:h-[min(56rem,calc(100dvh-2.5rem))] sm:rounded-[2rem]"
      >
        <div className="absolute right-3 top-3 z-20 flex items-center gap-2 sm:right-4 sm:top-4">
          {onEdit ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-full"
              onClick={onEdit}
            >
              Edit
            </Button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-2xl leading-none text-ink/70 hover:bg-surface-2 hover:text-ink"
          >
            <span aria-hidden>×</span>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-6 pt-6 sm:px-10 sm:pb-8 sm:pt-8">
          <header className={cn('flex items-start gap-4', onEdit ? 'pr-32 sm:pr-36' : 'pr-12')}>
            <Avatar
              src={author.avatarUrl}
              alt={author.displayName}
              size="lg"
              preview
              className="shadow-none"
            />
            <div className="min-w-0 pt-0.5">
              <h2
                id={titleId}
                className="font-display text-2xl font-black leading-tight tracking-tight sm:text-4xl"
              >
                {trip.title}
              </h2>
              {byline ? <p className="mt-2 text-sm text-muted sm:text-base">{byline}</p> : null}
            </div>
          </header>

          <div className="relative mt-6 min-h-[14rem] w-full flex-1 overflow-hidden rounded-2xl bg-surface-2 sm:mt-8 sm:min-h-[18rem] sm:rounded-[1.5rem]">
            {coverSrc ? (
              isRemoteHttpUrl(coverSrc) ? (
                <Image
                  src={coverSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 896px) 100vw, 896px"
                  priority
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverSrc} alt="" className="h-full w-full object-cover" />
              )
            ) : null}
          </div>

          {trip.blurb?.trim() ? (
            <p className="mt-6 max-w-3xl whitespace-pre-wrap text-base leading-relaxed text-ink/90 sm:mt-8 sm:text-lg">
              {trip.blurb}
            </p>
          ) : null}

          {badge ? (
            <p className="mt-4 text-sm text-muted">
              <span className="font-medium text-ink">Tag: </span>
              {badge}
            </p>
          ) : null}

          {trip.outboundUrl ? (
            <a
              href={trip.outboundUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full shrink-0 items-center justify-center gap-3 rounded-2xl border-[3px] border-border bg-purple px-5 py-4 font-display text-sm font-bold uppercase tracking-wide text-white shadow-chunky transition hover:-translate-y-0.5 sm:mt-8 sm:text-base"
            >
              Full story on {host}
              <ExternalLinkIcon />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 3.5H3.5A1.5 1.5 0 0 0 2 5v7.5A1.5 1.5 0 0 0 3.5 14H11a1.5 1.5 0 0 0 1.5-1.5V9" />
      <path d="M9 2.5h4.5V7" />
      <path d="M7.5 8.5 13.5 2.5" />
    </svg>
  );
}
