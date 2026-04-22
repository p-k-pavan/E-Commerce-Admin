"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Loader2, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { ProductModal } from "@/components/ProductModal";
import { useGetAdminProducts, useDeleteAdminProduct } from "@/hooks/useProduct";
import { useGetCategories } from "@/hooks/useCategory";
import { useDebounce } from "@/hooks/useDebounce";
import BulkProductModal from "@/components/BulkProductModal";

export default function Products() {
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    const debouncedSearch = useDebounce(searchQuery, 500);

    // 1. Fetch Categories for the dropdown
    const { data: categories } = useGetCategories();

    // 2. Fetch Products with Pagination & Search
    const { data: productsData, isLoading } = useGetAdminProducts({
        page,
        limit,
        search: debouncedSearch,
    });

    const deleteMutation = useDeleteAdminProduct();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);

    // Reset to page 1 when user searches
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const handleEdit = (slug: string) => {
        setSelectedProductSlug(slug);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedProductSlug(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (slug: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            await deleteMutation.mutateAsync(slug);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-[#111827]">Products</h1>
                    <p className="text-[#6B7280] mt-1">Manage your grocery inventory ({productsData?.totalCount || 0} items)</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50"
                    >
                        <Upload className="w-5 h-5" />
                        Bulk Upload
                    </button>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700"
                    >
                        <Plus className="w-5 h-5" />
                        Add Product
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent"
                    />
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#F9FAFB]">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Sub-Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-20">
                                        <Loader2 className="animate-spin mx-auto text-green-600 w-10 h-10" />
                                        <p className="mt-2 text-gray-500">Loading products...</p>
                                    </td>
                                </tr>
                            ) : productsData?.data?.map((product: any) => (
                                <tr key={product._id} className="hover:bg-[#F9FAFB] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg border overflow-hidden bg-gray-50">
                                                <img
                                                    src={product.image?.[0]}
                                                    className="w-full h-full object-cover"
                                                    alt={product.name}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-[#111827] line-clamp-1">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                                        {/* FIXED: Accessed as Object property, not .map() */}
                                        {product.category?.name || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                                        {/* FIXED: Accessed as Object property */}
                                        {product.subCategory?.name || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#111827]">
                                        ₹{product.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-sm font-semibold ${product.stock < 20 ? "text-red-500" : "text-gray-700"}`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(product.slug)}
                                                className="p-2 hover:bg-[#DBEAFE] rounded-lg transition-colors group"
                                            >
                                                <Edit2 className="w-4 h-4 text-[#6B7280] group-hover:text-[#3B82F6]" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.slug)}
                                                className="p-2 hover:bg-[#FEE2E2] rounded-lg transition-colors group"
                                            >
                                                <Trash2 className="w-4 h-4 text-[#6B7280] group-hover:text-[#EF4444]" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t flex items-center justify-between bg-gray-50">
                    <p className="text-sm text-gray-500 font-medium">
                        Page {page} of {productsData?.totalNoPage || 1}
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="p-2 border rounded-xl bg-white disabled:opacity-50 hover:bg-gray-50 transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            disabled={page >= (productsData?.totalNoPage || 1)}
                            onClick={() => setPage((p) => p + 1)}
                            className="p-2 border rounded-xl bg-white disabled:opacity-50 hover:bg-gray-50 transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                slug={selectedProductSlug}
            />
            <BulkProductModal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
            />
        </div>
    );
}