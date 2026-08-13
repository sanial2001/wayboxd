import { cn } from '@/lib/cn';

type RatingProps = {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
};

export function Rating({ value, max = 5, size = 'md', showValue = true, className }: RatingProps) {
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-display font-bold',
        sizeClass,
        className
      )}
      aria-label={`${value} out of ${max} stars`}
    >
      <span aria-hidden className="text-tangerine">
        ★
      </span>
      {showValue ? <span>{value.toFixed(1)}</span> : null}
    </span>
  );
}
