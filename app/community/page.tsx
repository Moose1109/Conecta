import { connection } from "next/server";
import type { Metadata } from "next";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { RightRail } from "@/components/layout/right-rail";
import { CommunityHeader } from "@/features/community/community-header";
import { CommunityDataProvider } from "@/features/community/community-data-provider";
import { CommunityFeed } from "@/features/community/community-feed";
import {
  isStoriesConceptState,
  type StoriesConceptState,
} from "@/features/stories/stories-concept-data";
import { StoriesStrip } from "@/features/stories/stories-strip";
import { getActivitiesStrict } from "@/lib/api/activities.service";
import { getCommunityPostsStrict } from "@/lib/api/community.service";
import { getVillagesStrict } from "@/lib/api/villages.service";

export const metadata: Metadata = { title: "Comunidad" };

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    storiesState?: string | string[];
    story?: string | string[];
  }>;
}) {
  await connection();

  const params = await searchParams;
  const queryParam = params.q;
  const initialQuery = Array.isArray(queryParam) ? (queryParam[0] ?? "") : (queryParam ?? "");
  const stateParam = Array.isArray(params.storiesState)
    ? params.storiesState[0]
    : params.storiesState;
  const initialStoriesState: StoriesConceptState =
    stateParam && isStoriesConceptState(stateParam) ? stateParam : "ready";
  const storyParam = Array.isArray(params.story) ? params.story[0] : params.story;
  const initialViewerPosition = storyParam === "first" || storyParam === "last"
    ? storyParam
    : undefined;
  const [postsResult, villagesResult, activitiesResult] = await Promise.allSettled([
    getCommunityPostsStrict(),
    getVillagesStrict(),
    getActivitiesStrict(),
  ]);
  const initialUnavailable = {
    activities: activitiesResult.status === "rejected",
    posts: postsResult.status === "rejected",
    villages: villagesResult.status === "rejected",
  };

  if (process.env.NODE_ENV === "development") {
    if (postsResult.status === "rejected") {
      console.warn("Unable to load the public community feed:", postsResult.reason);
    }
    if (villagesResult.status === "rejected") {
      console.warn("Unable to load villages for the community:", villagesResult.reason);
    }
    if (activitiesResult.status === "rejected") {
      console.warn("Unable to load activities for the community:", activitiesResult.reason);
    }
  }

  const posts = postsResult.status === "fulfilled" ? postsResult.value : [];
  const villages = villagesResult.status === "fulfilled" ? villagesResult.value : [];
  const activities = activitiesResult.status === "fulfilled" ? activitiesResult.value : [];

  return (
    <CommunityDataProvider
      initialData={{ activities, posts, villages }}
      initialUnavailable={initialUnavailable}
    >
      <AuthenticatedShell right={<RightRail />} variant="three-column">
        <CommunityHeader />
        <StoriesStrip
          initialState={initialStoriesState}
          initialViewerPosition={initialViewerPosition}
        />
        <CommunityFeed
          key={`community-feed-${initialQuery}`}
          initialQuery={initialQuery}
          user={{ name: "Usuario", avatar: "CP" }}
        />
      </AuthenticatedShell>
    </CommunityDataProvider>
  );
}
