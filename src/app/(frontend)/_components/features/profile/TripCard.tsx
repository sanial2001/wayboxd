import Image from 'next/image';
type TripCardTrip = {
  title: string;
  blurb: string | null;
  coverImageUrl: string | null;
  outboundUrl: string | null;
  tag: string | null;
  duration: string | null;
  tripDate: Date | string | null;
};

type TripCardProps = {
  trip: TripCardTrip;
  className?: string;
};

export function TripCard({ trip, className }: TripCardProps) {
  const badge = formatTripBadge(trip.tag, trip.duration);
  const dateLabel = trip.tripDate ? formatTripMonthYear(trip.tripDate) : '';
  const host = trip.outboundUrl ? hostnameFromUrl(trip.outboundUrl) : '';
  const coverSrc = trip.coverImageUrl?.trim() || null;

  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-[1.75rem] border-[3px] border-border bg-surface shadow-chunky',
        className
      )}
    >
      <div className="relative aspect-[16/10] bg-surface-2">
        {coverSrc ? (
          isRemoteHttpUrl(coverSrc) ? (
            <Image
              src={coverSrc}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverSrc} alt="" className="h-full w-full object-cover" />
          )
        ) : null}
        {badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wide text-paper">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {trip.title.trim() ? (
          <h3 className="font-display text-xl font-extrabold leading-tight tracking-tight">
            {trip.title}
          </h3>
        ) : (
          <h3 className="font-display text-xl font-extrabold leading-tight tracking-tight text-muted">
            Title
          </h3>
        )}
        {trip.blurb?.trim() ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-ink/90">{trip.blurb}</p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          {trip.outboundUrl && host ? (
            <a
              href={trip.outboundUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-[60%] truncate rounded-full border-[2.5px] border-border bg-tangerine/20 px-2.5 py-0.5 font-display text-[11px] font-bold uppercase tracking-wide text-tangerine"
            >
              {host}
            </a>
          ) : (
            <span />
          )}
          {dateLabel ? <span className="shrink-0 text-sm text-muted">{dateLabel}</span> : null}
        </div>
      </div>
    </article>
  );
}
