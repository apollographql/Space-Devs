import { readFileSync } from "fs";
import { join } from "path";
import { Resolvers } from "./__generated__/resolvers-types";
import { createHandler } from "@/server";

const typeDefs = readFileSync(join(process.cwd(), "schemas", "schema.graphql"), "utf-8");

const resolvers: Resolvers = {
  Query: {
    allAgencies: async (_parent, _args, context) => {
      const res =  await context.ll2.v220.agenciesList();
      return res.data.results?.map(a=>({id: a.id.toString(), name: a.name})) ?? [];
    },
  },
};


export default createHandler(typeDefs,resolvers);