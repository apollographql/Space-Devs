import { URL } from "url";

export function getLimitAndOffsetFromURL(urlString: string): {
  limit: number;
  offset: number;
} {
  const url = new URL(urlString);
  const limit = url.searchParams.get("limit") ?? "10";
  const offset = url.searchParams.get("offset") ?? "0";

  return {
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
}
