import { useMemo } from "react";
export function useDirtyCheck<T extends Record<string, unknown>>(
  values: T,
  initialValues: T,
): boolean {
  return useMemo(() => {
    const keys = Object.keys(initialValues) as (keyof T)[];
    return keys.some((key) => (values[key] ?? "") !== (initialValues[key] ?? ""));
  }, [values, initialValues]);
}