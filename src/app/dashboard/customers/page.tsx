'use client';

import { Search, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useCustomers, useCustomerStats } from "@/hooks/useCustomers";
import { useDebounce } from "@/hooks/useDebounce";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery);

  const { data, isLoading } = useCustomers(debouncedSearch, page);
  const { data: stats } = useCustomerStats();

  const customers = data?.customers || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-[#111827]">Customers</h1>
        <p className="text-[#6B7280] mt-1">Manage your customer relationships</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280] mb-1">Total Customers</p>
          <h3 className="text-3xl font-semibold text-[#111827]">
            {stats?.totalCustomers || 0}
          </h3>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280] mb-1">Active This Month</p>
          <h3 className="text-3xl font-semibold text-[#111827]">
            {stats?.activeThisMonth || 0}
          </h3>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280] mb-1">New This Week</p>
          <h3 className="text-3xl font-semibold text-[#111827]">
            {stats?.newThisWeek || 0}
          </h3>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1); // reset page on search
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Total Spent</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB]">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer: any) => (
                  <tr key={customer.id} className="hover:bg-[#F9FAFB]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#DCFCE7] rounded-full flex items-center justify-center">
                          <span className="text-[#16A34A] font-semibold text-sm">
                            {customer.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-[#111827]">
                          {customer.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                          <Mail className="w-4 h-4" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                          <Phone className="w-4 h-4" />
                          {customer.phone}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {customer.orders}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium">
                      {customer.spent}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} / {data?.pages || 1}
        </span>

        <button
          disabled={page === data?.pages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}