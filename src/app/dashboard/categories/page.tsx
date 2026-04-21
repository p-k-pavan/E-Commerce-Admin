"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { useGetCategories, useDeleteCategory } from "@/hooks/useCategory";
import CategoryModal from "@/components/CategoryModal";
import { toast } from "sonner";

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const { data: categories, isLoading } = useGetCategories();
  
  const deleteMutation = useDeleteCategory();

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteMutation.mutateAsync(slug);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#111827]">Categories</h1>
          <p className="text-[#6B7280] mt-1">Organize your products into categories</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#16A34A] text-white px-4 py-2.5 rounded-xl hover:bg-[#15803D] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#16A34A]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.map((category: any) => (
            <div
              key={category._id}
              className="bg-white rounded-2xl p-6 border border-[#E5E7EB] hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-26 h-26 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover -mb-16" />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(category)}
                    className="p-2 hover:bg-[#DBEAFE] rounded-lg transition-colors group"
                  >
                    <Edit2 className="w-4 h-4 text-[#6B7280] group-hover:text-[#3B82F6]" />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.slug)}
                    disabled={deleteMutation.isPending}
                    className="p-2 hover:bg-[#FEE2E2] rounded-lg transition-colors group"
                  >
                    <Trash2 className="w-4 h-4 text-[#6B7280] group-hover:text-[#EF4444]" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#111827] mb-1">{category.name}</h3>
              <p className="text-sm text-[#6B7280]">{category.subCategoryCount || 0} sub-categories</p>
            </div>
          ))}
        </div>
      )}

      <CategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        category={selectedCategory} 
      />
    </div>
  );
}