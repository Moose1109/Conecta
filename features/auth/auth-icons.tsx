import type { SVGProps } from "react";

export type AuthIconName =
  | "arrow-right"
  | "calendar"
  | "eye"
  | "eye-off"
  | "heart"
  | "lock"
  | "mail"
  | "map-pin"
  | "megaphone"
  | "plus"
  | "user"
  | "users";

type AuthIconProps = SVGProps<SVGSVGElement> & {
  name: AuthIconName;
};

export function AuthIcon({ name, className, ...props }: AuthIconProps) {
  const baseProps = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
    ...props,
  };

  if (name === "arrow-right") {
    return (
      <svg aria-hidden="true" {...baseProps}>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg aria-hidden="true" {...baseProps}>
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <path d="M4 9h16" />
        <rect height="17" rx="3" width="18" x="3" y="5" />
        <path d="M8 13h2" />
        <path d="M14 13h2" />
        <path d="M8 17h2" />
      </svg>
    );
  }

  if (name === "eye") {
    return (
      <svg aria-hidden="true" {...baseProps}>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  if (name === "eye-off") {
    return (
      <svg aria-hidden="true" {...baseProps}>
        <path d="m3 3 18 18" />
        <path d="M10.6 10.6a3 3 0 0 0 3.8 3.8" />
        <path d="M9.9 5.2A9 9 0 0 1 12 5c6 0 9.5 7 9.5 7a16 16 0 0 1-2.4 3.4" />
        <path d="M6.3 6.8C3.8 8.5 2.5 12 2.5 12s3.5 7 9.5 7a9 9 0 0 0 4-.9" />
      </svg>
    );
  }

  if (name === "heart") {
    return (
      <svg aria-hidden="true" {...baseProps}>
        <path d="M20.8 5.9a5.2 5.2 0 0 0-7.4 0L12 7.3l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 22l8.8-8.7a5.2 5.2 0 0 0 0-7.4Z" />
      </svg>
    );
  }

  if (name === "lock") {
    return (
      <svg aria-hidden="true" {...baseProps}>
        <rect height="11" rx="2" width="16" x="4" y="10" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }

  if (name === "mail") {
    return (
      <svg aria-hidden="true" {...baseProps}>
        <rect height="16" rx="3" width="20" x="2" y="4" />
        <path d="m22 7-10 6L2 7" />
      </svg>
    );
  }

  if (name === "map-pin") {
    return (
      <svg aria-hidden="true" {...baseProps}>
        <path d="M20 10c0 5.5-8 12-8 12S4 15.5 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  }

  if (name === "megaphone") {
    return (
      <svg aria-hidden="true" {...baseProps}>
        <path d="M4 13h3l10 5V6L7 11H4a2 2 0 0 0 0 4Z" />
        <path d="M7 15v4a2 2 0 0 0 2 2h1" />
        <path d="M19 9a4 4 0 0 1 0 6" />
      </svg>
    );
  }

  if (name === "plus") {
    return (
      <svg aria-hidden="true" {...baseProps}>
        <rect height="18" rx="5" width="18" x="3" y="3" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    );
  }

  if (name === "user") {
    return (
      <svg aria-hidden="true" {...baseProps}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" {...baseProps}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
      <path d="M16 3.2a4 4 0 0 1 0 7.6" />
    </svg>
  );
}
