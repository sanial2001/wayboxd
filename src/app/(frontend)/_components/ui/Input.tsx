import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  leading?: ReactNode;
};

export function Input({ label, hint, leading, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="flex w-full flex-col gap-2" htmlFor={inputId}>
      {label ? (
        <span className="font-display text-sm font-bold uppercase tracking-wide">{label}</span>
      ) : null}
      <span className="relative flex items-center">
        {leading ? (
          <span className="pointer-events-none absolute left-4 text-muted">{leading}</span>
        ) : null}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-2xl border-[3px] border-border bg-surface px-4 py-3 font-sans text-base text-ink shadow-chunky-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/30',
            leading && 'pl-11',
            className
          )}
          {...props}
        />
      </span>
      {hint ? <span className="text-sm text-muted">{hint}</span> : null}
    </label>
  );
}
