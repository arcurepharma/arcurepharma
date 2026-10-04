"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Tags,
  MessageSquareWarning,
  Star,
} from "lucide-react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/sliders", label: "Sliders", icon: ImageIcon },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openComplaints, setOpenComplaints] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/complaints")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOpenComplaints(
            data.filter((c: { status: string }) => c.status === "Open").length
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <aside
      className={`sticky top-0 h-screen shrink-0 bg-gray-900 text-white transition-all duration-300 flex flex-col z-30 select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Header with Brand & Collapse Button */}
      <div
        className={`h-16 border-b border-gray-800 flex items-center shrink-0 ${
          collapsed ? "justify-center px-2" : "justify-between px-4"
        }`}
      >
        {!collapsed && (
          <Link href="/admin" className="flex items-center">
            <Image
              src="/logo-arcure.png"
              alt="Arcure Pharma"
              width={140}
              height={38}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-teal-600 text-white shadow-sm"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              } ${collapsed ? "justify-center" : ""} ${
                item.href === "/admin/complaints" ? "relative" : ""
              }`}
              title={item.label}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {item.href === "/admin/complaints" && openComplaints > 0 && (
                <span
                  className={`ml-auto inline-flex items-center justify-center min-w-5 min-h-5 px-1.5 text-[10px] font-bold bg-red-500 text-white rounded-full ${
                    collapsed ? "absolute top-1.5 right-1.5" : ""
                  }`}
                >
                  {openComplaints}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}