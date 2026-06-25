import type { Village } from "@/lib/types";

export const villages: Village[] = [
  {
    id: "rupit",
    name: "Rupit",
    province: "Barcelona",
    region: "Catalunya",
    population: 270,
    image:
      "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deae?auto=format&fit=crop&w=1200&q=80",
    tagline: "Calles de piedra, calma y miradores sobre el Collsacabra.",
    description:
      "Rupit conserva un trazado medieval rodeado de bosques, saltos de agua y caminos perfectos para encuentros tranquilos entre vecinos y visitantes.",
    highlights: ["Puente colgante", "Salt de Sallent", "Rutas por Collsacabra"],
  },
  {
    id: "besalu",
    name: "Besalú",
    province: "Girona",
    region: "Catalunya",
    population: 2500,
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80",
    tagline: "Un puente icónico para cruzar siglos de historia compartida.",
    description:
      "Besalú mezcla patrimonio, comercio local y vida cultural en torno a su conjunto medieval, ideal para talleres, mercados y rutas guiadas.",
    highlights: ["Puente medieval", "Barrio judío", "Ferias artesanas"],
  },
  {
    id: "siurana",
    name: "Siurana",
    province: "Tarragona",
    region: "Catalunya",
    population: 35,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    tagline: "Un balcón de roca sobre viñas, agua y atardeceres.",
    description:
      "Siurana es un pequeño núcleo sobre el Priorat, conocido por su paisaje, escalada, senderismo y una energía serena que invita a reunirse al aire libre.",
    highlights: ["Pantano de Siurana", "Escalada", "Vistas del Priorat"],
  },
  {
    id: "alquezar",
    name: "Alquézar",
    province: "Huesca",
    region: "Aragón",
    population: 300,
    image:
      "https://images.unsplash.com/photo-1565031491910-e57fac031c41?auto=format&fit=crop&w=1200&q=80",
    tagline: "Pasarelas, cañones y una plaza que sabe reunir.",
    description:
      "Alquézar abraza el Parque Natural de la Sierra y Cañones de Guara, con actividades de naturaleza, gastronomía y cultura para todas las edades.",
    highlights: ["Pasarelas del Vero", "Colegiata", "Barranquismo"],
  },
  {
    id: "albarracin",
    name: "Albarracín",
    province: "Teruel",
    region: "Aragón",
    population: 1000,
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
    tagline: "Murallas rojizas y oficios vivos entre montes.",
    description:
      "Albarracín combina arquitectura singular, talleres artesanos y rutas naturales, con una comunidad local muy ligada a la conservación del entorno.",
    highlights: ["Murallas", "Artesanía", "Pinares de Rodeno"],
  },
];

export function getVillageById(id: string) {
  return villages.find((village) => village.id === id);
}
