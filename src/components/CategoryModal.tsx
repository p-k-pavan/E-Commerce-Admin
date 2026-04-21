"use client";

import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { useAddCategory, useUpdateCategory } from "@/hooks/useCategory";

export default function CategoryModal({ isOpen, onClose, category }: any) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(""); // URL for Add
  const [file, setFile] = useState<File | null>(null); // File for Update

  const addMutation = useAddCategory();
  const updateMutation = useUpdateCategory();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setImage(category.image || "");
    } else {
      setName("");
      setImage("");
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (category) {
      // Logic for Update (Uses FormData to support the 'file' field in your controller)
      const formData = new FormData();
      formData.append("name", name);
      if (file) formData.append("file", file);

      await updateMutation.mutateAsync({ slug: category.slug, data: formData });
    } else {
      // Logic for Add (Uses simple JSON as per your addCategory controller)
      await addMutation.mutateAsync({ name, image });
    }
    onClose();
  };

  const isPending = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{category ? "Edit Category" : "Add Category"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-700">Category Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fruits & Vegetables"
              className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {category ? (
            /* File Upload for Update */
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">Category Image (Upload)</label>
              <div className="border-2 border-dashed rounded-xl p-4 text-center hover:bg-gray-50 cursor-pointer relative">
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">{file ? file.name : "Click to upload new image"}</p>
              </div>
            </div>
          ) : (
            /* Image URL for Add (as per your current addCategory controller) */
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-700">Image URL</label>
              <input
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://cloudinary.com/..."
                className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803D] disabled:opacity-50 flex justify-center items-center"
            >
              {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}