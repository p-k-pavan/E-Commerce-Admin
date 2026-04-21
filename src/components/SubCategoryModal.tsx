"use client";

import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { useAddSubCategory, useUpdateSubCategory } from "@/hooks/useSubCategory";
import { useGetCategories } from "@/hooks/useCategory";

export default function SubCategoryModal({ isOpen, onClose, subCategory }: any) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { data: categories } = useGetCategories();
  
  const addMutation = useAddSubCategory();
  const updateMutation = useUpdateSubCategory();

  useEffect(() => {
    if (subCategory) {
      setName(subCategory.name);
      setCategoryId(subCategory.category?._id || "");
    } else {
      setName("");
      setCategoryId("");
    }
    setFile(null);
  }, [subCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", categoryId);
    if (file) formData.append("file", file);

    if (subCategory) {
      await updateMutation.mutateAsync({ slug: subCategory.slug, formData });
    } else {
      await addMutation.mutateAsync(formData);
    }
    onClose();
  };

  const isPending = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{subCategory ? "Edit Sub-Category" : "Add Sub-Category"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Sub-Category Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. Organic Tomatoes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Parent Category</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="">Select a category</option>
              {categories?.map((cat: any) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Image</label>
            <div className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-gray-50 relative">
              <input 
                type="file" 
                required={!subCategory}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
              <p className="text-xs text-gray-500">{file ? file.name : "Click to upload image"}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-xl">Cancel</button>
            <button 
              disabled={isPending}
              className="flex-1 py-2 bg-green-600 text-white rounded-xl flex justify-center items-center gap-2 hover:bg-green-700"
            >
              {isPending && <Loader2 className="animate-spin w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}