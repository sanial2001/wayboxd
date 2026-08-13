import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type StampProps = {
  children: ReactNode;
  className?: string;
};

export function Stamp({ children, className }: StampProps) {
  return (
    <span
      className={cn(
        'stamp inline-flex items-center justify-center rounded-full px-3 py-1 font-display text-[10px] font-black sm:text-xs',
        className
      )}
    >
      {children}
    </span>
  );
}
