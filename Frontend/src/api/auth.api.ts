import api from "../utils/axios";
import  type { LoginRequest, LoginResponse } from "../types/auth.types";

export const loginApi = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", data);
  return res.data;
};
