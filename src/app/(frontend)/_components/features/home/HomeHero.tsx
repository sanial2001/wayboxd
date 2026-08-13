import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Stamp } from '@/components/ui/Stamp';

export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border-[3px] border-border bg-surface shadow-chunky-lg">
      <div className="absolute -right-6 top-6 hidden sm:block">
        <Stamp>Pack light</Stamp>
      </div>
      <div className="absolute -left-2 bottom-8 hidden rotate-[-8deg] md:block">
        <Stamp className="border-purple text-purple">Judge freely</Stamp>
      </div>
      <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:p-12">
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-purple">
            Real places · Loud opinions · Zero corporate speak
          </p>
          <h1 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Where are we <span className="highlighter">going?</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Follow travelers with taste, steal their lists, and argue about cafés like it&apos;s a
            sport. Booking apps can keep the fine print — we want the gossip.
          </p>
          <form action="/search" className="mt-8 max-w-xl">
            <Input
              name="q"
              placeholder="Hunt places, cities, chaotic people..."
              aria-label="Search places, cities, people"
              leading={<span aria-hidden>⌕</span>}
            />
          </form>
          <p className="mt-3 flex items-center gap-2 text-sm text-muted">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-lime" aria-hidden />
            Near you · Bangalore (or wherever your phone thinks you are)
          </p>
        </div>
        <div className="rounded-[1.5rem] border-[3px] border-border bg-purple p-5 text-white shadow-chunky motion-safe:rotate-1">
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-lime">
            Hot take of the hour
          </p>
          <p className="mt-3 font-display text-3xl font-black uppercase leading-tight">
            People have opinions.
          </p>
          <p className="mt-3 text-sm text-white/85">
            Read the ones that sound like your funniest friend who somehow always finds the good
            spot.
          </p>
          <Button href="/review/new" variant="lime" size="sm" className="mt-5">
            Spill yours
          </Button>
        </div>
      </div>
    </section>
  );
}
