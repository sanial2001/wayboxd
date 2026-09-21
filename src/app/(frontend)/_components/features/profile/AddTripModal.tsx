'use client';

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { clientLogger } from '@/app/_lib/client-logger';
import {
  saveDraftTripClient,
  saveTripClient,
  updateTripClient,
  uploadTripCoverClient,
} from '@/app/api/client/trip-service-client';
import { TripStatus } from '@/app/api/model/enums/trip-status';
import {
  SaveDraftTripBodyRequest,
  SaveTripBodyRequest,
} from '@/app/api/model/request/save-trip-request';
import { UpdateTripBodyRequest } from '@/app/api/model/request/update-trip-request';
import { TripModel } from '@/app/api/model/response/trip-model';
import { Button } from '@/components/ui/Button';
import { TripCard } from '@/components/features/profile/TripCard';
import {
  composeTripMonthValue,
  listTripYears,
  splitTripMonthYear,
  TRIP_MONTH_OPTIONS,
} from '@/lib/trip-display';
import { cn } from '@/lib/cn';

type AddTripModalProps = {
  open: boolean;
  userId: number;
  drafts: TripModel[];
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

const selectClassName =
  'w-full cursor-pointer rounded-2xl border-[3px] border-border bg-surface px-4 py-3 font-sans text-base text-ink shadow-chunky-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/30 disabled:cursor-not-allowed disabled:opacity-50';

export function AddTripModal({ open, userId, drafts, onClose, onSaved }: AddTripModalProps) {
  const titleId = useId();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [blurb, setBlurb] = useState('');
  const [tag, setTag] = useState('');
  const [duration, setDuration] = useState('');
  const [outboundUrl, setOutboundUrl] = useState('');
  const [tripMonth, setTripMonth] = useState('');
  const [tripYear, setTripYear] = useState(() => String(new Date().getFullYear()));
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftPromptOpen, setDraftPromptOpen] = useState(false);
  const [selectedDraftId, setSelectedDraftId] = useState<number | null>(null);
  const [showDraftPicker, setShowDraftPicker] = useState(drafts.length > 0);

  const hasUnsavedWork =
    title.trim().length > 0 ||
    blurb.trim().length > 0 ||
    tag.trim().length > 0 ||
    duration.trim().length > 0 ||
    outboundUrl.trim().length > 0 ||
    Boolean(coverImageUrl) ||
    Boolean(coverPreviewUrl) ||
    tripMonth.length > 0;

  const requestClose = useCallback(() => {
    if (pending) {
      return;
    }
    if (showDraftPicker || !hasUnsavedWork) {
      onClose();
      return;
    }
    setDraftPromptOpen(true);
  }, [pending, showDraftPicker, hasUnsavedWork, onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || pending) {
        return;
      }
      if (draftPromptOpen) {
        setDraftPromptOpen(false);
        return;
      }
      requestClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, pending, draftPromptOpen, requestClose]);

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

  function clearCoverPreview() {
    if (coverPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
  }

  function resetComposer() {
    clearCoverPreview();
    setSelectedDraftId(null);
    setTitle('');
    setBlurb('');
    setTag('');
    setDuration('');
    setOutboundUrl('');
    setTripMonth('');
    setTripYear(String(new Date().getFullYear()));
    setCoverImageUrl(null);
    setCoverPreviewUrl(null);
    setError(null);
    setDraftPromptOpen(false);
  }

  function applyDraft(draft: TripModel) {
    const { year, month } = splitTripMonthYear(draft.tripDate);
    const cover = draft.coverImageUrl.trim();
    clearCoverPreview();
    setSelectedDraftId(draft.id);
    setTitle(draft.title);
    setBlurb(draft.blurb ?? '');
    setTag(draft.tag ?? '');
    setDuration(draft.duration ?? '');
    setOutboundUrl(isHttpUrl(draft.outboundUrl) ? draft.outboundUrl : '');
    setTripMonth(month);
    setTripYear(year);
    setCoverImageUrl(isHttpUrl(cover) ? cover : null);
    setCoverPreviewUrl(isHttpUrl(cover) ? cover : null);
    setShowDraftPicker(false);
    setError(null);
  }

  function startNewTrip() {
    resetComposer();
    setShowDraftPicker(false);
  }

  function backToDrafts() {
    if (pending) {
      return;
    }
    resetComposer();
    setShowDraftPicker(true);
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
    if (!tripMonth || !tripYear) {
      return 'Trip date is required.';
    }
    if (!composeTripMonthValue(tripYear, tripMonth)) {
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

    const tripDate = composeTripMonthValue(tripYear, tripMonth);
    if (!coverImageUrl || !tripDate) {
      return;
    }

    const publishFields = {
      title: title.trim(),
      coverImageUrl,
      outboundUrl: outboundUrl.trim(),
      tripDate,
      blurb: emptyToNull(blurb),
      tag: emptyToNull(tag),
      duration: emptyToNull(duration),
    };
    const createPayload: SaveTripBodyRequest = publishFields;
    const updatePayload: UpdateTripBodyRequest = {
      ...publishFields,
      status: TripStatus.PUBLISHED,
    };

    setError(null);
    setPending(true);
    try {
      const response = selectedDraftId
        ? await updateTripClient(selectedDraftId, updatePayload)
        : await saveTripClient(createPayload);
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

  async function saveDraft() {
    if (coverUploading) {
      setError('Wait for the cover to finish uploading.');
      return;
    }

    const payload: SaveDraftTripBodyRequest = {
      title: title.trim() || 'Untitled trip',
      blurb: emptyToNull(blurb),
      tag: emptyToNull(tag),
      duration: emptyToNull(duration),
    };
    if (coverImageUrl) {
      payload.coverImageUrl = coverImageUrl;
    }
    if (outboundUrl.trim() && isHttpUrl(outboundUrl.trim())) {
      payload.outboundUrl = outboundUrl.trim();
    }
    const tripDate = composeTripMonthValue(tripYear, tripMonth);
    if (tripDate) {
      payload.tripDate = tripDate;
    }

    setError(null);
    setPending(true);
    try {
      const response = selectedDraftId
        ? await updateTripClient(selectedDraftId, {
            title: payload.title,
            blurb: payload.blurb,
            tag: payload.tag,
            duration: payload.duration,
            ...(payload.coverImageUrl ? { coverImageUrl: payload.coverImageUrl } : {}),
            ...(payload.outboundUrl ? { outboundUrl: payload.outboundUrl } : {}),
            ...(payload.tripDate ? { tripDate: payload.tripDate } : {}),
          })
        : await saveDraftTripClient(payload);
      if (response.error || !response.data || response.status >= 400) {
        setError(response.error ?? 'Could not save this draft.');
        setDraftPromptOpen(false);
        return;
      }
      onSaved(response.data);
    } catch (saveError) {
      clientLogger.error({ err: saveError }, 'Trip draft save failed');
      setError('Could not save this draft. Try again.');
      setDraftPromptOpen(false);
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
        disabled={pending}
        onClick={requestClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 my-4 w-full max-w-5xl rounded-[2rem] border-[3px] border-border bg-surface shadow-chunky-lg"
      >
        {showDraftPicker ? (
          <div>
            <div className="flex items-start justify-between gap-4 px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
              <div>
                <h2 id={titleId} className="font-display text-3xl font-black tracking-tight">
                  Continue a draft
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Pick a saved draft to finish it, or start a new trip.
                </p>
              </div>
              <button
                type="button"
                onClick={requestClose}
                disabled={pending}
                aria-label="Close"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-border bg-surface-2 text-ink disabled:opacity-50"
              >
                <span aria-hidden className="text-xl leading-none">
                  ×
                </span>
              </button>
            </div>

            <ul className="grid grid-cols-1 gap-4 px-5 py-4 sm:grid-cols-2 sm:px-6">
              {drafts.map((draft) => (
                <li key={draft.id}>
                  <TripCard trip={draft} onOpen={() => applyDraft(draft)} />
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap justify-end gap-3 border-t-[3px] border-border px-5 py-4 sm:px-6">
              <Button type="button" variant="ghost" onClick={requestClose} disabled={pending}>
                Cancel
              </Button>
              <Button type="button" variant="lime" onClick={startNewTrip} disabled={pending}>
                Start a new trip
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={(event) => void onSubmit(event)}>
            <div className="flex items-start justify-between gap-4 px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
              <div>
                <h2 id={titleId} className="font-display text-3xl font-black tracking-tight">
                  {selectedDraftId ? 'Continue draft' : 'Add trip'}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {selectedDraftId
                    ? 'Finish this draft, then Publish posts it.'
                    : 'Cover uploads first → then Save posts the trip payload.'}
                </p>
              </div>
              <button
                type="button"
                onClick={requestClose}
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

                <fieldset className="flex w-full flex-col gap-2">
                  <legend>
                    <FieldLabel label="Trip date" required />
                  </legend>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="sr-only" htmlFor={`${titleId}-month`}>
                      Month
                    </label>
                    <select
                      id={`${titleId}-month`}
                      name="tripMonth"
                      value={tripMonth}
                      onChange={(event) => setTripMonth(event.target.value)}
                      disabled={busy}
                      className={selectClassName}
                    >
                      <option value="">Month</option>
                      {TRIP_MONTH_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <label className="sr-only" htmlFor={`${titleId}-year`}>
                      Year
                    </label>
                    <select
                      id={`${titleId}-year`}
                      name="tripYear"
                      value={tripYear}
                      onChange={(event) => setTripYear(event.target.value)}
                      disabled={busy}
                      className={selectClassName}
                    >
                      <option value="">Year</option>
                      {listTripYears().map((year) => (
                        <option key={year} value={String(year)}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </fieldset>

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

              <div className="order-1 flex min-h-[16rem] flex-col lg:order-2 lg:min-h-full">
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
                    'relative mt-2 flex min-h-[16rem] w-full flex-1 flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border-[2.5px] border-dashed border-border bg-surface-2 px-4 text-center disabled:opacity-50 lg:min-h-0'
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
                    <span className="mt-1 block text-xs text-muted">
                      Required · 16:10 · JPG/PNG
                    </span>
                  </span>
                </button>
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
              {drafts.length > 0 ? (
                <Button type="button" variant="ghost" onClick={backToDrafts} disabled={pending}>
                  Back to drafts
                </Button>
              ) : null}
              <Button type="button" variant="ghost" onClick={requestClose} disabled={pending}>
                Cancel
              </Button>
              <Button type="submit" variant="lime" disabled={busy}>
                {pending ? 'Saving…' : selectedDraftId ? 'Publish trip' : 'Save trip'}
              </Button>
            </div>
          </form>
        )}
      </div>

      {draftPromptOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-4">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Keep editing"
            disabled={pending}
            onClick={() => setDraftPromptOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${titleId}-draft`}
            className="relative z-10 w-full max-w-md rounded-[1.75rem] border-[3px] border-border bg-surface p-5 shadow-chunky-lg sm:p-6"
          >
            <h3 id={`${titleId}-draft`} className="font-display text-2xl font-black tracking-tight">
              Save as draft?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              You can finish this trip later. Discarding will lose what you have entered.
            </p>
            {coverUploading ? (
              <p className="mt-2 text-sm font-medium text-ink">
                Wait for the cover to finish uploading.
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onClose} disabled={pending}>
                Discard
              </Button>
              <Button
                type="button"
                variant="lime"
                onClick={() => void saveDraft()}
                disabled={pending || coverUploading}
              >
                {pending ? 'Saving…' : 'Save draft'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
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
