export type MomentSubtype =
  | "ahora"
  | "aviso"
  | "consejo"
  | "plan"
  | "postal"
  | "recuerdo";

export type MomentsConceptState = "empty" | "error" | "loading" | "ready";

export type ConceptMoment = {
  authorInitials: string;
  authorName: string;
  body: string;
  id: string;
  image?: string;
  subtype: MomentSubtype;
  timeLabel: string;
  title: string;
  villageName?: string;
};

export const momentSubtypeOrder = [
  "ahora",
  "postal",
  "recuerdo",
  "plan",
  "consejo",
  "aviso",
] satisfies MomentSubtype[];

export const momentSubtypeLabels: Record<MomentSubtype, string> = {
  ahora: "Ahora",
  aviso: "Aviso",
  consejo: "Consejo",
  plan: "Plan",
  postal: "Postal",
  recuerdo: "Recuerdo",
};

export const momentSubtypeDescriptions: Record<MomentSubtype, string> = {
  ahora: "Contenido inmediato, como se vería justo cuando ocurre.",
  aviso: "Información comunitaria que conviene destacar.",
  consejo: "Una recomendación útil sobre un pueblo o experiencia.",
  plan: "Una propuesta próxima o una intención compartida.",
  postal: "Una imagen o composición visual destacada del pueblo.",
  recuerdo: "Una memoria o contenido de un momento pasado.",
};

export const conceptMoments: ConceptMoment[] = [
  {
    authorInitials: "VC",
    authorName: "Coordinación de Valle Claro · ejemplo",
    body: "El mercado de esta mañana ya tiene los primeros puestos montados en la plaza. Así se vería compartir lo que pasa justo ahora en el pueblo.",
    id: "moment-ahora-mercado",
    subtype: "ahora",
    timeLabel: "Hace 12 min · ejemplo",
    title: "El mercado ya está abierto",
    villageName: "Valle Claro",
  },
  {
    authorInitials: "SL",
    authorName: "Guía local de Sierra Luna · ejemplo",
    body: "Ejemplo de un Momento tipo Ahora sin imagen, solo texto breve, para comprobar que la tarjeta funciona igual sin contenido visual.",
    id: "moment-ahora-texto",
    subtype: "ahora",
    timeLabel: "Hace 40 min · ejemplo",
    title: "Cielo despejado en el mirador",
    villageName: "Sierra Luna",
  },
  {
    authorInitials: "MC",
    authorName: "Vecinos de Mercado Viejo · ejemplo",
    body: "Composición visual destacada del pueblo, tal como se mostraría un Postal: una imagen grande con poco texto de acompañamiento.",
    id: "moment-postal-atardecer",
    image: "/images/raiz-village-hero.webp",
    subtype: "postal",
    timeLabel: "Ayer · ejemplo",
    title: "Atardecer sobre los tejados",
    villageName: "Mercado Viejo",
  },
  {
    authorInitials: "RV",
    authorName: "Asociación de Raíz Verde · ejemplo",
    body: "Otro ejemplo de Postal, esta vez del mercado semanal, para comprobar que el visor funciona con más de una imagen entre los ejemplos.",
    id: "moment-postal-mercado",
    image: "/images/raiz-market.webp",
    subtype: "postal",
    timeLabel: "Hace 2 días · ejemplo",
    title: "El mercado semanal de Raíz Verde",
    villageName: "Raíz Verde",
  },
  {
    authorInitials: "GE",
    authorName: "Guía local · ejemplo",
    body: "Este es un Momento tipo Recuerdo deliberadamente largo, escrito para comprobar que el visor conceptual envuelve varios párrafos, mantiene la legibilidad en pantallas estrechas y no provoca desplazamiento horizontal ni con zoom ampliado ni con nombres de pueblo extensos. La idea es que un Recuerdo pueda contar una historia breve del pueblo sin que el diseño se rompa por la longitud del texto de ejemplo.",
    id: "moment-recuerdo-largo",
    subtype: "recuerdo",
    timeLabel: "Hace 3 meses · ejemplo",
    title: "Cómo era la fiesta mayor hace unos años",
    villageName: "Valle Claro",
  },
  {
    authorInitials: "PR",
    authorName: "Archivo comunitario · ejemplo",
    body: "Un Recuerdo breve, para contrastar con el ejemplo largo anterior y comprobar que ambos tamaños de contenido conviven bien en la misma cuadrícula.",
    id: "moment-recuerdo-corto",
    subtype: "recuerdo",
    timeLabel: "Hace 1 año · ejemplo",
    title: "La primera cosecha del huerto comunitario",
    villageName: "Mercado Viejo",
  },
  {
    authorInitials: "TE",
    authorName: "Taller de cerámica · ejemplo",
    body: "Ejemplo de un Plan: una propuesta próxima que el pueblo podría compartir para coordinar quién se apunta, sin gestionar plazas reales todavía.",
    id: "moment-plan-taller",
    subtype: "plan",
    timeLabel: "Plan para el sábado · ejemplo",
    title: "Quedada para restaurar el sendero",
    villageName: "Sierra Luna",
  },
  {
    authorInitials: "SL",
    authorName: "Guía local de Sierra Luna · ejemplo",
    body: "Otro ejemplo de Consejo: una recomendación útil sobre cuándo visitar el mirador para evitar el calor y disfrutar mejor de la vista.",
    id: "moment-consejo-mirador",
    subtype: "consejo",
    timeLabel: "Consejo fijado · ejemplo",
    title: "La mejor hora para subir al mirador",
    villageName: "Sierra Luna",
  },
  {
    authorInitials: "RV",
    authorName: "Asociación de Raíz Verde · ejemplo",
    body: "Un Consejo práctico sobre transporte: dónde aparcar cuando hay mercado, para no bloquear el acceso de los vecinos.",
    id: "moment-consejo-aparcar",
    subtype: "consejo",
    timeLabel: "Consejo fijado · ejemplo",
    title: "Dónde aparcar los días de mercado",
    villageName: "Raíz Verde",
  },
  {
    authorInitials: "MC",
    authorName: "Coordinación de Mercado Viejo · ejemplo",
    body: "Ejemplo de Aviso: información comunitaria importante, como un corte de agua programado, mostrada con más énfasis visual que el resto de subtipos.",
    id: "moment-aviso-agua",
    subtype: "aviso",
    timeLabel: "Aviso activo · ejemplo",
    title: "Corte de agua programado el jueves",
    villageName: "Mercado Viejo",
  },
];

export function isMomentsConceptState(value: string): value is MomentsConceptState {
  return ["empty", "error", "loading", "ready"].includes(value);
}
