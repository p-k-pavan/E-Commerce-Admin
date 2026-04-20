import axiosInstance from "@/lib/axiosInstance";

export const getStats = async () => {
  const res = await axiosInstance.get(`/api/dashboard/stats`);
  return res.data;
};
