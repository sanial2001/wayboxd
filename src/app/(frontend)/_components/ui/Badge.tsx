import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type BadgeProps = {
  children: ReactNode;
  tone?: 'ink' | 'purple' | 'lime' | 'coral' | 'tangerine' | 'sky' | 'sun' | 'pink';
  className?: string;
};

const tones = {
  ink: 'bg-ink text-paper',
  purple: 'bg-purple text-white',
  lime: 'bg-lime text-ink',
  coral: 'bg-coral text-ink',
  tangerine: 'bg-tangerine text-ink',
  sky: 'bg-sky text-ink',
  sun: 'bg-sun text-ink',
  pink: 'bg-pink text-ink',
};

export function Badge({ children, tone = 'lime', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border-[2.5px] border-border px-2.5 py-0.5 font-display text-xs font-bold uppercase tracking-wide',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
