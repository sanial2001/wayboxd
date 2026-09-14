'use client';

import { Suspense, useEffect, type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthGateProvider, AuthQueryOpener } from '@/components/auth/AuthGate';
import { LandingHeader } from '@/components/layout/LandingHeader';
import { SiteHeader } from '@/components/layout/SiteHeader';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const isApiDocs = pathname === '/api-docs';

  if (isApiDocs) {
    return <>{children}</>;
  }

  if (isLanding) {
    return (
      <AuthGateProvider>
        <div className="flex min-h-full flex-col">
          <LandingHeader />
          <Suspense fallback={null}>
            <AuthQueryOpener />
          </Suspense>
          <main className="flex-1 pb-8">{children}</main>
        </div>
      </AuthGateProvider>
    );
  }

  return <LoggedInMvpFrame>{children}</LoggedInMvpFrame>;
}

function LoggedInMvpFrame({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/home';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/?auth=signin');
      return;
    }

    if (status === 'authenticated' && !isHome) {
      router.replace('/home');
    }
  }, [status, isHome, router]);

  const hidePage = status !== 'authenticated' || !isHome;

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1">{hidePage ? null : children}</main>
    </div>
  );
}
