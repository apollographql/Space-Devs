import { readFileSync } from "fs";
import { join } from "path";
import {
  Astronaut,
  Resolvers,
} from "./__generated__/resolvers-types";
import { Astronaut as LL2Astronaut } from "./__generated__/ll2";
import { createHandler } from "../../server";
import {
  setCursors,
} from "@/services/cursor-service";
import {
  getLimitOffset,
  getRelayPagination,
} from "@/services/pagination-service";

const typeDefs = readFileSync(
  join(process.cwd(), "schemas", "astronauts.graphql"),
  "utf-8"
);

const transformAstronaut = (a: LL2Astronaut): Astronaut => ({
  id: a.id,
  name: a.name,
  url: a.url,
  agency: { id: a.agency.id },
})

const resolvers: Resolvers = {
  Astronaut: {
    async __resolveReference({id}, context){
      const res = await context.ll2.v220.astronautRetrieve(id);
      if(!res.ok) return null;
      return transformAstronaut(res.data);
    }
  },
  Query: {
    astronauts: async (
      _parent,
      { first, after, last, before, limit },
      context
    ) => {
      //First we must convert the relay pagination arguments into { limit, offset } pattern
      //https://relay.dev/graphql/connections.htm#sec-Arguments
      let nodesLimitOffset = getLimitOffset(first, after, last, before, limit);

      const res = await context.ll2.v220.astronautList({ ...nodesLimitOffset });
      const { nodes, pageInfo } = getRelayPagination<Astronaut, LL2Astronaut>(
        res,
        nodesLimitOffset.limit,
        nodesLimitOffset.offset,
        first,
        last,
        transformAstronaut
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
