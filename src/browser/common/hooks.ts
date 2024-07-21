import { useCallback, useEffect, useMemo, useState } from "react";
import { Storage } from "webextension-polyfill";
import { useSearch } from "wouter";

import { Bounty } from "~/common/types";

export function useSearchParams() {
  const search = useSearch();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  return [searchParams] as const;
}

export function useToggle(initialState: boolean) {
  const [value, setValue] = useState(initialState);

  const toggle = (newValue?: boolean) =>
    setValue((value) => (typeof newValue === "boolean" ? newValue : !value));

  return [value, toggle] as const;
}

export function useStorage<T>(areaName: "local" | "session", key: string, defaultValue: T) {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  const areaStorage = useMemo(() => browser.storage[areaName], [areaName]);

  useEffect(() => {
    const promise = areaStorage.get(key);

    promise
      .then((values) => key in values && setValue(values[key]))
      .finally(() => setLoading(false));

    const listener = (changes: Record<string, Storage.StorageChange>) => {
      const change = changes[key];

      if (change) {
        setValue(change.newValue);
      }
    };

    browser.storage.onChanged.addListener(listener);

    return () => {
      browser.storage.onChanged.removeListener(listener);
    };
  }, [areaStorage, key]);

  const updateValue = useCallback(
    (updater: (value: T) => T) => areaStorage.set({ [key]: updater(value) }),
    [areaStorage, key, value],
  );

  return [value, loading, updateValue] as const;
}

export function useSettings() {
  return useStorage("local", "settings", {
    notifications: false,
    theme: "light",
  });
}

export function useBounties() {
  return useStorage("session", "bounties", new Array<Bounty>());
}
