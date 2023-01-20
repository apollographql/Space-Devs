import { readFileSync } from "fs";
import { join } from "path";
import { Resolvers } from "./__generated__/resolvers-types";
import { createHandler } from "@/server";
import { getLimitAndOffsetFromURL } from "@/services/url-service";
import { getCursorFromLimitAndOffset } from "@/services/cursor-service";

const typeDefs = readFileSync(
  join(process.cwd(), "schemas", "schema.graphql"),
  "utf-8"
);

const resolvers: Resolvers = {
  Query: {
    allAgencies: async (_parent, _args, context) => {
      const res = await context.ll2.v220.agenciesList();
      if (!res.ok) {
        return {
          edges: [],
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
        };
      }
      const nodes =
        res.data.results?.map((a) => ({ id: a.id.toString(), name: a.name })) ??
        [];
      const edges = nodes.map((node) => ({
        node,
        cursor: node.id,
      }));

      let endCursor: string | null = null;

      if(res.data.next) {
        const urlPageInfo = getLimitAndOffsetFromURL(res.data.next);
        if(urlPageInfo) {
          const {limit, offset} = urlPageInfo;
          endCursor = getCursorFromLimitAndOffset(limit, offset);
        }
      }

      return {
        edges,
        pageInfo: { hasNextPage: false, hasPreviousPage: false, endCursor},
      };
    },
  },
};

export default createHandler(typeDefs, resolvers);
