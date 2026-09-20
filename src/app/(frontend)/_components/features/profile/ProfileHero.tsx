import { PublicUserProfileView } from '@/app/api/model/response/public-user-profile-view';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

type ProfileHeroProps = {
  profile: PublicUserProfileView;
  isOwnProfile: boolean;
  onAddTrip?: () => void;
};

function formatJoinedAt(date: Date): string {
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(date);
}

function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function ProfileHero({ profile, isOwnProfile, onAddTrip }: ProfileHeroProps) {
  const displayName = profile.displayName?.trim() || profile.username;

  return (
    <section className="overflow-hidden rounded-[2rem] border-[3px] border-border bg-surface shadow-chunky-lg">
      <div
        className="relative h-28 bg-[radial-gradient(circle_at_18%_40%,#7047ff66,transparent_42%),radial-gradient(circle_at_82%_20%,#ff6b6b55,transparent_38%),linear-gradient(135deg,#efe6d6_0%,#d9c7ff_100%)] sm:h-36"
        aria-hidden
      />

      <div className="px-5 pb-6 sm:px-7">
        <div className="flex items-end justify-between gap-3">
          <div className="-mt-12 sm:-mt-14">
            <Avatar
              src={profile.avatarUrl}
              alt={displayName}
              size="hero"
              preview
              className="border-[4px] border-surface shadow-chunky"
            />
          </div>
          {isOwnProfile ? (
            <div className="mb-1 flex flex-wrap justify-end gap-2">
              {onAddTrip ? (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={onAddTrip}
                  className="rounded-full bg-tangerine text-ink hover:bg-tangerine"
                >
                  + Add trip
                </Button>
              ) : null}
              <Button href="/settings/profile" variant="secondary" size="sm">
                Edit profile
              </Button>
            </div>
          ) : (
            <Button type="button" variant="lime" size="sm" className="mb-1" disabled>
              Follow
            </Button>
          )}
        </div>

        <h1 className="mt-3 font-display text-3xl font-black uppercase leading-tight tracking-tight">
          {displayName}
        </h1>
        <p className="mt-0.5 text-muted">@{profile.username}</p>

        {profile.bio ? (
          <p className="mt-3 max-w-xl text-base leading-relaxed">{profile.bio}</p>
        ) : null}

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {profile.instagramProfileUrl ? (
            <li>
              <a
                href={profile.instagramProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-purple underline decoration-[3px] underline-offset-4"
              >
                {hostFromUrl(profile.instagramProfileUrl)}
              </a>
            </li>
          ) : null}
          {profile.xProfileUrl ? (
            <li>
              <a
                href={profile.xProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-purple underline decoration-[3px] underline-offset-4"
              >
                {hostFromUrl(profile.xProfileUrl)}
              </a>
            </li>
          ) : null}
          <li className="text-muted">Joined {formatJoinedAt(profile.joinedAt)}</li>
        </ul>

        <dl className="mt-5 flex flex-wrap gap-5">
          <div>
            <dt className="sr-only">Following</dt>
            <dd>
              <span className="font-display text-lg font-black">
                {profile.followingCount.toLocaleString()}
              </span>{' '}
              <span className="text-sm text-muted">Following</span>
            </dd>
          </div>
          <div>
            <dt className="sr-only">Followers</dt>
            <dd>
              <span className="font-display text-lg font-black">
                {profile.followerCount.toLocaleString()}
              </span>{' '}
              <span className="text-sm text-muted">Followers</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
