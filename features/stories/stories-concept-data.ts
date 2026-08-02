export const STORIES_BACKEND_NOTICE =
  "Las historias durarán 24 horas cuando exista el backend.";

export type StoriesConceptState =
  | "empty"
  | "error"
  | "loading"
  | "many-segments"
  | "ready"
  | "single";

export type StoryOwnerType = "activity" | "organization" | "user" | "village";

export type ConceptStoryItem = {
  caption: string;
  createdAtLabel?: string;
  id: string;
  image?: string;
  imageAlt: string;
};

export type ConceptStoryGroup = {
  id: string;
  ownerInitials: string;
  ownerName: string;
  ownerType: StoryOwnerType;
  stories: ConceptStoryItem[];
  villageName?: string;
};

export type StoryPosition = {
  groupIndex: number;
  storyIndex: number;
};

const readyGroups: ConceptStoryGroup[] = [
  {
    id: "group-neighbour",
    ownerInitials: "VE",
    ownerName: "Vecina de ejemplo",
    ownerType: "user",
    villageName: "Valle Claro",
    stories: [
      {
        caption: "Así amanece hoy la plaza del pueblo.",
        createdAtLabel: "Hace 2 h · ejemplo",
        id: "neighbour-1",
        image: "/images/raiz-village-hero.webp",
        imageAlt: "Vista editorial de un pueblo entre montañas al amanecer",
      },
      {
        caption: "El café de la plaza ya tiene mesas fuera.",
        createdAtLabel: "Hace 2 h · ejemplo",
        id: "neighbour-2",
        image: "/images/raiz-market.webp",
        imageAlt: "Imagen editorial de una terraza con mesas al aire libre",
      },
      {
        caption: "Esta variante conceptual comprueba el aspecto sin imagen disponible.",
        createdAtLabel: "Hace 1 h · ejemplo",
        id: "neighbour-3",
        imageAlt: "Historia conceptual sin imagen disponible",
      },
      {
        caption:
          "Esta historia conceptual contiene un texto deliberadamente largo para comprobar que el visor conserva la legibilidad, permite desplazarse verticalmente y mantiene visibles los controles incluso en pantallas de poca altura o con zoom ampliado.",
        createdAtLabel: "Hace 1 h · ejemplo",
        id: "neighbour-4",
        image: "/images/raiz-village-hero.webp",
        imageAlt: "Paisaje editorial de un pueblo de montaña al atardecer",
      },
      {
        caption: "Última actualización de ejemplo de esta vecina.",
        createdAtLabel: "Hace 40 min · ejemplo",
        id: "neighbour-5",
        image: "/images/raiz-market.webp",
        imageAlt: "Imagen editorial de un puesto de mercado local",
      },
    ],
  },
  {
    id: "group-village",
    ownerInitials: "VC",
    ownerName: "Valle Claro",
    ownerType: "village",
    stories: [
      {
        caption: "Una mirada rápida al paisaje que rodea el pueblo.",
        createdAtLabel: "Hace 3 h · ejemplo",
        id: "village-1",
        image: "/images/raiz-village-hero.webp",
        imageAlt: "Imagen editorial de un pueblo y su paisaje montañoso",
      },
      {
        caption: "El mirador conceptual del pueblo, sin datos reales todavía.",
        createdAtLabel: "Hace 3 h · ejemplo",
        id: "village-2",
        image: "/images/raiz-village-hero.webp",
        imageAlt: "Imagen editorial de un mirador sobre el valle",
      },
      {
        caption: "Así se vería una historia de cierre del pueblo.",
        createdAtLabel: "Hace 2 h · ejemplo",
        id: "village-3",
        image: "/images/raiz-market.webp",
        imageAlt: "Imagen editorial de una calle del pueblo con puestos",
      },
    ],
  },
  {
    id: "group-activity",
    ownerInitials: "FL",
    ownerName: "Fiesta local",
    ownerType: "activity",
    villageName: "Mercado Viejo",
    stories: [
      {
        caption: "La plaza empieza a prepararse para la actividad comunitaria.",
        createdAtLabel: "Hace 5 h · ejemplo",
        id: "activity-1",
        image: "/images/raiz-market.webp",
        imageAlt: "Imagen editorial de una plaza con actividad local",
      },
    ],
  },
  {
    id: "group-organization",
    ownerInitials: "AC",
    ownerName: "Asociación Cultural del Valle y Pueblos de la Sierra",
    ownerType: "organization",
    villageName: "Sierra Luna",
    stories: [
      {
        caption: "El sendero está tranquilo y con buena visibilidad hoy.",
        createdAtLabel: "Hace 6 h · ejemplo",
        id: "organization-1",
        image: "/images/raiz-village-hero.webp",
        imageAlt: "Paisaje editorial del valle y las montañas que rodean el sendero",
      },
      {
        caption: "Segunda actualización de ejemplo de la asociación.",
        createdAtLabel: "Hace 5 h · ejemplo",
        id: "organization-2",
        image: "/images/raiz-market.webp",
        imageAlt: "Imagen editorial de un encuentro comunitario",
      },
    ],
  },
];

const singleGroup: ConceptStoryGroup[] = [
  {
    id: "group-single",
    ownerInitials: "GE",
    ownerName: "Guía local de ejemplo",
    ownerType: "user",
    villageName: "Valle Claro",
    stories: [
      {
        caption: "Variante conceptual con un único grupo y una única historia.",
        createdAtLabel: "Hace 10 min · ejemplo",
        id: "single-1",
        image: "/images/raiz-village-hero.webp",
        imageAlt: "Imagen editorial de un pueblo de montaña",
      },
    ],
  },
];

const manySegmentsGroup: ConceptStoryGroup[] = [
  {
    id: "group-many",
    ownerInitials: "VE",
    ownerName: "Vecina de ejemplo",
    ownerType: "user",
    villageName: "Valle Claro",
    stories: Array.from({ length: 10 }, (_, index) => ({
      caption: `Historia conceptual número ${index + 1} de una serie extensa, usada para comprobar que los segmentos superiores no desbordan el ancho disponible.`,
      createdAtLabel: "Hace unos minutos · ejemplo",
      id: `many-${index + 1}`,
      image: index % 2 === 0 ? "/images/raiz-village-hero.webp" : "/images/raiz-market.webp",
      imageAlt: `Imagen editorial de ejemplo número ${index + 1}`,
    })),
  },
];

export function getConceptStoryGroups(state: StoriesConceptState): ConceptStoryGroup[] {
  switch (state) {
    case "empty":
    case "error":
    case "loading":
      return [];
    case "single":
      return singleGroup;
    case "many-segments":
      return manySegmentsGroup;
    default:
      return readyGroups;
  }
}

export function isStoriesConceptState(value: string): value is StoriesConceptState {
  return ["empty", "error", "loading", "many-segments", "ready", "single"].includes(value);
}

export function getFirstStoryPosition(groups: ConceptStoryGroup[]): StoryPosition | undefined {
  if (!groups.length || !groups[0]?.stories.length) return undefined;
  return { groupIndex: 0, storyIndex: 0 };
}

export function getLastStoryPosition(groups: ConceptStoryGroup[]): StoryPosition | undefined {
  const groupIndex = groups.length - 1;
  const group = groups[groupIndex];
  if (!group || !group.stories.length) return undefined;
  return { groupIndex, storyIndex: group.stories.length - 1 };
}

export function getNextStoryPosition(
  groups: ConceptStoryGroup[],
  position: StoryPosition,
): StoryPosition | undefined {
  const group = groups[position.groupIndex];
  if (!group) return undefined;

  if (position.storyIndex < group.stories.length - 1) {
    return { groupIndex: position.groupIndex, storyIndex: position.storyIndex + 1 };
  }
  if (position.groupIndex < groups.length - 1) {
    return { groupIndex: position.groupIndex + 1, storyIndex: 0 };
  }
  return undefined;
}

export function getPreviousStoryPosition(
  groups: ConceptStoryGroup[],
  position: StoryPosition,
): StoryPosition | undefined {
  if (position.storyIndex > 0) {
    return { groupIndex: position.groupIndex, storyIndex: position.storyIndex - 1 };
  }
  if (position.groupIndex > 0) {
    const previousGroup = groups[position.groupIndex - 1];
    if (!previousGroup) return undefined;
    return { groupIndex: position.groupIndex - 1, storyIndex: previousGroup.stories.length - 1 };
  }
  return undefined;
}

export const storyOwnerTypeLabels: Record<StoryOwnerType, string> = {
  activity: "Actividad conceptual",
  organization: "Organización conceptual",
  user: "Persona conceptual",
  village: "Pueblo conceptual",
};
