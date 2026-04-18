'use client'; // Required for usePathname and interactivity

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Layers, 
  Users, 
  Settings, 
  Bell, 
  ChevronRight, 
  Menu,
  X 
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: ShoppingBag, label: "Orders", path: "/dashboard/orders" },
  { icon: Package, label: "Products", path: "/dashboard/products" },
  { icon: Layers, label: "Categories", path: "/dashboard/categories" },
  { icon: Users, label: "Customers", path: "/dashboard/customers" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}


      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-[#E5E7EB] flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#16A34A] rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
              <span className="text-white text-xl font-bold">N</span>
            </div>
            <span className="text-xl font-bold text-[#111827]">Namma Mart</span>
          </div>
          <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#DCFCE7] text-[#16A34A] shadow-sm font-semibold"
                      : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-[#16A34A]" : "text-[#6B7280]"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F3F4F6] transition-colors cursor-pointer group">
            <div className="w-10 h-10 bg-[#DCFCE7] rounded-full flex items-center justify-center">
              <span className="text-[#16A34A] font-semibold text-sm">AD</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-semibold text-[#111827] truncate">Admin User</div>
              <div className="text-xs text-[#6B7280] truncate">admin@namma.com</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <Breadcrumbs />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors group">
              <Bell className="w-5 h-5 text-[#6B7280] group-hover:text-[#111827]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-[#F9FAFB]">
          <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
            {children} {/* This is where your page content will render */}
          </div>
        </main>
      </div>
    </div>
  );
}

function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean).slice(1);
  
  return (
    <div className="hidden sm:flex items-center gap-2 text-sm">
      <Link href="/dashboard" className="text-[#6B7280] hover:text-[#16A34A] transition-colors">Dashboard</Link>
      {pathSegments.map((segment, index) => {
        if (segment.toLowerCase() === 'admin' && index === 0) return null;
        
        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-[#6B7280]" />
            <span className="text-[#111827] font-medium capitalize">
              {segment.replace(/-/g, ' ')}
            </span>
          </div>
        );
      })}
    </div>
  );
}