import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminOrders,
  getAdminOrderStats,
  getAdminOrderDetail,
  updateAdminOrder,
  deleteAdminOrder,
} from "@/api/order";

export const useGetAdminOrders = (params: {
  page: number;
  limit: number;
  search: string;
  status: string;
}) => {
  return useQuery({
    queryKey: ["admin-orders", params],
    queryFn: () => getAdminOrders(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetAdminOrderStats = () => {
  return useQuery({
    queryKey: ["admin-order-stats"],
    queryFn: async () => {
      const res = await getAdminOrderStats();
      return res.data;
    },
  });
};


export const useGetAdminOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ["admin-order", orderId],
    queryFn: async () => {
      const res = await getAdminOrderDetail(orderId);
      return res.data;
    },
    enabled: !!orderId,
  });
};

export const useUpdateAdminOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminOrder,
    onSuccess: (res) => {
      toast.success(res.message || "Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update order");
    },
  });
};

export const useDeleteAdminOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminOrder,
    onSuccess: (res) => {
      toast.success(res.message || "Order deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete order");
    },
  });
};