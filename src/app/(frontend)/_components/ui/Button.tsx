import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'lime' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'icon';

const variants: Record<Variant, string> = {
  primary:
    'bg-purple text-white hover:-translate-y-0.5 active:translate-y-0 active:translate-x-0.5',
  secondary: 'bg-surface text-ink hover:-translate-y-0.5 active:translate-y-0',
  lime: 'bg-lime text-ink hover:-translate-y-0.5 active:translate-y-0',
  ghost: 'bg-transparent text-ink border-transparent shadow-none hover:bg-surface-2',
  danger: 'bg-coral text-ink hover:-translate-y-0.5',
  outline: 'bg-transparent text-ink hover:bg-surface',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
  icon: 'p-2.5',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-2xl border-[3px] border-border font-display font-bold uppercase tracking-wide shadow-chunky transition motion-safe:duration-200 disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
