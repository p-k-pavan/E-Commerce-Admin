import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getSubCategories,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  bulkUploadSubCategory,
} from "@/api/subCategory";

export const useGetSubCategories = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["sub-categories", params],
    queryFn: () => getSubCategories(params),
  });
};

export const useAddSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSubCategory,
    onSuccess: (res) => {
      toast.success(res.message || "Sub-category added successfully");
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add sub-category");
    },
  });
};

export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSubCategory,
    onSuccess: (res) => {
      toast.success(res.message || "Sub-category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update sub-category");
    },
  });
};

export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubCategory,
    onSuccess: (res) => {
      toast.success(res.message || "Sub-category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete sub-category");
    },
  });
};

export const useBulkUploadSubCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUploadSubCategory,
    onSuccess: (res) => {
      toast.success(res.message || "Bulk upload successful");
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Bulk upload failed");
    },
  });
};