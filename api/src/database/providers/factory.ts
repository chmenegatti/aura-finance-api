import { env } from "../../config/env.js";

import type { DatabaseProvider } from "./types.js";
import { drizzleProviderFactory } from "./drizzle-provider.js";
import { typeOrmProviderFactory } from "./typeorm-provider.js";

export function createDatabaseProvider(): DatabaseProvider {
  return env.isProduction ? drizzleProviderFactory() : typeOrmProviderFactory();
}
