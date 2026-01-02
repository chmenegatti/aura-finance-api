import jwt, { type SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

import { config } from "../config/index.js";

export type AuthJwtPayload = {
  userId: string;
  email: string;
};

export const signJwt = (payload: AuthJwtPayload) => {
  const options: SignOptions = { expiresIn: config.jwtExpiresIn as StringValue };
  return jwt.sign(payload, config.jwtSecret, options);
};

export const verifyJwt = <T extends Record<string, unknown>>(token: string): T => {
  return jwt.verify(token, config.jwtSecret) as T;
};
