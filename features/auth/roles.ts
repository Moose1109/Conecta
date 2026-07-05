import type { AuthUser } from "@/lib/types";

function isAdminRole(value: unknown) {
  return typeof value === "string" && ["admin", "superadmin"].includes(value.trim().toLowerCase());
}

export function isAdminUser(user: AuthUser | undefined | null) {
  if (!user) {
    return false;
  }

  const extra = user as AuthUser & {
    isAdmin?: unknown;
    roles?: unknown;
  };

  if (extra.isAdmin === true || isAdminRole(user.role)) {
    return true;
  }

  if (Array.isArray(extra.roles)) {
    return extra.roles.some(isAdminRole);
  }

  return isAdminRole(extra.roles);
}
