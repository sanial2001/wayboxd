'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Stamp } from '@/components/ui/Stamp';
import { cn } from '@/lib/cn';

export type AuthMode = 'signin' | 'signup';

type AuthGateContextValue = {
  open: boolean;
  mode: AuthMode;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
  setMode: (mode: AuthMode) => void;
};

const AuthGateContext = createContext<AuthGateContextValue | null>(null);

export function AuthGateProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('signup');

  const openAuth = useCallback((next: AuthMode = 'signup') => {
    setMode(next);
    setOpen(true);
  }, []);

  const closeAuth = useCallback(() => setOpen(false), []);

  return (
    <AuthGateContext.Provider value={{ open, mode, openAuth, closeAuth, setMode }}>
      {children}
      <AuthModal />
    </AuthGateContext.Provider>
  );
}

export function useAuthGate() {
  const ctx = useContext(AuthGateContext);
  if (!ctx) {
    throw new Error('useAuthGate must be used within AuthGateProvider');
  }
  return ctx;
}

export function AuthGateSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { openAuth } = useAuthGate();

  return (
    <div
      className={className}
      onClickCapture={(event) => {
        const target = event.target as HTMLElement | null;
        if (!target) return;

        const interactive = target.closest(
          'a, button, [role="button"], input, textarea, select, label, summary'
        );
        if (!interactive) return;

        event.preventDefault();
        event.stopPropagation();
        openAuth('signup');
      }}
      onSubmitCapture={(event) => {
        event.preventDefault();
        event.stopPropagation();
        openAuth('signup');
      }}
    >
      {children}
    </div>
  );
}

function AuthModal() {
  const { open, mode, closeAuth, setMode } = useAuthGate();
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAuth();
    };

    document.addEventListener('keydown', onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, closeAuth]);

  if (!open) return null;

  const isSignup = mode === 'signup';

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]"
        onClick={closeAuth}
      />
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md space-y-5 motion-safe:animate-[fadeUp_0.28s_ease-out]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <Stamp className="mb-3">{isSignup ? 'New here' : 'Welcome back'}</Stamp>
            <h2
              id={titleId}
              className="font-display text-3xl font-black uppercase leading-tight tracking-tight"
            >
              {isSignup ? 'Create your account' : 'Sign in'}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {isSignup
                ? 'Join the scrapbook. Places, people, and takes await — once you’re in.'
                : 'Pick up where you left off. Your taste profile missed you.'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeAuth}
            className="rounded-xl border-[2.5px] border-border bg-surface-2 px-2.5 py-1 font-display text-sm font-bold"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          {isSignup ? (
            <Input label="Display name" name="name" placeholder="What should we call you?" />
          ) : null}
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@somewhere.com"
            autoComplete="email"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Something memorable"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
          />
          <Button type="submit" variant="lime" className="w-full">
            {isSignup ? 'Create account' : 'Sign in'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted">
          {isSignup ? 'Already got a passport stamp?' : 'First time here?'}{' '}
          <button
            type="button"
            className={cn(
              'font-display font-bold uppercase underline decoration-[3px] underline-offset-4'
            )}
            onClick={() => setMode(isSignup ? 'signin' : 'signup')}
          >
            {isSignup ? 'Sign in' : 'Create account'}
          </button>
        </p>

        <p className="text-center text-xs text-muted">
          Auth wiring comes later — this gate keeps the preview honest for now.
        </p>
      </Card>
    </div>
  );
}
