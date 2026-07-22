import { LoadingState } from "@/components/ui/loading-state";

export default function AppLoading() {
  return (
    <main className="page-shell py-6 sm:py-8">
      <div className="mb-6">
        <div className="skeleton-shimmer h-4 w-28 rounded-full" />
        <div className="skeleton-shimmer mt-3 h-10 w-80 max-w-full rounded-full" />
      </div>
      <LoadingState label="Cargando ConectaPueblos" variant="post" />
    </main>
  );
}
