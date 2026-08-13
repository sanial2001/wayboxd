import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'article' | 'section' | 'li';
  children: ReactNode;
  padded?: boolean;
  tilt?: boolean | 'left' | 'right';
  interactive?: boolean;
};

export function Card({
  as: Tag = 'div',
  children,
  className,
  padded = true,
  tilt = false,
  interactive = false,
  ...props
}: CardProps) {
  const tiltClass =
    tilt === true || tilt === 'right'
      ? 'motion-safe:rotate-1'
      : tilt === 'left'
        ? 'motion-safe:-rotate-1'
        : '';

  return (
    <Tag
      className={cn(
        'rounded-[1.75rem] border-[3px] border-border bg-surface shadow-chunky',
        padded && 'p-4 sm:p-5',
        interactive &&
          'transition motion-safe:duration-200 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-chunky-lg',
        tiltClass,
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
