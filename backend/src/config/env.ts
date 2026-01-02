import dotenv from "dotenv";
import path from "node:path";

const envFile = path.resolve(process.cwd(), ".env");

dotenv.config({ path: envFile });

const getRequired = (value: string | undefined, key: string): string => {
  if (!value || !value.trim()) {
    throw new Error(`Environment variable ${key} is required`);
  }

  return value.trim();
};

const defaultCorsOrigins = ["http://localhost:8080"];
const corsOrigins = process.env.CORS_ORIGIN
  ? Array.from(
    new Set([
      ...defaultCorsOrigins,
      ...process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter((origin) => origin.length),
    ]),
  )
  : defaultCorsOrigins;

export const env = {
  nodeEnv: (process.env.NODE_ENV ?? "development").trim(),
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: getRequired(process.env.JWT_SECRET, "JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
  dbPath: path.resolve(process.cwd(), process.env.DB_PATH ?? "data/aura-finance.sqlite"),
  corsOrigins,
};
