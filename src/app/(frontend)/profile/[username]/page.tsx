import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProfileHero } from '@/components/features/profile/ProfileHero';
import { ProfileTrips } from '@/components/features/profile/ProfileTrips';
import { Container } from '@/components/ui/Container';
import { loadPublicProfilePageData } from '@/lib/server/load-public-profile-page-data';

type Props = PageProps<'/profile/[username]'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const data = await loadPublicProfilePageData(username);
  if (!data) {
    return { title: 'Traveler not found (yet)' };
  }
  const name = data.profile.displayName?.trim() || `@${data.profile.username}`;
  return { title: name };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const data = await loadPublicProfilePageData(username);
  if (!data) {
    notFound();
  }

  const { profile, isOwnProfile, trips } = data;

  return (
    <Container className="space-y-8 py-6 sm:py-8">
      <ProfileHero profile={profile} isOwnProfile={isOwnProfile} />

      <section>
        <h2 className="sr-only">Trips</h2>
        <ProfileTrips trips={trips} isOwnProfile={isOwnProfile} userId={profile.userId} />
      </section>
    </Container>
  );
}
