import { ApiError } from "@/lib/api/client";
import type { Translator } from "@/lib/i18n/translate";
import type { TranslationKey } from "@/lib/i18n/types";

const knownBackendDetailKeys: Record<string, TranslationKey> = {
  "Activity is full": "errors.backend.activityFull",
  "Activity slug already exists": "errors.backend.activitySlugTaken",
  "Email already registered": "errors.backend.emailTaken",
  "Invalid email or password": "errors.backend.invalidCredentials",
  "Username already taken": "errors.backend.usernameTaken",
  "Village slug already exists": "errors.backend.villageSlugTaken",
};

function knownBackendDetail(error: ApiError, t: Translator["t"]) {
  const key = typeof error.detail === "string" ? knownBackendDetailKeys[error.detail] : undefined;
  return key ? t(key) : undefined;
}

/**
 * Maps known backend error shapes to a localized interface message. Free
 * text returned by the backend is never translated or shown verbatim — only
 * codes/details we explicitly recognize are mapped, everything else falls
 * back to a generic localized message while the technical detail stays
 * available to `logApiIssue` for diagnostics.
 */
export function getApiErrorMessage(
  error: unknown,
  t: Translator["t"],
  fallback?: string,
): string {
  const resolvedFallback = fallback ?? t("errors.generic");
  if (!(error instanceof ApiError)) return resolvedFallback;

  const knownMessage = knownBackendDetail(error, t);
  if (knownMessage) return knownMessage;

  if (error.type === "configuration") return t("errors.configuration");
  if (error.type === "timeout") return t("errors.timeout");
  if (error.isNetworkError || error.type === "network") return t("errors.network");
  if (error.status === 400) return t("errors.status400");
  if (error.status === 401) return t("errors.status401");
  if (error.status === 403) return t("errors.status403");
  if (error.status === 404) return t("errors.status404");
  if (error.status === 409) return t("errors.status409");
  if (error.status === 422) return t("errors.status422");
  if (error.status === 429) return t("errors.status429");
  if (error.status >= 500) return t("errors.status5xx");

  return resolvedFallback;
}

export function logApiIssue(context: string, error: unknown) {
  if (process.env.NODE_ENV !== "development") return;

  if (error instanceof ApiError) {
    console.warn(context, {
      code: error.code,
      detail: error.detail,
      path: error.path,
      status: error.status,
      type: error.type,
    });
    return;
  }

  console.warn(context, { type: "unexpected" });
}
