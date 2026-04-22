import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminProducts,
  getAdminProductDetails,
  addAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  bulkUploadAdminProducts,
} from "@/api/product";

export const useGetAdminProducts = (params: { page: number; limit: number; search: string }) => {
  return useQuery({
    queryKey: ["admin-products", params],
    queryFn: () => getAdminProducts(params),
  });
};

export const useGetAdminProductDetails = (slug: string) => {
  return useQuery({
    queryKey: ["admin-product", slug],
    queryFn: async () => {
      const res = await getAdminProductDetails(slug);
      return res.productData;
    },
    enabled: !!slug,
  });
};

export const useAddAdminProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAdminProduct,
    onSuccess: (res) => {
      toast.success(res.message || "Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create product");
    },
  });
};

export const useUpdateAdminProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminProduct,
    onSuccess: (res) => {
      toast.success(res.message || "Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update product");
    },
  });
};

export const useDeleteAdminProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminProduct,
    onSuccess: (res) => {
      toast.success(res.message || "Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete product");
    },
  });
};

export const useBulkUploadAdminProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUploadAdminProducts,
    onSuccess: (res) => {
      toast.success(`Uploaded ${res.insertedCount} products. Skipped ${res.skippedCount}.`);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Bulk upload failed");
    },
  });
};