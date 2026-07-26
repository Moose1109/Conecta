export type ActivityCategory =
  | "Naturaleza"
  | "Cultura"
  | "Gastronomía"
  | "Deporte"
  | "Música"
  | "Voluntariado"
  | "Mercados"
  | "Fiestas locales"
  | "Otra";

export type EntityDataSource = "demo" | "persistent";

export type Village = {
  dataSource: EntityDataSource;
  id: string;
  slug?: string;
  name: string;
  province: string;
  region: string;
  population: number;
  image?: string;
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
  dataSource: EntityDataSource;
  id: string;
  slug?: string;
  title: string;
  category: ActivityCategory;
  villageId: string;
  villageName?: string;
  startsAt?: string;
  endsAt?: string;
  date: string;
  time: string;
  capacity: number;
  spotsLeft?: number;
  participantsCount?: number;
  image?: string;
  bannerImage?: string;
  description: string;
  organizer: string;
  location?: string;
  status?: string;
  isJoined?: boolean;
  isSaved?: boolean;
};

export type CommunityPost = {
  dataSource: EntityDataSource;
  id: string;
  title: string;
  content: string;
  authorId?: string;
  villageId?: string;
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

export type AuthUser = {
  id: string;
  name: string;
  email?: string;
  username?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  role?: string;
  favoriteVillageId?: string | null;
  stats?: {
    activities?: number;
    posts?: number;
    followedVillages?: number;
  };
  createdAt?: string;
};
