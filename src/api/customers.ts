import axiosInstance from "@/lib/axiosInstance";

export const getCustomers = async ({
  search = "",
  page = 1,
  limit = 10,
}: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await axiosInstance.get("/api/admin/customers", {
    params: { search, page, limit },
  });
  return res.data;
};

export const getCustomerStats = async () => {
  const res = await axiosInstance.get("/api/admin/customers/stats");
  return res.data;
};