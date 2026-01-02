import { env } from "./env.js";

export const config = {
  nodeEnv: env.nodeEnv,
  port: env.port,
  jwtSecret: env.jwtSecret,
  jwtExpiresIn: env.jwtExpiresIn,
  dbPath: env.dbPath,
  corsOrigins: env.corsOrigins,
};
