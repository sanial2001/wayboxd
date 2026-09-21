import { PublicUserProfileView } from '@/app/api/model/response/public-user-profile-view';
import { ProfileSocialLinks } from '@/components/features/profile/profile-social-links';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

type ProfileHeroProps = {
  profile: PublicUserProfileView;
  isOwnProfile: boolean;
  tripCount: number;
  onAddTrip?: () => void;
};

function formatJoinedAt(date: Date): string {
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(date);
}

function ProfileActions({
  isOwnProfile,
  onAddTrip,
}: {
  isOwnProfile: boolean;
  onAddTrip?: () => void;
}) {
  if (isOwnProfile) {
    return (
      <>
        <Button href="/settings/profile" variant="secondary" size="sm">
          Edit profile
        </Button>
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
      </>
    );
  }

  return (
    <Button type="button" variant="lime" size="sm" disabled>
      Follow
    </Button>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="font-display text-lg font-black">{value.toLocaleString()}</span>{' '}
        <span className="text-sm text-muted">{label}</span>
      </dd>
    </div>
  );
}

export function ProfileHero({ profile, isOwnProfile, tripCount, onAddTrip }: ProfileHeroProps) {
  const displayName = profile.displayName?.trim() || profile.username;

  return (
    <section className="overflow-hidden rounded-[2rem] border-[3px] border-border bg-surface shadow-chunky-lg">
      <div
        className="h-28 bg-[radial-gradient(circle_at_18%_40%,#7047ff66,transparent_42%),radial-gradient(circle_at_82%_20%,#ff6b6b55,transparent_38%),linear-gradient(135deg,#efe6d6_0%,#d9c7ff_100%)] sm:h-36"
        aria-hidden
      />

      <div className="px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-8">
          <div className="-mt-14 shrink-0 sm:-mt-16">
            <Avatar
              src={profile.avatarUrl}
              alt={displayName}
              size="hero"
              preview
              className="border-[4px] border-surface shadow-chunky"
            />
          </div>

          <div className="mt-5 flex min-w-0 w-full flex-1 flex-col items-center gap-3 sm:mt-0 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="text-center sm:text-left">
              <h1 className="font-display text-3xl font-black uppercase leading-none tracking-tight">
                {displayName}
              </h1>
              <p className="mt-1.5 text-muted">@{profile.username}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
              <ProfileActions isOwnProfile={isOwnProfile} onAddTrip={onAddTrip} />
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-4 text-center sm:ml-40 sm:mt-6 sm:text-left">
          {profile.bio ? <p className="text-base leading-relaxed">{profile.bio}</p> : null}

          <dl className="flex flex-wrap justify-center gap-x-6 gap-y-1 sm:justify-start">
            <Stat value={tripCount} label={tripCount === 1 ? 'Trip' : 'Trips'} />
            <Stat value={profile.followingCount} label="Following" />
            <Stat value={profile.followerCount} label="Followers" />
          </dl>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <ProfileSocialLinks
              instagramProfileUrl={profile.instagramProfileUrl}
              xProfileUrl={profile.xProfileUrl}
              otherProfileUrl={profile.otherProfileUrl}
            />
            <p className="text-sm text-muted">Joined {formatJoinedAt(profile.joinedAt)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
