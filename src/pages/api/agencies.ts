import { readFileSync } from "fs";
import { join } from "path";
import {
  Agency,
  Resolvers,
} from "./__generated__/resolvers-types";
import { Agency as LL2Agency } from "./__generated__/ll2";
import { createHandler } from "../../server";
import {
  setCursors,
} from "@/services/cursor-service";
import {
  getLimitOffset,
  getRelayPagination,
} from "@/services/pagination-service";
import alphaConvert from "countries-list/dist/countries3to2.json";
const typeDefs = readFileSync(
  join(process.cwd(), "schemas", "agencies.graphql"),
  "utf-8"
);

const transformAgency = (a: LL2Agency): Agency => ({
  id: a.id,
  name: a.name,
  url: a.url,
  country: { code:  (alphaConvert as any)[a.country_code ?? "USA"] },
})

const resolvers: Resolvers = {
  Agency: {
    async __resolveReference({id}, context){
      const res = await context.ll2.v220.agenciesRetrieve(id);
      if(!res.ok) return null;
      return transformAgency(res.data);
    }
  },
  Query: {
    allAgencies: async (
      _parent,
      { first, after, last, before, limit },
      context
    ) => {
      //First we must convert the relay pagination arguments into { limit, offset } pattern
      //https://relay.dev/graphql/connections.htm#sec-Arguments
      let nodesLimitOffset = getLimitOffset(first, after, last, before, limit);

      const res = await context.ll2.v220.agenciesList({ ...nodesLimitOffset });
      const { nodes, pageInfo } = getRelayPagination<Agency, LL2Agency>(
        res,
        nodesLimitOffset.limit,
        nodesLimitOffset.offset,
        first,
        last,
        transformAgency
      );
      
      return {
        edges: setCursors(
          nodes,
          nodesLimitOffset.limit,
          nodesLimitOffset.offset
        ),
        pageInfo,
      };
    },
  },
};

export default createHandler(typeDefs, resolvers);
