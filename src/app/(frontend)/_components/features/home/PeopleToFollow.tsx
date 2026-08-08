import { PersonCard } from '@/components/features/people/PersonCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { Person } from '@/types';

export function PeopleToFollow({ people }: { people: Person[] }) {
  return (
    <section>
      <SectionHeader
        eyebrow="Main character energy"
        title="People to stalk (nicely)"
        description="Travelers whose taste might ruin your savings account — in the best way."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {people.map((person, index) => (
          <PersonCard key={person.id} person={person} tilt={index % 2 === 0 ? 'left' : 'right'} />
        ))}
      </div>
    </section>
  );
}
