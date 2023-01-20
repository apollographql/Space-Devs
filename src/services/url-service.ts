import { URL } from "url";

export function getLimitAndOffsetFromURL(urlString: string): {
  limit: number;
  offset: number;
} | null {
  const url = new URL(urlString);
  const limit = url.searchParams.get("limit");
  const offset = url.searchParams.get("offset");

  if (
    limit === undefined ||
    limit === null ||
    offset === undefined ||
    offset === null
  ) {
    return null;
  }

  return {
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
}
