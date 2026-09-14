import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProfileHero } from '@/components/features/profile/ProfileHero';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
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

  const { profile, isOwnProfile } = data;
  const emptyCopy = isOwnProfile
    ? 'Nothing filed yet. Edit your profile, then start stamping places.'
    : 'This traveler is still warming up the keyboard.';

  return (
    <Container className="space-y-8 py-6 sm:py-8">
      <ProfileHero profile={profile} isOwnProfile={isOwnProfile} />

      <section>
        <SectionHeader title="Filed takes" description="The public record of their taste." />
        <Card className="text-center">
          <p className="font-display text-xl font-extrabold uppercase">
            Nobody&apos;s spilled the tea yet.
          </p>
          <p className="mt-2 text-muted">{emptyCopy}</p>
        </Card>
      </section>
    </Container>
  );
}
