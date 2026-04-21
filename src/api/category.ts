import axiosInstance from "@/lib/axiosInstance";

export const getCategories = async () => {
  const res = await axiosInstance.get("/api/admin/category");
  return res.data;
};

export const addCategory = async (data: { name: string; image: string }) => {
  const res = await axiosInstance.post("/api/admin/category/add", data);
  return res.data;
};

export const updateCategory = async ({
  slug,
  data,
}: {
  slug: string;
  data: FormData | { name?: string; image?: string };
}) => {
  const res = await axiosInstance.patch(`/api/admin/update-category/${slug}`, data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return res.data;
};

export const deleteCategory = async (slug: string) => {
  const res = await axiosInstance.delete(`/api/admin/category/${slug}`);
  return res.data;
};

export const bulkUploadCategory = async (categories: any[]) => {
  const res = await axiosInstance.post("/api/admin/category/bulk", categories);
  return res.data;
};