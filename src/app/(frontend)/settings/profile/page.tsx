import type { Metadata } from 'next';
import { ProfileEditForm } from '@/components/features/profile/ProfileEditForm';
import { Container } from '@/components/ui/Container';
import { loadProfileEditPageData } from '@/lib/server/load-profile-edit-page-data';

export const metadata: Metadata = {
  title: 'Edit profile',
};

export default async function SettingsProfilePage() {
  const { userId, username, initialProfile } = await loadProfileEditPageData();

  return (
    <Container className="py-8 sm:py-10">
      <ProfileEditForm userId={userId} username={username} initialProfile={initialProfile} />
    </Container>
  );
}
