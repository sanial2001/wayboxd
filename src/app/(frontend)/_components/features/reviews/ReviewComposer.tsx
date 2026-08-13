'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Stamp } from '@/components/ui/Stamp';
import { places } from '@/data/mock';
import { cn } from '@/lib/cn';

const prompts = [
  'What blindsided you?',
  'Worth the hype?',
  'Would you come back?',
  'What should people know before going?',
];

const tagOptions = ['loud', 'worth it', 'hidden gem', 'overrated', 'sunset', 'food'];

export function ReviewComposer() {
  const [rating, setRating] = useState(4);
  const [goAgain, setGoAgain] = useState<boolean | null>(true);
  const [tags, setTags] = useState<string[]>(['worth it']);
  const [submitted, setSubmitted] = useState(false);

  function toggleTag(tag: string) {
    setTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]
    );
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-2xl space-y-4 text-center">
        <Stamp className="mx-auto">Filed</Stamp>
        <h1 className="font-display text-4xl font-black uppercase">
          And that&apos;s your official opinion.
        </h1>
        <p className="text-muted">
          The scrapbook just got louder. Somewhere, a tourist trap just felt a shiver.
        </p>
        <Button href="/home" variant="lime">
          Back to causing trouble
        </Button>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-3">
        <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-purple">
          Opinion factory
        </p>
        <h1 className="font-display text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
          Tell us what you really think.
        </h1>
        <p className="text-muted">
          Don&apos;t write a brochure. Write the thing you&apos;d text your group chat.
        </p>
      </header>

      <Card className="space-y-6">
        <label className="block space-y-2">
          <span className="font-display text-sm font-bold uppercase">
            Which place are we roasting / praising?
          </span>
          <select
            className="w-full rounded-2xl border-[3px] border-border bg-surface px-4 py-3 font-sans shadow-chunky-sm"
            defaultValue={places[0]?.slug}
          >
            {places.map((place) => (
              <option key={place.id} value={place.slug}>
                {place.name} — {place.city}
              </option>
            ))}
          </select>
        </label>

        <div>
          <p className="font-display text-sm font-bold uppercase">How many stars survived?</p>
          <div className="mt-2 flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={cn(
                  'h-12 w-12 rounded-2xl border-[3px] border-border font-display text-xl font-black shadow-chunky-sm transition motion-safe:hover:-translate-y-0.5',
                  rating >= value ? 'bg-sun' : 'bg-surface'
                )}
                aria-label={`${value} stars`}
                aria-pressed={rating === value}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-display text-sm font-bold uppercase">Would you go again?</p>
          <div className="mt-2 flex gap-2">
            <Button
              variant={goAgain === true ? 'lime' : 'secondary'}
              size="sm"
              onClick={() => setGoAgain(true)}
            >
              Book the sequel
            </Button>
            <Button
              variant={goAgain === false ? 'danger' : 'secondary'}
              size="sm"
              onClick={() => setGoAgain(false)}
            >
              One and done
            </Button>
          </div>
        </div>

        <label className="block space-y-2">
          <span className="font-display text-sm font-bold uppercase">Your take</span>
          <textarea
            rows={6}
            placeholder="Beautiful. Crowded. Still somehow worth it..."
            className="w-full rounded-2xl border-[3px] border-border bg-surface px-4 py-3 font-sans text-base shadow-chunky-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple/30"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="rounded-full border-[2.5px] border-dashed border-border bg-surface-2 px-3 py-1.5 text-sm font-medium hover:bg-lime"
            >
              {prompt}
            </button>
          ))}
        </div>

        <Input
          label="When did this happen?"
          type="month"
          name="visitDate"
          hint="Approximate is fine. Memory is a soft science."
        />

        <div>
          <p className="font-display text-sm font-bold uppercase">Stick some tags on it</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tagOptions.map((tag) => (
              <button key={tag} type="button" onClick={() => toggleTag(tag)}>
                <Badge tone={tags.includes(tag) ? 'purple' : 'sky'}>{tag}</Badge>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border-[3px] border-dashed border-border bg-surface-2 px-4 py-8 text-center">
          <p className="font-display font-bold uppercase">Toss photos here</p>
          <p className="mt-1 text-sm text-muted">Blurry sunsets and accidental thumbs welcome.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="lime" onClick={() => setSubmitted(true)}>
            Publish the chaos
          </Button>
          <Button variant="ghost">Hide it in drafts</Button>
        </div>
      </Card>
    </div>
  );
}
