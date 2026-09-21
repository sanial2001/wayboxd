'use client';

import { useEffect, useId, useState, type FormEvent } from 'react';
import { clientLogger } from '@/app/_lib/client-logger';
import { updateTripClient } from '@/app/api/client/trip-service-client';
import { UpdateTripBodyRequest } from '@/app/api/model/request/update-trip-request';
import { TripModel } from '@/app/api/model/response/trip-model';
import { Button } from '@/components/ui/Button';

type EditTripModalProps = {
  trip: TripModel;
  onClose: () => void;
  onUpdated: (trip: TripModel) => void;
};

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

const inputClassName =
  'w-full rounded-2xl border-[3px] border-border bg-surface px-4 py-3 font-sans text-base text-ink shadow-chunky-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/30';

export function EditTripModal({ trip, onClose, onUpdated }: EditTripModalProps) {
  const titleId = useId();
  const [title, setTitle] = useState(trip.title);
  const [blurb, setBlurb] = useState(trip.blurb ?? '');
  const [outboundUrl, setOutboundUrl] = useState(trip.outboundUrl);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !pending) {
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
  }, [pending, onClose]);

  function validate(): string | null {
    if (!title.trim()) {
      return 'Title is required.';
    }
    if (!outboundUrl.trim()) {
      return 'Outbound URL is required.';
    }
    if (!isHttpUrl(outboundUrl.trim())) {
      return 'Outbound URL must use http or https.';
    }
    return null;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload: UpdateTripBodyRequest = {
      title: title.trim(),
      blurb: emptyToNull(blurb),
      outboundUrl: outboundUrl.trim(),
    };

    setError(null);
    setPending(true);
    try {
      const response = await updateTripClient(trip.id, payload);
      if (response.error || !response.data || response.status >= 400) {
        setError(response.error ?? 'Could not update this trip.');
        return;
      }
      onUpdated(response.data);
    } catch (updateError) {
      clientLogger.error({ err: updateError }, 'Trip update failed');
      setError('Could not update this trip. Try again.');
    } finally {
      setPending(false);
    }
  }

  const coverSrc = trip.coverImageUrl?.trim() || null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/70 p-4 sm:p-8">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close edit trip"
        disabled={pending}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 my-4 w-full max-w-5xl rounded-[2rem] border-[3px] border-border bg-surface shadow-chunky-lg"
      >
        <form onSubmit={(event) => void onSubmit(event)}>
          <div className="flex items-start justify-between gap-4 px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
            <div>
              <h2 id={titleId} className="font-display text-3xl font-black tracking-tight">
                Edit trip
              </h2>
              <p className="mt-1 text-sm text-muted">
                Title, blurb, and link can change. Cover stays as filed.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              aria-label="Close"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-border bg-surface-2 text-ink disabled:opacity-50"
            >
              <span aria-hidden className="text-xl leading-none">
                ×
              </span>
            </button>
          </div>

          <div className="grid gap-6 px-5 py-4 lg:grid-cols-2 lg:items-stretch sm:px-6">
            <div className="order-2 space-y-4 lg:order-1">
              <label className="flex w-full flex-col gap-2">
                <FieldLabel label="Title" required />
                <input
                  name="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  disabled={pending}
                  maxLength={160}
                  className={inputClassName}
                />
              </label>

              <label className="flex w-full flex-col gap-2">
                <FieldLabel label="Blurb" />
                <textarea
                  name="blurb"
                  value={blurb}
                  onChange={(event) => setBlurb(event.target.value)}
                  disabled={pending}
                  maxLength={400}
                  rows={4}
                  className={inputClassName}
                />
              </label>

              <label className="flex w-full flex-col gap-2">
                <FieldLabel label="Outbound URL" required />
                <input
                  name="outboundUrl"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  value={outboundUrl}
                  onChange={(event) => setOutboundUrl(event.target.value)}
                  placeholder="https://notion.so/…"
                  disabled={pending}
                  className={inputClassName}
                />
              </label>
            </div>

            <div className="order-1 flex min-h-[16rem] flex-col lg:order-2 lg:min-h-full">
              <FieldLabel label="Cover photo" hint="Locked" />
              <div className="relative mt-2 min-h-[16rem] flex-1 overflow-hidden rounded-[1.5rem] border-[3px] border-border bg-surface-2 lg:min-h-0">
                {coverSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverSrc} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
            </div>
          </div>

          {error ? (
            <p
              className="mx-5 mb-3 rounded-xl border-[2.5px] border-border bg-sun/50 px-3 py-2 text-sm font-medium text-ink sm:mx-6"
              role="status"
            >
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3 border-t-[3px] border-border px-5 py-4 sm:px-6">
            <Button type="button" variant="ghost" onClick={onClose} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" variant="lime" disabled={pending}>
              {pending ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldLabel({
  label,
  required = false,
  hint,
}: {
  label: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <span className="flex items-baseline gap-2 font-display text-sm font-bold uppercase tracking-wide">
      {label}
      <span className="text-[10px] font-bold tracking-widest text-muted">
        {hint ?? (required ? 'Required' : 'Optional')}
      </span>
    </span>
  );
}
