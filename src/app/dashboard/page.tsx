'use client';

import { TrendingUp, DollarSign, ShoppingCart, Users, AlertTriangle } from "lucide-react";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatusBadge from "@/components/StatusBadge";
import { useStats } from "@/hooks/useStats";


export default function Dashboard() {
  const { data, isLoading, error } = useStats();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading stats</p>;

  const COLORS = [
    "#6366F1",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#3B82F6",
    "#A855F7",
    "#14B8A6",
    "#F97316",
  ];

  const categoryData = data?.categoryData?.map((item: any, index: any) => ({
    ...item,
    color: COLORS[index % COLORS.length],
  })) || [];


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-[#111827]">Dashboard Overview</h1>
        <p className="text-[#6B7280] mt-1">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={data?.stats.totalRevenue ? `₹${data.stats.totalRevenue}` : "₹0"}
          change="+12%"
          trend="up"
          icon={DollarSign}
          iconBg="bg-[#DCFCE7]"
          iconColor="text-[#16A34A]"
        />
        <StatCard
          title="Total Orders"
          value={data?.stats.totalOrders ? data.stats.totalOrders.toString() : "0"}
          change="48 today"
          icon={ShoppingCart}
          iconBg="bg-[#DBEAFE]"
          iconColor="text-[#3B82F6]"
        />
        <StatCard
          title="Total Customers"
          value={data?.stats.totalCustomers ? data.stats.totalCustomers.toString() : "0"}
          change="+156 this week"
          icon={Users}
          iconBg="bg-[#FEF3C7]"
          iconColor="text-[#F59E0B]"
        />
        <StatCard
          title="Low Stock Alert"
          value={data?.stats.lowStock ? data.stats.lowStock.toString() : "0"}
          change="Needs attention"
          icon={AlertTriangle}
          iconBg="bg-[#FEE2E2]"
          iconColor="text-[#EF4444]"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Report */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#111827]">Sales Report</h3>
            <p className="text-sm text-[#6B7280]">Revenue trend over the last 30 days</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data ? data.salesData : []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #E5E7EB", borderRadius: "8px" }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#16A34A" strokeWidth={3} dot={{ fill: "#16A34A", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#111827]">
              Top Categories
            </h3>
            <p className="text-sm text-[#6B7280]">By sales volume</p>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry:any, index:any) => (
                  <Cell key={`cell-${entry._id}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {categoryData.map((category:any) => (
              <div key={category._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm text-[#6B7280]">
                    {category.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-[#111827]">
                  {category.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB]">
        <div className="p-6 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#111827]">Recent Orders</h3>
          <p className="text-sm text-[#6B7280]">Latest 5 orders from your customers</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {data?.recentOrders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-[#F9FAFB] cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827]">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.deliveryStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend?: "up" | "down";
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

function StatCard({ title, value, change, trend, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#6B7280] mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-[#111827]">{value}</h3>
          <div className="flex items-center gap-1 mt-2">
            {trend === "up" && <TrendingUp className="w-4 h-4 text-[#16A34A]" />}
            <span className={`text-sm ${trend === "up" ? "text-[#16A34A]" : "text-[#6B7280]"}`}>
              {change}
            </span>
          </div>
        </div>
        <div className={`${iconBg} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}