import type { CodegenConfig } from "@graphql-codegen/cli";
import * as path from "path";

const api = path.relative(__dirname, path.join(__dirname, "src", "pages", "api"));

const config: CodegenConfig = {
  schema: path.relative(__dirname, path.join(__dirname, "schemas", "*.graphql")),
  generates: {
    [path.join(api, "__generated__", "resolvers-types.ts")]: {
      config: {
        useIndexSignature: true,
        federation: true,
        contextType: `${path.relative(__dirname, path.join(__dirname, "src", "server"))}#Context`,
      },
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};
export default config;
