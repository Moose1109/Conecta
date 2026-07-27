"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { AuthGate } from "@/features/auth/auth-gate";
import { ProfileHeader } from "@/features/profile/profile-header";
import { ProfileRecommendationsRail } from "@/features/profile/profile-recommendations";
import { ProfileTabs } from "@/features/profile/profile-tabs";
import { getActivitiesStrict } from "@/lib/api/activities.service";
import { getCurrentUser } from "@/lib/api/auth.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { getCommunityPostsStrict } from "@/lib/api/community.service";
import { logApiIssue } from "@/lib/api/error-message";
import { clearSession, saveSession } from "@/lib/api/session";
import { getVillagesStrict } from "@/lib/api/villages.service";
import { useAuthSession } from "@/features/auth/use-auth-session";
import {
  COMMUNITY_DATA_REFRESH_EVENT,
} from "@/features/community/community-events";
import type { Activity, AuthUser, CommunityPost, Village } from "@/lib/types";

type ProfileData = {
  activities: Activity[];
  posts: CommunityPost[];
  user?: AuthUser;
  villages: Village[];
};

export type ProfileUnavailableSources = {
  activities: boolean;
  posts: boolean;
  villages: boolean;
};

function isPostByUser(post: CommunityPost, user?: AuthUser) {
  if (!user) {
    return false;
  }

  if (post.authorId) {
    return post.authorId === user.id;
  }

  if (post.handle && user.username) {
    return post.handle.replace(/^@/, "") === user.username.replace(/^@/, "");
  }

  return false;
}

function metricValue(
  primary: number | undefined,
  fallback: number,
  unavailable: boolean,
  mayBeTruncated: boolean,
) {
  if (typeof primary === "number" && Number.isFinite(primary)) return primary;
  return unavailable || mayBeTruncated ? undefined : fallback;
}

export function ProfileView() {
  const { token, user: sessionUser } = useAuthSession();
  const sessionUserId = sessionUser?.id;
  const sessionUserName = sessionUser?.name;
  const sessionUserEmail = sessionUser?.email;
  const sessionUserUsername = sessionUser?.username;
  const sessionUserAvatarUrl = sessionUser?.avatarUrl;
  const sessionUserBannerUrl = sessionUser?.bannerUrl;
  const sessionUserBio = sessionUser?.bio;
  const sessionUserRole = sessionUser?.role;
  const sessionUserFavoriteVillageId = sessionUser?.favoriteVillageId;
  const sessionUserStatsActivities = sessionUser?.stats?.activities;
  const sessionUserStatsPosts = sessionUser?.stats?.posts;
  const sessionUserStatsFollowedVillages = sessionUser?.stats?.followedVillages;
  const sessionFallbackUser = useMemo(
    () =>
      sessionUserId && sessionUserName
        ? {
            id: sessionUserId,
            name: sessionUserName,
            email: sessionUserEmail,
            username: sessionUserUsername,
            avatarUrl: sessionUserAvatarUrl,
            bannerUrl: sessionUserBannerUrl,
            bio: sessionUserBio,
            role: sessionUserRole,
            favoriteVillageId: sessionUserFavoriteVillageId,
            stats: {
              activities: sessionUserStatsActivities,
              posts: sessionUserStatsPosts,
              followedVillages: sessionUserStatsFollowedVillages,
            },
          }
        : undefined,
    [
      sessionUserAvatarUrl,
      sessionUserBannerUrl,
      sessionUserBio,
      sessionUserEmail,
      sessionUserFavoriteVillageId,
      sessionUserId,
      sessionUserName,
      sessionUserRole,
      sessionUserStatsActivities,
      sessionUserStatsFollowedVillages,
      sessionUserStatsPosts,
      sessionUserUsername,
    ],
  );
  const [data, setData] = useState<ProfileData>({
    activities: [],
    posts: [],
    user: sessionUser,
    villages: [],
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const [refreshRequest, setRefreshRequest] = useState(0);
  const [unavailableSources, setUnavailableSources] = useState<ProfileUnavailableSources>({
    activities: false,
    posts: false,
    villages: false,
  });

  useEffect(() => {
    const refresh = () => setRefreshRequest((current) => current + 1);
    window.addEventListener(COMMUNITY_DATA_REFRESH_EVENT, refresh);

    return () => window.removeEventListener(COMMUNITY_DATA_REFRESH_EVENT, refresh);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    const authToken = token;
    let active = true;

    async function loadProfile() {
      setError("");
      setIsLoading(true);

      const [userResult, postsResult, activitiesResult, villagesResult] =
        await Promise.allSettled([
          getCurrentUser(authToken),
          getCommunityPostsStrict(
            authToken,
            sessionUserId ? { authorId: sessionUserId } : undefined,
          ),
          getActivitiesStrict(authToken),
          getVillagesStrict(authToken),
        ]);

      if (!active) return;

      const hasUnauthorizedResponse = [
        userResult,
        postsResult,
        activitiesResult,
        villagesResult,
      ].some(
        (result) =>
          result.status === "rejected" && isUnauthorizedError(result.reason),
      );

      if (hasUnauthorizedResponse) {
        clearSession();
        setIsLoading(false);
        return;
      }

      const currentUser = userResult.status === "fulfilled"
        ? userResult.value ?? sessionFallbackUser
        : sessionFallbackUser;
      const nextUnavailable = {
        activities: activitiesResult.status === "rejected",
        posts: postsResult.status === "rejected",
        villages: villagesResult.status === "rejected",
      };
      const missingLabels = [
        nextUnavailable.posts ? "publicaciones" : "",
        nextUnavailable.activities ? "actividades" : "",
        nextUnavailable.villages ? "pueblos" : "",
      ].filter(Boolean);

      if (userResult.status === "fulfilled" && userResult.value) {
        saveSession({ token: authToken, user: userResult.value });
      }
      if (userResult.status === "rejected") logApiIssue("Error loading current profile user", userResult.reason);
      if (postsResult.status === "rejected") logApiIssue("Error loading profile posts", postsResult.reason);
      if (activitiesResult.status === "rejected") logApiIssue("Error loading profile activities", activitiesResult.reason);
      if (villagesResult.status === "rejected") logApiIssue("Error loading profile villages", villagesResult.reason);

      setUnavailableSources(nextUnavailable);
      setError(
        missingLabels.length
          ? `No hemos podido cargar ${missingLabels.join(", ")}. El resto de tu perfil sigue disponible.`
          : userResult.status === "rejected"
            ? "Mostramos los datos guardados en tu sesión porque no hemos podido actualizar el perfil."
            : "",
      );
      setData((current) => ({
        activities: activitiesResult.status === "fulfilled"
          ? activitiesResult.value
          : current.activities,
        posts: postsResult.status === "fulfilled" ? postsResult.value : current.posts,
        user: currentUser ?? current.user,
        villages: villagesResult.status === "fulfilled"
          ? villagesResult.value
          : current.villages,
      }));
      setIsLoading(false);
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [
    refreshRequest,
    sessionFallbackUser,
    sessionUserId,
    token,
  ]);

  const profileUser = data.user ?? sessionUser;
  const userPosts = useMemo(
    () => data.posts.filter((post) => isPostByUser(post, profileUser)),
    [data.posts, profileUser],
  );
  const joinedActivities = useMemo(
    () => data.activities.filter((activity) => activity.isJoined === true),
    [data.activities],
  );
  const followedVillages = useMemo(
    () => data.villages.filter((village) => village.isFollowing === true),
    [data.villages],
  );
  const limitedSources = {
    activities: data.activities.length >= 100,
    posts: data.posts.length >= 100,
    villages: data.villages.length >= 100,
  };
  const stats = {
    posts: metricValue(
      profileUser?.stats?.posts,
      userPosts.length,
      unavailableSources.posts,
      data.posts.length >= 100,
    ),
    activities: metricValue(
      undefined,
      joinedActivities.length,
      unavailableSources.activities,
      data.activities.length >= 100,
    ),
    followedVillages: metricValue(
      profileUser?.stats?.followedVillages,
      followedVillages.length,
      unavailableSources.villages,
      data.villages.length >= 100,
    ),
  };

  return (
    <AuthGate message="Para acceder a tu perfil necesitas iniciar sesión.">
      <div className="grid gap-5">
        {error ? (
          <Card className="border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800" role="status">
            {error}
          </Card>
        ) : null}
        {isLoading && !profileUser ? <LoadingState variant="profile" label="Cargando perfil" /> : <ProfileHeader stats={stats} user={profileUser} />}
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <ProfileTabs
            activities={joinedActivities}
            isLoading={isLoading}
            limitedSources={limitedSources}
            posts={userPosts}
            unavailableSources={unavailableSources}
            villages={followedVillages}
          />
          <ProfileRecommendationsRail activities={data.activities} villages={data.villages} />
        </div>
      </div>
    </AuthGate>
  );
}
