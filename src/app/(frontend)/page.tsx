import type { Metadata } from 'next';
import { LandingFeed } from '@/components/features/landing/LandingFeed';

export const metadata: Metadata = {
  title: 'Go somewhere. Have an opinion.',
  description: 'Discover places through travelers with taste. Sign in to join the scrapbook.',
};

export default function LandingRoutePage() {
  return <LandingFeed />;
}
