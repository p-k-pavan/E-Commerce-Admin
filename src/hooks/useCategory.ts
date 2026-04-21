import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  bulkUploadCategory,
} from "@/api/category";

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories();
      return res.data || [];
    },
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCategory,
    onSuccess: (res) => {
      toast.success(res.message || "Category added successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add category");
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (res) => {
      toast.success(res.message || "Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update category");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (res) => {
      toast.success(res.message || "Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });
};

export const useBulkUploadCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUploadCategory,
    onSuccess: (res) => {
      toast.success(res.message || "Bulk upload successful");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Bulk upload failed");
    },
  });
};