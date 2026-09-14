import type { Metadata } from 'next';
import { UnderProgressBanner } from '@/components/features/home/UnderProgressBanner';

export const metadata: Metadata = {
  title: 'Home',
};

export default function AppHomePage() {
  return <UnderProgressBanner />;
}
