import { HttpResponse } from "@/pages/api/__generated__/ll2";
import {
  InputMaybe,
  Maybe,
  PageInfo,
} from "@/pages/api/__generated__/resolvers-types";
import { GraphQLError } from "graphql";
import {
  getCursorFromLimitAndOffset,
  getLimitAndOffsetFromCursor,
} from "./cursor-service";

/**
 *
 * @param first First number of edges to take from list
 * @param after Take edges after a given cursor in the list
 * @param last Last number of edges to take from list
 * @param before Take edges before a given cursor in the list
 * @param limit How many edges to take from the list. Defaults to 10, max is 100 based on LL2 API: https://github.com/TheSpaceDevs/Tutorials/blob/main/faqs/faq_LL2.md
 * @returns
 */
export function getLimitOffset(
  first?: InputMaybe<number>,
  after?: InputMaybe<string>,
  last?: InputMaybe<number>,
  before?: InputMaybe<string>,
  limit: number = 10
) {
  let nodesLimitOffset;

  if (after) nodesLimitOffset = getLimitAndOffsetFromCursor(after);
  else if (before) nodesLimitOffset = getLimitAndOffsetFromCursor(before);

  if (!nodesLimitOffset) nodesLimitOffset = { limit, offset: undefined };
  else if(nodesLimitOffset.limit < limit) nodesLimitOffset.limit = limit;

  if (first && first > limit) limit = first;
  if (last && last > limit) limit = last;

  if (limit > 100) throw new GraphQLError("limit cannot be greater than 100");
  if (first && first < 0)
    throw new GraphQLError("first cannot be a negative number");
  if (last && last < 0)
    throw new GraphQLError("last cannot be a negative number");

  return nodesLimitOffset;
}

/**
 * This function is meant to take a reponse coming from the generated swagger API class and create a relay paginated structure.
 * 
 * @param res The response coming from LL2 API through generated swagger API class
 * @param limit The number of nodes to take from the list
 * @param first The number of nodes to take from the start of the list
 * @param last The number of nodes to take from the end of the list
 * @param offset The number of nodes that were offset in the initial request 
 * @callback transform An optional function that will be executed on each node
 * @returns An array of nodes along with the pagination information 
 */
export function getRelayPagination<T, K>(
  res: HttpResponse<any, any>,
  limit: number,
  offset: number = 0,
  first?: InputMaybe<number>,
  last?: InputMaybe<number>,
  transform?: (x: K) => T
): {
  nodes: Array<T>;
  pageInfo?: PageInfo;
} {
  if (!res.ok) {
    return {
      nodes: [],
    };
  }

  const nodes: T[] =
    res.data.results?.map((r: any) =>
      transform ? transform(r) : (r as T)
    ) ?? [];

  if (first && nodes.length > first) nodes.splice(nodes.length - first, first);
  if (last && nodes.length > last) nodes.splice(nodes.length - last, last);

  let pageInfo: PageInfo = {
    hasNextPage: res.data.next ? true : false,
    hasPreviousPage: res.data.previous ? true : false,
    startCursor: getCursorFromLimitAndOffset(limit, offset + 1),
    endCursor: getCursorFromLimitAndOffset(limit, offset + nodes.length),
  };

  return {
    nodes,
    pageInfo,
  };
}