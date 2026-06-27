import type { ReactNode } from "react";

export function SocialLayout({
  left,
  children,
  right,
}: {
  left?: ReactNode;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_300px]">
      {left ? <aside className="hidden lg:block">{left}</aside> : null}
      <section className="min-w-0">{children}</section>
      {right ? <aside className="hidden xl:block">{right}</aside> : null}
    </div>
  );
}
