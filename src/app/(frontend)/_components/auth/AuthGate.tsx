'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { userSignupClient } from '@/app/api/client/user-service-client';
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

/** Reads `?auth=signin|signup` — must render under Suspense. */
export function AuthQueryOpener() {
  const searchParams = useSearchParams();
  const { openAuth } = useAuthGate();

  useEffect(() => {
    const auth = searchParams.get('auth');
    if (auth === 'signin' || auth === 'signup') {
      openAuth(auth);
    }
  }, [searchParams, openAuth]);

  return null;
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
  const { status } = useSession();

  return (
    <div
      className={className}
      onClickCapture={(event) => {
        if (status === 'authenticated') return;

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
        if (status === 'authenticated') return;
        event.preventDefault();
        event.stopPropagation();
        openAuth('signup');
      }}
    >
      {children}
    </div>
  );
}

function friendlyAuthMessage(raw: string | null | undefined, mode: AuthMode): string {
  const message = (raw ?? '').trim().toLowerCase();

  if (message.includes('username already exists')) {
    return 'That username is already out exploring. Try another handle.';
  }
  if (message.includes('email is required')) {
    return 'Drop an email so we can find you later.';
  }
  if (message.includes('username is required')) {
    return 'Pick a username — short, memorable, yours.';
  }
  if (message.includes('password is required')) {
    return 'You’ll need a password to get back in.';
  }
  if (message.includes('invalid username or password') || message.includes('credentials')) {
    return 'Those details didn’t match. Double-check and try again.';
  }
  if (message.includes('invalid request')) {
    return 'Something in that form looks off — give it another pass.';
  }
  if (message.includes('account created')) {
    return 'You’re in the book — now sign in to open the scrapbook.';
  }
  if (mode === 'signup') {
    return 'Couldn’t finish signing you up just now. Check your details and try again.';
  }
  return 'Couldn’t get you in just now. Check your details and try again.';
}

function AuthModal() {
  const { open, mode, closeAuth, setMode } = useAuthGate();
  const titleId = useId();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !pending) closeAuth();
    };

    document.addEventListener('keydown', onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, closeAuth, pending]);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setPending(false);
    setShowPassword(false);
  }, [open, mode]);

  async function finishWithCredentials() {
    const result = await signIn('credentials', {
      username: username.trim(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(friendlyAuthMessage('Invalid username or password', 'signin'));
      return false;
    }

    closeAuth();
    router.push('/home');
    router.refresh();
    return true;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      if (mode === 'signup') {
        const response = await userSignupClient({
          username: username.trim(),
          email: email.trim() || undefined,
          password,
        });

        if (response.error || response.status >= 400) {
          setError(friendlyAuthMessage(response.error, 'signup'));
          return;
        }

        const signedIn = await finishWithCredentials();
        if (!signedIn) {
          setError(
            friendlyAuthMessage('Account created, but sign-in failed. Try signing in.', 'signup')
          );
          setMode('signin');
        }
        return;
      }

      await finishWithCredentials();
    } catch {
      setError(friendlyAuthMessage(null, mode));
    } finally {
      setPending(false);
    }
  }

  if (!open) return null;

  const isSignup = mode === 'signup';

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]"
        onClick={() => {
          if (!pending) closeAuth();
        }}
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
            onClick={() => {
              if (!pending) closeAuth();
            }}
            className="rounded-xl border-[2.5px] border-border bg-surface-2 px-2.5 py-1 font-display text-sm font-bold"
            aria-label="Close"
            disabled={pending}
          >
            ✕
          </button>
        </div>

        <form className="space-y-3" onSubmit={onSubmit}>
          <Input
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourhandle"
            autoComplete="username"
            required
            disabled={pending}
          />
          {isSignup ? (
            <Input
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@somewhere.com"
              autoComplete="email"
              disabled={pending}
            />
          ) : null}
          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Something memorable"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            required
            disabled={pending}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-[2.5px] border-border bg-surface-2 text-ink hover:bg-lime disabled:opacity-50"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                disabled={pending}
              >
                {showPassword ? (
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.02-2.89 2.99-5.15 5.47-6.53" />
                    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 8a11.7 11.7 0 0 1-2.16 3.19" />
                    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                    <path d="M1 1l22 22" />
                  </svg>
                ) : (
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            }
          />
          {error ? (
            <p
              className="rounded-xl border-[2.5px] border-border bg-sun/50 px-3 py-2 text-sm font-medium text-ink"
              role="status"
            >
              {error}
            </p>
          ) : null}
          <Button type="submit" variant="lime" className="w-full" disabled={pending}>
            {pending ? 'Working…' : isSignup ? 'Create account' : 'Sign in'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted">
          {isSignup ? 'Already got a passport stamp?' : 'First time here?'}{' '}
          <button
            type="button"
            className={cn(
              'font-display font-bold uppercase underline decoration-[3px] underline-offset-4'
            )}
            onClick={() => {
              if (pending) return;
              setError(null);
              setMode(isSignup ? 'signin' : 'signup');
            }}
            disabled={pending}
          >
            {isSignup ? 'Sign in' : 'Create account'}
          </button>
        </p>
      </Card>
    </div>
  );
}
