'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { clientLogger } from '@/app/_lib/client-logger';
import { saveTripClient, uploadTripCoverClient } from '@/app/api/client/trip-service-client';
import { SaveTripBodyRequest } from '@/app/api/model/request/save-trip-request';
import { TripModel } from '@/app/api/model/response/trip-model';
import { TripCard } from '@/components/features/profile/TripCard';
import { Button } from '@/components/ui/Button';
import { monthInputToIsoTripDate } from '@/lib/trip-display';
import { cn } from '@/lib/cn';

type AddTripModalProps = {
  open: boolean;
  userId: number;
  onClose: () => void;
  onSaved: (trip: TripModel) => void;
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

export function AddTripModal({ open, userId, onClose, onSaved }: AddTripModalProps) {
  const titleId = useId();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [blurb, setBlurb] = useState('');
  const [tag, setTag] = useState('');
  const [duration, setDuration] = useState('');
  const [outboundUrl, setOutboundUrl] = useState('');
  const [month, setMonth] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !pending && !coverUploading) {
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
  }, [open, pending, coverUploading, onClose]);

  useEffect(() => {
    return () => {
      if (coverPreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
    };
  }, [coverPreviewUrl]);

  if (!open) {
    return null;
  }

  async function onCoverSelected(file: File | undefined) {
    if (!file) {
      return;
    }

    setError(null);
    const objectUrl = URL.createObjectURL(file);
    if (coverPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    setCoverPreviewUrl(objectUrl);
    setCoverImageUrl(null);
    setCoverUploading(true);

    try {
      const result = await uploadTripCoverClient(userId, file);
      setCoverImageUrl(result.url);
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : 'Could not upload that cover.';
      clientLogger.warn({ err: uploadError }, 'Trip cover upload failed');
      setError(message);
      setCoverPreviewUrl(null);
      URL.revokeObjectURL(objectUrl);
    } finally {
      setCoverUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function validate(): string | null {
    if (coverUploading) {
      return 'Wait for the cover to finish uploading.';
    }
    if (!coverImageUrl) {
      return 'Cover photo is required.';
    }
    if (!title.trim()) {
      return 'Title is required.';
    }
    if (!month) {
      return 'Trip date is required.';
    }
    if (!monthInputToIsoTripDate(month)) {
      return 'Trip date must be a valid month.';
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

    const tripDate = monthInputToIsoTripDate(month);
    if (!coverImageUrl || !tripDate) {
      return;
    }

    const payload: SaveTripBodyRequest = {
      title: title.trim(),
      coverImageUrl,
      outboundUrl: outboundUrl.trim(),
      tripDate,
      blurb: emptyToNull(blurb),
      tag: emptyToNull(tag),
      duration: emptyToNull(duration),
    };

    setError(null);
    setPending(true);
    try {
      const response = await saveTripClient(payload);
      if (response.error || !response.data || response.status >= 400) {
        setError(response.error ?? 'Could not save this trip.');
        return;
      }
      onSaved(response.data);
    } catch (saveError) {
      clientLogger.error({ err: saveError }, 'Trip save failed');
      setError('Could not save this trip. Try again.');
    } finally {
      setPending(false);
    }
  }

  const busy = pending || coverUploading;
  const previewCover = coverImageUrl ?? coverPreviewUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/70 p-4 sm:p-8">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close add trip"
        disabled={busy}
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
                Add trip
              </h2>
              <p className="mt-1 text-sm text-muted">
                Cover uploads first → then Save posts the trip payload.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Close"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-border bg-surface-2 text-ink disabled:opacity-50"
            >
              <span aria-hidden className="text-xl leading-none">
                ×
              </span>
            </button>
          </div>

          <div className="grid gap-6 px-5 py-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] sm:px-6">
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                id={fileInputId}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={busy}
                onChange={(event) => void onCoverSelected(event.target.files?.[0])}
              />
              <FieldLabel label="Cover photo" required />
              <button
                type="button"
                disabled={busy}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  void onCoverSelected(event.dataTransfer.files?.[0]);
                }}
                className={cn(
                  'relative flex aspect-[16/10] w-full flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border-[2.5px] border-dashed border-border bg-surface-2 px-4 text-center disabled:opacity-50'
                )}
              >
                {previewCover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewCover}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}
                <span
                  className={cn(
                    'relative z-10',
                    previewCover && 'rounded-xl bg-ink/70 px-3 py-2 text-paper'
                  )}
                >
                  <span className="block font-display text-sm font-bold uppercase">
                    {coverUploading ? 'Uploading…' : 'Upload cover photo'}
                  </span>
                  <span className="mt-1 block text-xs text-muted">Required · 16:10 · JPG/PNG</span>
                </span>
              </button>

              <label className="flex w-full flex-col gap-2">
                <FieldLabel label="Title" required />
                <input
                  name="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  disabled={busy}
                  maxLength={160}
                  className="w-full rounded-2xl border-[3px] border-border bg-surface px-4 py-3 font-sans text-base text-ink shadow-chunky-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/30"
                />
              </label>

              <label className="flex w-full flex-col gap-2">
                <FieldLabel label="Blurb" />
                <textarea
                  name="blurb"
                  value={blurb}
                  onChange={(event) => setBlurb(event.target.value)}
                  disabled={busy}
                  maxLength={400}
                  rows={4}
                  className="w-full rounded-2xl border-[3px] border-border bg-surface px-4 py-3 font-sans text-base text-ink shadow-chunky-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/30"
                />
              </label>

              <label className="flex w-full flex-col gap-2">
                <FieldLabel label="Trip date" required />
                <input
                  name="tripDate"
                  type="month"
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                  disabled={busy}
                  className="w-full rounded-2xl border-[3px] border-border bg-surface px-4 py-3 font-sans text-base text-ink shadow-chunky-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/30"
                />
              </label>

              <label className="flex w-full flex-col gap-2">
                <FieldLabel label="Tag" />
                <input
                  name="tag"
                  value={tag}
                  onChange={(event) => setTag(event.target.value)}
                  placeholder="Himalaya"
                  disabled={busy}
                  maxLength={40}
                  className="w-full rounded-2xl border-[3px] border-border bg-surface px-4 py-3 font-sans text-base text-ink shadow-chunky-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/30"
                />
              </label>

              <label className="flex w-full flex-col gap-2">
                <FieldLabel label="Duration" />
                <input
                  name="duration"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  placeholder="9 days"
                  disabled={busy}
                  maxLength={40}
                  className="w-full rounded-2xl border-[3px] border-border bg-surface px-4 py-3 font-sans text-base text-ink shadow-chunky-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/30"
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
                  disabled={busy}
                  className="w-full rounded-2xl border-[3px] border-border bg-surface px-4 py-3 font-sans text-base text-ink shadow-chunky-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/30"
                />
              </label>
            </div>

            <div>
              <p className="mb-3 font-display text-[11px] font-bold uppercase tracking-widest text-muted">
                Live card preview
              </p>
              <TripCard
                trip={{
                  title,
                  blurb: emptyToNull(blurb),
                  coverImageUrl: previewCover,
                  outboundUrl: emptyToNull(outboundUrl),
                  tag: emptyToNull(tag),
                  duration: emptyToNull(duration),
                  tripDate: monthInputToIsoTripDate(month),
                }}
              />
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
            <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" variant="lime" disabled={busy}>
              {pending ? 'Saving…' : 'Save trip'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <span className="flex items-baseline gap-2 font-display text-sm font-bold uppercase tracking-wide">
      {label}
      <span className="text-[10px] font-bold tracking-widest text-muted">
        {required ? 'Required' : 'Optional'}
      </span>
    </span>
  );
}
