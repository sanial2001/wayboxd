import type { Metadata } from 'next';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { places } from '@/data/mock';

export const metadata: Metadata = {
  title: 'Map',
};

const pins = [
  { label: 'Been there', tone: 'lime' as const, top: '28%', left: '62%' },
  { label: 'Reviewed it', tone: 'purple' as const, top: '44%', left: '48%' },
  { label: 'Saved for later', tone: 'coral' as const, top: '36%', left: '72%' },
  { label: 'Friend said go', tone: 'sky' as const, top: '58%', left: '55%' },
];

export default function MapPage() {
  return (
    <Container className="space-y-6 py-8 sm:py-10">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
          Wander mode
        </h1>
        <p className="mt-3 text-muted">
          A map for curiosity, not turn-by-turn guilt. Poke pins. Plot chaos. Ignore traffic.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {pins.map((pin) => (
          <Badge key={pin.label} tone={pin.tone}>
            {pin.label}
          </Badge>
        ))}
      </div>

      <Card padded={false} className="relative overflow-hidden">
        <div
          className="relative min-h-[420px] bg-[radial-gradient(circle_at_30%_40%,#67d8ff55,transparent_35%),radial-gradient(circle_at_70%_60%,#c8ff3d44,transparent_40%),linear-gradient(160deg,#efe6d6,#d9efe8)] sm:min-h-[560px]"
          role="img"
          aria-label="Interactive travel map preview"
        >
          <div className="absolute inset-6 rounded-[1.5rem] border-[3px] border-dashed border-border/40" />
          <p className="absolute left-1/2 top-8 -translate-x-1/2 rounded-full border-[2.5px] border-border bg-surface px-3 py-1 font-display text-xs font-bold uppercase shadow-chunky-sm">
            Drag around. Discover nonsense.
          </p>
          {pins.map((pin) => (
            <div
              key={pin.label}
              className="absolute motion-safe:animate-[bounce_2.4s_ease-in-out_infinite]"
              style={{ top: pin.top, left: pin.left }}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-border bg-surface shadow-chunky font-display text-xs font-black">
                ✦
              </span>
            </div>
          ))}
          <div className="absolute bottom-6 left-6 right-6 grid gap-3 sm:grid-cols-3">
            {places.slice(0, 3).map((place) => (
              <div
                key={place.id}
                className="rounded-2xl border-[3px] border-border bg-surface/95 p-3 shadow-chunky-sm backdrop-blur"
              >
                <p className="font-display text-sm font-extrabold uppercase">{place.name}</p>
                <p className="text-xs text-muted">
                  {place.city}, {place.country}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </Container>
  );
}
