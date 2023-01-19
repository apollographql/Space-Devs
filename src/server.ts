import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { readFileSync } from "fs";
import { join } from "path";
import { Resolvers } from "./pages/api/__generated__/resolvers-types";
import { Api } from "./pages/api/__generated__/ll2";


export type Context = {
  ll2: Api<unknown>;
}

export const createHandler = (typeDefs: string, resolvers: Resolvers) =>{
  const server = new ApolloServer<Context>({
    resolvers,
    typeDefs
  });

  return startServerAndCreateNextHandler(server, {
    context: async (req, res) => {
      return {
        ll2: new Api({ baseUrl:`https://lldev.thespacedevs.com`})
      };
    },
  })
};
