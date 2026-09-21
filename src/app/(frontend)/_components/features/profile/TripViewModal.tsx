'use client';

import { useEffect, useId, useState } from 'react';
import Image from 'next/image';
import { clientLogger } from '@/app/_lib/client-logger';
import { deleteTripClient } from '@/app/api/client/trip-service-client';
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
  onDeleted?: (trip: TripModel) => void;
};

export function TripViewModal({ trip, author, onClose, onEdit, onDeleted }: TripViewModalProps) {
  const titleId = useId();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trip) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || pending) {
        return;
      }
      if (confirmOpen) {
        setConfirmOpen(false);
        setError(null);
        return;
      }
      onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [trip, onClose, pending, confirmOpen]);

  if (!trip) {
    return null;
  }

  const selectedTrip = trip;
  const badge = formatTripBadge(selectedTrip.tag, selectedTrip.duration);
  const dateLabel = formatTripMonthYear(selectedTrip.tripDate);
  const host = hostnameFromUrl(selectedTrip.outboundUrl);
  const coverSrc = selectedTrip.coverImageUrl?.trim() || null;
  const byline = [`Trip by ${author.displayName}${host ? ` for ${host}` : ''}`, dateLabel]
    .filter((part) => part.length > 0)
    .join(' · ');
  const ownerActionCount = Number(Boolean(onEdit)) + Number(Boolean(onDeleted));
  const headerPadClass =
    ownerActionCount === 2 ? 'pr-36' : ownerActionCount === 1 ? 'pr-24' : 'pr-12';

  async function confirmDelete() {
    setError(null);
    setPending(true);
    try {
      const response = await deleteTripClient(selectedTrip.id);
      if (response.error || !response.data || response.status >= 400) {
        setError(response.error ?? 'Could not delete this trip.');
        return;
      }
      onDeleted?.(response.data);
    } catch (deleteError) {
      clientLogger.error({ err: deleteError }, 'Trip delete failed');
      setError('Could not delete this trip. Try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75 p-3 sm:p-5">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close trip"
        disabled={pending}
        onClick={() => {
          if (!confirmOpen) {
            onClose();
          }
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex h-[min(56rem,calc(100dvh-1.5rem))] w-full max-w-4xl flex-col overflow-hidden rounded-[1.75rem] border-[3px] border-border bg-surface shadow-chunky-lg sm:h-[min(56rem,calc(100dvh-2.5rem))] sm:rounded-[2rem]"
      >
        <div className="absolute right-3 top-3 z-20 flex items-center gap-1 sm:right-4 sm:top-4">
          {onDeleted ? (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setConfirmOpen(true);
              }}
              disabled={pending}
              aria-label="Delete trip"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink/70 hover:bg-surface-2 hover:text-ink disabled:opacity-50"
            >
              <TrashIcon />
            </button>
          ) : null}
          {onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              disabled={pending}
              aria-label="Edit trip"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink/70 hover:bg-surface-2 hover:text-ink disabled:opacity-50"
            >
              <PencilIcon />
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              if (!confirmOpen) {
                onClose();
              }
            }}
            disabled={pending}
            aria-label="Close"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-2xl leading-none text-ink/70 hover:bg-surface-2 hover:text-ink disabled:opacity-50"
          >
            <span aria-hidden>×</span>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-6 pt-6 sm:px-10 sm:pb-8 sm:pt-8">
          <header className={cn('flex items-start gap-4', headerPadClass)}>
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
                {selectedTrip.title}
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

          {selectedTrip.blurb?.trim() ? (
            <p className="mt-6 max-w-3xl whitespace-pre-wrap text-base leading-relaxed text-ink/90 sm:mt-8 sm:text-lg">
              {selectedTrip.blurb}
            </p>
          ) : null}

          {badge ? (
            <p className="mt-4 text-sm text-muted">
              <span className="font-medium text-ink">Tag: </span>
              {badge}
            </p>
          ) : null}

          {selectedTrip.outboundUrl ? (
            <a
              href={selectedTrip.outboundUrl}
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

      {confirmOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-4">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Keep trip"
            disabled={pending}
            onClick={() => {
              setConfirmOpen(false);
              setError(null);
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${titleId}-delete`}
            className="relative z-10 w-full max-w-md rounded-[1.75rem] border-[3px] border-border bg-surface p-5 shadow-chunky-lg sm:p-6"
          >
            <h3
              id={`${titleId}-delete`}
              className="font-display text-2xl font-black tracking-tight"
            >
              Delete this trip?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              It will come off your profile. This cannot be undone from here.
            </p>
            {error ? (
              <p
                className="mt-3 rounded-xl border-[2.5px] border-border bg-sun/50 px-3 py-2 text-sm font-medium text-ink"
                role="status"
              >
                {error}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setConfirmOpen(false);
                  setError(null);
                }}
                disabled={pending}
              >
                Keep trip
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => void confirmDelete()}
                disabled={pending}
              >
                {pending ? 'Deleting…' : 'Delete trip'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
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
