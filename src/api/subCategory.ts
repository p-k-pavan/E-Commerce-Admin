import axiosInstance from "@/lib/axiosInstance";

export const getSubCategories = async (params?: { page?: number; limit?: number }) => {
  const res = await axiosInstance.get("/api/admin/sub-category", { params });
  return res.data;
};

export const addSubCategory = async (formData: FormData) => {
  const res = await axiosInstance.post("/api/admin/sub-category/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateSubCategory = async ({
  slug,
  formData,
}: {
  slug: string;
  formData: FormData;
}) => {
  const res = await axiosInstance.patch(`/api/admin/update-sub-category/${slug}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteSubCategory = async (slug: string) => {
  const res = await axiosInstance.delete(`/api/admin/sub-category/${slug}`);
  return res.data;
};

export const bulkUploadSubCategory = async (data: any[]) => {
  const res = await axiosInstance.post("/api/admin/sub-category/bulk", data);
  return res.data;
};