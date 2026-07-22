const socialRoutePrefixes = [
  "/community",
  "/activities",
  "/villages",
  "/profile",
  "/saved",
  "/messages",
  "/notifications",
  "/settings",
  "/admin",
  "/explore",
] as const;

const socialRouteAliases = {
  "/actividades": "/activities",
  "/comunidad": "/community",
  "/pueblos": "/villages",
} as const;

export function normalizeSocialPathname(pathname: string) {
  for (const [alias, canonical] of Object.entries(socialRouteAliases)) {
    if (pathname === alias) return canonical;
    if (pathname.startsWith(`${alias}/`)) {
      return `${canonical}${pathname.slice(alias.length)}`;
    }
  }

  return pathname;
}

export function isNavigationRoute(pathname: string, href: string) {
  const normalizedPathname = normalizeSocialPathname(pathname);

  return normalizedPathname === href || normalizedPathname.startsWith(`${href}/`);
}

export function isSocialRoute(pathname: string) {
  const normalizedPathname = normalizeSocialPathname(pathname);

  return socialRoutePrefixes.some(
    (prefix) =>
      normalizedPathname === prefix || normalizedPathname.startsWith(`${prefix}/`),
  );
}
