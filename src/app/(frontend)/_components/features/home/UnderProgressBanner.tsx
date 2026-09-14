'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Stamp } from '@/components/ui/Stamp';

export function UnderProgressBanner() {
  const { data: session, status } = useSession();
  if (status !== 'authenticated') {
    return null;
  }

  const username = session?.userDetails?.username;

  return (
    <Container className="py-10 sm:py-16">
      <section className="overflow-hidden rounded-[2rem] border-[3px] border-border bg-purple p-8 text-white shadow-chunky-lg sm:p-12">
        <Stamp className="border-lime text-lime">Under progress</Stamp>
        <h1 className="mt-5 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
          We&apos;re still packing the scrapbook
        </h1>
        <p className="mt-4 max-w-xl text-lg text-white/85">
          You&apos;re in. Set up how you show up while we finish the rest of the scrapbook.
        </p>
        <Button
          href={username ? `/profile/${username}` : '/settings/profile'}
          variant="lime"
          className="mt-6"
        >
          Your profile
        </Button>
      </section>
    </Container>
  );
}
