'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/cn';

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolved, toggle } = useTheme();
  const isDark = resolved === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'inline-flex items-center justify-center rounded-2xl border-[3px] border-border bg-surface p-2.5 shadow-chunky-sm transition motion-safe:duration-200 motion-safe:hover:-translate-y-0.5',
        className
      )}
      aria-label={isDark ? 'Flip to daylight mode' : 'Flip to night mode'}
      title={isDark ? 'Too dark? Flip it.' : 'Too bright? Flip it.'}
    >
      <span aria-hidden className="font-display text-sm font-black">
        {isDark ? '☀' : '☾'}
      </span>
    </button>
  );
}
