"use client";

import { useState, useEffect } from "react";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { OrderDetailModal } from "@/components/OrderDetailModal";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetAdminOrders, useGetAdminOrderStats } from "@/hooks/useOrder";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: stats } = useGetAdminOrderStats();

  const { data: ordersData, isLoading } = useGetAdminOrders({
    page,
    limit,
    search: debouncedSearch,
    status: activeTab,
  });

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch]);

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const tabs = [
    { id: "all", label: "All Orders", count: stats?.all || 0 },
    { id: "pending", label: "Pending", count: stats?.pending || 0 },
    { id: "shipped", label: "Shipped", count: stats?.shipped || 0 },
    { id: "delivered", label: "Delivered", count: stats?.delivered || 0 },
    { id: "cancelled", label: "Cancelled", count: stats?.cancelled || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-[#111827]">Orders</h1>
        <p className="text-[#6B7280] mt-1">Manage and track all customer orders</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB]">
        <div className="border-b border-[#E5E7EB] overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#16A34A] text-[#16A34A]"
                    : "border-transparent text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#F3F4F6] text-[#6B7280]"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search by order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {isLoading ? (
                 <tr><td colSpan={7} className="text-center py-10">Loading orders...</td></tr>
              ) : ordersData?.data?.map((order: any) => (
                <tr key={order.id} className="hover:bg-[#F9FAFB]">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">₹{order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.payment} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleViewOrder(order)} className="p-2 hover:bg-[#DBEAFE] rounded-lg">
                      <Eye className="w-4 h-4 text-[#6B7280]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between">
          <p className="text-sm text-[#6B7280]">
            Showing page {page} of {ordersData?.totalNoPage || 1}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 border rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              disabled={page >= (ordersData?.totalNoPage || 1)}
              onClick={() => setPage(p => p + 1)}
              className="p-2 border rounded-lg disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={selectedOrder?.id}
      />
    </div>
  );
}