import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';

type AvatarProps = {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  className?: string;
};

const sizes = {
  sm: 'h-8 w-8',
  md: 'h-11 w-11',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

export function Avatar({ src, alt, size = 'md', href, className }: AvatarProps) {
  const content = (
    <span
      className={cn(
        'relative inline-block overflow-hidden rounded-full border-[3px] border-border bg-surface-2 shadow-chunky-sm',
        sizes[size],
        className
      )}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="96px" />
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block shrink-0" aria-label={alt}>
        {content}
      </Link>
    );
  }

  return content;
}
