import { FuturePage } from "@/components/ui/future-page";

export default function ExplorePage() {
  return (
    <FuturePage
      eyebrow="Explorar"
      title="Descubre contenido local"
      description="Un espacio futuro para explorar fotos, actividades, pueblos y publicaciones recomendadas."
      items={["Tendencias comunitarias", "Pueblos cerca de ti", "Planes populares"]}
    />
  );
}
