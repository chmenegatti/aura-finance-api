import type { User } from "./user";

export interface AuthTokenData {
  token: string;
}

export interface AuthData extends AuthTokenData {
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
