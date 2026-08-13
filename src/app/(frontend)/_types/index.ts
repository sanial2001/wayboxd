export type Place = {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
  image: string;
  excerpt?: string;
  excerptAuthor?: string;
  categories?: string[];
  priceRange?: string;
  bestTime?: string;
  website?: string;
  hours?: string;
};

export type Person = {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatar: string;
  placesReviewed: number;
  countriesVisited: number;
  followers: number;
  following: number;
  taste?: string[];
};

export type Review = {
  id: string;
  placeSlug: string;
  title: string;
  body?: string;
  rating: number;
  author: Person;
  createdAt: string;
  photoCount: number;
  likes: number;
  comments: number;
  tags?: string[];
  wouldGoAgain?: boolean;
};

export type PlaceList = {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  placeCount: number;
  author: Person;
  places?: Place[];
};

export type Community = {
  id: string;
  slug: string;
  name: string;
  description: string;
  memberCount: number;
  coverImage: string;
  accent: 'purple' | 'lime' | 'coral' | 'tangerine' | 'sky' | 'sun' | 'pink';
};
