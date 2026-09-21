import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type CloseButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

/** Circular dismiss control — 40px, 2.5px border, surface-2 fill. Use on every modal. */
export function CloseButton({
  label = 'Close',
  className,
  type = 'button',
  ...props
}: CloseButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[2.5px] border-border bg-surface-2 text-ink disabled:opacity-50',
        className
      )}
      {...props}
    >
      <span aria-hidden className="text-xl leading-none">
        ×
      </span>
    </button>
  );
}
