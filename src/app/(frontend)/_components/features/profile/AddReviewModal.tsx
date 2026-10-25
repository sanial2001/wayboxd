'use client';

import { useEffect, useId, useState, type FormEvent } from 'react';
import { clientLogger } from '@/app/_lib/client-logger';
import { saveReviewClient } from '@/app/api/client/review-service-client';
import { REVIEW_BODY_MAX_LENGTH } from '@/app/api/model/enums/review-body';
import { ReviewModel } from '@/app/api/model/response/review-model';
import { Button } from '@/components/ui/Button';
import { CloseButton } from '@/components/ui/CloseButton';

type AddReviewModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: (review: ReviewModel) => void;
};

export function AddReviewModal({ open, onClose, onSaved }: AddReviewModalProps) {
  const titleId = useId();
  const [body, setBody] = useState('');
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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = body.trim();
    if (text.length === 0) {
      setError('Write a review first.');
      return;
    }
    if (text.length > REVIEW_BODY_MAX_LENGTH) {
      setError(`Keep it under ${REVIEW_BODY_MAX_LENGTH} characters.`);
      return;
    }

    setPending(true);
    setError(null);
    try {
      const response = await saveReviewClient({ body: text });
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
        className="relative z-10 my-4 w-full max-w-xl rounded-[2rem] border-[3px] border-border bg-surface shadow-chunky-lg"
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

          <div className="space-y-2 px-5 py-4 sm:px-6">
            <label className="flex w-full flex-col gap-2">
              <span className="font-display text-sm font-bold uppercase">
                Review <span className="text-coral">*</span>
              </span>
              <textarea
                name="body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                disabled={pending}
                maxLength={REVIEW_BODY_MAX_LENGTH}
                rows={8}
                required
                placeholder="Beautiful. Crowded. Still somehow worth it..."
                className="w-full rounded-2xl border-[3px] border-border bg-surface px-4 py-3 font-sans text-base text-ink shadow-chunky-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/30"
              />
            </label>
            <p className="text-right text-sm text-muted">
              {body.trim().length}/{REVIEW_BODY_MAX_LENGTH}
            </p>
            {error ? <p className="text-sm font-medium text-coral">{error}</p> : null}
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t-[3px] border-border px-5 py-4 sm:px-6">
            <Button type="button" variant="ghost" onClick={onClose} disabled={pending}>
              Cancel
            </Button>
            <Button type="submit" variant="lime" disabled={pending || body.trim().length === 0}>
              {pending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
