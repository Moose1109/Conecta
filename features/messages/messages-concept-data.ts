export type ConceptConversationKind =
  | "activity"
  | "community"
  | "individual"
  | "village";

export type ConceptConversationFilter =
  | "activities"
  | "all"
  | "unread"
  | "villages";

export type MessagesConceptState = "empty" | "error" | "loading" | "ready";

export type ConceptSharedResource = {
  description: string;
  image: string;
  meta: string[];
  title: string;
  type: "activity" | "village";
};

export type ConceptMessage = {
  content?: string;
  direction: "incoming" | "outgoing";
  id: string;
  readState?: string;
  sender?: string;
  sharedResource?: ConceptSharedResource;
  time: string;
};

export type ConceptMessageDay = {
  label: string;
  messages: ConceptMessage[];
};

export type ConceptConversation = {
  about: string;
  context: string;
  days: ConceptMessageDay[];
  id: string;
  initials: string;
  kind: ConceptConversationKind;
  lastMessage: string;
  name: string;
  status: string;
  timeLabel: string;
  unreadCount: number;
};

const sharedActivity: ConceptSharedResource = {
  description: "Así se mostraría una actividad compartida dentro del chat.",
  image: "/images/raiz-market.webp",
  meta: ["Sáb, 12 jul · 09:00", "Sendero del río"],
  title: "Limpieza comunitaria del sendero · ejemplo",
  type: "activity",
};

const sharedVillage: ConceptSharedResource = {
  description: "Una ficha compacta para dar contexto territorial a la conversación.",
  image: "/images/raiz-village-hero.webp",
  meta: ["Pueblo de ejemplo", "Comunidad local"],
  title: "Valle Claro · ejemplo conceptual",
  type: "village",
};

export const messagesConceptConversations: ConceptConversation[] = [
  {
    about: "Conversación comunitaria vinculada a un pueblo conceptual. No representa vecinos ni mensajes reales.",
    context: "Pueblo · contenido de ejemplo",
    days: [
      {
        label: "Ayer · ejemplo",
        messages: [
          {
            content: "Abrimos este hilo de demostración para enseñar cómo se vería una conversación vinculada a un pueblo.",
            direction: "incoming",
            id: "valle-1",
            sender: "Coordinación · ejemplo",
            time: "18:32",
          },
          {
            content: "Perfecto. Así podemos mantener el contexto local sin convertir el chat en una pantalla distinta al resto de ConectaPueblos.",
            direction: "outgoing",
            id: "valle-2",
            readState: "Estado conceptual: leído",
            time: "18:35",
          },
          {
            direction: "incoming",
            id: "valle-3",
            sender: "Coordinación · ejemplo",
            sharedResource: sharedVillage,
            time: "18:37",
          },
        ],
      },
      {
        label: "Hoy · ejemplo",
        messages: [
          {
            content: "Este mensaje deliberadamente largo comprueba que las burbujas pueden crecer, envolver varias líneas y seguir siendo legibles en pantallas estrechas, con zoom y con nombres extensos sin provocar desplazamiento horizontal.",
            direction: "incoming",
            id: "valle-4",
            sender: "Coordinación · ejemplo",
            time: "09:12",
          },
          {
            content: "También podemos representar una actividad compartida sin inventar una ruta ni afirmar que el recurso existe en la base de datos.",
            direction: "outgoing",
            id: "valle-5",
            readState: "Estado conceptual: entregado",
            time: "09:14",
          },
          {
            direction: "incoming",
            id: "valle-6",
            sender: "Coordinación · ejemplo",
            sharedResource: sharedActivity,
            time: "09:16",
          },
          {
            content: "¿El compositor podría conservar el texto si el envío todavía no está conectado?",
            direction: "incoming",
            id: "valle-7",
            sender: "Coordinación · ejemplo",
            time: "09:18",
          },
          {
            content: "Sí. Al intentar enviarlo se mostrará el aviso de backend y el borrador permanecerá intacto.",
            direction: "outgoing",
            id: "valle-8",
            readState: "Estado conceptual: leído",
            time: "09:20",
          },
          {
            content: "Así la propuesta demuestra la experiencia sin simular un envío exitoso.",
            direction: "incoming",
            id: "valle-9",
            sender: "Coordinación · ejemplo",
            time: "09:22",
          },
        ],
      },
    ],
    id: "concept-valle-claro",
    initials: "VC",
    kind: "village",
    lastMessage: "Así la propuesta demuestra la experiencia sin simular un envío.",
    name: "Valle Claro · conversación comunitaria de ejemplo",
    status: "Vista conceptual vinculada a un pueblo",
    timeLabel: "10:45",
    unreadCount: 2,
  },
  {
    about: "Ejemplo de conversación individual. La identidad mostrada no pertenece a una persona registrada.",
    context: "Persona conceptual · guía local",
    days: [
      {
        label: "Hoy · ejemplo",
        messages: [
          {
            content: "Esta variante enseña cómo se vería una conversación individual.",
            direction: "incoming",
            id: "guia-1",
            sender: "Guía local · ejemplo",
            time: "08:41",
          },
          {
            content: "La identidad, el estado y el contenido son únicamente parte de la propuesta visual.",
            direction: "outgoing",
            id: "guia-2",
            readState: "Estado conceptual: entregado",
            time: "08:44",
          },
        ],
      },
    ],
    id: "concept-guia-local",
    initials: "GE",
    kind: "individual",
    lastMessage: "La identidad mostrada es un ejemplo, no un perfil real.",
    name: "Guía local · perfil de ejemplo",
    status: "Conversación individual conceptual",
    timeLabel: "Ayer",
    unreadCount: 1,
  },
  {
    about: "Ejemplo de conversación contextual asociada a una actividad, sin inscripción ni participantes reales.",
    context: "Actividad · mercado comunitario",
    days: [
      {
        label: "Lunes · ejemplo",
        messages: [
          {
            content: "El mercado conceptual se usaría para coordinar horarios y resolver dudas de participantes.",
            direction: "incoming",
            id: "mercado-1",
            sender: "Organización · ejemplo",
            time: "17:10",
          },
          {
            direction: "incoming",
            id: "mercado-2",
            sender: "Organización · ejemplo",
            sharedResource: sharedActivity,
            time: "17:12",
          },
        ],
      },
    ],
    id: "concept-mercado",
    initials: "MC",
    kind: "activity",
    lastMessage: "Recordatorio conceptual sobre el horario de la actividad.",
    name: "Mercado comunitario · ejemplo",
    status: "Conversación conceptual de actividad",
    timeLabel: "Lun",
    unreadCount: 0,
  },
  {
    about: "Grupo conceptual para representar conversaciones de comunidad sin usuarios ni miembros reales.",
    context: "Comunidad · grupo de ejemplo",
    days: [
      {
        label: "Domingo · ejemplo",
        messages: [
          {
            content: "Una conversación grupal podría mostrar el nombre del remitente sobre cada mensaje entrante.",
            direction: "incoming",
            id: "red-1",
            sender: "Moderación · ejemplo",
            time: "12:05",
          },
          {
            content: "La implementación real dependerá de autorización, moderación y participantes en backend.",
            direction: "outgoing",
            id: "red-2",
            readState: "Estado conceptual: leído",
            time: "12:08",
          },
        ],
      },
    ],
    id: "concept-red-pueblos",
    initials: "PR",
    kind: "community",
    lastMessage: "La moderación real dependerá del futuro backend.",
    name: "Pueblos en red · grupo conceptual",
    status: "Grupo comunitario conceptual",
    timeLabel: "Dom",
    unreadCount: 0,
  },
  {
    about: "Ejemplo de hilo para una actividad local, sin plazas, confirmaciones ni asistentes reales.",
    context: "Actividad · taller de ejemplo",
    days: [
      {
        label: "Viernes · ejemplo",
        messages: [
          {
            content: "Aquí aparecerían las indicaciones útiles antes de un taller.",
            direction: "incoming",
            id: "taller-1",
            sender: "Taller · ejemplo",
            time: "16:20",
          },
          {
            content: "El prototipo no confirma plazas ni envía respuestas.",
            direction: "outgoing",
            id: "taller-2",
            readState: "Estado conceptual: entregado",
            time: "16:24",
          },
        ],
      },
    ],
    id: "concept-taller",
    initials: "TE",
    kind: "activity",
    lastMessage: "El prototipo no confirma plazas ni envía respuestas.",
    name: "Taller de cerámica · ejemplo",
    status: "Conversación conceptual de actividad",
    timeLabel: "Vie",
    unreadCount: 0,
  },
  {
    about: "Segundo ejemplo territorial para probar filtros y contadores internos de la propuesta.",
    context: "Pueblo · conversación conceptual",
    days: [
      {
        label: "Jueves · ejemplo",
        messages: [
          {
            content: "Esta conversación permite comprobar la variante de pueblo y el badge interno de no leídos.",
            direction: "incoming",
            id: "sierra-1",
            sender: "Comunidad · ejemplo",
            time: "11:30",
          },
          {
            direction: "incoming",
            id: "sierra-2",
            sender: "Comunidad · ejemplo",
            sharedResource: sharedVillage,
            time: "11:32",
          },
        ],
      },
    ],
    id: "concept-sierra-luna",
    initials: "SL",
    kind: "village",
    lastMessage: "Nueva guía conceptual disponible para revisar.",
    name: "Sierra Luna · pueblo de ejemplo",
    status: "Vista conceptual vinculada a un pueblo",
    timeLabel: "Jue",
    unreadCount: 4,
  },
];

export const conceptFilters = [
  "all",
  "unread",
  "activities",
  "villages",
] satisfies ConceptConversationFilter[];

export function isMessagesConceptState(value: string): value is MessagesConceptState {
  return ["empty", "error", "loading", "ready"].includes(value);
}
