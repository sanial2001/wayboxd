import Link from 'next/link';
import { cn } from '@/lib/cn';

export function Logo({ className, href = '/' }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 font-display text-xl font-black uppercase tracking-tight sm:text-2xl',
        className
      )}
    >
      <span
        aria-hidden
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-[3px] border-border bg-lime shadow-chunky-sm motion-safe:rotate-[-4deg]"
      >
        W
      </span>
      <span>
        Way<span className="text-purple">Boxd</span>
      </span>
    </Link>
  );
}
