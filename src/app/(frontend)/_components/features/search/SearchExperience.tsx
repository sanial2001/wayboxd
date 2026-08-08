'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PlaceCard } from '@/components/features/places/PlaceCard';
import { PersonCard } from '@/components/features/people/PersonCard';
import { ListCard } from '@/components/features/lists/ListCard';
import { CommunityCard } from '@/components/features/communities/CommunityCard';
import { ReviewCard } from '@/components/features/places/ReviewCard';
import { Input } from '@/components/ui/Input';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { communities, lists, people, places, reviews } from '@/data/mock';

export function SearchExperience() {
  const searchParams = useSearchParams();
  const initial = searchParams.get('q') ?? '';
  const [q, setQ] = useState(initial);
  const query = q.trim().toLowerCase();

  const matchedPlaces = query
    ? places.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query) ||
          p.country.toLowerCase().includes(query)
      )
    : places.slice(0, 3);

  const matchedPeople = query
    ? people.filter(
        (p) =>
          p.username.toLowerCase().includes(query) ||
          p.name.toLowerCase().includes(query) ||
          p.bio.toLowerCase().includes(query)
      )
    : people.slice(0, 3);

  const matchedLists = query
    ? lists.filter((l) => l.title.toLowerCase().includes(query))
    : lists.slice(0, 2);

  const matchedCommunities = query
    ? communities.filter((c) => c.name.toLowerCase().includes(query))
    : communities.slice(0, 2);

  const matchedReviews = query
    ? reviews.filter(
        (r) => r.title.toLowerCase().includes(query) || r.body?.toLowerCase().includes(query)
      )
    : reviews.slice(0, 2);

  return (
    <div className="space-y-10">
      <header className="max-w-3xl space-y-5">
        <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
          Where are we going?
        </h1>
        <p className="text-muted">
          Type something. Anything. Cities, people, vibes, unfinished weekend plans.
        </p>
        <Input
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Hunt places, cities, people, lists, clubs..."
          aria-label="Search"
          leading={<span aria-hidden>⌕</span>}
        />
        <div className="flex flex-wrap gap-2 text-sm">
          {['Paris', 'Bangalore', 'maya', 'cafés', 'Japan'].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setQ(suggestion)}
              className="rounded-full border-[2.5px] border-border bg-surface px-3 py-1 font-display text-xs font-bold uppercase shadow-chunky-sm hover:bg-lime"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </header>

      <section>
        <SectionHeader title="Places that matched the vibe" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {matchedPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="People who might get it" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matchedPeople.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Lists ready for theft" />
        <div className="grid gap-5 sm:grid-cols-2">
          {matchedLists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Clubs in the mix" />
        <div className="grid gap-5 sm:grid-cols-2">
          {matchedCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Opinions in the results"
          description="Because a place name alone never tells the whole story."
        />
        <div className="mx-auto grid max-w-3xl gap-4">
          {matchedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      <p className="text-center text-sm text-muted">
        Feeling lucky? Try{' '}
        <Link href="/search?q=Bangalore" className="underline decoration-[3px] underline-offset-2">
          /search?q=Bangalore
        </Link>
      </p>
    </div>
  );
}
