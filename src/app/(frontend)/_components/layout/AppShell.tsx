'use client';

import { Suspense, useEffect, type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthGateProvider, AuthQueryOpener } from '@/components/auth/AuthGate';
import { LandingHeader } from '@/components/layout/LandingHeader';
import { MobileNav } from '@/components/layout/MobileNav';
import { SideNav } from '@/components/layout/SideNav';
import { SiteHeader } from '@/components/layout/SiteHeader';

const AUTHENTICATED_APP_PATHS = ['/home', '/settings/profile', '/profile'] as const;

function isAuthenticatedAppPath(pathname: string): boolean {
  return AUTHENTICATED_APP_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

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
  const allowed = isAuthenticatedAppPath(pathname);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/?auth=signin');
      return;
    }

    if (status === 'authenticated' && !allowed) {
      router.replace('/home');
    }
  }, [status, allowed, router]);

  const hidePage = status !== 'authenticated' || !allowed;

  return (
    <div className="flex min-h-full">
      <SideNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1 pb-20 lg:pb-0">{hidePage ? null : children}</main>
        <MobileNav />
      </div>
    </div>
  );
}
