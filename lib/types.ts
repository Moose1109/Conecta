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
  name: string;
  province: string;
  region: string;
  population: number;
  image: string;
  tagline: string;
  description: string;
  highlights: string[];
};

export type Activity = {
  id: string;
  title: string;
  category: ActivityCategory;
  villageId: string;
  date: string;
  time: string;
  spots: number;
  image: string;
  description: string;
  organizer: string;
};

export type CommunityPost = {
  id: string;
  title: string;
  content: string;
  villageId: string;
  author: string;
  date: string;
};
