import type { CommunityPost } from "@/lib/types";

export const communityPosts: CommunityPost[] = [
  {
    id: "huerto-compartido-rupit",
    title: "Buscamos manos para el huerto compartido",
    content:
      "Este sábado abrimos bancales nuevos y nos vendría genial ayuda para preparar compost, plantar aromáticas y organizar turnos de riego.",
    villageId: "rupit",
    author: "Marta Soler",
    authorHandle: "@marta.rupit",
    avatar: "MS",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
    date: "2026-06-20",
    likes: 48,
    comments: 12,
    shares: 5,
    saved: true,
  },
  {
    id: "archivo-fotos-besalu",
    title: "Archivo de fotografías antiguas",
    content:
      "Estamos digitalizando fotos familiares del pueblo. Quien quiera sumar imágenes puede pasar por la biblioteca los martes por la tarde.",
    villageId: "besalu",
    author: "Joan Ferrer",
    authorHandle: "@joan.arxiu",
    avatar: "JF",
    date: "2026-06-18",
    likes: 31,
    comments: 7,
    shares: 3,
  },
  {
    id: "cena-vecinal-siurana",
    title: "Cena vecinal de verano",
    content:
      "Proponemos una cena sencilla en la plaza después del concierto acústico. Cada casa puede traer algo para compartir.",
    villageId: "siurana",
    author: "Laia Pujol",
    authorHandle: "@laia.siurana",
    avatar: "LP",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    date: "2026-06-16",
    likes: 67,
    comments: 18,
    shares: 9,
  },
  {
    id: "rutas-familias-alquezar",
    title: "Rutas cortas para familias",
    content:
      "Varias familias estamos preparando un mapa con paseos de menos de una hora y sombras buenas para los días de calor.",
    villageId: "alquezar",
    author: "Nuria Arnal",
    authorHandle: "@nuria.guara",
    avatar: "NA",
    date: "2026-06-12",
    likes: 24,
    comments: 6,
    shares: 4,
  },
  {
    id: "taller-ceramica-albarracin",
    title: "Nuevo taller abierto de cerámica",
    content:
      "Abrimos tres tardes de taller para aprender técnicas básicas y decorar piezas inspiradas en las casas rojizas de Albarracín.",
    villageId: "albarracin",
    author: "Sergio Martín",
    authorHandle: "@sergio.taller",
    avatar: "SM",
    image:
      "https://images.unsplash.com/photo-1493106819501-66d381c466f1?auto=format&fit=crop&w=1200&q=80",
    date: "2026-06-10",
    likes: 39,
    comments: 11,
    shares: 6,
  },
];
