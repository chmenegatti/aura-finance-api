import { api } from "./api";
import type { ApiResponseSuccess } from "@/types/api";
import type { AuthData, AuthTokenData, LoginRequest, RegisterRequest } from "@/types/auth";

export const authService = {
  async login(payload: LoginRequest): Promise<AuthTokenData> {
    const { data } = await api.post<ApiResponseSuccess<AuthTokenData>>("/auth/login", payload);
    return data.data;
  },

  async register(payload: RegisterRequest): Promise<AuthData> {
    const { data } = await api.post<ApiResponseSuccess<AuthData>>("/auth/register", payload);
    return data.data;
  },
};
