'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AuthGateProvider } from '@/components/auth/AuthGate';
import { LandingHeader } from '@/components/layout/LandingHeader';
import { MobileNav } from '@/components/layout/MobileNav';
import { SiteHeader } from '@/components/layout/SiteHeader';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  if (isLanding) {
    return (
      <AuthGateProvider>
        <div className="flex min-h-full flex-col">
          <LandingHeader />
          <main className="flex-1 pb-8">{children}</main>
        </div>
      </AuthGateProvider>
    );
  }

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1 pb-28 lg:pb-12">{children}</main>
      <MobileNav />
    </div>
  );
}
