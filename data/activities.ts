import type { Activity, ActivityCategory } from "@/lib/types";

export const activityCategories: ActivityCategory[] = [
  "Naturaleza",
  "Cultura",
  "Gastronomía",
  "Deporte",
  "Música",
  "Voluntariado",
  "Mercados",
  "Fiestas locales",
];

export const activities: Activity[] = [
  {
    id: "ruta-salt-sallent",
    title: "Ruta al Salt de Sallent",
    category: "Naturaleza",
    villageId: "rupit",
    date: "2026-07-12",
    time: "09:30",
    spots: 18,
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    description:
      "Caminata guiada entre hayedos, masías y miradores, con parada final para picnic comunitario junto al salto.",
    organizer: "Associació Collsacabra Viu",
  },
  {
    id: "mercado-medieval-besalu",
    title: "Mercado de oficios medievales",
    category: "Mercados",
    villageId: "besalu",
    date: "2026-07-18",
    time: "11:00",
    spots: 40,
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
    description:
      "Puestos de artesanía, demostraciones de oficios y degustación de productos locales alrededor del casco histórico.",
    organizer: "Comerciants de Besalú",
  },
  {
    id: "noche-musica-siurana",
    title: "Noche de música bajo las estrellas",
    category: "Música",
    villageId: "siurana",
    date: "2026-07-25",
    time: "21:00",
    spots: 60,
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
    description:
      "Concierto acústico en pequeño formato con músicos del Priorat y cena sencilla compartida al atardecer.",
    organizer: "Veïns de Siurana",
  },
  {
    id: "taller-tapas-alquezar",
    title: "Taller de tapas de la Sierra de Guara",
    category: "Gastronomía",
    villageId: "alquezar",
    date: "2026-08-02",
    time: "12:30",
    spots: 22,
    image:
      "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80",
    description:
      "Cocina participativa con recetas locales, productos de cercanía y comida final en mesa larga.",
    organizer: "Casa de Cultura de Alquézar",
  },
  {
    id: "restauracion-senderos-albarracin",
    title: "Jornada de restauración de senderos",
    category: "Voluntariado",
    villageId: "albarracin",
    date: "2026-08-09",
    time: "08:45",
    spots: 25,
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    description:
      "Mañana colaborativa para señalizar y limpiar un tramo de sendero, con material incluido y almuerzo local.",
    organizer: "Montes Universales",
  },
  {
    id: "visita-murallas-albarracin",
    title: "Visita cultural a las murallas",
    category: "Cultura",
    villageId: "albarracin",
    date: "2026-08-16",
    time: "18:00",
    spots: 30,
    image:
      "https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=1200&q=80",
    description:
      "Recorrido interpretado por la historia urbana de Albarracín, con cierre en un taller artesano.",
    organizer: "Guías de Albarracín",
  },
];

export function getActivityById(id: string) {
  return activities.find((activity) => activity.id === id);
}

export function getActivitiesByVillage(villageId: string) {
  return activities.filter((activity) => activity.villageId === villageId);
}
