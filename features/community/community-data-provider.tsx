"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { COMMUNITY_DATA_REFRESH_EVENT } from "@/features/community/community-events";
import { getActivitiesStrict } from "@/lib/api/activities.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { getCommunityPostsStrict } from "@/lib/api/community.service";
import { logApiIssue } from "@/lib/api/error-message";
import { clearSession } from "@/lib/api/session";
import { getVillagesStrict } from "@/lib/api/villages.service";
import type { Activity, CommunityPost, Village } from "@/lib/types";

type CommunityData = {
  activities: Activity[];
  posts: CommunityPost[];
  villages: Village[];
};

export type CommunityUnavailableSources = {
  activities: boolean;
  posts: boolean;
  villages: boolean;
};

type CommunityDataContextValue = CommunityData & {
  personalizationUnavailable: boolean;
  unavailableSources: CommunityUnavailableSources;
};

type AuthenticatedResult = {
  data: CommunityData;
  personalizationUnavailable: boolean;
  token: string;
  unavailableSources: CommunityUnavailableSources;
};

const CommunityDataContext = createContext<CommunityDataContextValue | null>(null);

export function CommunityDataProvider({
  children,
  initialData,
  initialUnavailable = {
    activities: false,
    posts: false,
    villages: false,
  },
}: {
  children: ReactNode;
  initialData: CommunityData;
  initialUnavailable?: CommunityUnavailableSources;
}) {
  const { token } = useAuthSession();
  const [authenticatedResult, setAuthenticatedResult] =
    useState<AuthenticatedResult>();
  const [refreshRequest, setRefreshRequest] = useState(0);

  useEffect(() => {
    const refresh = () => setRefreshRequest((current) => current + 1);
    window.addEventListener(COMMUNITY_DATA_REFRESH_EVENT, refresh);

    return () => window.removeEventListener(COMMUNITY_DATA_REFRESH_EVENT, refresh);
  }, []);

  useEffect(() => {
    if (!token) return;

    let active = true;

    Promise.allSettled([
      getCommunityPostsStrict(token),
      getVillagesStrict(token),
      getActivitiesStrict(token),
    ])
      .then(([postsResult, villagesResult, activitiesResult]) => {
        if (!active) return;

        const rejectedResults = [postsResult, villagesResult, activitiesResult]
          .filter((result): result is PromiseRejectedResult => result.status === "rejected");

        if (rejectedResults.some((result) => isUnauthorizedError(result.reason))) {
          clearSession();
          return;
        }

        rejectedResults.forEach((result) => {
          logApiIssue("Unable to personalize part of the community", result.reason);
        });

        setAuthenticatedResult({
          data: {
            activities: activitiesResult.status === "fulfilled"
              ? activitiesResult.value
              : initialData.activities,
            posts: postsResult.status === "fulfilled"
              ? postsResult.value
              : initialData.posts,
            villages: villagesResult.status === "fulfilled"
              ? villagesResult.value
              : initialData.villages,
          },
          personalizationUnavailable: rejectedResults.length > 0,
          token,
          unavailableSources: {
            activities:
              activitiesResult.status === "rejected" && initialUnavailable.activities,
            posts: postsResult.status === "rejected" && initialUnavailable.posts,
            villages: villagesResult.status === "rejected" && initialUnavailable.villages,
          },
        });
      });

    return () => {
      active = false;
    };
  }, [
    initialData.activities,
    initialData.posts,
    initialData.villages,
    initialUnavailable.activities,
    initialUnavailable.posts,
    initialUnavailable.villages,
    refreshRequest,
    token,
  ]);

  const value = useMemo<CommunityDataContextValue>(() => {
    const currentResult =
      token && authenticatedResult?.token === token
        ? authenticatedResult
        : undefined;
    const data = currentResult?.data ?? initialData;

    return {
      ...data,
      personalizationUnavailable:
        currentResult?.personalizationUnavailable ?? false,
      unavailableSources:
        currentResult?.unavailableSources ?? initialUnavailable,
    };
  }, [authenticatedResult, initialData, initialUnavailable, token]);

  return (
    <CommunityDataContext.Provider value={value}>
      {children}
    </CommunityDataContext.Provider>
  );
}

export function useCommunityData() {
  const value = useContext(CommunityDataContext);

  if (!value) {
    throw new Error("useCommunityData must be used within CommunityDataProvider");
  }

  return value;
}
