'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { clientLogger } from '@/app/_lib/client-logger';
import {
  saveUserProfileClient,
  uploadUserAvatarClient,
} from '@/app/api/client/user-service-client';
import { SaveUserProfileBodyRequest } from '@/app/api/model/request/save-user-profile-request';
import { UserProfileModel } from '@/app/api/model/response/user-profile-model';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Stamp } from '@/components/ui/Stamp';
import { cn } from '@/lib/cn';

type ProfileEditFormProps = {
  userId: number;
  username: string;
  initialProfile: UserProfileModel | null;
};

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function initialField(
  profile: UserProfileModel | null,
  key: keyof SaveUserProfileBodyRequest
): string {
  const value = profile?.[key];
  if (value === null || value === undefined) {
    return '';
  }
  return typeof value === 'string' ? value : '';
}

export function ProfileEditForm({ userId, username, initialProfile }: ProfileEditFormProps) {
  const router = useRouter();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pending, setPending] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState(() => initialField(initialProfile, 'displayName'));
  const [bio, setBio] = useState(() => initialField(initialProfile, 'bio'));
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    () => initialProfile?.avatarUrl ?? null
  );
  const [instagramProfileUrl, setInstagramProfileUrl] = useState(() =>
    initialField(initialProfile, 'instagramProfileUrl')
  );
  const [xProfileUrl, setXProfileUrl] = useState(() => initialField(initialProfile, 'xProfileUrl'));

  async function onAvatarSelected(file: File | undefined) {
    if (!file) return;

    setError(null);
    setAvatarUploading(true);
    try {
      const result = await uploadUserAvatarClient(userId, file);
      setAvatarUrl(result.url);
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : 'Could not upload that image.';
      clientLogger.warn({ err: uploadError }, 'Avatar upload failed');
      setError(message);
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const payload: SaveUserProfileBodyRequest = {
      displayName: emptyToNull(displayName),
      bio: emptyToNull(bio),
      avatarUrl,
      instagramProfileUrl: emptyToNull(instagramProfileUrl),
      xProfileUrl: emptyToNull(xProfileUrl),
    };

    try {
      const response = await saveUserProfileClient(payload);
      if (response.error || response.status >= 400) {
        setError(response.error ?? 'Could not save your profile.');
        return;
      }
      router.push(`/profile/${username}`);
      router.refresh();
    } catch (saveError) {
      clientLogger.error({ err: saveError }, 'Profile save failed');
      setError('Could not save your profile. Try again.');
    } finally {
      setPending(false);
    }
  }

  const busy = pending || avatarUploading;

  return (
    <form className="mx-auto max-w-2xl space-y-6" onSubmit={onSubmit}>
      <header className="space-y-3">
        <Stamp>Edit passport</Stamp>
        <h1 className="font-display text-4xl font-black uppercase leading-tight tracking-tight">
          Your public face
        </h1>
        <p className="text-muted">
          @{username} — tune how you show up before the scrapbook goes fully live.
        </p>
      </header>

      <Card className="space-y-6">
        <div className="flex flex-col items-center gap-3">
          <input
            ref={fileInputRef}
            id={fileInputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={busy}
            onChange={(event) => void onAvatarSelected(event.target.files?.[0])}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => fileInputRef.current?.click()}
            className="relative rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/30 disabled:opacity-50"
            aria-label={avatarUploading ? 'Uploading photo' : 'Change profile photo'}
          >
            <Avatar src={avatarUrl} alt={`@${username}`} size="hero" />
            <span className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-[2.5px] border-border bg-lime shadow-chunky-sm">
              {avatarUploading ? (
                <span className="font-display text-[9px] font-black uppercase">…</span>
              ) : (
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              )}
            </span>
          </button>
          <p className="text-center text-sm text-muted">
            Tap the photo to change it. JPEG, PNG, or WebP.
          </p>
        </div>

        <Input
          label="Display name"
          name="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="What should people call you?"
          disabled={busy}
          maxLength={120}
        />

        <label className="flex w-full flex-col gap-2">
          <span className="font-display text-sm font-bold uppercase tracking-wide">Bio</span>
          <textarea
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="The elevator pitch for your taste."
            disabled={busy}
            maxLength={500}
            rows={4}
            className={cn(
              'w-full rounded-2xl border-[3px] border-border bg-surface px-4 py-3 font-sans text-base text-ink shadow-chunky-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/30'
            )}
          />
        </label>

        <Input
          label="Instagram"
          name="instagramProfileUrl"
          type="url"
          value={instagramProfileUrl}
          onChange={(e) => setInstagramProfileUrl(e.target.value)}
          placeholder="https://instagram.com/you"
          disabled={busy}
        />

        <Input
          label="X (Twitter)"
          name="xProfileUrl"
          type="url"
          value={xProfileUrl}
          onChange={(e) => setXProfileUrl(e.target.value)}
          placeholder="https://x.com/you"
          disabled={busy}
        />

        {error ? (
          <p
            className="rounded-xl border-[2.5px] border-border bg-sun/50 px-3 py-2 text-sm font-medium text-ink"
            role="status"
          >
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" variant="lime" disabled={busy}>
            {pending ? 'Saving…' : 'Save'}
          </Button>
          <Button type="button" variant="ghost" href={`/profile/${username}`} disabled={busy}>
            Cancel
          </Button>
        </div>
      </Card>
    </form>
  );
}
