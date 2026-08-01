import type { Metadata } from "next";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { isMomentsConceptState } from "@/features/moments/moments-concept-data";
import { MomentsView } from "@/features/moments/moments-view";

export const metadata: Metadata = { title: "Momentos" };

export default async function MomentsPage({
  searchParams,
}: {
  searchParams: Promise<{ conceptState?: string | string[] }>;
}) {
  const rawState = (await searchParams).conceptState;
  const requestedState = Array.isArray(rawState) ? rawState[0] : rawState;
  const initialState = requestedState && isMomentsConceptState(requestedState)
    ? requestedState
    : "ready";

  return (
    <AuthenticatedShell>
      <MomentsView initialState={initialState} />
    </AuthenticatedShell>
  );
}
