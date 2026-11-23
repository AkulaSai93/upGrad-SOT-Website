"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * A value kept in this browser's localStorage, readable from any component
 * through `use()` and re-rendering it on a change made in this tab (a custom
 * event) or in another one (the browser's storage event). Used for the
 * signed-in applicant and their application until the admissions back end
 * is wired up. On the server, and before hydration, the value is null.
 *
 * `parse` turns the stored JSON back into the value, or null when it is
 * missing or not in the expected shape.
 */
export function createLocalStore<T>(
  key: string,
  parse: (value: unknown) => T | null,
) {
  const event = `${key}-change`;

  const readRaw = (): string | null => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null; // storage blocked (private mode, cookies off)
    }
  };

  const subscribe = (onChange: () => void) => {
    window.addEventListener("storage", onChange);
    window.addEventListener(event, onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener(event, onChange);
    };
  };

  const decode = (raw: string | null): T | null => {
    if (!raw) return null;
    try {
      return parse(JSON.parse(raw));
    } catch {
      return null;
    }
  };

  const write = (raw: string | null) => {
    try {
      if (raw === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, raw);
    } catch {
      // storage blocked: the value simply won't persist
    }
    window.dispatchEvent(new Event(event));
  };

  return {
    use(): T | null {
      const raw = useSyncExternalStore(subscribe, readRaw, () => null);
      return useMemo(() => decode(raw), [raw]);
    },
    get: (): T | null => decode(readRaw()),
    set: (value: T) => write(JSON.stringify(value)),
    clear: () => write(null),
  };
}

const noop = () => () => {};

/** false on the server and during hydration, true once on the client */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
