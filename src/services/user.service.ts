import { api } from "./api";
import type { ApiResponseSuccess } from "@/types/api";
import type { User } from "@/types/user";

interface UserProfileResponse {
  user: User;
}

export const userService = {
  async getProfile(): Promise<User> {
    const { data } = await api.get<ApiResponseSuccess<UserProfileResponse>>("/users/me");
    return data.data.user;
  },
};
