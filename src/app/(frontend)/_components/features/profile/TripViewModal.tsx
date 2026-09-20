'use client';

import { useEffect, useId } from 'react';
import Image from 'next/image';
import { TripModel } from '@/app/api/model/response/trip-model';
import { Button } from '@/components/ui/Button';
import {
  formatTripBadge,
  formatTripMonthYear,
  hostnameFromUrl,
  isRemoteHttpUrl,
} from '@/lib/trip-display';

type TripViewModalProps = {
  trip: TripModel | null;
  onClose: () => void;
};

export function TripViewModal({ trip, onClose }: TripViewModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/70 p-4 sm:p-8">
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
        className="relative z-10 my-4 w-full max-w-5xl rounded-[2rem] border-[3px] border-border bg-surface shadow-chunky-lg"
      >
        <div className="flex items-start justify-between gap-4 px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
          <div>
            <p className="font-display text-[11px] font-bold uppercase tracking-widest text-muted">
              Trip
            </p>
            <h2 id={titleId} className="mt-1 font-display text-3xl font-black tracking-tight">
              {trip.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-border bg-surface-2 text-ink"
          >
            <span aria-hidden className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>

        <div className="grid gap-6 px-5 py-4 lg:grid-cols-2 lg:items-stretch sm:px-6">
          <div className="order-2 space-y-4 lg:order-1">
            {dateLabel ? <p className="text-sm text-muted">{dateLabel}</p> : null}
            {badge ? (
              <p className="inline-flex rounded-full bg-ink/90 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wide text-paper">
                {badge}
              </p>
            ) : null}
            {trip.blurb?.trim() ? (
              <p className="whitespace-pre-wrap text-base leading-relaxed">{trip.blurb}</p>
            ) : null}
            {trip.outboundUrl ? (
              <a
                href={trip.outboundUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-border bg-lime px-4 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-ink shadow-chunky transition hover:-translate-y-0.5"
              >
                Open {host}
              </a>
            ) : null}
          </div>

          <div className="order-1 relative min-h-[16rem] overflow-hidden rounded-[1.5rem] border-[3px] border-border bg-surface-2 lg:order-2 lg:min-h-full">
            {coverSrc ? (
              isRemoteHttpUrl(coverSrc) ? (
                <Image
                  src={coverSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverSrc} alt="" className="h-full w-full object-cover" />
              )
            ) : null}
          </div>
        </div>

        <div className="flex justify-end border-t-[3px] border-border px-5 py-4 sm:px-6">
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
