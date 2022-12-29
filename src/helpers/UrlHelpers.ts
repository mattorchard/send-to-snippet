import { QueryParams } from "../types/UrlTypes";

export const getQueryParam = (key: keyof QueryParams): string | null => {
  if (!self.location) return null;
  const params = new URLSearchParams(self.location.search);
  return params.get(key) ?? null;
};

type UrlParts = {
  hash?: string;
  search?: string | Record<keyof QueryParams, string | number>;
};

export const buildUrl = (
  base: string | URL,
  overrides: Partial<UrlParts>
): URL => {
  const url = new URL(base.toString());
  if (overrides.hash) url.hash = overrides.hash;
  if (typeof overrides.search === "string") url.search = overrides.search;
  if (typeof overrides.search === "object")
    url.search = new URLSearchParams(
      Object.entries(overrides.search) as [string, string][]
    ).toString();
  return url;
};
