'use client';

import { useSession } from 'next-auth/react';
import { Container } from '@/components/ui/Container';
import { Stamp } from '@/components/ui/Stamp';

export function UnderProgressBanner() {
  const { status } = useSession();
  if (status !== 'authenticated') {
    return null;
  }

  return (
    <Container className="py-10 sm:py-16">
      <section className="overflow-hidden rounded-[2rem] border-[3px] border-border bg-purple p-8 text-white shadow-chunky-lg sm:p-12">
        <Stamp className="border-lime text-lime">Under progress</Stamp>
        <h1 className="mt-5 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
          We&apos;re still packing the scrapbook
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/85">
          You&apos;re in. The logged-in app is being built — check back once the next pages land.
        </p>
      </section>
    </Container>
  );
}
