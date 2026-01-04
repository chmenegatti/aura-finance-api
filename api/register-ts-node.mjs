import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("ts-node/esm", pathToFileURL("./"));

import("./src/server.ts").catch((error) => {
  console.error("Failed to launch server", error);
  process.exit(1);
});
