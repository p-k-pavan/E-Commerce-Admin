import axiosInstance from "@/lib/axiosInstance";
import { Login, Resigter } from "@/types/api";

export const loginUser = async (formData: Login) => {
  const res = await axiosInstance.post(`/api/users/login`, formData);
  return res.data;
};

export const logout = async () => {
    await axiosInstance.get("/api/users/logout");
}

export const register = async (FormData: Resigter) => {
    const res = await axiosInstance.post("/api/users/register", FormData);
    return res.data;
}