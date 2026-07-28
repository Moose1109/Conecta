"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { JoinActivityButton } from "@/components/social/join-activity-button";
import { SaveButton } from "@/components/social/save-button";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { getActivityByIdStrict } from "@/lib/api/activities.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { clearSession } from "@/lib/api/session";
import type { Activity } from "@/lib/types";

type PersonalActivityState = {
  isJoined: boolean;
  isSaved: boolean;
  requestKey: string;
};

type InteractionTracker = {
  joined: boolean;
  requestKey: string;
  saved: boolean;
};

type HydrationRequest = {
  promise: Promise<Activity | undefined>;
  requestKey: string;
};

export function ActivityCardActions({
  activityId,
  demo = false,
  hydrateFromApi = false,
  initialJoined = false,
  initialSaved = false,
  interactionSupported = true,
}: {
  activityId: string;
  demo?: boolean;
  hydrateFromApi?: boolean;
  initialJoined?: boolean;
  initialSaved?: boolean;
  interactionSupported?: boolean;
}) {
  const { token } = useAuthSession();
  const normalizedActivityId = activityId.trim();
  const requestKey = token ? `${normalizedActivityId}\u0000${token}` : "";
  const [personalState, setPersonalState] = useState<PersonalActivityState>();
  const hydrationRequestRef = useRef<HydrationRequest | undefined>(undefined);
  const interactionTrackerRef = useRef<InteractionTracker | undefined>(undefined);
  const currentState = personalState?.requestKey === requestKey
    ? personalState
    : undefined;
  const isJoined = currentState?.isJoined ?? initialJoined;
  const isSaved = currentState?.isSaved ?? initialSaved;

  const markJoinedInteraction = useCallback(() => {
    interactionTrackerRef.current = interactionTracker(
      interactionTrackerRef.current,
      requestKey,
      "joined",
    );
  }, [requestKey]);

  const markSavedInteraction = useCallback(() => {
    interactionTrackerRef.current = interactionTracker(
      interactionTrackerRef.current,
      requestKey,
      "saved",
    );
  }, [requestKey]);

  useEffect(() => {
    if (
      !hydrateFromApi ||
      !interactionSupported ||
      !normalizedActivityId ||
      !token
    ) {
      return;
    }

    const tracker = interactionTracker(
      interactionTrackerRef.current,
      requestKey,
    );
    interactionTrackerRef.current = tracker;

    let request = hydrationRequestRef.current;

    if (!request || request.requestKey !== requestKey) {
      request = {
        promise: getActivityByIdStrict(normalizedActivityId, token),
        requestKey,
      };
      hydrationRequestRef.current = request;
    }

    let active = true;

    request.promise
      .then((activity) => {
        if (!active || !activity) return;

        setPersonalState((previous) => {
          const baseline = previous?.requestKey === requestKey
            ? previous
            : {
                isJoined: initialJoined,
                isSaved: initialSaved,
                requestKey,
              };

          return {
            isJoined:
              tracker.joined || typeof activity.isJoined !== "boolean"
                ? baseline.isJoined
                : activity.isJoined,
            isSaved:
              tracker.saved || typeof activity.isSaved !== "boolean"
                ? baseline.isSaved
                : activity.isSaved,
            requestKey,
          };
        });
      })
      .catch((error) => {
        if (active && isUnauthorizedError(error)) {
          clearSession();
        }
      });

    return () => {
      active = false;
    };
  }, [
    hydrateFromApi,
    initialJoined,
    initialSaved,
    interactionSupported,
    normalizedActivityId,
    requestKey,
    token,
  ]);

  return (
    <>
      <SaveButton
        compact
        demo={demo}
        hydrateFromApi={false}
        initialSaved={isSaved}
        interactionSupported={interactionSupported}
        onInteractionStart={markSavedInteraction}
        storageKey={`activity:${activityId}`}
      />
      <JoinActivityButton
        compact
        demo={demo}
        hydrateFromApi={false}
        initialJoined={isJoined}
        interactionSupported={interactionSupported}
        onInteractionStart={markJoinedInteraction}
        storageKey={activityId}
      />
    </>
  );
}

function interactionTracker(
  current: InteractionTracker | undefined,
  requestKey: string,
  field?: "joined" | "saved",
): InteractionTracker {
  const tracker = current?.requestKey === requestKey
    ? current
    : { joined: false, requestKey, saved: false };

  if (field) tracker[field] = true;
  return tracker;
}
