import { HomeHero } from '@/components/features/home/HomeHero';
import { PeopleToFollow } from '@/components/features/home/PeopleToFollow';
import { TrendingPlaces } from '@/components/features/home/TrendingPlaces';
import { ListCard } from '@/components/features/lists/ListCard';
import { CommunityCard } from '@/components/features/communities/CommunityCard';
import { AuthGateSurface } from '@/components/auth/AuthGate';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { communities, lists, people, places } from '@/data/mock';

export function LandingFeed() {
  return (
    <AuthGateSurface>
      <Container className="space-y-14 py-8 sm:space-y-16 sm:py-10">
        <HomeHero />
        <TrendingPlaces places={places.slice(0, 6)} />
        <PeopleToFollow people={people.filter((p) => p.username !== 'kelvin')} />
        <section>
          <SectionHeader
            eyebrow="Highly stealable"
            title="Lists worth pocketing"
            description="Other people's ranking systems so you don't have to invent your own."
            actionHref="/lists"
            actionLabel="Raid the lists"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {lists.slice(0, 3).map((list, i) => (
              <ListCard key={list.id} list={list} tilt={i % 2 === 0 ? 'left' : false} />
            ))}
          </div>
        </section>
        <section>
          <SectionHeader
            eyebrow="Find your people"
            title="Clubs for the travel-obsessed"
            description="Less forum. More group chat that somehow has good recommendations."
            actionHref="/communities"
            actionLabel="Crash a club"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {communities.map((community, i) => (
              <CommunityCard
                key={community.id}
                community={community}
                tilt={i % 2 === 0 ? 'right' : 'left'}
              />
            ))}
          </div>
        </section>
      </Container>
    </AuthGateSurface>
  );
}
