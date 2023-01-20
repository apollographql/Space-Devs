// We recommend using the Apollo Router instead of @apollo/gateway
//    For example, Defer support is generally available as of Apollo Router v1.8.0
// You can read more about the differences in our docs:
// https://www.apollographql.com/docs/router/migrating-from-gateway#whats-different

import { join } from "path";
import { readFileSync } from "fs";
import { ApolloServer } from "@apollo/server";
import { ApolloGateway } from "@apollo/gateway";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

const gateway = new ApolloGateway({
  supergraphSdl: readFileSync(
    join(process.cwd(), "schemas", "supergraph.graphql"),
    "utf-8"
  ),
});
const server = new ApolloServer({
  gateway,
});
export default startServerAndCreateNextHandler(server);
