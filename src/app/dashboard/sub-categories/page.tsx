"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Loader2, Search, ChevronLeft, ChevronRight, Copy, Upload } from "lucide-react";
import { useGetSubCategories, useDeleteSubCategory } from "@/hooks/useSubCategory";
import SubCategoryModal from "@/components/SubCategoryModal";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import BulkSubCategoryModal from "@/components/BulkSubCategoryModal";

export default function SubCategories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 20;

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data: subData, isLoading, isPlaceholderData } = useGetSubCategories({
    page,
    limit
  });

  const deleteMutation = useDeleteSubCategory();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleEdit = (sub: any) => {
    setSelectedSub(sub);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedSub(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (slug: string) => {
    if (confirm("Are you sure you want to delete this sub-category?")) {
      await deleteMutation.mutateAsync(slug);
    }
  };

  const filteredData = subData?.data?.filter((sub: any) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("Category ID copied!");
    } catch (error) {
      toast.error("Failed to copy ID");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#111827]">Sub-Categories</h1>
          <p className="text-[#6B7280] mt-1">Manage {subData?.data?.length || 0} items on this page</p>
        </div>
        <div className="flex gap-3">
          {/* New Bulk Upload Button */}
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
          >
            <Upload className="w-5 h-5" />
            Bulk Upload
          </button>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-[#16A34A] text-white px-4 py-2.5 rounded-xl hover:bg-[#15803D] transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Add Sub-Category
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search current page..."
              className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="text-sm text-gray-500 font-medium">
            Page {page}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F9FAFB] text-xs uppercase text-[#6B7280] font-medium">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Sub-Category</th>
                <th className="px-6 py-4">Parent Category</th>
                <th className="px-6 py-4 text-center">Products</th>
                <th className="px-6 py-4 text-right">Actions</th>

              </tr>
            </thead>
            <tbody className={`divide-y divide-[#E5E7EB] ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
              {isLoading ? (
                <tr><td colSpan={5} className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-green-600" /></td></tr>
              ) : filteredData?.length > 0 ? (
                filteredData.map((sub: any) => (
                  <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-lg border overflow-hidden bg-gray-50">
                        <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#111827]">{sub.name}</td>
                    <td className="px-6 py-4 cursor-pointer">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium" onClick={() => handleCopyId(sub.category?._id)}>
                        {sub.category?.name || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500 font-semibold">
                      {sub.productCount}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(sub)} className="p-2 hover:bg-blue-50 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sub.slug)}
                          disabled={deleteMutation.isPending}
                          className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                        >
                          {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleCopyId(sub._id)}
                          className="p-2 hover:bg-[#E0F2FE] rounded-lg transition-colors group"
                        >
                          <Copy className="w-4 h-4 text-[#6B7280] group-hover:text-[#0284C7]" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="py-10 text-center text-gray-400">No sub-categories found on this page.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-[#E5E7EB] flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredData?.length || 0}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((old) => Math.max(old - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-600 text-white text-sm font-medium">
              {page}
            </div>

            <button
              onClick={() => {
                if (subData?.data?.length === limit) {
                  setPage((old) => old + 1);
                }
              }}
              disabled={subData?.data?.length < limit}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <SubCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subCategory={selectedSub}
      />
      <BulkSubCategoryModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />
    </div>
  );
}