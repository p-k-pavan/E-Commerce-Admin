"use client";

import { X, Upload, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetAdminProductDetails, useAddAdminProduct, useUpdateAdminProduct } from "@/hooks/useProduct";
import { useGetCategories } from "@/hooks/useCategory";
import { useGetSubCategories } from "@/hooks/useSubCategory";

export function ProductModal({ isOpen, onClose, slug }: { isOpen: boolean; onClose: () => void; slug: string | null }) {
  const { data: categories } = useGetCategories();
  const { data: subData } = useGetSubCategories({ limit: 100 });
  const { data: product, isLoading: isFetching } = useGetAdminProductDetails(slug || "");

  const addMutation = useAddAdminProduct();
  const updateMutation = useUpdateAdminProduct();

  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    price: "",
    discount: "",
    category: "",
    subCategory: "",
    stock: "",
    unit: "",
  });

  // FIXED: Correctly extracting _id from Category and SubCategory objects
  useEffect(() => {
    if (slug && product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        discount: product.discount || 0,
        category: product.category?._id || "", 
        subCategory: product.subCategory?._id || "",
        stock: product.stock || 0,
        unit: product.unit || "",
      });
    } else {
      setFormData({ name: "", description: "", price: "", discount: "", category: "", subCategory: "", stock: "", unit: "" });
      setFiles([]);
    }
  }, [product, slug, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    
    // Append Text Fields
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    // Append Files (Key must be 'files' to match your backend)
    files.forEach(file => data.append("files", file));

    if (slug) {
      await updateMutation.mutateAsync({ slug, formData: data });
    } else {
      await addMutation.mutateAsync(data);
    }
    onClose();
  };

  const isPending = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-semibold text-gray-800">
            {slug ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {isFetching ? (
          <div className="p-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-green-600 w-10 h-10" />
            <p className="text-gray-500">Loading product details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" rows={3} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit (e.g. kg, 1L)</label>
                <input required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-2.5 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select Category</option>
                  {categories?.map((cat: any) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category</label>
                <select required value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})} className="w-full p-2.5 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-green-500">
                  <option value="">Select Sub-Category</option>
                  {subData?.data?.map((sub: any) => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                <input type="number" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} className="w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center relative hover:bg-gray-50 transition-all">
                  <input type="file" multiple onChange={e => setFiles(Array.from(e.target.files || []))} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <Upload className="mx-auto w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-600">
                    {files.length > 0 ? `${files.length} files selected` : "Drag and drop or click to upload up to 5 images"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t sticky bottom-0 bg-white">
              <button type="button" onClick={onClose} className="px-8 py-2.5 border rounded-xl font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button disabled={isPending} className="px-8 py-2.5 bg-green-600 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-green-700 transition-all disabled:opacity-50">
                {isPending && <Loader2 className="animate-spin w-4 h-4" />}
                {slug ? "Update Product" : "Save Product"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}