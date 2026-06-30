export type ActivityCategory =
  | "Naturaleza"
  | "Cultura"
  | "Gastronomía"
  | "Deporte"
  | "Música"
  | "Voluntariado"
  | "Mercados"
  | "Fiestas locales";

export type Village = {
  id: string;
  slug?: string;
  name: string;
  province: string;
  region: string;
  population: number;
  image: string;
  bannerImage?: string;
  tagline: string;
  description: string;
  highlights: string[];
  followersCount?: number;
  activitiesCount?: number;
  postsCount?: number;
  isFollowing?: boolean;
};

export type Activity = {
  id: string;
  slug?: string;
  title: string;
  category: ActivityCategory;
  villageId: string;
  villageName?: string;
  date: string;
  time: string;
  spots: number;
  spotsLeft?: number;
  participantsCount?: number;
  image: string;
  description: string;
  organizer: string;
  isJoined?: boolean;
  isSaved?: boolean;
};

export type CommunityPost = {
  id: string;
  title: string;
  content: string;
  villageId: string;
  villageName?: string;
  author: string;
  authorHandle?: string;
  handle?: string;
  avatar?: string;
  authorAvatar?: string;
  image?: string;
  date: string;
  likes?: number;
  isLiked?: boolean;
  comments?: number;
  commentsCount?: number;
  shares?: number;
  saved?: boolean;
  isSaved?: boolean;
};

export type MockUser = {
  id: string;
  name: string;
  email: string;
  handle: string;
  role: string;
  location: string;
  avatar: string;
  banner: string;
  favoriteVillageId: string;
  interests: string[];
  stats: {
    activities: number;
    posts: number;
    followedVillages: number;
  };
};
