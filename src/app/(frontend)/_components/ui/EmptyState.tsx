import { cn } from '@/lib/cn';

type EmptyStateProps = {
  title: string;
  description?: string;
  className?: string;
};

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-[1.75rem] border-[3px] border-dashed border-border bg-surface-2/60 px-6 py-12 text-center',
        className
      )}
    >
      <p className="font-display text-2xl font-extrabold uppercase tracking-tight">{title}</p>
      {description ? <p className="mt-2 text-muted">{description}</p> : null}
    </div>
  );
}
