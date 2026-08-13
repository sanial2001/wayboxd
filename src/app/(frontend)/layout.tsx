import type { ReactNode } from 'react';
import { AuthSessionProvider } from '@/components/auth/AuthSessionProvider';
import { AppShell } from '@/components/layout/AppShell';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthSessionProvider>
        <AppShell>{children}</AppShell>
      </AuthSessionProvider>
    </ThemeProvider>
  );
}
