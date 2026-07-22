"use client";

import { useCallback, useState } from "react";

export function useKeyedOptimisticBoolean(
  key: string | undefined,
  fallback: boolean,
) {
  const [override, setOverride] = useState<
    {
      baseline: boolean;
      key: string | undefined;
      value: boolean;
    } | undefined
  >(undefined);

  const value =
    override && override.key === key && override.baseline === fallback
      ? override.value
      : fallback;

  const setValue = useCallback(
    (next: boolean) => {
      setOverride({ baseline: fallback, key, value: next });
    },
    [fallback, key],
  );

  return [value, setValue] as const;
}
