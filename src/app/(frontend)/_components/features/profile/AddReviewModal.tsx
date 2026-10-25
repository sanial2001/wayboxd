'use client';

import { useEffect, useId, useState, type FormEvent } from 'react';
import { clientLogger } from '@/app/_lib/client-logger';
import { savePlaceFromOsmClient } from '@/app/api/client/place-service-client';
import { saveReviewClient } from '@/app/api/client/review-service-client';
import {
  REVIEW_BODY_MAX_LENGTH,
  REVIEW_TAG_MAX_COUNT,
  REVIEW_TAG_MAX_LENGTH,
  REVIEW_TITLE_MAX_LENGTH,
} from '@/app/api/model/enums/review-body';
import { MAX_RATING, MIN_RATING } from '@/app/api/model/enums/review-rating';
import { ReviewModel } from '@/app/api/model/response/review-model';
import { TripPlaceSelection } from '@/app/api/model/response/trip-place-selection';
import { PlaceSearchField } from '@/components/features/profile/PlaceSearchField';
import { Button } from '@/components/ui/Button';
import { CloseButton } from '@/components/ui/CloseButton';
import { cn } from '@/lib/cn';
import { composeTripMonthValue, listTripYears, TRIP_MONTH_OPTIONS } from '@/lib/trip-display';

type AddReviewModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: (review: ReviewModel) => void;
};

const fieldClassName =
  'w-full rounded-2xl border-[3px] border-border bg-surface px-4 py-3 font-sans text-base text-ink shadow-chunky-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/30 disabled:cursor-not-allowed disabled:opacity-50';

const selectClassName =
  'w-full cursor-pointer rounded-2xl border-[3px] border-border bg-surface px-4 py-3 font-sans text-base text-ink shadow-chunky-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/30 disabled:cursor-not-allowed disabled:opacity-50';

export function AddReviewModal({ open, onClose, onSaved }: AddReviewModalProps) {
  const titleId = useId();
  const placeFieldId = useId();
  const [placeQuery, setPlaceQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<TripPlaceSelection | null>(null);
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [body, setBody] = useState('');
  const [wouldGoAgain, setWouldGoAgain] = useState<boolean | null>(null);
  const [visitMonth, setVisitMonth] = useState('');
  const [visitYear, setVisitYear] = useState('');
  const [tags, setTags] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || pending || event.defaultPrevented) {
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
  }, [open, pending, onClose]);

  if (!open) {
    return null;
  }

  function validate(): string | null {
    if (!selectedPlace) {
      if (placeQuery.trim()) {
        return 'Choose a place from the list.';
      }
      return 'Place is required.';
    }
    if (!title.trim()) {
      return 'Title is required.';
    }
    if (title.trim().length > REVIEW_TITLE_MAX_LENGTH) {
      return `Title must be ${REVIEW_TITLE_MAX_LENGTH} characters or fewer.`;
    }
    if (rating === null) {
      return 'Rating is required.';
    }
    if (body.trim().length > REVIEW_BODY_MAX_LENGTH) {
      return `Review must be ${REVIEW_BODY_MAX_LENGTH} characters or fewer.`;
    }
    const parsedTags = parseTags(tags);
    if (parsedTags.length > REVIEW_TAG_MAX_COUNT) {
      return `Use at most ${REVIEW_TAG_MAX_COUNT} tags.`;
    }
    if (parsedTags.some((tag) => tag.length > REVIEW_TAG_MAX_LENGTH)) {
      return `Each tag must be ${REVIEW_TAG_MAX_LENGTH} characters or fewer.`;
    }
    if ((visitMonth && !visitYear) || (!visitMonth && visitYear)) {
      return 'Choose both a month and a year, or leave the visit date empty.';
    }
    return null;
  }

  async function resolvePlaceId(): Promise<number> {
    if (!selectedPlace) {
      throw new Error('Place is required.');
    }
    if (selectedPlace.placeId) {
      return selectedPlace.placeId;
    }
    if (!selectedPlace.osmHit) {
      throw new Error('Choose a place from the list.');
    }
    const response = await savePlaceFromOsmClient(selectedPlace.osmHit);
    if (response.error || !response.data || response.status >= 400) {
      throw new Error(response.error ?? 'Could not save that place.');
    }
    return response.data.id;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validate();
    if (validationError || rating === null) {
      setError(validationError);
      return;
    }

    setPending(true);
    setError(null);
    try {
      const placeId = await resolvePlaceId();
      const response = await saveReviewClient({
        placeId,
        title: title.trim(),
        rating,
        body: body.trim() || null,
        wouldGoAgain,
        visitDate: composeTripMonthValue(visitYear, visitMonth),
        tags: parseTags(tags),
      });
      if (response.error || !response.data || response.status >= 400) {
        setError(response.error ?? 'Could not save this review.');
        return;
      }
      onSaved(response.data);
    } catch (saveError) {
      clientLogger.error({ err: saveError }, 'Review save failed');
      setError(
        saveError instanceof Error ? saveError.message : 'Could not save this review. Try again.'
      );
    } finally {
      setPending(false);
    }
  }

  const ratings = Array.from(
    { length: MAX_RATING - MIN_RATING + 1 },
    (_, index) => MIN_RATING + index
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/70 p-4 sm:p-8">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close add review"
        disabled={pending}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 my-4 w-full max-w-2xl rounded-[2rem] border-[3px] border-border bg-surface shadow-chunky-lg"
      >
        <form onSubmit={(event) => void onSubmit(event)}>
          <div className="flex items-start justify-between gap-4 px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
            <div>
              <h2 id={titleId} className="font-display text-3xl font-black tracking-tight">
                Add review
              </h2>
              <p className="mt-1 text-sm text-muted">Say what you actually think.</p>
            </div>
            <CloseButton onClick={onClose} disabled={pending} />
          </div>

          <div className="space-y-4 px-5 py-4 sm:px-6">
            <div className="flex w-full flex-col gap-2">
              <FieldLabel label="Place" required />
              <PlaceSearchField
                id={placeFieldId}
                disabled={pending}
                selected={selectedPlace}
                onQueryChange={setPlaceQuery}
                onSelect={setSelectedPlace}
              />
            </div>

            <label className="flex w-full flex-col gap-2">
              <FieldLabel label="Title" required />
              <input
                name="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                disabled={pending}
                maxLength={REVIEW_TITLE_MAX_LENGTH}
                className={fieldClassName}
              />
            </label>

            <div>
              <FieldLabel label="Rating" required />
              <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Rating">
                {ratings.map((value) => (
                  <button
                    key={value}
                    type="button"
                    disabled={pending}
                    onClick={() => setRating(value)}
                    aria-label={`${value} star${value === 1 ? '' : 's'}`}
                    aria-pressed={rating === value}
                    className={cn(
                      'h-12 w-12 rounded-2xl border-[3px] border-border font-display text-xl font-black shadow-chunky-sm',
                      rating !== null && rating >= value ? 'bg-sun' : 'bg-surface'
                    )}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <label className="flex w-full flex-col gap-2">
              <FieldLabel label="Review" />
              <textarea
                name="body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                disabled={pending}
                maxLength={REVIEW_BODY_MAX_LENGTH}
                rows={6}
                placeholder="Beautiful. Crowded. Still somehow worth it..."
                className={fieldClassName}
              />
              <span className="text-right text-sm text-muted">
                {body.trim().length}/{REVIEW_BODY_MAX_LENGTH}
              </span>
            </label>

            <div>
              <FieldLabel label="Would you go again?" />
              <div className="mt-2 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={wouldGoAgain === true ? 'lime' : 'secondary'}
                  disabled={pending}
                  onClick={() => setWouldGoAgain((current) => (current === true ? null : true))}
                >
                  Yes
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={wouldGoAgain === false ? 'danger' : 'secondary'}
                  disabled={pending}
                  onClick={() => setWouldGoAgain((current) => (current === false ? null : false))}
                >
                  No
                </Button>
              </div>
            </div>

            <fieldset className="flex w-full flex-col gap-2">
              <legend>
                <FieldLabel label="Visit date" />
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <label className="sr-only" htmlFor={`${titleId}-month`}>
                  Month
                </label>
                <select
                  id={`${titleId}-month`}
                  name="visitMonth"
                  value={visitMonth}
                  onChange={(event) => setVisitMonth(event.target.value)}
                  disabled={pending}
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
                  name="visitYear"
                  value={visitYear}
                  onChange={(event) => setVisitYear(event.target.value)}
                  disabled={pending}
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
              <FieldLabel label="Tags" />
              <input
                name="tags"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                disabled={pending}
                placeholder="loud, worth it, sunset"
                className={fieldClassName}
              />
              <span className="text-sm text-muted">Separate tags with commas.</span>
            </label>

            {error ? <p className="text-sm font-medium text-coral">{error}</p> : null}
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t-[3px] border-border px-5 py-4 sm:px-6">
            <Button type="button" variant="ghost" onClick={onClose} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" variant="lime" disabled={pending}>
              {pending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <span className="font-display text-sm font-bold uppercase">
      {label}
      {required ? <span className="text-coral"> *</span> : null}
    </span>
  );
}

function parseTags(value: string): string[] {
  const tags: string[] = [];
  const seen = new Set<string>();
  for (const part of value.split(',')) {
    const tag = part.trim();
    if (!tag) {
      continue;
    }
    const key = tag.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    tags.push(tag);
  }
  return tags;
}
