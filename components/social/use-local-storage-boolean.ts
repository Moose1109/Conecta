"use client";

import { useState, useSyncExternalStore } from "react";

function subscribeToStorage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
  };
}

function getServerSnapshot() {
  return undefined;
}

export function useLocalStorageBoolean(key: string | undefined, fallback: boolean) {
  const [override, setOverride] = useState<boolean | undefined>(undefined);
  const storedValue = useSyncExternalStore(
    subscribeToStorage,
    () => {
      if (!key) {
        return undefined;
      }

      const value = window.localStorage.getItem(key);

      return value === null ? undefined : value === "true";
    },
    getServerSnapshot,
  );

  const value = override ?? storedValue ?? fallback;

  function setValue(next: boolean) {
    setOverride(next);

    if (key) {
      window.localStorage.setItem(key, String(next));
    }
  }

  return [value, setValue] as const;
}
