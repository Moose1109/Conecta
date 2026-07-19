"use client";

import { useEffect, useMemo, useState } from "react";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { Card } from "@/components/ui/card";
import { AuthGate } from "@/features/auth/auth-gate";
import { ProfileHeader } from "@/features/profile/profile-header";
import { ProfileLeftExtras } from "@/features/profile/profile-recommendations";
import { ProfileStatCard } from "@/features/profile/profile-stat-card";
import { ProfileTabs } from "@/features/profile/profile-tabs";
import { getActivities } from "@/lib/api/activities.service";
import { getCurrentUser } from "@/lib/api/auth.service";
import { getCommunityPosts } from "@/lib/api/community.service";
import { getVillages } from "@/lib/api/villages.service";
import { useAuthSession } from "@/features/auth/use-auth-session";
import type { Activity, AuthUser, CommunityPost, Village } from "@/lib/types";

type ProfileData = {
  activities: Activity[];
  posts: CommunityPost[];
  user?: AuthUser;
  villages: Village[];
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

function metricValue(primary: number | undefined, fallback: number) {
  return typeof primary === "number" && Number.isFinite(primary) ? primary : fallback;
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

  useEffect(() => {
    if (!token) {
      return;
    }

    const authToken = token;
    let active = true;

    async function loadProfile() {
      setError("");
      setIsLoading(true);

      try {
        const [currentUser, posts, activities, villages] = await Promise.all([
          getCurrentUser(authToken).catch((error) => {
            console.error("Error loading current profile user:", error);
            return sessionFallbackUser;
          }),
          getCommunityPosts(authToken),
          getActivities(authToken),
          getVillages(authToken),
        ]);

        if (!active) {
          return;
        }

        setData({
          activities,
          posts,
          user: currentUser ?? sessionFallbackUser,
          villages,
        });
      } catch (error) {
        console.error("Error loading profile data:", error);
        if (active) {
          setError("No se pudo cargar todo tu perfil. Mostramos solo los datos disponibles.");
          setData((current) => ({
            ...current,
            user: current.user ?? sessionFallbackUser,
          }));
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [
    sessionFallbackUser,
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
  const stats = {
    posts: metricValue(profileUser?.stats?.posts, userPosts.length),
    activities: metricValue(profileUser?.stats?.activities, joinedActivities.length),
    followedVillages: metricValue(
      profileUser?.stats?.followedVillages,
      followedVillages.length,
    ),
  };

  return (
    <AuthenticatedShell
      leftExtra={token ? (
        <ProfileLeftExtras
          activities={data.activities}
          user={profileUser}
          villages={data.villages}
        />
      ) : null}
    >
      <AuthGate message="Para acceder a tu perfil necesitas iniciar sesión.">
        <div className="grid gap-6">
          {error ? (
            <Card className="border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">
              {error}
            </Card>
          ) : null}
          <ProfileHeader user={profileUser} />
          {isLoading ? (
            <Card className="p-4 text-sm font-bold text-[#1E1E1E]/62">
              Cargando métricas reales de tu perfil...
            </Card>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-3">
            <ProfileStatCard
              label="Publicaciones"
              note="Creadas por tu usuario"
              value={stats.posts}
            />
            <ProfileStatCard
              label="Actividades inscritas"
              note="Marcadas como apuntado"
              value={stats.activities}
            />
            <ProfileStatCard
              label="Pueblos seguidos"
              note="Devueltos como seguidos"
              value={stats.followedVillages}
            />
          </div>
          <ProfileTabs
            activities={joinedActivities}
            posts={userPosts}
            villages={followedVillages}
          />
          <div className="grid gap-5 lg:hidden">
            <ProfileLeftExtras
              activities={data.activities}
              user={profileUser}
              villages={data.villages}
            />
          </div>
        </div>
      </AuthGate>
    </AuthenticatedShell>
  );
}
