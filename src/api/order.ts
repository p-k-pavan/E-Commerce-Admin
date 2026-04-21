import axiosInstance from "@/lib/axiosInstance";

export const getAdminOrders = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  const res = await axiosInstance.get("/api/admin/get-orders", { params });
  return res.data;
};

export const getAdminOrderStats = async () => {
  const res = await axiosInstance.get("/api/admin/status-stats");
  return res.data;
};

export const getAdminOrderDetail = async (orderId: string) => {
  const res = await axiosInstance.get(`/api/admin/detail/${orderId}`);
  return res.data;
};

export const updateAdminOrder = async ({
  orderId,
  data,
}: {
  orderId: string;
  data: {
    delivery_status?: string;
    payment_status?: string;
    reson_for_cancellation?: string;
    delivery_date?: string | Date;
  };
}) => {
  const res = await axiosInstance.patch(`/api/admin/update/${orderId}`, data);
  return res.data;
};

export const deleteAdminOrder = async (orderId: string) => {
  const res = await axiosInstance.delete(`/api/admin/delete/${orderId}`);
  return res.data;
};