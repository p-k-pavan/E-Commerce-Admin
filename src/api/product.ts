import axiosInstance from "@/lib/axiosInstance";

export const getAdminProducts = async (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const res = await axiosInstance.get("/api/admin/product/get", { params });
  return res.data;
};

export const getAdminProductDetails = async (slug: string) => {
  const res = await axiosInstance.get(`/api/admin/product/${slug}`);
  return res.data;
};

export const addAdminProduct = async (formData: FormData) => {
  const res = await axiosInstance.post("/api/admin/product/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateAdminProduct = async ({
  slug,
  formData,
}: {
  slug: string;
  formData: FormData;
}) => {
  const res = await axiosInstance.patch(`/api/admin/product/update/${slug}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteAdminProduct = async (slug: string) => {
  const res = await axiosInstance.delete(`/api/admin/product/delete/${slug}`);
  return res.data;
};

export const bulkUploadAdminProducts = async (products: any[]) => {
  const res = await axiosInstance.post("/api/admin/product/bulk-upload", { products });
  return res.data;
};