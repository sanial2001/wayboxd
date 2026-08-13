import type { Community, Person, Place, PlaceList, Review } from '@/types';

export const people: Person[] = [
  {
    id: '1',
    username: 'maya',
    name: 'Maya Chen',
    bio: 'Collecting cafés, stamps, and questionable life decisions.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    placesReviewed: 142,
    countriesVisited: 19,
    followers: 3840,
    following: 210,
    taste: ['Cafés', 'Street food', 'Night walks'],
  },
  {
    id: '2',
    username: 'arjun',
    name: 'Arjun Mehta',
    bio: 'Bangalore nights, loud rooms, and beer that tastes like an opinion.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    placesReviewed: 98,
    countriesVisited: 11,
    followers: 2104,
    following: 340,
    taste: ['Nightlife', 'Breweries', 'Live music'],
  },
  {
    id: '3',
    username: 'rohan',
    name: 'Rohan Das',
    bio: 'Shows up after the crowds leave. Annoyingly right about it.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    placesReviewed: 76,
    countriesVisited: 22,
    followers: 5120,
    following: 88,
    taste: ['Islands', 'Hikes', 'Hidden spots'],
  },
  {
    id: '4',
    username: 'kelvin',
    name: 'Kelvin Nath',
    bio: 'Finding good places, roasting the bad ones, and calling it research.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    placesReviewed: 87,
    countriesVisited: 14,
    followers: 243,
    following: 128,
    taste: ['Cafés', 'Mountains', 'Beaches', 'Nightlife', 'Food'],
  },
  {
    id: '5',
    username: 'sofia',
    name: 'Sofia Reyes',
    bio: 'Passport stamps beat plans. Always. Itineraries are suggestions.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    placesReviewed: 201,
    countriesVisited: 31,
    followers: 9200,
    following: 412,
    taste: ['Beaches', 'Markets', 'Sunsets'],
  },
];

export const places: Place[] = [
  {
    id: '1',
    slug: 'toit',
    name: 'Toit',
    city: 'Bangalore',
    country: 'India',
    rating: 4.6,
    reviewCount: 842,
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&h=800&fit=crop',
    excerpt: 'The beer is good. The music is aggressively loud.',
    excerptAuthor: 'arjun',
    categories: ['Brewery', 'Nightlife'],
    priceRange: '₹₹',
    bestTime: 'Thu–Sat evenings',
    website: 'https://toit.in',
    hours: '12:00 – 23:30',
  },
  {
    id: '2',
    slug: 'oia',
    name: 'Oia',
    city: 'Santorini',
    country: 'Greece',
    rating: 4.7,
    reviewCount: 1284,
    image: 'https://images.unsplash.com/photo-1570077186673-f96372a0a9c4?w=1600&h=1000&fit=crop',
    excerpt: 'Beautiful. Crowded. Still worth it.',
    excerptAuthor: 'maya',
    categories: ['Town', 'Views', 'Sunset'],
    priceRange: '€€€',
    bestTime: 'Shoulder season, early morning',
    hours: 'Always open (it is a town)',
  },
  {
    id: '3',
    slug: 'cubbon-park',
    name: 'Cubbon Park',
    city: 'Bangalore',
    country: 'India',
    rating: 4.5,
    reviewCount: 2103,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&h=800&fit=crop',
    excerpt: 'The city’s lungs. Bring a book and ignore your phone.',
    excerptAuthor: 'kelvin',
    categories: ['Park', 'Walk'],
    priceRange: 'Free',
    bestTime: 'Weekday mornings',
  },
  {
    id: '4',
    slug: 'shibuya-crossing',
    name: 'Shibuya Crossing',
    city: 'Tokyo',
    country: 'Japan',
    rating: 4.4,
    reviewCount: 4521,
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=800&fit=crop',
    excerpt: 'Chaos as choreography. Cross twice.',
    excerptAuthor: 'sofia',
    categories: ['Landmark', 'City'],
    priceRange: 'Free',
    bestTime: 'Evening rush',
  },
  {
    id: '5',
    slug: 'third-wave-coffee',
    name: 'Third Wave Coffee',
    city: 'Bangalore',
    country: 'India',
    rating: 4.3,
    reviewCount: 612,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=800&fit=crop',
    excerpt: 'For people who take their coffee too seriously. Relatable.',
    excerptAuthor: 'maya',
    categories: ['Café'],
    priceRange: '₹₹',
    bestTime: 'Late mornings',
  },
  {
    id: '6',
    slug: 'amalfi-coast',
    name: 'Amalfi Coast',
    city: 'Amalfi',
    country: 'Italy',
    rating: 4.8,
    reviewCount: 3012,
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&h=800&fit=crop',
    excerpt: 'Postcard that somehow survived the Instagram era.',
    excerptAuthor: 'rohan',
    categories: ['Coast', 'Drive'],
    priceRange: '€€€',
    bestTime: 'May or September',
  },
];

const byUsername = Object.fromEntries(people.map((p) => [p.username, p]));

export const reviews: Review[] = [
  {
    id: '1',
    placeSlug: 'oia',
    title: 'Beautiful. Crowded. Still worth it.',
    body: 'Yes, everyone has the same photo. Take it anyway. Then walk five minutes past the viewpoint and suddenly the island remembers how to breathe.',
    rating: 4.5,
    author: byUsername.maya,
    createdAt: '2 days ago',
    photoCount: 6,
    likes: 248,
    comments: 31,
    tags: ['sunset', 'crowds', 'worth it'],
    wouldGoAgain: true,
  },
  {
    id: '2',
    placeSlug: 'oia',
    title: "Everyone told me to come for sunset. Don't. Come after the crowds leave.",
    body: 'The blue hour is quieter, cooler, and somehow more honest. The white walls glow without the elbows.',
    rating: 5,
    author: byUsername.rohan,
    createdAt: '5 days ago',
    photoCount: 4,
    likes: 512,
    comments: 47,
    tags: ['timing', 'blue hour'],
    wouldGoAgain: true,
  },
  {
    id: '3',
    placeSlug: 'toit',
    title: 'The beer is good. The music is aggressively loud.',
    body: 'Order the flight. Claim a corner. Accept that conversation will become interpretive dance.',
    rating: 4,
    author: byUsername.arjun,
    createdAt: '1 week ago',
    photoCount: 3,
    likes: 189,
    comments: 22,
    tags: ['brewery', 'loud'],
    wouldGoAgain: true,
  },
  {
    id: '4',
    placeSlug: 'toit',
    title: 'Crowded in the best and worst ways.',
    rating: 3.5,
    author: byUsername.kelvin,
    createdAt: '3 days ago',
    photoCount: 2,
    likes: 64,
    comments: 8,
    wouldGoAgain: false,
  },
  {
    id: '5',
    placeSlug: 'shibuya-crossing',
    title: 'Chaos as choreography. Cross twice.',
    body: 'Once for the photo. Twice because you finally understand the rhythm.',
    rating: 4.5,
    author: byUsername.sofia,
    createdAt: '4 days ago',
    photoCount: 8,
    likes: 891,
    comments: 56,
    wouldGoAgain: true,
  },
  {
    id: '6',
    placeSlug: 'cubbon-park',
    title: 'The city’s lungs. Bring a book and ignore your phone.',
    rating: 5,
    author: byUsername.kelvin,
    createdAt: '1 day ago',
    photoCount: 1,
    likes: 112,
    comments: 14,
    wouldGoAgain: true,
  },
];

export const lists: PlaceList[] = [
  {
    id: '1',
    slug: 'places-id-move-to-tomorrow',
    title: "PLACES I'D MOVE TO TOMORROW",
    description: 'No lease required. Just vibes and a one-way ticket fantasy.',
    coverImage:
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&h=800&fit=crop',
    placeCount: 12,
    author: byUsername.maya,
    places: [places[1], places[5], places[3]],
  },
  {
    id: '2',
    slug: 'cafes-too-seriously',
    title: 'CAFÉS FOR PEOPLE WHO TAKE THEIR COFFEE TOO SERIOUSLY',
    description: 'Latte art judgments welcome. Small talk optional.',
    coverImage:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&h=800&fit=crop',
    placeCount: 18,
    author: byUsername.kelvin,
    places: [places[4], places[2]],
  },
  {
    id: '3',
    slug: 'tourist-traps-worth-it',
    title: 'TOURIST TRAPS THAT ARE ACTUALLY WORTH IT',
    description: 'Sometimes the hype survives contact with reality.',
    coverImage:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200&h=800&fit=crop',
    placeCount: 9,
    author: byUsername.rohan,
    places: [places[1], places[3], places[5]],
  },
  {
    id: '4',
    slug: 'places-that-changed-my-life',
    title: 'PLACES THAT CHANGED MY LIFE',
    description: 'Dramatic? Yes. Accurate? Also yes.',
    coverImage:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=800&fit=crop',
    placeCount: 7,
    author: byUsername.sofia,
  },
];

export const communities: Community[] = [
  {
    id: '1',
    slug: 'solo-travel',
    name: 'Solo Travel',
    description: 'One seat. Infinite itineraries. Occasional talking to yourself.',
    memberCount: 84000,
    coverImage:
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=800&fit=crop',
    accent: 'purple',
  },
  {
    id: '2',
    slug: 'japan',
    name: 'Japan',
    description: 'Trains, temples, convenience stores, and opinions about both.',
    memberCount: 132000,
    coverImage:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=800&fit=crop',
    accent: 'coral',
  },
  {
    id: '3',
    slug: 'bangalore',
    name: 'Bangalore',
    description: 'Traffic, weather debates, and cafés that refuse to be quiet.',
    memberCount: 28000,
    coverImage:
      'https://images.unsplash.com/photo-1596176530529-78163a4f7d55?w=1200&h=800&fit=crop',
    accent: 'lime',
  },
  {
    id: '4',
    slug: 'backpacking',
    name: 'Backpacking',
    description: 'Pack light. Collect stamps. Overshare the stories.',
    memberCount: 211000,
    coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=800&fit=crop',
    accent: 'tangerine',
  },
];

export function getPlace(slug: string) {
  return places.find((p) => p.slug === slug);
}

export function getPerson(username: string) {
  return people.find((p) => p.username === username);
}

export function getReviewsForPlace(slug: string) {
  return reviews.filter((r) => r.placeSlug === slug);
}

export function getList(slug: string) {
  return lists.find((l) => l.slug === slug);
}

export function getCommunity(slug: string) {
  return communities.find((c) => c.slug === slug);
}

export function formatMembers(count: number) {
  if (count >= 1000) {
    return `${Math.round(count / 1000)}K`;
  }
  return String(count);
}
